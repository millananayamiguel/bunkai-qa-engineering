# BK-230 — Implementation Plan (Dev)

> Jira field: `customfield_10070` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-230)

# Implementation Plan: [https://jira.upexgalaxy.com/browse/BK-230#icft=BK-230](https://jira.upexgalaxy.com/browse/BK-230#icft=BK-230) - Billing | Upgrade to a paid plan

## Overview

Self-serve upgrade from `community` to `cloud` (Bunkai Cloud's paid tier): a tier-comparison
screen at `/settings/billing/upgrade`, an owner-only seat-quantity step, and a redirect to
Stripe Checkout (hosted). A webhook activates the new plan the moment Stripe confirms payment.
Enterprise stays a `mailto:` contact path. Free-plan project-limit enforcement (a dependency
AC2 needs) ships in the same PR, per the PO/Dev ratification on the ticket.

***Acceptance Criteria covered:*** AC1 (tier comparison, current-plan badge), AC2 (upgrade
unlocks limits immediately + receipt), AC3 (declined payment leaves plan/state untouched,
retry), AC4 (Enterprise is contact-only), AC5 (owner-only confirm; admin/member/viewer
read-only). Scenario E1 (double-tab/double-submit) is covered by a one-open-checkout-session
guard. See "Ratified departures from the shift-left draft" below for how the Stripe-redirect
decision reshapes AC2/AC3's exact mechanics — this is a re-pass of the refined ACs per the
2026-08-17 PO/Dev ratification comment's own instruction ("re-pass Phase 3's refined ACs... once
implementation planning starts").

---

## Ratified departures from the shift-left draft (re-pass per the 2026-08-17 comment)

The 2026-08-17 PO/Dev ratification (Jira comment) already answered the four Critical Questions
and four Technical Questions that were blocking estimation. This plan carries those answers
forward and resolves the remaining open scenarios (2.4/2.5/3.3/E1) that the ratification left to
implementation planning. Full reasoning for each is published as an AI Tech Lead / AI Product
Owner attributed Jira comment (see "Jira publication" below) and, for the two decisions that are
architectural, as ADR-0014.

1. ***Payment mechanism (Q1, unchanged):*** Stripe Checkout, hosted, redirect + webhook. Confirm

is no longer an in-app modal action — the owner is redirected to Stripe's hosted page and our

app never touches card data (zero PCI scope, per T1).

1. ***How the integration is provisioned (new — AI Tech Lead):*** the `stripe` npm SDK, wired

directly with env-var credentials (`STRIPE*SECRET*KEY`, `STRIPE*WEBHOOK*SECRET`,
`STRIPE*CLOUD*PRICE_ID`), the same pattern this repo already uses for Resend
(`RESEND*API*KEY` in `.env.example`, no Vercel Marketplace claim). The Vercel Marketplace
Stripe integration is a **connectable** integration (dashboard/browser claim step) that a
headless, unattended worker session cannot complete; the code path built here is the real
integration, not a mock — a human supplies live/test API keys via `.env` / Vercel env before
it processes a real payment. Recorded as a scored decision in the attributed Jira comment.

1. ***Declined-payment retry (AC3, Scenario 3.1-3.4):*** Stripe's hosted Checkout page owns retry

natively (a decline keeps the shopper on Stripe's page with another card field) — no in-app

decline/retry UI is built. This resolves Scenario 3.3 (seat quantity survives a decline+retry)
for free: the seat quantity was fixed as the Checkout Session's line-item quantity before
redirect, and Stripe's own retry never leaves that session.

1. ***Team-tier pricing (Q3, unchanged):*** no dollar figure is computed or rendered by our app

anywhere in the upgrade flow (comparison screen OR the seat-quantity step) — copy says "see

your exact rate on the next screen (Stripe Checkout)". Stripe's hosted page is the only place
the real number appears, avoiding any drift between our copy and the actual price.

1. ***member/viewer role (Q4, unchanged):*** same as admin — can view the comparison, cannot

confirm. No nav-hiding.

1. ***Enterprise contact destination (T3, unchanged):*** `mailto:` to a sales alias.
2. ***Idempotency (T2, unchanged + extended):*** the existing `Idempotency-Key` contract

(`lib/api/idempotency.ts`, ADR-0002) gates `POST .../billing/checkout` exactly like
`POST /api/v1/runs`. Extended for Scenario E1 (two tabs, both confirmed): a partial unique
index allows at most one ***open*** `billing*checkout*sessions` row per workspace — a second
concurrent checkout attempt gets back the SAME Stripe Checkout URL (or a 409 if it loses the
insert race), so two tabs can complete at most once, never two charges.

1. ***Free-plan project-limit enforcement (Q2, unchanged):*** built in this PR as a `BEFORE INSERT`

trigger on `public.projects`, mirroring `lib/billing/plan-tiers.ts`'s limits as SQL literals
(same convention `0065*atc*tags*cap*guard.sql` established) — the only real gate today, since
`POST /api/v1/workspaces/{id}/projects` does a plain RLS-gated insert with no RPC layer to
backstop otherwise.

1. ***Minimum seat quantity (Scenario 2.4/2.5 — new, AI Product Owner):*** minimum purchasable

seats = the workspace's current `active*seats` count (from `bunkai*workspace*billing*overview`,
already gated owner/admin). Rationale: this story has no seat-reduction path (that is
downgrade territory, [https://jira.upexgalaxy.com/browse/BK-233#icft=BK-233](https://jira.upexgalaxy.com/browse/BK-233#icft=BK-233), explicitly out of scope), so selling fewer seats than are already
occupied would immediately misrepresent the workspace's own membership. Maximum = the Cloud
tier's `seatLimit` (25) — the story does not introduce a variable seat ceiling, only a
variable **purchased** quantity within the already-ratified fixed cap. A 0-seat or
below-current-usage attempt is rejected client- and server-side (`seat*quantity*invalid`).

1. ***Abandoned checkout (new — AI Tech Lead, closes a gap the ratification didn't address):***

landing back on `/settings/billing/upgrade` from Stripe's `cancel_url` calls
`POST .../billing/checkout/cancel`, which expires the Stripe session server-side and flips the
`billing*checkout*sessions` row to `canceled`, releasing the one-open-session lock
immediately instead of stranding the owner for Stripe's default 24h session TTL.

---

## Technical Approach

***Chosen approach:*** Stripe Checkout Session (`mode: 'subscription'`, one line item at
`STRIPE*CLOUD*PRICE_ID` × seat quantity), created server-side by an owner-only, idempotent POST
route; a public webhook route verifies Stripe's signature and applies the plan change through a
new `SECURITY DEFINER` RPC (no user session exists inside a webhook request). A `BEFORE INSERT`
trigger on `projects` enforces the Free-plan project cap.

***Alternatives considered:***

- ***In-app card form (Stripe Elements embedded):*** rejected by the 2026-08-17 ratification —

keeps full PCI scope on our servers for no product benefit over a hosted redirect.

- ***Vercel Marketplace-provisioned Stripe:*** rejected for this worker session (see departure #2

above) — the claim step needs a human at a dashboard; the code built here does not preclude

provisioning it later, since Marketplace-managed Stripe still lands as the same env vars.

- ***Synchronous plan activation in the checkout POST route (no webhook):*** rejected — payment

confirmation is asynchronous by construction once Stripe hosts the page; the route returns

before the owner has even entered a card. The webhook is the only point that legitimately knows
payment succeeded.

***Why this approach:***

- Zero PCI scope; matches existing `Idempotency-Key` / `SECURITY DEFINER` RPC / non-disclosure

conventions already established across the codebase (ADR-0002, ADR-0012, `0072`, `0065`).

- ❌ Trade-off: plan activation has webhook latency (typically sub-second, but not synchronous) —

the success page shows a "confirming your upgrade" state rather than an instant flip, which is

honest given the DB write genuinely hasn't landed yet at redirect time.

---

## Database changes (`supabase/migrations/0077*billing*upgrade_checkout.sql`)

1. `billing*checkout*sessions` ***table*** — one row per Stripe Checkout Session attempt.

Columns: `id uuid pk`, `workspace*id uuid fk`, `created*by*user*id uuid fk auth.users`,
`target*plan text check (in ('cloud'))`, `seat*quantity int check (> 0)`,
`stripe*checkout*session_id text unique not null`, {{status text check (in ('open','completed',
'expired','canceled')) default 'open'}}, `idempotency*key text not null`, {{expires*at
timestamptz not null}}, `created*at`, `completed*at`.
***Partial unique index*** `on (workspace_id) where status = 'open'` — the E1 guard (departure
#7). RLS enabled: owner-only `select`/`insert` ({{with check (bunkai*is*workspace_owner
(workspace*id))}}) and owner-only `update` (for the cancel route) — mirrors `idempotency*keys`'
self-scoped RLS posture (0009) even though routes use the caller's own RLS-scoped client, not
an admin client, for these two operations (only the webhook needs `service_role`).

1. `stripe*webhook*events` ***table*** — `id text primary key` (the Stripe event id), `type text`,

`received*at timestamptz default now()`. RLS enabled, ***no policies*** (service*role-only,
mirrors `magic*link*tokens`' posture in 0009). The webhook's dedupe key.

1. **`bunkai*enforce*project_limit()` trigger function + `BEFORE INSERT` trigger on

`public.projects`.** Mirrors `lib/billing/plan-tiers.ts`'s `projectLimit` per plan
(`community` 3, `cloud` 50, `enterprise` unlimited) as inline SQL literals with a pointer
comment to that file — the `0065` convention. Raises `project*limit*reached` (new errcode
`45700`) when the workspace's current plan is at its project cap. `SECURITY INVOKER` (no actor
spoof surface — the RLS insert policy already restricts callers to workspace members, and the
trigger only reads `workspaces.plan` + counts `projects`, both already visible to a member
under existing RLS).

1. **`bunkai*apply*billing*checkout*webhook*event(p*stripe*event*id text, p*stripe*event_type

text, p*stripe*checkout*session*id text){{ RPC**, }}SECURITY DEFINER{{ (webhook has no

}}auth.uid(){{). Body: insert into }}stripe*webhook*events{{ (}}on conflict do nothing{{; 0 rows
affected → return }}{status: 'duplicate'}{{ immediately). Then, by }}p*stripe*event_type`:

- `checkout.session.completed` → lock the `billing*checkout*sessions` row, set

`workspaces.plan = target*plan`, flip the row to `completed`, insert an `activity*log`
`workspace.plan_upgraded` event.

- `checkout.session.expired` → flip the row to `expired` (releases the one-open-session lock).
- anything else → no-op, returns `{status: 'ignored'`}.

