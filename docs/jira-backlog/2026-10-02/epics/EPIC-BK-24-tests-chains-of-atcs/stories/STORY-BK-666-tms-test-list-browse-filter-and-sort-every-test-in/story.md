# TMS-Test List | Browse, filter and sort every Test in a Project

**Jira Key:** [BK-666](https://jira.upexgalaxy.com/browse/BK-666)
**Epic:** [BK-24](https://jira.upexgalaxy.com/browse/BK-24) (Tests (chains of ATCs))
**Type:** Story
**Status:** Ready For Dev
**Priority:** Medium
**Story Points:** -

---

## Overview

## User story

***As a*** Senior QA Engineer (Elena Vargas)
***I want to*** browse, filter and sort a Project's Tests from a list of their own, and open any row into that Test
***So that*** I can find the Test I need to run before a deploy without scanning the explorer rail one Test at a time

## Definition of done

- [ ] A Project has a Tests list surface of its own, reachable from the project sub-nav alongside "All ATCs", "Test Runs", "Bug Reports" and the other built sections
- [ ] The list renders every Test the Project shell already resolves — the same set, in the same scope, as the explorer's Tests group
- [ ] Each row shows the Test's name, how many ATCs its chain holds, its tags, and when it was created
- [ ] Opening a row navigates to that Test's own detail route
- [ ] The existing toolbar tag filter scopes this list exactly as it already scopes the explorer's Tests group — one filter control, two surfaces
- [ ] Columns can be sorted, and the sort applies to the whole filtered set rather than a visible page of it
- [ ] A Project with no Tests shows an explicit "nothing here yet" state that does not read as an error
- [ ] A tag that matches no Test shows a distinct "no match" state, phrased as a filter outcome and not as an empty Project
- [ ] A Test belonging to a different Workspace never appears in the list
- [ ] The workbench Tree / Table / Mind map toggle is untouched, and Table View still shows ATCs only

## Context

The daily regression journey opens with a step no one can perform. `.context/PRD/user-journeys.md:79` walks Elena through "Opens the Project, switches to Table View, filters tests tagged 'smoke', clicks TEST-008" — but Table View is an ATC surface by design, not a polymorphic one, so there is nowhere in the product to see a Project's Tests as a list.

The absence is already on the record rather than being newly discovered: the ratified departure D18 in `.context/design/master-design-plan.md` states in as many words that the project sub-nav entries are "derived from routes that actually exist — one per built surface, none invented (ATCs and Tests have no list route of their own)". This story builds the missing route so that observation stops being true for Tests.

Everything the list needs is already loaded. The Project layout resolves the Test set once at layout level and hands it to the workbench provider, and the toolbar tag filter already narrows that same set for the explorer. This story gives that data a second, denser presentation — it does not add a fetch, a schema change, or a new filter control.

## Provenance

Authored 2026-08-27 against `origin/staging`. Sources: `.context/PRD/user-journeys.md:79` (Journey 2, Step 1); `.context/PRD/mvp-scope.md:74` (US 8.2, the table-view-of-any-entity story this narrows one entity of); `.context/design/master-design-plan.md` §5 D18 (the ratified statement that Tests have no list route); `.context/business/domain-glossary.md` §3 (Test, Chain step, Reserved suite tag).

---

## QA Refinements (Shift-Left Analysis) — Added 2026-09-08

> Refined Acceptance Criteria live in the `acceptance_criteria` field.

### Edge Cases Identified

| # | Edge case | In original Story? | Criticality | Action |
| --- | --- | --- | --- | --- |
| 1 | List is workspace-scoped, not project-scoped, on every Project (escalation of the Story's own E15) | Yes, but framed as an occasional leak rather than the query's default behavior | Critical | Escalate to PO before sprint planning — see Critical Question 1 |
| 2-20 | Original E1-E14, E16-E20 (authored 2026-08-27) | Yes | As already dispositioned in the Story's comment | No further action — already mapped to ACs or marked test-only |

### Clarified Business Rules

- "The same Tests, in the same scope, as the Project explorer's Tests group" (AC-02, AC-07) currently resolves to Workspace scope, not Project scope: `tests` carries no `project*id`, and both the layout's read and `GET /api/v1/tests?tag=` filter by `workspace*id` only. Every Project in a Workspace will show the identical, full Workspace-wide Test set until the linked Defect (BK-620) lands.

### Critical Questions for PO

1. Do you want this Story to ship showing every Workspace Test on every Project's list (current reality), or do you want it to wait for BK-620's fix so it can be genuinely Project-scoped?

### Technical Questions for Dev

1. Should the new list route call the same server-side read `layout.tsx` already does, or issue its own query? Confirming reuse (rather than a parallel query) is what keeps AC-07's "one scoping rule" promise mechanically true instead of just a design intent.

> Full refinement (Phases 1-5, coverage outlines, risk + data feasibility) lives in the ATP — the `acceptance*test*plan` field.

---

## Scope Decision (2026-09-09)

Resolved — no dedicated PO on this project, decision made jointly by QA and the engineering owner. This Story ships now showing every Workspace Test on every Project's list (current reality), matching AC-02/AC-04/AC-07 as written. This is a deliberate, temporary acceptance, not an implementation detail left to the plan: the list will become genuinely Project-scoped once `BK-620` lands (see AC-11, confirmed as a placeholder scenario). The new Tests list route reuses the same server-side read `layout.tsx` already performs — it does not introduce a second query — so AC-07's "one scoping rule" promise stays mechanically true, and correcting BK-620 automatically corrects this list with it.

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

## Traceability

### Defect (1)

- [BK-620](https://jira.upexgalaxy.com/browse/BK-620): Bunkai Runs/Tests: a Test created in Project A leaks into Project B's Explorer and is runnable from there (422 is only the downstream symptom) _(Open)_

---

## Metadata

- **Created:** 2026-08-28
- **Updated:** 2026-09-10
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** +shift-left-2026-09-08, +shift-left-reviewed

---

_Synced from Jira by sync-jira-issues_
