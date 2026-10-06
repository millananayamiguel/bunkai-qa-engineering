# TMS-Home | Show workspace test coverage summary

**Jira Key:** [BK-259](https://jira.upexgalaxy.com/browse/BK-259)
**Epic:** [BK-254](https://jira.upexgalaxy.com/browse/BK-254) (Home Dashboard)
**Type:** Story
**Status:** BLOCKED
**Priority:** Medium
**Story Points:** -

---

## Overview

## User story

As a QA Lead, I want to see the workspace's overall test coverage percentage and how it changed recently so that I can build a coverage story I trust without assembling it by hand.

## Definition of done

- The coverage summary appears on Home once the Coverage domain can compute a workspace-wide percentage.
- The change does not regress existing Home navigation or other screens.

## Technical notes

Renders into `home.jsx` (master-design-plan.md §4.2), the "Coverage" KPI card. Blocked by the Coverage domain ([https://jira.upexgalaxy.com/browse/BK-44#icft=BK-44](https://jira.upexgalaxy.com/browse/BK-44#icft=BK-44), Coverage & Traceability) — see this story's Jira links for the specific gating ticket.

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)

---

## Traceability

### Test Execution (1)

- [BK-878](https://jira.upexgalaxy.com/browse/BK-878): ATR: BK-259: Story Testing _(Close)_

### Defects (2)

- [BK-881](https://jira.upexgalaxy.com/browse/BK-881): BK-254: Bunkai Coverage: Coverage percentage rounds to a false 100%/0% extreme at scale _(In Review)_
- [BK-881](https://jira.upexgalaxy.com/browse/BK-881): BK-254: Bunkai Coverage: Coverage percentage rounds to a false 100%/0% extreme at scale _(In Review)_

### Story (1)

- [BK-46](https://jira.upexgalaxy.com/browse/BK-46): TMS-Coverage | Surface untested ACs and modules with not-run filter _(BLOCKED)_

### Test Plan (1)

- [BK-877](https://jira.upexgalaxy.com/browse/BK-877): ATP: BK-259: TMS-Home | Show workspace test coverage summary _(Planning)_

### Test Set (1)

- [BK-876](https://jira.upexgalaxy.com/browse/BK-876): ATS: BK-259: TMS-Home | Show workspace test coverage summary _(Designing)_

---

## Metadata

- **Created:** 2026-07-31
- **Updated:** 2026-09-12
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** blocked, p2

---

_Synced from Jira by sync-jira-issues_