Unknown/missing session id → `{status: 'unknown_session'`} (logged by the route, still 200 to
Stripe — retrying would not help).

---

## API changes

- `POST /api/v1/workspaces/{id}/billing/checkout` — owner-only (`bunkai*is*workspace_owner`),

`Idempotency-Key` required. Body {{{ seat_quantity: int }}}. Reads
`bunkai*workspace*billing*overview` for `plan` + `active*seats` (reuses the [https://jira.upexgalaxy.com/browse/BK-229#icft=BK-229](https://jira.upexgalaxy.com/browse/BK-229#icft=BK-229) RPC — no new
read path). Validates `plan === 'community'` (else `plan*not*upgradable`, 422) and
`active*seats <= seat*quantity <= 25` (else `seat*quantity*invalid`, 422). Reuses an existing
open session for the workspace if one is live (`stripe.checkout.sessions.retrieve` status
check); otherwise creates a Stripe Checkout Session (`idempotencyKey` = the request's
`Idempotency-Key`) and inserts the `billing*checkout*sessions` row. A losing race on the partial
unique index maps to 409 `checkout*in*progress`. Returns {{{ url }}}.

- `POST /api/v1/workspaces/{id}/billing/checkout/cancel` — owner-only. Expires the workspace's

open Stripe session (best-effort) and flips the row to `canceled`. 204.

- `POST /api/v1/billing/webhook` — `auth: 'public'`, Stripe-signature-verified (raw body via

`request.text()`, never `.json()`). Dispatches into the RPC above. Always 200 unless the
signature itself fails to verify (400).

- `app/api/v1/workspaces/[id]/projects/route.ts` — catch the trigger's `45700` and map to a

new `project*limit*reached` (422) `ApiError`, alongside the existing 23505/42501 mapping.

- ***New**** `ApiErrorCode`****s*** in `lib/api/error-envelope.ts`: `plan*not*upgradable` (422),

`seat*quantity*invalid` (422), `checkout*in*progress` (409), `project*limit*reached` (422),
`payment*processor*unavailable` (503 — `STRIPE*SECRET*KEY`/`STRIPE*WEBHOOK*SECRET` missing,
mirrors the optional-env graceful-degrade convention `ATLASSIAN_*` already uses in `lib/env.ts`).

- ***OpenAPI***: `route.openapi.ts` for both new workspace-scoped routes (registered in

`scripts/openapi-gen.ts`); the webhook route is intentionally NOT registered (not a
client-facing contract — Stripe is the only caller, mirrors how internal-only surfaces are
typically excluded... confirmed against existing registry usage before writing).

---

## UI/UX Design

***Design System:*** frozen tokens per `master-design-plan.md` §2 (unchanged); reuses `Card` /
`CardHeader` / `CardTitle` / `CardContent` from `components/ui/card.tsx`, `Button`, `Input`,
`Meter` primitives already live in `components/billing/BillingOverviewView.tsx`.

***Route:*** `app/(app)/settings/billing/upgrade/page.tsx` (server component, resolves
`workspaceId` same as `settings/billing/page.tsx`) → `components/billing/UpgradeView.tsx`
(client, owns the whole lifecycle: fetch overview → render comparison → seat step → checkout
redirect → cancel-return handling).

***Structure***, adapted from `plan-comparison-checkout.html` (community/cloud/enterprise, English
storage-literal-derived display names — `domain-glossary.md` §3 bans "Free/Team"):

```
┌──────────────────────────────────────────────────────────────┐
│ Upgrade your plan                                             │
│ Compare tiers and pick your seat count. Changes apply         │
│ immediately once payment is confirmed.                        │
├───────────────┬───────────────────┬───────────────────────────┤
│ Community      │ Cloud              │ Enterprise                │
│ [Current plan] │ Upgrade to Cloud   │ Contact sales (mailto)    │
│ 5 seats/3 proj │ 25 seats/50 proj   │ Unlimited                 │
│ /30d retention │ /90d retention     │ Custom, sales-assisted    │
└───────────────┴───────────────────┴───────────────────────────┘
        (owner clicks "Upgrade to Cloud" → seat step expands)
┌──────────────────────────────────────────────────────────────┐
│ Seats — [-] N [+]   (min = active members, max = 25)           │
│ "See your exact rate on the next screen (Stripe Checkout)."    │
│ [ Continue to payment ]  → redirects to Stripe                 │
└──────────────────────────────────────────────────────────────┘
```

Non-owner (admin/member/viewer): comparison renders read-only; the Cloud column's CTA is replaced
by "Only the workspace owner can upgrade the plan. Ask the workspace owner to confirm this
change." (Scenario 5.3 — copy is this story's own call, undecided upstream).

***States:*** loading (skeleton, mirrors `BillingOverviewSkeleton`), error+retry (mirrors
`BillingOverviewView`'s pattern), forbidden (workspace not visible → same 404→"not available"
non-disclosure convention as [https://jira.upexgalaxy.com/browse/BK-229#icft=BK-229](https://jira.upexgalaxy.com/browse/BK-229#icft=BK-229)), checkout-redirecting (brief "Redirecting to Stripe…"),
canceled-return (banner: "Checkout canceled. Nothing was charged." — fires the cancel POST once
on mount via a `?checkout=canceled` query param), success-return (banner on `/settings/billing`:
"Payment confirmed — activating your plan" while `BillingOverviewView`'s own poll-on-mount picks
up the new plan; no bespoke polling loop is built — a manual refresh always reflects the true
state, and the existing overview fetch already runs on every mount).

***Content writing:*** all copy above is Bunkai-specific (Billing Plan / Tier, Community / Cloud /
Enterprise, seats) per `domain-glossary.md` — no "Free/Team" reintroduction, no generic
placeholder strings.

---

## Types & Type Safety

- `lib/types.ts` already has `WorkspacePlan` / `MemberRole` — reused, not duplicated.
- `WorkspaceBillingOverview` shape reused from BK-229's route (`plan`, `active_seats`).
- New request/response types live beside their route (`CheckoutBodySchema` via `zod`, matching

`app/api/v1/workspaces/[id]/projects/route.ts`'s `CreateBodySchema` pattern).

- `api/openapi-types.ts` regenerated after `openapi:gen` picks up the two new registered routes.

---

## Implementation Steps

### Step 1: Migration `0077*billing*upgrade_checkout.sql`

***Task:*** tables, RLS, partial unique index, project-limit trigger, webhook-apply RPC.

***Testing:*** apply via Supabase MCP; re-read the live definitions and diff against the committed
file (repo mandate). Manually exercise the trigger with a throwaway insert past the Community cap
in a scratch transaction (`begin; ...; rollback;`) to confirm the raise fires, then roll back —
never leaves the guard unverified.

***Estimated time:*** 1.5h

### Step 2: `lib/billing/stripe.ts` + `lib/billing/checkout.ts`

***Task:*** lazy Stripe client (throws `payment*processor*unavailable` if env vars absent, not at
import time); seat-quantity bounds helper (`resolveSeatQuantityBounds(activeSeats, tier)`); the
Checkout Session orchestration function the route calls (validate → reuse-or-create → insert row).

***Testing:*** unit tests for the bounds helper (pure function, no network/DB) — mirrors
`plan-tiers.test.ts`'s style.

***Estimated time:*** 2h

### Step 3: `lib/supabase/rpc.ts` wrappers + `lib/billing/errors.ts` (RPC error → `ApiError` mapper)

***Task:*** typed wrappers for the new RPC, mirroring `mapRunRpcError`'s exhaustive-switch style for
the `45700`/webhook-RPC error paths.

***Estimated time:*** 45m

### Step 4: `app/api/v1/workspaces/[id]/billing/checkout/route.ts` (+ `.openapi.ts`) and

`.../checkout/cancel/route.ts`

***Task:*** owner-only POST, `Idempotency-Key` required, wraps Step 2's orchestration; cancel route.

***Testing:*** route-level tests mocking the Supabase client (existing pattern in
`app/api/v1/workspaces/[id]/billing/route.ts` has no `.test.ts` sibling yet to mirror exactly —
check `app/api/v1/runs/route.test.ts` for the house mocking style instead) — covers owner gate,
plan-not-upgradable, seat-quantity bounds, idempotent replay, and the 409 race path.

***Estimated time:*** 2.5h

### Step 5: `app/api/v1/billing/webhook/route.ts`

***Task:*** `auth: 'public'`, raw-body signature verification, dispatch to the RPC, always-200
posture (except signature failure).

***Testing:*** unit test with a hand-signed payload (Stripe's Node SDK exposes
`Webhook.generateTestHeaderString` for exactly this) covering completed / expired / unknown-type /
bad-signature.

***Estimated time:*** 1.5h

### Step 6: Project-limit enforcement wiring in the existing projects route

***Task:*** catch `45700`, map to `project*limit*reached` 422 in
`app/api/v1/workspaces/[id]/projects/route.ts`.

***Testing:*** extend that route's existing test file with a Community-plan-at-cap case.

***Estimated time:*** 30m

### Step 7: `components/billing/UpgradeView.tsx` + `app/(app)/settings/billing/upgrade/page.tsx`

***Task:*** the screen described in UI/UX Design above; wires the two new routes; the "Upgrade
plan" entry on `BillingOverviewView`'s plan card (currently the [https://jira.upexgalaxy.com/browse/BK-229#icft=BK-229](https://jira.upexgalaxy.com/browse/BK-229#icft=BK-229) inert `soon` control per
D34(d)) becomes a live `<Link href="/settings/billing/upgrade">`.

***Testing:*** component test covering owner vs non-owner render, seat-quantity min/max clamping,
canceled-return banner firing the cancel POST once.

***Estimated time:*** 3h

### Step 8: OpenAPI + types regeneration, full verification gate

***Task:*** `bun run openapi:gen && bun run openapi:diff`, {{bun run api:sync --file
public/openapi.json}}, then `bun test && bun run types:check && bun run lint:check`.

***Estimated time:*** 45m

### Step 9: Integration — full flow read-through (no live UI per this run's scope)

***Task:*** trace comparison → seat step → checkout POST → Stripe redirect (code path only, not
rendered) → webhook → plan flip → overview reflects it; trace cancel path; trace E1 race.

***Estimated time:*** 30m

---

## Technical Decisions (Story-specific)

### Decision 1: Checkout-session writes go through the caller's RLS-scoped client, not `service_role`

***Chosen:*** `POST .../checkout` and `.../checkout/cancel` use `getAuth(ctx).db` (the user's own
session), relying on RLS (`bunkai*is*workspace_owner`) as the real gate — same posture as
`0072`'s overview RPC and the projects route. Only the webhook (no user session exists) uses
`createAdminClient()`.

***Reasoning:***

- ✅ Keeps the "never `createAdminClient()` for a user-facing write unless there is no session"

convention intact (0072's own commentary is explicit about this failure mode).

- ❌ Trade-off: none identified — this is the established house pattern, not a deviation.

### Decision 2 → promoted to ADR-0014

The payment-provider integration shape (Stripe Checkout hosted, redirect + webhook, env-var
wired rather than Vercel-Marketplace-claimed) and the webhook's `SECURITY DEFINER` RPC / signature
verification model are architectural and hard to reverse (external billing state, a new
auth-less write surface). See `ADR-0014-stripe-checkout-billing-upgrade.md`.

---

## Dependencies

- [x] `BK-229` (`lib/billing/plan-tiers.ts`, migration `0072`) — Ready For QA, shipped.
- [x] `bunkai*is*workspace_owner` (migration `0005`) — live.
- [x] `lib/api/idempotency.ts` (ADR-0002) — live, reused as-is.
- [ ] ***Human/Conductor step, non-blocking for merge:*** real Stripe API keys

(`STRIPE*SECRET*KEY`, `STRIPE*WEBHOOK*SECRET`, `STRIPE*CLOUD*PRICE_ID`) must be set in Vercel
env before this processes a real payment on staging/production. Code ships complete and
degrades to a clear `payment*processor*unavailable` 503 without them — not a merge blocker.

---

## Risks & Mitigations

***Risk 1:*** Webhook signature secret misconfigured in an environment → every webhook 400s,
silently stranding paid workspaces at `community`.

- ***Impact:*** High
- ***Mitigation:*** `payment*processor*unavailable` at checkout-creation time surfaces the

misconfiguration BEFORE a customer pays (checkout route validates env vars are present, not

just the webhook route) — a workspace can never reach Stripe without our webhook already being
configured to receive its result.

***Risk 2:*** Two tabs both completing payment (Scenario E1) despite the one-open-session guard, if
the guard's read-check-then-insert has a race window.

- ***Impact:*** Medium (would double-charge a real customer)
- ***Mitigation:*** the partial unique index is the actual race-safety mechanism (DB-enforced, not

the read-check) — a losing insert always 409s before a second Stripe session is ever created.

***Risk 3:*** Abandoned checkout stranding the one-open-session lock for up to Stripe's default 24h
TTL if the cancel route is never called (e.g., the owner closes the tab instead of clicking back).

- ***Impact:*** Low
- ***Mitigation:*** the Checkout Session is created with an explicit 30-minute `expires_at`

(shorter than Stripe's 24h default) and Stripe's own `checkout.session.expired` webhook releases
the lock automatically — the cancel route is a UX nicety for the common path, not the only
release valve.

---

## Estimated Effort

| ***Step**** | ****Time*** |
| --- | --- |
| 1. Migration | 1.5h |
| 2. `lib/billing/stripe.ts` + `checkout.ts` | 2h |
| 3. RPC wrappers + error mapper | 45m |
| 4. Checkout + cancel routes | 2.5h |
| 5. Webhook route | 1.5h |
| 6. Project-limit route wiring | 30m |
| 7. UI (`UpgradeView` + page) | 3h |
| 8. OpenAPI/types + verification gate | 45m |
| 9. Integration read-through | 30m |
| ***Total**** | ****~13h*** |

***Story points:*** 13 (matches `story.md`).

---

## Definition of Done Checklist

- [ ] Code implemented per this plan
- [ ] AC1-AC5 + Scenario E1 covered (2.4/2.5/3.3 resolved per departures #7/#9 above)
- [ ] Types from `@lib/types` / generated Supabase types used throughout — zero `as any`
- [ ] UI matches frozen design tokens; mockup-informed structure per `master-design-plan.md`

§4.15, departure from decline/retry UI recorded in §5 + ADR-0014

- [ ] Domain-glossary-correct copy (Billing Plan/Tier, Community/Cloud/Enterprise, seats) —

no "Free/Team", no generic placeholder text

- [ ] `bun test`, `bun run types:check`, `bun run lint:check` all green
- [ ] OpenAPI spec + generated types regenerated and committed
- [ ] Adversarial self-review — zero BLOCKER/MAJOR left open
- [ ] Attributed AI Tech Lead / AI Product Owner Jira comment published, ADR-0014 written
- [ ] Branch pushed, PR open against `staging`
- [ ] Jira → In Review

---
_Synced from Jira by sync-jira-issues_
