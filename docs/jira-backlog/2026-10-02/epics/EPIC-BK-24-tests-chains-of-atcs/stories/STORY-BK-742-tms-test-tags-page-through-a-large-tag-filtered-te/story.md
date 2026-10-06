# TMS-Test Tags | Page through a large tag-filtered Test list

**Jira Key:** [BK-742](https://jira.upexgalaxy.com/browse/BK-742)
**Epic:** [BK-24](https://jira.upexgalaxy.com/browse/BK-24) (Tests (chains of ATCs))
**Type:** Story
**Status:** Backlog
**Priority:** Medium
**Story Points:** -

---

## Overview

## Overview

No functional requirement maps cleanly to this story, so none is cited — the gap itself is recorded under "The spec gap this story walks into" below. The binding convention is `.context/business/business-api-map.md` §7.4 (`:724-728`), and the governing performance target is `.context/SRS/non-functional-specs.md` §1 (`:15`), which budgets list reads at under 500ms p95 ***for a paged 50-row page*** — a shape this endpoint does not have today.

## User story

******As a**** **"Karim", the autonomous AI test agent that reads Bunkai over a PAT*
**********I want to****** ****ask for the Tests carrying a tag and receive a bounded page that tells me plainly whether more remain***
**So that**** a tag that grew popular does not hand me one enormous answer, and — far more important — never hands me a trimmed answer I mistake for the whole set

## Definition of done

- [ ] The Test tag lookup answers with at most one page of Tests, sized by the caller within a fixed ceiling and by a published default otherwise
- [ ] Every answer that is not the last one carries a cursor; the last one carries none, and that is the only signal a caller needs to stop
- [ ] A caller that walks the cursors sees every matching Test exactly once — none repeated, none skipped, including while Tests are being created underneath the walk
- [ ] A page size out of range is refused, never quietly shrunk; a cursor the product did not issue is refused, never quietly restarted at page one
- [ ] Workspace isolation is unchanged: no page and no cursor reaches a Test outside the caller's membership
- [ ] The Project toolbar's Test tag filter still scopes the explorer to ***every*** matching Test, not to the first page of them
- [ ] A tag is still required — this story does not turn the lookup into a way to list every Test in a Workspace
- [ ] The published contract, the API map and the domain glossary describe what the lookup actually does

## Context

### What is actually true today

`GET /api/v1/tests` takes a ***required**** `tag` and returns ****every*** Test in the caller's Workspaces that carries it, in one response, with no bound of any kind. Verified at `origin/staging` at all three hops:

| ***Hop**** | ****Evidence*** |
| --- | --- |
| Route | `app/api/v1/tests/route.ts:27-46` — reads only `tag`; no `limit`, no cursor, no range |
| Wrapper | `lib/supabase/rpc.ts:259-264` — passes exactly two arguments, `p*actor*user*id` and `p*tag` |
| RPC | `supabase/migrations/0082*bk635*search*rpc*actor*bind*and*grant*revoke.sql:148-197` — `jsonb*agg` over an unbounded `select ... order by t.created*at desc` |

Two corrections worth stating plainly, because both are easy to get wrong from a distance. First, this is ***not**** a list-all endpoint — `app/api/v1/tests/route.ts:26` says so in as many words: **"**`tag` **is required (the MVP exposes single-tag filtering only — no list-all)"*. The set it returns is already narrowed by a tag. Second, the RPC lives in `0082`, not in `0081*bk203*search*tests*grant*fix.sql` — that migration defines `bunkai*search_tests`, which backs the different `/tests/search` endpoint, and says so at `:23-24`.

Why it still grows without limit: Tests are ***workspace-scoped, not project-scoped**** (`supabase/migrations/0024*tests.sql:6-7`, and the `tests` table at `:40-49` carries no `project*id`). So a reserved suite tag like `smoke` accumulates across every Project in the Workspace, for the life of the Workspace, with nothing narrowing it further. The RPC also runs a correlated `count(**)` over `test_steps` per returned row (`0082:184`), so the cost grows on two axes at once.

### The point of the story

An unbounded answer is the ***friendly*** failure. It is slow and wasteful, but it is honest — the caller holds the complete set and can tell.

A ***silent cap is the harmful one***, and this endpoint is one careless change away from it. `app/(app)/projects/[projectSlug]/test-tag-filter.tsx:43-49` is the single in-product consumer: it fetches the whole `items` array and maps it into the id set that scopes the explorer's Tests group. Cap that response without telling anyone, and the explorer quietly shows a subset of the Tests carrying a tag while presenting it as the match. Nobody gets an error. Nobody learns they are looking at a partial answer.

So the outcome this story wants is not "smaller". It is ***bounded, and never silently so***: a page that always carries an explicit cursor when more remains, so a caller can always tell there is more and can always reach it. Every acceptance criterion below is downstream of that one sentence.

### Why this endpoint, and why now

`BK-666` (**TMS-Test List | Browse, filter and sort every Test in a Project**, Backlog, same epic) renders this data and ***explicitly hands this decision off****. Its Out of Scope reads: **"Pagination controls. The list shows the Project's Tests; introducing paging is a scale decision this story does not take."* This is the story that takes it. That makes this a genuine prerequisite for a queued sibling, not a speculative hardening task.

One tension the two stories must resolve together, flagged here so nobody discovers it mid-build: `BK-666` AC-05 requires that **"sorting orders the whole filtered set, not just what is on screen"**. Server-side paging and client-side sorting cannot both be true. Whichever story lands second owns reconciling them, and the honest reconciliation is server-side ordering — which is why this story fixes the order server-side and puts caller-chosen ordering explicitly out of scope.

### The pattern is already in the building

Nothing here is new engineering. Keyset paging ships today on `/api/v1/activity`, and the codec was already extracted for reuse:

- `lib/pagination/keyset-cursor.ts` — generic, zero-dependency base64url codec over `(timestamp, id)`, written to be **"usable from any future keyset-paged list"** (`:1-12`)
- `lib/activity/history-validation.ts:29-38` — the `limit` + `cursor` query schema
- `app/api/v1/activity/response.ts:213-216` — the page shape: {{{ items, next_cursor: string | null }}}
- `app/api/v1/activity/route.ts:48-56` — a malformed cursor is a 400, never a silent first page

And the Tests domain already bounds its other read: `/tests/search` clamps to 1..50 with a default of 20 (`lib/tests/search-validation.ts:16-17`, RPC clamp at `0081:43`).

***One real sub-task, not free.**** `public.tests` has no index supporting a `(created*at, id)` keyset — the only indexes are `tests*workspace*id*idx` (`0024*tests.sql:51`) and `tests*tags*gin*idx` (`0030*test*tags.sql:49`). The RPC already orders by `created_at desc` (`0082:192`) but that order is not **total*, so ties must be broken by `id` for a page boundary to be unambiguous.

### The spec gap this story walks into

No functional requirement cleanly covers listing or paging Tests, and this story does not invent one:

- `FR-018 — Test tagging` (`.context/SRS/functional-specs.md:150`) specs the tag ***write***, and notes reserved values are recognised for filter semantics — but specs no list endpoint
- `FR-022 — Run history per Test` (`:180-184`) is the only FR that specs `?limit` + `before` + `next_cursor` explicitly. It is about Runs, not Tests, but it is the ratified precedent for the shape
- `FR-030 — Table view query` (`:237-241`) does cover `entity = test`, but specs ***offset**** paging (`page`, `total`) — which directly contradicts `business-api-map.md:728` (**"No offset pagination"*). This story follows the map, not FR-030, and the contradiction is recorded here rather than silently resolved

Three further recorded-vs-shipped divergences this story is obliged to clean up as it passes through:

| ***Recorded**** | ****Shipped**** | ****Where*** |
| --- | --- | --- |
| `project*id` ***required****, `tag` optional | `tag` ****required***, `project*id` not accepted at all | `.context/SRS/api-contracts.yaml:470-483` vs `app/api/v1/tests/route.ts:30-33` |
| `GET /tests` backed by FR-022 | FR-022 is Run history per Test | `.context/business/business-api-map.md:515` vs `functional-specs.md:180` |
| Convention is `?before=`, max 100 | Every shipped paged read uses `?cursor=`, max 50 | `business-api-map.md:726` vs `lib/activity/history-validation.ts:27` |

The recorded `project*id: required` is not merely stale, it is un-implementable: `tests` carries no `project*id` column (`0024_tests.sql:40-49`).

Finally, `.context/business/domain-glossary.md` defines ***no*** paging vocabulary at all. Its own change protocol (`:165`) requires a story that introduces domain terms to add them in the same change, which is why that appears as a criterion rather than as a nicety.

## Decisions taken on this ticket

Six open questions were ***decided here rather than escalated****, per the project's decision-authority rule. Each is published as an attributed comment on this issue with its alternatives scored: five by the ****AI Tech Lead**** (default page size and ceiling; refuse-versus-clamp; cursor design; backward compatibility; whose convention wins when the map and the code disagree) and one by the ****AI Product Owner*** (whether this story also unlocks list-all — it does not). Read those comments before writing an implementation plan, and do not re-open either question there.

## Sequencing

No blocking dependency. The codec, the query-schema pattern, the page shape and two shipped reference implementations are all on `staging` today. The only ordering constraint is internal and non-negotiable: the bound and the in-product consumer must land in the same change, because a bounded response with an unfixed tag filter silently narrows a filter users read as complete. This mirrors the rule `BK-667` already ratified for the same reason.

Landing this before `BK-666` is the cheaper order — it lets that story build its screen against a settled contract instead of discovering the scale decision it deferred.

## Provenance

Authored 2026-08-30 against `origin/staging` (`c893971`). Every technical claim above was read at that ref and its line numbers re-measured, not carried over. Sources: `app/api/v1/tests/route.ts`, `route.openapi.ts`, `lib/supabase/rpc.ts`, `lib/tests/search-validation.ts`, `lib/activity/history-validation.ts`, `lib/pagination/keyset-cursor.ts`, `app/api/v1/activity/route.ts` + `response.ts`, `app/(app)/projects/[projectSlug]/test-tag-filter.tsx`, migrations `0024`, `0030`, `0081`, `0082`; `.context/business/business-api-map.md` §7.4, `.context/business/domain-glossary.md` §3-§4 and §6, `.context/SRS/functional-specs.md`, `.context/SRS/non-functional-specs.md` §1, `.context/SRS/api-contracts.yaml`; and the full text of sibling stories `BK-666` and `BK-667`.

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Workflow](./workflow.md)

---

## Metadata

- **Created:** 2026-08-31
- **Updated:** 2026-08-31
- **Reporter:** Ely
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_
