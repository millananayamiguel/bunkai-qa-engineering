# BK-667 — Acceptance Test Plan (QA)

> Jira field: `customfield_10137` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-667)

# Shift-Left Refinement: BK-667 — API Contract | Make the five remaining create endpoints safe to retry

***Status***: Refined — Awaiting PO Estimation
***Mode***: Shift-Left (pre-sprint, single-Story session)
***Refined on***: 2026-09-12
***Refined by***: QA — Shift-Left session
***Modality***: Xray

---

## Phase 1 — Critical Analysis

### Business context

- ***Primary persona affected***: "Karim" — the autonomous AI test agent authenticating with a Personal Access Token (PAT), retrying creates over a flaky network.
- ***Secondary personas***: any human user double-clicking a create form (Workspace onboarding, Project, User Story, ATC, Bug).
- ***Business value proposition***: eliminates duplicate-record cleanup (Workspaces, Projects, User Stories, ATCs, Bugs) caused by network retries; protects defect-heatmap and Module density signals from double-filed Bugs.
- ***KPI(s) influenced***: duplicate-record rate, support/cleanup burden, defect-heatmap accuracy.
- ***User journey position***: the create step of five distinct flows (bootstrap onboarding, project setup, backlog authoring, ATC authoring, bug filing) — all early/foundational steps whose failure blocks everything downstream.

### Technical context

- ***Frontend***: `app/(app)/onboarding/onboarding-form.tsx`, create-project form, user-story create form, new-ATC editor, `components/bugs/BugFormDialog.tsx`. Pattern to replicate: `components/tests/StartRunButton.tsx` (lazy `useState(() => crypto.randomUUID())`, rotate only on non-ok response).
- ***Backend****: `app/api/v1/workspaces/route.ts`, `app/api/v1/workspaces/[id]/projects/route.ts`, `app/api/v1/modules/[id]/user-stories/route.ts`, `app/api/v1/atcs/route.ts`, `app/api/v1/bugs/route.ts` — all currently ****zero references*** to `@lib/api/idempotency` (confirmed by grep against all five). Shared helper: `lib/api/idempotency.ts` (`beginIdempotentRequest` / `recordIdempotencyResult` / `discardIdempotencyResult`). Backing table: `idempotency*keys` (migration `0009*cross_cutting.sql`).
- ***External services***: none new.
- ***Integration points***: `withApiHandler`'s `requires: [...]` capability gate runs BEFORE the handler body on four of the five endpoints (`projects`, `user-stories`, `atcs`, `bugs` all declare `requires: ['atc:write']`); `workspaces` POST uses `auth: 'authenticated'` with no capability requirement (confirmed — this is the headless bootstrap case, matches AC-06 Scenario 2).

### Story complexity

| Axis | Rating | Why |
| --- | --- | --- |
| Business logic | Medium | Helper is pre-built and proven on 2 endpoints; this Story is wiring, not new logic |
| Integration | High | 5 backend routes + 5 frontend callers must land together (server-only lands an outage) |
| Data validation | Medium | Key shape + payload-hash comparison, both already implemented in the shared helper |
| UI | Low | No screen redesign — header + key-rotation only, invisible to the user |

***Estimated test effort***: Medium-High — mostly parametrized API-level coverage across 5 routes plus 2 regression-reference routes, light UI coverage (5 forms), no new infra/test-data seeding.

### Epic-level inheritance

No parent epic feature-test-plan exists yet for BK-1 (Tenancy & Identity) covering idempotency specifically — this Story is self-contained against `BK-037` (SRS) and `ADR-0002`, not an epic-level test strategy. Nothing to inherit or reuse from epic-level QA.

---

## Phase 2 — Story Quality Analysis

### Ambiguities

None identified. Both ambiguities a first read would raise (header required-or-optional; `POST /bugs` in-or-out) were already raised and resolved on-ticket by the AI Tech Lead, with alternatives scored (see `comments.md`) — not reopened here per this skill's anti-padding rule.

### Gaps (missing info)

