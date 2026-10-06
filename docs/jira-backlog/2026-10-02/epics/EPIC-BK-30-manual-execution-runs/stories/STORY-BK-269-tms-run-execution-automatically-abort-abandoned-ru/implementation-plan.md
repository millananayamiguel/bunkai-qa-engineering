# BK-269 — Implementation Plan (Dev)

> Jira field: `customfield_10070` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-269)

## Goal

Close Runs that have been sitting in `running` with no step activity past a configurable inactivity threshold, so the Home active-runs widget and every report built on Run status report reality instead of Runs someone forgot to finish.

## Shape — decided, do not re-derive

The sweep runs ***entirely inside Postgres****: `pg*cron` invokes a `SECURITY DEFINER` SQL function directly. ****No Supabase Edge Function, no**** `POST /api/v1/admin/sweep/**` ***route, no service-role HTTP call, no**** `CRON*SECRET`****.***

This ***overrides*** the `## PO Responses` comment on this ticket, which prescribed the Edge Function shape. That comment was right about the numbers (4 hours, every 15 minutes) and wrong about the mechanism. Ratified by the operator on 2026-08-24 in an interactive run. Two prior autonomous-delivery runs (2026-08-21, 2026-08-22) deferred this story specifically because the Edge Function shape opens a third principal class — neither cookie session nor PAT — which amends ADR-0001 rather than applying it.

Why in-DB wins:

|  | ***Edge Function + admin route**** | ****In-DB ***`pg_cron` |
| --- | --- |
| New principal class | Yes — amends ADR-0001 | ***None*** |
| New secret (`CRON_SECRET`) | Yes, absent from `.env` today | ***None*** |
| New HTTP surface | `supabase/functions/` + `app/api/v1/admin/` | ***None*** |
| ADR-0012 actor bind | Must be written and guarded | ***Vacuous — the function takes no identity parameter*** |
| Network hop | `pg_net`, not installed | ***None*** |

`pg*cron` is available at `1.6.4` on project `fmbpikzpkafptqximhxn` but not installed (`pg*available*extensions`, queried live 2026-08-24). Neither `pg*net` nor `http` is installed, which independently confirms there is no path from Postgres out to a Node process even if one were wanted.

## Technical Decisions

### TD1 — No schema change on `runs`. Idle time is `coalesce(max(run*steps.executed*at), runs.started_at)`

The `## Dev Responses` comment prescribed a new `runs.last*step*activity*at` column stamped by a rewritten `bunkai*mark*run*step`. ***Overridden.***

`run*steps.executed*at` is nullable with no default and is written ***only*** by the mark (`0042*run*step_mark.sql:155`); abort and finish only flip `status` to `'skipped'` and never touch it. It is therefore already a clean "last human activity" signal with no denormalization to keep in sync. This is the same signal `lib/home/active-runs.ts:47-54` already computes, so the sweep and the Home widget cannot disagree about what counts as idle.

The column alternative additionally requires a `create or replace` on the live `bunkai*mark*run*step`, and — because that RPC never writes the `runs` row today (`0042:151-177`) — would start firing the `runs*set*updated*at` trigger (`0031*runs.sql:96-98`) mid-run for the first time, changing `runs.updated*at` semantics for `runs*workspace*id*updated*at_idx` (`0059:56-57`) and `lib/home/recent-projects.ts`. That is a behaviour change to shipped code bought for nothing.

`runs.updated*at` ***is never read for idle time.*** The `runs*set*updated*at` trigger fires on the sweep's own abort, which is the self-reference the QA refinement flagged as edge case #5.

Performance: `0060*home*active*runs*index.sql` records that the partial index on `status = 'running'` "stays proportional to concurrent executions (single digits in this product)". `run*atcs*run*id*idx` (`0031:131`) and `run*steps*run*atc*id_idx` (`0031:181`) serve the join.

### TD2 — The sweep cannot call `bunkai*abort*run`; it replicates the close sequence inline

`bunkai*abort*run`'s step 2 is `perform public.bunkai*assert*actor*can*write*workspace(p*actor*user*id, v*workspace*id)` (`0067*run*finish*abort*via.sql:182`), and that helper raises `42501 forbidden` whenever no active `member`/`admin`/`owner` row matches the actor (`0024_tests.sql:146-167`) — which a null system actor never does. The `## Dev Responses` claim that the sweep "calls the same internal `abortRun` function" does not hold in the in-DB shape.

Steps 5a/5b/5c and the audit insert are replicated byte-for-byte from `0067*run*finish*abort*via.sql`, with a header comment naming that file as the canonical shape so the two stay diffable.

***A system-actor bypass is NOT added to the live RPC.*** That would weaken a shipped authorization gate to save a dozen lines.

### TD3 — Authorization: the function takes no caller-supplied identity, and is granted to nobody

ADR-0012's actor-bind requirement is ***vacuous by construction*** here: there is no identity or scope parameter to spoof, which is the ADR's own preferred outcome ("prefer deleting the identity parameter over guarding it") — the same reasoning `0066*run*event_notifications.sql` records for its trigger.

