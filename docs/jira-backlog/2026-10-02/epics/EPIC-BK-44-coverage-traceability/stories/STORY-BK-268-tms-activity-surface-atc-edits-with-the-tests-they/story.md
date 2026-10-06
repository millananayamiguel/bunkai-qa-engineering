# TMS-Activity | Surface ATC edits with the Tests they affect

**Jira Key:** [BK-268](https://jira.upexgalaxy.com/browse/BK-268)
**Epic:** [BK-44](https://jira.upexgalaxy.com/browse/BK-44) (Coverage & Traceability)
**Type:** Story
**Status:** Ready For Dev
**Priority:** Medium
**Story Points:** 1

---

## Overview

## User story

***As a*** Senior QA Engineer
***I want to*** see an ATC edit in the workspace activity feed no matter where the edit was made, including which Tests it affects
***So that*** I know a Test I depend on was rewritten under me instead of finding out the hard way during my next run

## Definition of done

- [ ] Feature works end-to-end against staging
- [ ] Covered by an ATC chain anchored to a User Story + Acceptance Criterion
- [ ] Acceptance Criteria verified by QA
- [ ] Demoed to the team

## Dependency note

`ADR-0009` (ATC edit propagation contract) recorded a follow-up: unify the in-app ATC editor onto the same write path the API uses, so both surfaces emit the same edit event.
***Corrected 2026-09-20 (Shift-Left QA ruling): ***`ADR-0009` is Accepted — Implemented (status synced 2026-08-13, verified live against origin/staging in upex-bunkai-tms). The unification follow-up already shipped via PR #58 (`refactor(BK-21): unify ATC web-editor save onto bunkai*update*atc`) — both the in-app editor and the API already write through the same `bunkai*update*atc` RPC and already emit `atc.updated` with real `affected*test*ids`. This story does NOT need to build that unification — it only needs to surface the existing event in the activity feed (add `atc.updated` to the feed allowlist) and resolve `affected*test*ids` to Test titles for display. See the shift-left refinement ATP for the full analysis.

## Open questions for the PO

- [ ] Should an ATC edit also generate a notification (not just a feed entry) to watchers of the Tests it affects, or is a feed entry sufficient for this story?
- [ ] How should the activity entry render when the number of affected Tests is large (e.g. dozens), and how should it render when the edit affects zero Tests?

---

## QA Refinements (Shift-Left Analysis) — Added 2026-09-19

> Refined Acceptance Criteria live in the `acceptance_criteria` field (Step 1a).

### Edge Cases Identified

| # | Edge case | In original Story? | Criticality | Action |
| --- | --- | --- | --- | --- |
| 1 | No-op resave with identical content still versions + emits an event | No | Medium | NEEDS PO/DEV CONFIRMATION — define whether desired |
| 2 | Autosave-before-creation could emit a false pre-creation atc.updated | No | Medium | NEEDS PO/DEV CONFIRMATION — verify `NewAtcEditor.tsx` behavior |
| 3 | PAT/Bearer actor resolution may inherit BK-182's known gap | No | Medium | Technical question for Dev (T4) |
| 4 | Entry shows post-edit (not pre-edit) title when the edit itself renamed the ATC | No | Low | NEEDS PO/DEV CONFIRMATION — confirm desired |
| 5 | Affected Test archived/deleted after the edit has no defined fallback label | No | High | NEEDS PO/DEV CONFIRMATION — define fallback copy |
| 6 | Large affected-Tests count (dozens) has no defined rendering treatment | Partially (Story's own open question) | High | Carried from Story — blocks Estimation |
| 7 | Zero-affected-Tests state copy undefined | Partially (AC6 requires "sensible" but no literal copy) | Medium | NEEDS PO/DEV CONFIRMATION — define copy |
| 8 | Long ATC title (near 200-char cap) could break entry layout | No | Low | Test only — mirrors BK-49's existing CSS handling |
| 9 | Two same-ATC edits sharing created_at need stable order | No | Low | Inherited from BK-49's existing tie-break — test only, no new AC needed |

### Clarified Business Rules

- The Story's "Dependency note" is stale: `ADR-0009-atc-edit-propagation-contract.md` is ***Accepted — Implemented*** (not "Proposed"), and the in-app editor and the API already write the same `atc.updated` event through the same RPC (`bunkai*update*atc`), confirmed live on `staging`. The dual-write-path unification this Story's dependency note worries about has already shipped (PR #58).
- `bunkai*update*atc` (migration `0035*atc*update*propagation.sql`) unconditionally full-replaces children and emits `atc.updated` with `affected*test_ids` already in the payload on every invocation — there is no diff-check, so a byte-identical resave still versions and emits (Critical Question 5).
- The real remaining net-new build surface is resolving `affected*test*ids` (UUIDs) to Test titles server-side, workspace-scoped — no existing resolver does this today (only `bunkai*resolve*activity_actors`, ADR-0011, resolves user ids to emails).

### Critical Questions for PO

1. ***The Story's "Dependency note" is stale — should it (and the Story's framing) be corrected before Estimation?***

1. ***Should an ATC edit also generate a notification to watchers of affected Tests, or is a feed entry sufficient?**** **(carried from the Story's own open questions — unchanged)*

1. ***How should the entry render when the affected-Tests count is large (dozens) or zero?**** **(carried from the Story's own open questions — unchanged)*

1. ***What exact label/copy should the atc.updated entry use, and how should the affected-Tests list visually appear within the existing card (inline text, chips, expandable)?***

1. ***Is a resave with byte-identical content expected to still show as an "edit" in the feed?***

### Technical Questions for Dev

1. ***Resolver mechanism for affected-Test titles******:****** a new ****`SECURITY DEFINER`**** batch resolver (mirroring ****`bunkai*resolve*activity*actors`****, ADR-0011's pattern) vs. embedding the title directly in the ****`atc.updated`**** payload via a JOIN inside ****`bunkai*update_atc`**** at write time?*** — Context: the payload-embedding approach is more consistent with BK-49's own "positive projection, never raw/derived-at-read-time" convention, and avoids a second resolver's RLS/co-membership surface entirely. Testing impact: determines whether the OpenAPI response shape changes at the RPC layer or the API-route layer, and whether a NEW peer-visibility posture change needs its own ADR two-gate test (à la ADR-0011, since Test titles — like emails — become visible to all workspace members, not just the actor).
2. ***What fallback copy/behavior applies when an affected Test can no longer be resolved (archived/deleted after the edit)?*** — Context: no existing Test-fallback precedent exists (only the actor-fallback does). Testing impact: outline 5.4 cannot be finalized.
3. ***Does ****`NewAtcEditor.tsx`****'s create-flow autosave (if any) call ****`bunkai*update*atc`**** before the ATC is confirmed created, risking a spurious pre-creation ****`atc.updated`**** entry?*** — Context: unverified in this light code pass — needs a targeted check by Dev, who knows the create-flow's actual autosave cadence. Testing impact: outline 7.2 cannot be executed without knowing whether this risk is real.
4. ***Does an API-originated (PAT/Bearer) ****`atc.updated`**** entry's actor resolve correctly, given BK-182's known Bearer active-workspace-resolution gap on the sibling ****`GET /api/v1/activity`**** route?*** — Context: BK-49's own implementation plan explicitly flagged this dependency for the read side; unclear whether it also touches the ATC-edit write side's actor capture. Testing impact: outline 3.2 needs this answered to know if it's testable as written or blocked on BK-182.

> Full refinement (Phases 1-5, coverage outlines, risk + data feasibility) lives in the ATP — the `acceptance*test*plan` field (Step 2; `/sprint-testing` Stage 1 later materializes it as the Test Plan issue).

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Workflow](./workflow.md)
- [Mockup](./mockup.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)

---

## Metadata

- **Created:** 2026-08-05
- **Updated:** 2026-09-22
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** shift-left-2026-09-19, shift-left-reviewed

---

_Synced from Jira by sync-jira-issues_
