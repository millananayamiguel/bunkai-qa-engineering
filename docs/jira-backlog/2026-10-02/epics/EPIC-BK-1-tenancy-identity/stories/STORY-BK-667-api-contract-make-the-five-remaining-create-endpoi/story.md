# API Contract | Make the five remaining create endpoints safe to retry

**Jira Key:** [BK-667](https://jira.upexgalaxy.com/browse/BK-667)
**Epic:** [BK-1](https://jira.upexgalaxy.com/browse/BK-1) (Tenancy & Identity)
**Type:** Story
**Status:** Ready For Dev
**Priority:** Medium
**Story Points:** 8

---

## Overview

## Overview

******Source spec*****:** **BK-037 — Idempotency (**`.context/SRS/functional-specs.md`**, Cross-cutting Functional Requirements). That is an SRS functional-requirement id, not a Jira issue key. The governing contract is** **********ADR-0002 — Idempotency-Key Scoping for the Headless Write Surface***** (Accepted, Implemented).

## User story

******As a**** **"Karim", the autonomous AI test agent that authenticates to Bunkai with a Personal Access Token*
**********I want to****** ****retry a create call that timed out or failed mid-flight, and be certain the retry leaves one record behind rather than two***
**So that**** a flaky network between my runner and Bunkai costs me a retry instead of a duplicate Workspace, Project, User Story, ATC or Bug that a human then has to find and clean up

## Definition of done

- [ ] Every create endpoint BK-037 names honours `Idempotency-Key` on the exact contract the two shipped adopters already publish — no second variant of the contract exists anywhere in the product
- [ ] A retry carrying the same key and the same payload returns the first response and writes nothing a second time
- [ ] The same key with a different payload, and a key whose first request is still in flight, are both refused as conflicts rather than served
- [ ] A failure before the record is written does not strand the key, so an honest retry is still possible
- [ ] Every in-product caller of the five endpoints sends a key and rotates it after a refusal, so no screen breaks on the day the header becomes required
- [ ] New-user onboarding still completes end to end
- [ ] The published API contract, the cross-cutting requirement, the API map and the QA testability guide all describe what the routes actually do

## Context

BK-037 commits idempotency for "every POST endpoint that creates non-trivial state" and names seven of them by requirement id: BK-002 Workspace creation, BK-005 Project creation, BK-007 User Story CRUD, BK-010 ATC creation, BK-015 Test creation, BK-019 Start Run, BK-025 File Bug.

******Two of the seven adopted it. Five did not.**** Verified at `origin/staging`: only `app/api/v1/tests/route.ts` and `app/api/v1/runs/route.ts` import `@lib/api/idempotency`. `business-api-map.md` §5.1 independently states the same count ("OPT-IN, inside the handler, on the 2 adopters"). A third route imports the helper — `app/api/v1/workspaces/[id]/billing/checkout/route.ts` — but that is an ADR-0014 Stripe route and is not one of BK-037's seven, so it is not counted here and is not touched by this story.

The five that never got wired, each confirmed to export a `POST` and to contain zero references to the helper:

| ***BK-037 requirement**** | ****Route*** |
| --- | --- |
| BK-002 Workspace creation | `app/api/v1/workspaces/route.ts` |
| BK-005 Project creation | `app/api/v1/workspaces/[id]/projects/route.ts` |
| BK-007 User Story CRUD (create half) | `app/api/v1/modules/[id]/user-stories/route.ts` |
| BK-010 ATC creation | `app/api/v1/atcs/route.ts` |
| BK-025 File Bug | `app/api/v1/bugs/route.ts` |

******This is a wiring gap, not a capability gap.**** `lib/api/idempotency.ts` **is complete and in production use:** **it exports** `beginIdempotentRequest`**,** `recordIdempotencyResult` **and** `discardIdempotencyResult`**, it hashes the payload with a deterministic sorted-key stringify, and it handles replay, payload mismatch, in-flight collision and failed-row reclaim. The backing table** `idempotency*keys` **shipped in** `supabase/migrations/0009*cross*cutting.sql`**.** **********_Zero migrations are needed for this story.*****

The client half is load-bearing and is why this is one story rather than five. Per ADR-0002 Decision #2 the header is REQUIRED on any endpoint that adopts, so the moment a route is wired, every caller that omits the header receives 400 `idempotency*key*required`. Five in-product callers exist, one per endpoint, and one of them is the signup path: `app/(app)/onboarding/onboarding-form.tsx` posts to `/api/v1/workspaces`. A change that wires the server and forgets that file bricks new-user onboarding on staging. The pattern to copy already exists and is proven — `components/tests/StartRunButton.tsx` generates one key per attempt with a lazy `useState` initialiser and rotates it on every non-ok response, precisely because the server hash-checks key reuse before it checks status.

## Two open questions, both decided on this ticket

Both were settled by the ******AI Tech Lead**** and published as an attributed comment on this issue, with alternatives scored. Read that comment before implementing; do not re-open either question in the implementation plan.

1. ******Required or optional?**** **BK-037's prose calls the header optional; the two shipped adopters make it required.** ***********Decision: mirror the strict precedent***** on all five — ADR-0002 Decision #2 is the binding contract, and BK-037's wording is corrected to match rather than the reverse.
2. ******The**** `POST /bugs` ****contradiction.**** `business-api-map.md` **§4.10 labels** `POST /bugs` **"not an adopter".** ***********Decision: the map is descriptive, not normative — the exclusion is not real.***** ADR-0002's own follow-ups name Bugs as a future adopter by name, and the map's §7.3 wording is a present-tense state statement ("Today exactly two routes adopt it"). `/bugs` stays in scope; the map is refreshed once this lands.

## What this story is not

This does ******not**** introduce a server-derived fallback key for header-less callers. ADR-0002 Decision #6 defers that explicitly and says it needs its own ADR, because it would change the shared helper's contract for every consumer including the two already shipped.

This does ******not**** widen BK-037's list. Endpoints that create state but are not named by BK-037 — Acceptance Criterion creation, Module creation, ATC duplication, PAT minting, invite creation, invite acceptance — are untouched.

## Sequencing

No blocking dependency. The helper, the table and the two reference implementations are all on `staging` today, and no migration is involved. The only ordering constraint is internal: the server wiring and the client callers must land in the same change, because the two halves are only correct together.

## Provenance

Authored 2026-08-27 from BK-037 in `.context/SRS/functional-specs.md`, ADR-0002 read in full, `.context/business/business-api-map.md` §4.10, §5.1 and §7.3, and a read of every route and caller named above at `origin/staging`. The two open questions this story hit were decided on-ticket by the AI Tech Lead rather than escalated, per the project's decision-authority rule.

---

## QA Refinements (Shift-Left Analysis)

**Added by **`/shift-left-testing`**, 2026-09-12. Full analysis in the Acceptance Test Plan (ATP) field.**

### Edge Cases Identified

- Same caller reuses one Idempotency-Key across two different Workspaces, same endpoint, identically-shaped payload — the lookup key in `lib/api/idempotency.ts` is `(user*id, endpoint, key)`, with no `workspace*id` dimension. Risk: cross-workspace replay. ***NEEDS PO/DEV CONFIRMATION*** — see AC-09 and Critical Question #1.
- Key length exact boundaries (7 / 8 / 128 / 129 characters) — already implied by the published shape, added as test outlines only, no AC change needed.
- Key containing a character outside `[\w-]` (`.`, `@`, space, unicode) — already implied by the published shape, test outline only.
- PAT capability-gate (`403 forbidden`) runs before the Idempotency-Key check (`400`) on 4 of the 5 endpoints — deterministic from the route wrapper order, flagged as a Technical Question for Dev to confirm intent, not a blocker for PO.
- Concurrent reclaim race on a `failed` key (two retries, exactly one should win) — implied by AC-04, not spelled out as a race; test outline only.

### Clarified Business Rules

No contradictions found. Both ambiguities a first read would raise (header required-or-optional; `POST /bugs` in-or-out) were already resolved on-ticket by an attributed AI Tech Lead comment with alternatives scored — not reopened by this refinement.

### Open Questions for PO / Dev

***Critical (blocks sprint planning)******:***

1. Should the idempotency key be scoped per Workspace, not only per caller and endpoint? `lib/api/idempotency.ts` looks up `(user*id, endpoint, key)` — `workspace*id` is stored on the row but not part of the lookup or the payload hash. A caller who belongs to two Workspaces and reuses one key on the same endpoint with an identically-shaped body risks a cross-workspace replay. See AC-09.

***Technical (blocks implementation, not PO estimation)******:***

1. Is the 403-before-400 precedence (capability gate before Idempotency-Key check) the intended contract? `withApiHandler`'s `requires: ['atc:write']` runs before the handler body on `projects`/`user-stories`/`atcs`/`bugs`, so a PAT without the capability never reaches the idempotency check even with a missing/malformed key.

Full Critical Analysis, Story Quality Analysis, refined-AC rationale, 31 test outlines (by AC and technique), edge-case table, risks and recommended testing strategy: see the Acceptance Test Plan (ATP) field on this Story.

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Workflow](./workflow.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)

---

## Metadata

- **Created:** 2026-08-28
- **Updated:** 2026-09-12
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** shift-left-2026-09-12, shift-left-reviewed

---

_Synced from Jira by sync-jira-issues_