ADR-0012 requirement (4), result scoping, still binds and is satisfied: every row the function touches is reached from `runs.id` through the candidate query, never from an external input.

Grants:

```sql
revoke execute on function public.bunkai*sweep*abandoned*runs(int) from public, anon, authenticated, service*role;
```

***Deliberately granted to nothing.*** `pg_cron` runs the job as the database owner, which needs no grant. A function that closes every idle Run across every Workspace, reachable over PostgREST by any signed-in user, would be a cross-tenant denial-of-service with a friendly name.

### TD4 — Lock discipline: the candidate query is a filter, never the authority

```
select ... from public.runs where status = 'running' ... for update skip locked
```

then ***re-evaluate the idle predicate inside the lock*** and `continue` when the Run turns out to be fresh.

This is the whole of scenario E1. Without the re-check, a step marked between the candidate `SELECT` and the abort is silently discarded and a live Run is closed — the actual defect E1 exists to prevent. `skip locked` additionally makes two overlapping sweep passes safe.

`bunkai*mark*run*step` already takes `for update of r` on the same `runs` header specifically so it serializes against a concurrent abort (`0042:122-130`, header at `:44-48`), and its status gate raises `45212 run*step*marking*closed` on a Run that is no longer `running` (`0042:139-142`). So the sweep-wins branch needs zero new code.

### TD5 — Idempotency needs no extra machinery

The `status = 'running'` predicate plus the under-lock re-check is the entire mechanism: a second pass finds an already-`aborted` Run outside its candidate set. AC5 asserts the property; nothing implements it separately.

### TD6 — Per-Run failure does not abort the pass

Each Run's close is wrapped in its own `begin ... exception when others then ... end` block, so one bad Run cannot strand the rest. That is what makes the sweep resumable after a mid-pass crash (QA edge case #3) without any state of its own.

### TD7 — Reason text and structural markers

```
Auto-closed by inactivity sweep: no step activity for {N}h (closed {YYYY-MM-DD HH:MM} UTC)
```

86 characters at a 4-hour threshold, against `runs*abort*reason*chk`'s `between 3 and 500` (`0036*run_abort.sql:38-44`). ASCII only — the em dash in the ticket's proposal is replaced by a colon, because the string is stored, transported and asserted by tests.

The timestamp stays in the string despite duplicating `runs.finished_at`: `RunnerView.tsx:639-653` renders the abort-reason block for an aborted Run while the closure-time block at `:656` renders only for `passed`/`failed`, so on the runner the reason text is the only place a QA Lead sees **when** the Run was closed.

A prefix alone is spoofable by anyone who types it into the manual abort dialog, so the audit row also carries ***structural*** markers at zero cost: `activity*log.actor*user*id = NULL` (already nullable, `0009*cross_cutting.sql:82`) and `payload->>'via' = 'sweep'`. `via`'s contract explicitly tolerates new values (`0067` header: an unrecognised value "behaves identically to NULL from the trigger's point of view ... never a new failure mode").

### TD8 — Threshold configuration

`bunkai*sweep*abandoned*runs(p*threshold_hours int default 4)`, scheduled as a literal:

```sql
select cron.schedule('bunkai-sweep-abandoned-runs', '**/15 ** ** ** *',
  $$select public.bunkai*sweep*abandoned_runs(4)$$);
```

The env var `SWEEP*INACTIVITY*THRESHOLD_HOURS` from the `## PO Responses` comment ***cannot be built*** — a `SECURITY DEFINER` function running inside Postgres has no `process.env`.

Splitting the value across two layers gives two different change costs: the signature default is migration-tracked and code-reviewed, while the operational value lives in the `cron.job` row, so retuning is a re-`cron.schedule` under the same `jobname` (an upsert on a data row, not a `create or replace` on a live function). A settings table was rejected as speculative — `out-of-scope.md:7` defers per-Workspace configurability, so it would carry a new table, new RLS surface and a seed row for a single integer no UI reads.

`p*threshold*hours < 1` raises `45215 sweep*threshold*invalid` (next free code in the `452xx` run block; `45203` reserved, `45204`-`45214` allocated). This settles ATP edge case #4 — a threshold of 0 would close every running Run on the next tick.

### TD9 — The owner notification arrives for free; add no code for it

`out-of-scope.md:9` defers "notifying a Run's owner when their Run is closed by the sweep". That item is ***resolved by inheritance, not by new scope.***

Migrations `0066*run*event*notifications` and `0067*run*finish*abort*via` are applied live (`20260806222747` / `20260806222820`). The `activity*log*notify*run*event` trigger fires on any `run.aborted` row; with `actor*user*id = NULL` its suppression predicate `v*recipient is not distinct from new.actor*user*id and (new.payload ->> 'via') = 'cookie'` is ***false***, so exactly one notification goes to the Run's starter (`runs.executor*user*id`), scoped to the right workspace. If the starter's account was deleted, the `v_recipient is null` early return (`0066:157-159`) fires first and nothing is written.

