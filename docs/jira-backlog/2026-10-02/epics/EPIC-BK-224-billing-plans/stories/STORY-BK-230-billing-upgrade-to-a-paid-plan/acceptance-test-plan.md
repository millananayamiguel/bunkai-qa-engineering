# ACCEPTANCE TEST PLAN (ATP): ATP: BK-230: Billing | Upgrade to a paid plan

**Jira Key:** [BK-824](https://jira.upexgalaxy.com/browse/BK-824)
**Status:** Planning
**Components:** None

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

# Acceptance Test Plan — BK-230: Billing | Upgrade to a paid plan

***Epic******:**** BK-224 (Billing & Plans) · ****Modality******:**** jira-xray · ****Target env******:*** staging
***Sprint******:**** Bunkai (72) Sprint 4 · ****Risk verdict******:*** HIGH (veto: REQUIRE TESTING — money/billing + auth + external integration + data integrity; risk score 13)
***Shift-left short-circuit******:*** ACTIVE (`shift-left-reviewed` + `shift-left-2026-08-17`) — Phases 1-3 inherited; this is the in-sprint superset.
***Authored******:*** 2026-09-01, Stage 1 Planning. Full technique derivation + parametrization data + per-TC steps: `.session/sprint-testing/BK-230/atp-draft.md` (working copy).

Plan-name mapping: `community` = Free, `cloud` = Team, `enterprise` = Enterprise.

---

## 1. Risk triage

Veto ***REQUIRE TESTING*** fires on four triggers: money/billing (real Stripe charges; `workspaces.plan` + `purchased*seats` are billing state), auth (owner-only mutation gate), external integration (first payment processor in the product — Stripe Checkout hosted redirect + signed webhook), data integrity (new `billing*checkout*sessions` state machine, `bunkai*enforce*project*limit()` trigger, two SECURITY DEFINER RPCs).

***Risk drivers (ordered)******:*** (1) silent money-without-value — payment succeeds at Stripe but the plan never activates (late webhook past the 30-min TTL, guard rejects a non-`open` session), no auto-reconciliation; (2) plan activates without verified payment; (3) owner-only gate bypass via a direct API call (BK-135 class); (4) double-charge/double-activate on double-submit (BK-248 precedent); (5) `bunkai*enforce*project_limit()` counts every `projects` row — soft-deleted projects may consume quota; (6) tenant isolation on the new routes; (7) Stripe test keys likely NOT wired on staging (0 sessions ever, 0 `cloud` workspaces).

---

## 2. Test Analysis (condensed)

***UI*** `/settings/billing/upgrade` — 3-column tier comparison, current-plan marker, seat selector, Confirm→redirect, Enterprise `mailto:` CTA, decline/retry return, cancel-URL return.
***API*** `POST` create-checkout (owner-only via `bunkai*is*workspace*owner`; inserts `billing*checkout*sessions` `open`, 30-min Stripe Checkout Session, `{checkout*url}`, reuses open row / `409` on concurrency) and `POST` Stripe webhook receiver (Stripe-signature auth, calls `bunkai*apply*billing*checkout*webhook_event(...)`, always `2xx`).
***DB*** `billing*checkout*sessions` (CHECKs + partial unique index `one*open*per*workspace WHERE status='open'`), `stripe*webhook*events` dedup ledger, `workspaces.plan`/`purchased*seats`, `projects` trigger `bunkai*enforce*project*limit()` (community=3, cloud=50, enterprise=unlimited), RPC `bunkai*apply*billing*checkout*webhook*event` (idempotent; returns `applied|already*processed|duplicate|awaiting*payment|payment*failed|expired|unknown*session|ignored`), `bunkai*workspace*billing*overview` (+`purchased*seats`), `activity*log` `workspace.plan*upgraded`.

***Out of scope******:**** downgrade/cancel (BK-233), Enterprise self-serve checkout, PO invoicing, tax handling, mid-cycle proration, ****hard invite-time seat enforcement (BK-636, deferred)***, billing details/invoices (BK-231).

---

## 3. Technique derivation (summary)

- ***Decision Table**** — role {owner, admin, member, viewer} x current plan {community, cloud, enterprise} x action x payment outcome {paid, declined, abandoned/expired, double-submit}. Collapse: admin==member==viewer for the confirm gate (PO ratification Q4); Enterprise path role-independent; upgrading from enterprise is an invalid transition. 48 cartesian cells → ****14 surviving rules*** (TC2, TC4, TC9, TC12, TC14, TC15, TC16, TC17c/d, TC19, TC20, TC21, TC23). Pairwise (role x plan x outcome, 3 factors) satisfied by this reduction — logged.
- ***BVA*** — seat quantity, min=`active*seats`, max=25: reject `0, 1, active*seats-1, 26`; accept `active*seats, active*seats+1, 24, 25` (TC7 accept / TC8 reject, both parameterized). Project-count BVA around the community cap of 3: `2/3/4` (TC5).
- ***State-Transition**** — `billing*checkout*sessions.status`: `∅→open→{completed|expired|canceled}`. Valid T1-T4 (insert, webhook-paid, webhook-expired/TTL/cancel, cancel→canceled). Invalid/guarded I1-I7: replayed event (dedup), duplicate paid event on `completed` (no-op), `expired→completed`**** late-paid webhook — the Conductor nuance, NEEDS DEV CONFIRMATION (TC18)***, unknown-session id (`unknown*session`+2xx), `async*payment_failed`→expired, two `open` rows blocked by the unique index (TC19).
- ***Error-Guessing charters*** — Stripe keys absent (Stage 2 first probe); invalid webhook signature (400, RPC not called); unknown-session webhook; concurrent create-checkout; abandoned-checkout/cancel-URL release; project-limit trigger vs soft-deleted rows (NEEDS DEV CONFIRMATION, TC22); double-submit Confirm (BK-248); non-owner privilege escalation via direct API (BK-135 class, TC14); tenant non-disclosure (TC23); activation only on verified `paid` (TC17c); purchased_seats meter honesty vs BK-636 enforcement gap (TC6); receipt channel (AC2.2 "TBD").

---

## 4. Test-Case list (final — 23 Test issues, 5 parameterized: TC7, TC8, TC11, TC16, TC17)

Nomenclature `BK-230: TC#: should <outcome> [<connector> <condition>] [given <precondition>]`. Type M = Manual, G = Gherkin/Cucumber.

| TC | Title | AC | Type | Level | Pri |
| --- | --- | --- | --- | --- | --- |
| TC1 | should display community/cloud/enterprise tiers with limits and mark the current plan, given an owner on community | AC1.1 | M | UI | High |
| TC2 | should mark cloud as current with no downgrade CTA, given a cloud workspace | AC1.2 | M | UI | Med |
| TC3 | should render the cloud price only as the "see checkout for your rate" indicator, never a number | AC1.3+Q3 | M | UI | Med |
| TC4 | should move workspace to cloud, set purchased*seats, unlock limits w/o reload, log activity*log, issue receipt, given valid Stripe payment | AC2.1+2.2, 5.1 | G | E2E | Critical |
| TC5 | should allow a 4th project after upgrade and block it while still community, given exactly 3 projects | AC2.3 | G | E2E/DB | Critical |
| TC6 | should show the real purchased seat cap (not tier max) in the seat meter | AC2 (purchased_seats) | M | API/DB | High |
| TC7 (param) | should accept the seat quantity at each valid boundary — Examples: active_seats, +1, 24, 25 | AC2.4+ratif | G | API/UI | High |
| TC8 (param) | should reject the seat quantity at each invalid boundary, no session created — Examples: 0, 1/<active, active_seats-1, 26 | AC2.4/2.5+ratif | G | API/UI | High |
| TC9 | should keep workspace on community, no charge, no partial state, decline-specific copy, given a declined card | AC3.1+3.2 | G | E2E | Critical |
| TC10 | should let the owner retry a different card and succeed without restarting tier selection or seat entry | AC3.3+3.4+ratif | M | E2E | High |
| TC11 (param) | should map each Stripe decline*code to reason-specific copy — Examples: insufficient*funds, card*declined, expired*card, incorrect_cvc | AC3.2+T4 | M | UI | Med |
| TC12 | should show an Enterprise contact CTA (mailto: sales) and mount zero card fields | AC4.1-4.3+T3 | M | UI | High |
| TC13 | should let the owner view + confirm end to end (collapsed: covered by TC1+TC4, kept for traceability) | AC5.1 | M | E2E | High |
| TC14 | should block a non-owner from confirming client AND server (no billing*checkout*sessions row on direct API call) | AC5.2 | G | UI+API | Critical |
| TC15 | should tell a non-owner the owner completes upgrades | AC5.3 | M | UI | Med |
| TC16 (param) | should give member and viewer the same view-only access as admin — Examples: member, viewer | AC5.4+Q4 | G | UI+API | High |
| TC17 (param) | should apply the webhook idempotently, only on verified payment — Examples: (a) paid→activated once (b) replay→already*processed (c) unpaid→awaiting*payment (d) expired→session expired+lock released (e) unknown session→unknown_session+2xx (f) bad signature→400, RPC not called | Scn 21+22 | G | API/DB | Critical |
| TC18 | should activate (or explicitly surface as a reconciliation signal, not silently drop) a late paid webhook arriving after the session already expired — Conductor nuance | ST invalid I3 | M | API/DB | High — NEEDS DEV CONFIRMATION |
| TC19 | should enforce exactly one open checkout session per workspace under concurrency — one row, loser gets same URL or 409, never 2 Stripe sessions | Scn E1+ratif | G | API/DB | High |
| TC20 | should not double-charge/activate/receipt on rapid double-submit or network retry | Scn 20/E1+BK-248 | M | E2E | High |
| TC21 | should expire the session and release the lock immediately on cancel-URL return, allowing an immediate fresh checkout | Scn 22+ratif | M | E2E | Med |
| TC22 | should count only live projects toward the community cap (soft-deleted project doesn't consume quota) | risk#7 | M | DB | Med — NEEDS DEV CONFIRMATION |
| TC23 | should return the tenant non-disclosure error for a non-owned-workspace create-checkout call, no row created | isolation+BK-135 | G | API | High |

***Reconciliation with the shift-left 22 outlines******:**** all 22 map onto TC1-TC21 (1:1 or 1:many — e.g. outline 21/22 → TC17+TC21, outline 16 → TC9+TC11). ****Expanded beyond the 22**** (risk-outside-criterion): TC6, TC17b/e/f, TC18, TC19, TC22, TC23. ****Collapsed******:*** TC7/TC8 (EP-merge within partition), TC12 (one UI state), TC13 (structurally covered by TC1+TC4).

---

## 5. Contingency — Stripe test-mode not wired on staging

Stage 2's first action is the smoke probe (owner → upgrade → Team → Confirm). ***Redirect to ****`checkout.stripe.com` → wired → run full E2E legs (TC4, TC5, TC9, TC10, TC11, TC20) with Stripe test cards. `500`**** / non-redirect**** → NOT wired → (1) file an environment Defect (`root*cause=configuration*error`, component Billing); (2) record the payment-success/decline legs of TC4/TC9/TC10/TC11/TC20 as ****NOT TESTED*** with that Defect as blocker; (3) exercise the webhook-application path by calling `bunkai*apply*billing*checkout*webhook_event(...)` directly with simulated event payloads — covers all TC17 rows, TC18, and the DB side of TC4/TC5/TC6; (4) TC1/TC2/TC3, TC7/TC8 (to the redirect boundary), TC12, TC14-TC16, TC19, TC21-TC23 remain fully executable without Stripe.

---

## 6. Test-Design Checklist (filled)

| Item | Verdict |
| --- | --- |
| P1 beyond "every AC passes" | YES — TC6, TC17b/e/f, TC18, TC19, TC22, TC23 |
| P2 AC as floor, coverage above | YES — §3 charters |
| P3 concrete exploration not AC restatement | YES — TC13/TC4-5.1 explicitly marked collapsed/traceability |
| P4 multiple cases per AC, collapses justified | YES — AC1→TC1-3, AC2→TC4-8, AC3→TC9-11, AC5→TC13-16; collapses stated |
| P5 boundary/exception/anomaly beyond AC | YES — seat BVA, state machine, concurrency, double-submit, soft-delete quota |
| EP partitions (valid+invalid) | YES — role, payment outcome, seat range |
| BVA every range has boundaries | YES — seats 0/1/active_seats±1/24/25/26; projects 2/3/4 |
| ST transition table incl. invalid | YES — T1-T4 valid, I1-I7 invalid/guarded |
| DT 2+ interacting conditions | YES — 48 cells → 14 rules |
| PW 3+ factors, pairwise logged | YES — role x plan x outcome, reduction logged |
| PARAM same-behavior variants in one artifact | YES — TC7/8/11/16/17 carry Examples, not N Tests |
| RISK prioritized, drops logged | YES — priority column; only conditional deferral is Contingency §5, logged NOT TESTED |

---

## 7. Traceability plan (Set-first)

`ATS: BK-230: Billing | Upgrade to a paid plan` (parent BK-515, components inherited) holds TC1-TC23 as Xray-internal membership; `ATS is tested by BK-230` via the `test` slug — ***the coverage-bearing edge***. `ATP: BK-230: …` (this body, parent BK-514) and `ATR: BK-230: Story Testing` (parent BK-515, Test Environment = staging) link to BK-230 via `test` — administrative only. ATP/ATR test lists are derived from the ATS membership, never maintained independently. Every Bug/Defect filed parents to BK-183, links via `problem*incident`, carries mandatory `components` + `qa*assignee` (self) + Severity→Priority.

---

## 8. Open items (resolve before batch creation / Stage 2)

1. `.agents/jira-fields.json`*** is STALE*** vs `upexgalaxy72` (verified by name-match against `/rest/api/3/field`): ATP `10067→10137`, ATR `10124→10165`, QA Assignee `10070→10104`, Severity `10121→10054`, Acceptance Criteria `10097→10110`, Actual/Expected Result `10094→10077`/`→10166`, Test Environment `→10078`, Root Cause `10049→10094`, Evidence `→10134`. Run `/jira-instance-migration` before Stage 3.
2. ***Xray CLI not authenticated*** — batch creation blocked until `bun xray auth login` succeeds.
3. ***BK-230 is in an active sprint — "Bunkai (72) Sprint 4"*** — contradicts the earlier "no Sprint field" note; STP was skipped on that stale basis.
4. ***BK-230 has no ***`components` — proposed `Bunkai Billing`; confirm/create before the batch.
5. TC18 and TC22 carry NEEDS DEV CONFIRMATION.
6. AC2 seeding (3-project community ws; route to cloud without real payment) deferred to Stage 2, needs authorization.

---

## Related Issues

- is tested by: [BK-230](https://jira.upexgalaxy.com/browse/BK-230) - Billing | Upgrade to a paid plan

---

## Metadata

- **Created:** 2026-09-01
- **Updated:** 2026-09-03
- **Reporter:** Carlos C
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Plan [BK-824](https://jira.upexgalaxy.com/browse/BK-824) description · ATP · synced by sync-jira-issues_