| # | Type | Why critical | What to add | Risk if omitted |
| --- | --- | --- | --- | --- |
| 1 | Business rule / edge case | Idempotency scope is `(user*id, endpoint, key)` — verified in `lib/api/idempotency.ts` — with ***no ****`workspace*id`**** dimension**** in the lookup key. AC-03 only proves two **different** callers don't collide; it never states what happens when the ****same*** caller reuses one key across two different Workspaces on the same endpoint with an identically-shaped body (e.g. creating an ATC named "Smoke test" in Workspace A, then the same name in Workspace B, same key). If the request hash does not fold in `workspace_id`, the second call could replay Workspace A's stored response instead of creating in Workspace B. | An explicit AC statement (or an explicit "out of scope, expected behavior is X") for same-caller/cross-workspace key reuse | A silent cross-workspace data leak/replay if the hash doesn't disambiguate — worse than the duplicate-record bug this Story exists to fix |

### Edge cases not in Story

| # | Scenario | Expected behavior (best guess) | Criticality | Action |
| --- | --- | --- | --- | --- |
| 1 | Same caller reuses one key across two Workspaces, same endpoint, identically-shaped payload | Unclear from the Story alone — code inspection shows the lookup key omits `workspace*id`, so behavior likely depends on whether `workspace*id` differs the payload hash | Critical | Add to AC (***NEEDS PO/DEV CONFIRMATION***) — see Critical Question #1 |
| 2 | Key length exactly at the boundary (7 / 8 / 128 / 129 chars) | Reject at 7 and 129, accept at 8 and 128 — the shape is fully specified (`^[\w-]{8,128}$`), this is a BVA gap in the outline set, not an open question | Medium | Test only — add outlines, no AC change needed |
| 3 | Key containing a character outside `[\w-]` (e.g. `.`, `@`, space, emoji) | Reject as `idempotency*key*invalid` — deterministic from the regex | Medium | Test only — add outline, no AC change needed |
| 4 | A PAT lacking `atc:write` calls one of the four capability-gated endpoints (`projects`, `user-stories`, `atcs`, `bugs`) with a missing/malformed key | `requires: [...]` is evaluated by `withApiHandler` before the handler body runs the idempotency check, so the caller gets 403 `forbidden`, never the idempotency error — confirmed by reading the route wrapper order | Low-Medium | Test only — add a precedence outline; flag as a Dev confirmation to make sure this ordering is the intended contract, not an accident |

### Contradictions

