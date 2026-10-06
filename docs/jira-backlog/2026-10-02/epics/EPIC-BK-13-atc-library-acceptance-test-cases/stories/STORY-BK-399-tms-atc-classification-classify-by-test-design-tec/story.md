# TMS-ATC Classification | Classify by test-design technique and priority

**Jira Key:** [BK-399](https://jira.upexgalaxy.com/browse/BK-399)
**Epic:** [BK-13](https://jira.upexgalaxy.com/browse/BK-13) (ATC Library (Acceptance Test Cases))
**Type:** Story
**Status:** QA Approved
**Priority:** Medium
**Story Points:** 3

---

## Overview

## User story

***As a*** Senior QA Engineer
***I want to*** classify each ATC by the test-design technique that produced it and by its priority
***So that*** I can assess how well my test suite's design techniques and priority levels actually cover the feature, not just how many ATCs exist

## Definition of done

- [ ] Feature works end-to-end against staging
- [ ] Covered by an ATC chain anchored to a User Story + Acceptance Criterion
- [ ] Acceptance Criteria verified by QA
- [ ] Demoed to the team

## Technical notes

### Current state (verified at `origin/staging@4924f48`)

`atcs` (`supabase/migrations/0004*atcs.sql:54-68`) carries exactly: `id, project*id, module*id, user*story*id, slug, title, layer, version, status, tags, tsv, created*at, updated*at`, plus `archived*at` (`0014*module*soft*delete.sql:31`) and two CHECK constraints added later — a title-length floor (`0058*atc*title*min*length.sql:50`) and a 10-tag cap (`0065*atc*tags*cap*guard.sql:26-27`). There is no `priority` and no `derivation*technique`/`technique` column anywhere in the schema; `git grep -i "derivation_technique"` returns zero hits repo-wide. This story specifies two new optional classification fields on that same header row, following the same shape as the existing `layer` enum.

### Why technique and priority ship together

Both attributes share the same edit surface (the ATC editor's attribute panel, `components/atcs/AtcEditor.tsx`, alongside the existing Layer segmented control and Tags chip input) and the same shape (a constrained, optional enum plus a matching list filter). Splitting them into two stories would touch the same files for roughly half a story point each.

### Scope boundary vs. EPIC BK-13's Phase-3 deferral

EPIC BK-13's Out of Scope section defers "ATC parameterization editors (equivalence partitions, boundary values, decision tables, state transitions)" to Phase 3. This story is not that: storing which test-design technique produced an ATC is a constrained enum column plus a list filter, not an authoring surface for technique-specific test data (equivalence-partition input tables, boundary-value data grids, decision-table matrices, state-transition diagrams). See the attributed decision comment on this issue for the full scoring of this boundary call.

---

## QA Refinements (Shift-Left Analysis)

> Refined on 2026-09-04 by QA — Shift-Left batch 2026-09-04-bk-399. Source: `shift-left-refinement.md` (17 refined scenarios, 22 outlines). This appendix summarizes the shift-left analysis appended to the Story description for PO/Dev estimation.

### Refined Acceptance Criteria (summary)

Refined 9 original ACs into 17 Gherkin scenarios with explicit Given/When/Then and ***NEEDS PO/DEV CONFIRMATION*** flags where contracts are unbound:

- AC-01 technique set: 2 scenarios (Positive + Negative invalid technique)
- AC-02 priority set: 2 scenarios (Positive + Negative invalid priority)
- AC-03 optional fields: 1 scenario (neither set -> not specified)
- AC-04 filter by technique (Pairwise): 1 scenario
- AC-05 filter by priority (Critical): 1 scenario
- AC-06 empty result (State Transition): 1 scenario
- AC-07 persist across reload (Decision Table + Medium): 1 scenario
- AC-08 legacy ATC (NULL -> not specified): 1 scenario
- AC-09 AND-combine technique+layer: 1 scenario
- New edge cases E1-E6 (case-mismatch, whitespace, clear-to-null, duplicate-carry, all-unspecified boundary, triple AND) flagged NEEDS PO/DEV CONFIRMATION

Full refined scenarios live in field `customfield*10110` and ATP `customfield*10137`.

### Edge Cases Identified

| # | Edge case | Criticality |
| --- | --- | --- |
| E1 | API technique with wrong case (boundary value analysis) | Medium |
| E2 | API priority outside enum (Urgent) | High |
| E3 | Clearing set technique/priority back to unspecified | Medium |
| E4 | All ATCs unspecified, filter by any real technique — boundary empty | Medium |
| E5 | Technique + priority + layer all active — triple AND | Medium |
| E6 | Duplicate ATC should carry technique/priority | Medium |
| E7 | Version bump + updated_at on edit, duplicate lineage | Low |

### Clarified Business Rules

- Technique enum: Equivalence Partitioning, Boundary Value Analysis, State Transition, Decision Table, Pairwise — optional, NULL = not specified — ***NEEDS PO/DEV CONFIRMATION*** on canonical stored string/casing
- Priority enum: Critical, High, Medium, Low — optional, NULL = not specified — ***NEEDS PO/DEV CONFIRMATION***
- Unrecognized API value must be rejected not coerced — ***NEEDS PO/DEV CONFIRMATION*** on status 400 vs 422 and code ATC*INVALID*TECHNIQUE/PRIORITY
- Filter composition is AND across technique, priority, layer, project/module — single-select per filter ***NEEDS PO/DEV CONFIRMATION***
- Legacy rows stay NULL after migration; UI renders not specified with dedicated testid — ***NEEDS PO/DEV CONFIRMATION*** on verbatim copy
- Duplicate carries technique/priority; edit bumps version and propagates to chaining Tests

### Open Questions (deduplicated)

***Critical for PO (blocks estimation)******:***

1. Canonical stored values and casing for technique/priority, verbatim not specified copy + testids?
2. Is each filter single-select, and is Unspecified itself filterable?
3. Verbatim filtered-empty copy + testid, distinct from project-empty view?

***Technical for Dev (blocks implementation)******:***

1. API query-param names and error contract for new enums?
2. Migration leaves existing rows NULL with CHECK constraints?
3. Does edit bump version/updated_at and does duplicate copy both fields?
4. Is clearing back to unspecified via null/omit with clear affordance?
5. Does search combine technique/priority/layer/project/module/tsvector with AND and indexed?

See full analysis in `shift-left-refinement.md` Phase 2 and Phase 5, and ATP outlines (22) in acceptance*test*plan field.

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Workflow](./workflow.md)
- [Implementation Plan (Dev)](./implementation-plan.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)

---

## Traceability

### Test Execution (1)

- [BK-915](https://jira.upexgalaxy.com/browse/BK-915): ATR: BK-399: Story Testing _(Close)_

### Bug (1)

- [BK-886](https://jira.upexgalaxy.com/browse/BK-886): saveAtcAction bypasses mapAtcRpcError — raw Postgres constraint text reaches the caller _(In Review)_

### Improvement (1)

- [BK-989](https://jira.upexgalaxy.com/browse/BK-989): ATC Classification: Error format contract for invalid technique/priority values _(Open)_

### Tech Storys (2)

- [BK-884](https://jira.upexgalaxy.com/browse/BK-884): qa_inspector_ro silently regains EXECUTE on write-capable DEFINER functions after drop+recreate (0085 default privilege) _(To Do)_
- [BK-885](https://jira.upexgalaxy.com/browse/BK-885): No automated test execution gate — ~2,000+ tests never run automatically _(To Do)_

### Test Plan (1)

- [BK-914](https://jira.upexgalaxy.com/browse/BK-914): ATP: BK-399: TMS-ATC Classification | Classify by test-design technique and priority _(Completed)_

### Test Set (1)

- [BK-913](https://jira.upexgalaxy.com/browse/BK-913): ATS: BK-399: TMS-ATC Classification | Classify by test-design technique and priority _(Close)_

---

## Metadata

- **Created:** 2026-08-12
- **Updated:** 2026-09-12
- **Reporter:** Ely
- **Assignee:** Gianluca Módena
- **Labels:** atc-classification, atc-library, discovery-2026-08-12, shift-left-2026-09-04, shift-left-reviewed

---

_Synced from Jira by sync-jira-issues_