Suppressing it would require an approval-gated rewrite of a live trigger to buy strictly less product value. ***Ruling:**** ****let it notify, add no code.***

### ADR promotion — none

Assessed against the two-gate test. This story adds no new principal class, no new auth path, no cross-cutting invariant, and no schema change — the in-DB shape exists precisely so that ADR-0001 is applied rather than amended, and ADR-0012's preferred outcome is satisfied by construction. Every clause above is reversible by a single migration. Fails ADR gate 1 (architectural); no ADR is written. The decision record lives here and in the attributed Jira ruling comment.

## Implementation steps

### Step 1 — `supabase/migrations/0075*run*inactivity_sweep.sql`

Next free number is `0075` (tip is `0074*test*plan*nbsp*whitespace*class`). House header style per `0074`: banner rule, bare `NNNN*slug`, ticket line, narrative, live-instance verification evidence.

Contents, in order:

1. `create extension if not exists pg_cron;` plus the Supabase-documented grants (`grant usage on schema cron to postgres;` / `grant all privileges on all tables in schema cron to postgres;`).
2. `create or replace function public.bunkai*sweep*abandoned*runs(p*threshold*hours int default 4) returns jsonb language plpgsql security definer set search*path = ''`:
3. `revoke execute ... from public, anon, authenticated, service_role;`
4. `select cron.schedule('bunkai-sweep-abandoned-runs', '**/15 ** ** ** *', $$select public.bunkai*sweep*abandoned_runs(4)$$);`

Applied via Supabase MCP `apply*migration` (never `execute*sql` — `supabase/migrations/README.md:19-20`), then the live definition is re-read and diffed against the committed file per `.agents/project.yaml:156`.

`verify:` `list_migrations` shows `0075`; `select cron.jobname, schedule from cron.job` returns the scheduled job; the live `prosrc` matches the file.

### Step 2 — `lib/runs/inactivity-sweep-isolation.test.ts`

DB-integration test against the real database, following the canonical pattern in `lib/notifications/run-event-trigger-isolation.test.ts`: inline service-role `createClient`, `describeOrSkip = hasEnv ? describe : describe.skip`, `PREFIX`-namespaced throwaway workspace seeded in `beforeAll` and torn down in `afterAll`, plus a deployment probe that skips loudly when `0075` is not applied.

ADR-0012 requirement (6): this test ships in the same slice as the migration. A mocked `db.rpc` would prove nothing about the function.

Coverage, one test per AC scenario — 1.1, 1.2, 2.1, 2.2, 3.1, 5.1, 6.1, 6.2, 7.1, E1.2, E2, E3, 8.1. Scenario E1.1 (mark commits before the sweep takes the lock) is asserted at the predicate level rather than by racing two real transactions.

`verify:` `bun test lib/runs/inactivity-sweep-isolation.test.ts` green.

### Step 3 — Documentation, in the PR branch

- `.context/design/master-design-plan.md` §8 — add the missing US->Screen row under ***BK-30 Manual Execution & Runs***, between [https://jira.upexgalaxy.com/browse/BK-39#icft=BK-39](https://jira.upexgalaxy.com/browse/BK-39#icft=BK-39) and [https://jira.upexgalaxy.com/browse/BK-442#icft=BK-442](https://jira.upexgalaxy.com/browse/BK-442#icft=BK-442). Non-UI, mirroring the [https://jira.upexgalaxy.com/browse/BK-371#icft=BK-371](https://jira.upexgalaxy.com/browse/BK-371#icft=BK-371) / [https://jira.upexgalaxy.com/browse/BK-398#icft=BK-398](https://jira.upexgalaxy.com/browse/BK-398#icft=BK-398) precedent for no-screen stories. This closes a Critical Rule #15 bookkeeping gap the dev-roadmap has carried since 2026-08-21.
- `.context/business/business-data-map.md` / `business-api-map.md` — record the sweep as a scheduled in-DB job with no HTTP surface, if the maps carry a job section.

### Step 4 — Verification, parallel cap=3

`bun run lint:check` · `bun run types:check` · `bun test`. Green before any push.

## Out of scope, restated

No new Run status. No UI. No per-Workspace threshold configuration. No `/api/v1/admin` surface. No Edge Function. No change to manual abort or to finishing a Run with a verdict.

***Known cosmetic follow-up, deliberately not in this diff:*** the workspace Activity Stream renders a null-actor row as "a workspace member" (`lib/activity/view.ts:31-33`), so a swept closure reads as though a person did it. The copy fix branches on `payload->>'via' = 'sweep'`, which this story makes available. Separate ticket.

## Review Workload Forecast

Estimated: 330 additions + 5 deletions = 335 total lines
400-line budget risk: Medium
Chain strategy: single-pr
Decision trace: n/a (risk not High)
Decided by: n/a
Decision needed before apply: No

---
_Synced from Jira by sync-jira-issues_