No contradictions found. The two documents that appeared to disagree (`BK-037`'s "optional" wording vs. the two adopters' strict behavior; `business-api-map.md` §4.10 vs. ADR-0002's follow-ups on `/bugs`) were already reconciled on-ticket by the AI Tech Lead comment, with the ADR declared binding in both cases.

### Testability validation

***Verdict***: Yes.

The 8 ACs are Gherkin Scenario Outlines with concrete endpoints, concrete key values (`"K"`), and concrete expected outcomes (status class, DB-write count). No vague language, no missing error taxonomy (`idempotency*key*required` / `idempotency*key*invalid` / `conflict` are all named), no missing performance criteria that would block automation. The one soft spot is the cross-workspace scoping gap above — testability is fine (the case IS testable), the open question is which OUTCOME is correct, not whether it can be verified.

---

## Phase 3 — Refined Acceptance Criteria

The 8 original ACs (AC-01 … AC-08) are already written as Given/When/Then Gherkin Scenario Outlines with concrete data (`.context/PBI/.../acceptance-criteria.md`) — they are not rewritten here; each is confirmed testable as-is. One new scenario is added below.

### New scenario surfaced from Phase 2 — NEEDS PO/DEV CONFIRMATION

#### Scenario E1: Should scope the idempotency key per Workspace, not only per caller and endpoint (Type: Edge, Priority: Critical)

- ***NEEDS PO/DEV CONFIRMATION***: behavior inferred from code (`lib/api/idempotency.ts` lookup key = `(user*id, endpoint, key)`, no `workspace*id`) — confirm intended behavior before sprint planning.
- ***Given***: I am a member of Workspace A and Workspace B, and I POST to `/api/v1/atcs` in Workspace A with key `"K"` and an ATC body, and it succeeds
- ***When***: I POST to `/api/v1/atcs` in Workspace B with the same key `"K"` and an identically-shaped body (e.g. same field names/values, only the workspace context differs)
- ***Then***: {open — either (a) the second call is treated as a genuine new request because `workspace_id` is folded into the hash/scope, and an ATC is created in Workspace B, or (b) it is incorrectly replayed as Workspace A's stored response. Only outcome (a) is safe.}

---

## Phase 4 — Test Outlines (outline names only)

### Coverage estimate

| Type | Count | Notes |
| --- | --- | --- |
| Positive | 10 | Happy-path replay, key-attach, onboarding/bootstrap, cross-caller/cross-endpoint non-collision |
| Negative | 10 | Missing/malformed/invalid-charset key, conflicts (payload-mismatch + in-flight), capability-gate precedence, non-adopter regression control |
| Boundary | 5 | Key-length BVA (7/8/128/129) + replay-window expiry |
| Integration | 6 | Onboarding e2e, PAT bootstrap, published-contract parity (x3), two-adopters-untouched regression |
| API | 7 endpoints exercised | 5 adopting (`workspaces`, `projects`, `user-stories`, `atcs`, `bugs`) + 2 regression-reference (`tests`, `runs`) |
| ***Total**** | ****31*** |  |

***Rationale***: High Integration axis (5 routes + 5 callers must land together) plus a fully-specified error taxonomy justifies exploding AC-01 and AC-03 rather than collapsing — each names a distinct partition (missing vs. malformed vs. out-of-range vs. wrong-charset key) that a single outline would hide. AC-06/07/08 stay lean because they are largely regression/parity checks, not new business logic.

### Outline list

#### AC-01 — Every endpoint BK-037 names requires the key

- ***Should refuse a create call with no Idempotency-Key header**** — Pre: valid PAT, valid body. Expected: 400 `idempotency*key*required`, no record created. **(EP — Negative; parametrized across 5 endpoints)*
- ***Should refuse a malformed key shorter than the minimum**** — Pre: key `"abc"`. Expected: 400 `idempotency*key*invalid`, distinct from the missing-header error, no record created. **(EP — Negative; parametrized across 3 endpoints)*
- ***Should accept a key at the exact 8-character minimum**** — Pre: key of length 8, valid charset. Expected: 201, record created. **(BVA — Boundary)*
- ***Should reject a key at 7 characters, one below the minimum**** — Expected: 400 `idempotency*key*invalid`. **(BVA — Boundary)*
- ***Should accept a key at the exact 128-character maximum**** — Expected: 201, record created. **(BVA — Boundary)*
- ***Should reject a key at 129 characters, one above the maximum**** — Expected: 400 `idempotency*key*invalid`. **(BVA — Boundary)*
- ***Should reject a key containing a character outside ****`[\w-]` — Pre: key contains `.`/space/unicode. Expected: 400 `idempotency*key*invalid`. **(EP — Negative)*
- ***Should accept a browser-generated random UUID as a valid key**** — Expected: 201, accepted by all seven adopting-or-reference endpoints. **(EP — Positive)*
- ***Should return 403 for insufficient PAT scope before ever evaluating the Idempotency-Key**** — Pre: PAT without `atc:write`, missing/malformed key. Expected: 403 `forbidden`, never `idempotency*key*required`/`idempotency*key*invalid`. **(Decision Table — Negative; parametrized across the 4 capability-gated endpoints; **`workspaces`** excluded — no capability gate)*

#### AC-02 — A retry returns the first answer and writes nothing twice

- ***Should replay the stored response for identical key and payload**** — Expected: same status + body as the first call, exactly one record. **(EP — Positive; parametrized across 5 endpoints)*
- ***Should replay identically regardless of payload property order**** — Pre: same values, different key ordering in the JSON body. Expected: treated as the same request, no second record. **(EP — Positive)*
- ***Should treat a replay outside the retention window as a new request**** — Pre: original key used more than the stored window ago. Expected: 201, a new record created. **(Boundary — time window)*

#### AC-03 — Reuse and races are refused, not served

- ***Should refuse a conflict when the same key is reused with a different payload**** — Expected: 409 `conflict`, second body not written. **(EP — Negative; parametrized across 3 endpoints)*
- ***Should refuse a second concurrent call sharing an in-flight key as a conflict**** — Pre: first call started, not yet answered. Expected: 409 `conflict` on the second call; exactly one record once the first completes. **(Error Guessing — Negative, race)*
- ***Should let two different callers reuse identical key text without colliding**** — Pre: two members of different Workspaces, same key text. Expected: both succeed, each gets their own record. **(EP — Positive, scoping by **`user_id`**)*
- ***Should let one caller reuse a key across two different endpoints without cross-read**** — Expected: second call is not read as a replay of the first; it creates its own record. **(EP — Positive, scoping by **`endpoint`**)*
- ***Should scope the idempotency key per Workspace, not only per caller and endpoint**** — see Scenario E1 above. **(Decision Table — Edge; *****NEEDS PO/DEV CONFIRMATION****)**

#### AC-04 — A failure before the write does not strand the key

- ***Should release a key for reuse after a validation failure occurs before any write**** — Pre: invalid body under key `"K"`, refused. Expected: a corrected retry with a fresh key succeeds; the old key is not blocking. **(State-Transition — Positive, **`failed`** state)*
- ***Should preserve the created record and success response even if the response snapshot fails to persist**** — Expected: caller still receives the success answer; a later retry with the same key does not mint a second record. **(Positive — durability)*
- ***Should let exactly one concurrent retry reclaim a failed key while a simultaneous second retry is refused**** — Pre: key in `failed` status, two retries race to reclaim it. Expected: one wins (compare-and-set), the other gets 409 `conflict`. **(Error Guessing — Negative, race on the reclaim path)*

#### AC-05 — Every in-product caller sends a key

- ***Should attach an Idempotency-Key on every create-form submit**** — Expected: request carries the header; record created exactly as before. **(EP — Positive; parametrized across 5 forms***:**** onboarding, create-project, user-story create, new-ATC editor, file-a-Bug dialog)**
- ***Should create exactly one record when a create form is double-submitted before the first response**** — Expected: one record, no conflict error shown for the user's own double-click. **(Error Guessing — Positive)*
- ***Should rotate the key after a refused submit so the corrected retry is not read as a mismatch**** — Pre: first submit refused (e.g. taken slug). Expected: second submit carries a different key, succeeds. **(State-Transition — Positive, key rotation)*
- ***Should leave the User Story edit path unaffected by the create-side key requirement**** — Pre: editing an existing User Story. Expected: save behaves exactly as before, no key required, nothing refused. **(Negative-control — regression)*

#### AC-06 — New-user onboarding still works end to end

- ***Should complete onboarding end-to-end for a brand-new account with the key attached**** — Expected: Workspace created, user lands signed in, no refused request. **(Integration — Positive)*
- ***Should let a fresh PAT with no Workspace create its first Workspace over the API**** — Pre: newly minted PAT, no Workspace membership. Expected: Workspace created, documented headless bootstrap still works. **(Integration — Positive)*

#### AC-07 — What is published matches what ships

- ***Should publish Idempotency-Key as a required header with the shared shape on all five endpoints' contract**** — Expected: contract declares the header, the `8–128`/`[\w-]` shape, and the bad-request/conflict/replay outcomes. **(Integration/doc — parametrized across 5 endpoints)*
- ***Should state the cross-cutting requirement (****`BK-037`****) as required, not optional, with the shipped key shape**** — Expected: requirement text no longer contradicts the ADR or the shipped routes. **(Integration/doc — Positive)*
- ***Should list seven adopters in the API map and QA testability guide with no ****`/bugs`**** exclusion**** — Expected: `business-api-map.md` §4.10/§5.1/§7.3 and the QA guide's Workspace-create entry both reflect the shipped state. **(Integration/doc — Positive)*

#### AC-08 — Nothing else changes

- ***Should leave Test-create and Run-start behavior, status codes and contract unchanged**** — Expected: no regression on the two existing adopters. **(Integration — regression)*
- ***Should continue accepting a create call with no key on an endpoint outside ****`BK-037`****'s list**** — Pre: e.g. Acceptance Criterion creation or Module creation. Expected: 201, unaffected by this Story. **(Negative-control — regression)*

---

## Phase 5 — Edge Cases (outline)

| # | Edge case | In original Story? | Criticality | Action |
| --- | --- | --- | --- | --- |
| 1 | Same caller reuses key across two different Workspaces, same endpoint, identical-shaped payload | No | Critical | Add to AC (PO/Dev confirm — Scenario E1) |
| 2 | Key length exact boundaries (7/8/128/129 chars) | Implied by shape statement, not spelled out | Medium | Test only |
| 3 | Key with disallowed charset (`.`, `@`, space, unicode) | Implied by shape statement, not spelled out | Medium | Test only |
| 4 | PAT capability-gate (403) vs. idempotency-check (400) precedence | No | Low-Medium | Test only + Dev confirmation of intended contract |
| 5 | Concurrent reclaim race on a `failed` key (two retries, one should win) | Implied by AC-04, not spelled out as a race | Medium | Test only |

---

## Story Quality Assessment

***Verdict***: Good.

***Key findings***:

- The 8 ACs are unusually complete for a backlog Story — full Gherkin Scenario Outlines with a named error taxonomy, and both real ambiguities a first read would raise were already resolved on-ticket by an attributed, scored decision (not left for this session to reopen).
- Code inspection confirms every claim the Story makes: the 5 target routes have zero `idempotency` references today, the 2 adopters + shared helper implement replay/conflict/reclaim exactly as described, and the client rotation pattern (`StartRunButton.tsx`) is a real, copyable precedent.
- The one genuine gap this session found — cross-workspace key scoping — comes directly from reading `lib/api/idempotency.ts`'s lookup key (`user*id, endpoint, key`, no `workspace*id`), not from guessing; it is a real risk surface the ACs are silent on.

---

## Critical Questions for PO

> These BLOCK sprint planning until answered.

1. ***Should the idempotency key be scoped per Workspace, not only per caller and endpoint?***

---

## Technical Questions for Dev

> These do not block PO but block implementation.

1. ***Is the 403-before-400 precedence (capability gate before Idempotency-Key check) the intended contract?*** — Context: `withApiHandler`'s `requires: ['atc:write']` runs before the handler body on `projects`/`user-stories`/`atcs`/`bugs`, so a PAT without the capability never reaches the idempotency check even with a missing/malformed key. Testing impact: QA needs to know this is deliberate so the outline's expected status code (403, not 400) is asserted with confidence rather than flagged as a possible defect during execution.

---

## Suggested Story Improvements

| # | Current state | Suggested change | Benefit |
| --- | --- | --- | --- |
| 1 | AC-03 only states two **different** callers don't collide on shared key text | Add an explicit scenario for the same caller reusing a key across two Workspaces | Closes the one real gap this session found before it reaches implementation |

---

## Data feasibility flags

No data feasibility risks identified. All test data (PATs, Workspaces, the five entity types) is creatable via the API itself — no seeding or fixture gap.

---

## Recommended testing strategy

### Pre-implementation

- Get the PO answer on cross-workspace key scoping (Critical Question #1) before Dev starts, since it may change the hash/scope implementation, not just the tests.

### During implementation

- Confirm with Dev the 403-before-400 precedence (Technical Question #1) so the automated suite's expected status codes are locked in from the start rather than discovered as "unexpected" during execution.

### Post-implementation (in-sprint by /sprint-testing)

- Full parametrization tables + test-data JSON for all 31 outlines above, Faker-generated payload variants per endpoint, numbered API-level steps against staging.

---

## Risks & mitigation

| # | Risk | Likelihood | Impact | Mitigated by which outlines |
| --- | --- | --- | --- | --- |
| 1 | Cross-workspace key-scope replay leaks data across tenants | Medium | High | Scenario E1 / AC-03 outline 5 |
| 2 | Onboarding form ships without the client change, bricking new-user signup | Low (named explicitly in scope) | Critical | AC-05 outline 1, AC-06 outline 1 |
| 3 | Capability-gate ordering surprises QA mid-execution and is misreported as a defect | Medium | Low | AC-01 outline 9 |

---

## Next steps

- [ ] PO answers the cross-workspace key-scoping question before sprint planning
- [ ] Dev confirms the capability-gate-vs-idempotency-check precedence before estimation
- [ ] Story enters sprint at status Ready For Dev once estimated
- [ ] When Story reaches Ready For QA, `/sprint-testing` will short-circuit refinement (label `shift-left-reviewed` detected) and add parametrization + test-data JSON to the 31 outlines above

---
_Synced from Jira by sync-jira-issues_
