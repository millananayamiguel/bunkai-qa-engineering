# TMS-Home | Show active test runs summary and table

**Jira Key:** [BK-256](https://jira.upexgalaxy.com/browse/BK-256)
**Epic:** [BK-254](https://jira.upexgalaxy.com/browse/BK-254) (Home Dashboard)
**Type:** Story
**Status:** Ready For Release
**Priority:** Medium
**Story Points:** -

---

## Overview

## User story

As a QA Lead, I want to see a table of active test runs across every project in the workspace so that I can spot stalled or blocked runs without opening each project individually.

## Definition of done

- The table appears on Home and reflects the workspace's currently active runs.
- The change does not regress existing Home navigation or other screens.

## Technical notes

Renders into `home.jsx` (master-design-plan.md §4.2), the "Active test runs" section. Backed by the Runs domain ([https://jira.upexgalaxy.com/browse/BK-30#icft=BK-30](https://jira.upexgalaxy.com/browse/BK-30#icft=BK-30), informational context only — no blocking dependency; BK-30's child stories already provide the underlying run data).

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Implementation Plan (Dev)](./implementation-plan.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)
- [Acceptance Test Results (QA)](./acceptance-test-results.md)

---

## Traceability

### Test Execution (1)

- [BK-848](https://jira.upexgalaxy.com/browse/BK-848): ATR: BK-256: Story Testing _(Close)_

### Defect (1)

- [BK-620](https://jira.upexgalaxy.com/browse/BK-620): Bunkai Runs/Tests: a Test created in Project A leaks into Project B's Explorer and is runnable from there (422 is only the downstream symptom) _(Open)_

### Test Plan (1)

- [BK-847](https://jira.upexgalaxy.com/browse/BK-847): ATP: BK-256: TMS-Home | Show active test runs summary and table _(Plan Automated)_

### Test Set (1)

- [BK-846](https://jira.upexgalaxy.com/browse/BK-846): ATS: BK-256: TMS-Home | Show active test runs summary and table _(Designing)_

---

## Metadata

- **Created:** 2026-07-31
- **Updated:** 2026-09-03
- **Reporter:** Ely
- **Assignee:** Carlos C
- **Labels:** p2

---

_Synced from Jira by sync-jira-issues_
