# TMS-Workspace | View the workspaces I belong to

**Jira Key:** [BK-89](https://jira.upexgalaxy.com/browse/BK-89)
**Epic:** [BK-85](https://jira.upexgalaxy.com/browse/BK-85) (Account & Settings)
**Type:** Story
**Status:** QA Approved
**Priority:** Medium
**Story Points:** 2

---

## Overview

## User story

As a QA Lead (Mateo Silva) I want to see every workspace I belong to with my role in each, so that I always know which teams my account can reach.

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Implementation Plan (Dev)](./implementation-plan.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)
- [Acceptance Test Results (QA)](./acceptance-test-results.md)

---

## Traceability

### Tests (4)

- [BK-136](https://jira.upexgalaxy.com/browse/BK-136): BK-89: TC01: GET /api/v1/workspaces returns HTTP 200 with correct workspace list shape _(AUTOMATED)_
- [BK-139](https://jira.upexgalaxy.com/browse/BK-139): BK-89: TC02: GET /api/v1/workspaces unauthenticated returns 401 _(AUTOMATED)_
- [BK-141](https://jira.upexgalaxy.com/browse/BK-141): BK-89: TC04: should return the caller's role for every workspace in GET /api/v1/workspaces _(READY)_
- [BK-140](https://jira.upexgalaxy.com/browse/BK-140): BK-89: TC03: GET /api/v1/workspaces returns only active memberships — DB cross-validation _(MANUAL)_

### Test Execution (1)

- [BK-1057](https://jira.upexgalaxy.com/browse/BK-1057): ATR: BK-89: Story Testing _(Close)_

### Storys (2)

- [BK-90](https://jira.upexgalaxy.com/browse/BK-90): TMS-Workspace | Leave a workspace _(Ready For QA)_
- [BK-87](https://jira.upexgalaxy.com/browse/BK-87): Settings | Open a settings hub and view my account _(Ready For Release)_

### Improvements (3)

- [BK-1061](https://jira.upexgalaxy.com/browse/BK-1061): BK-89: AC 2 still forbids the Leave and Delete controls that BK-90 and BK-512 shipped _(Open)_
- [BK-1062](https://jira.upexgalaxy.com/browse/BK-1062): BK-89: AC 4 derives the Owner label from owner_user_id, the build derives it from the membership role _(Open)_
- [BK-1063](https://jira.upexgalaxy.com/browse/BK-1063): BK-89: the active-workspace marker does not match PO Decision 2 (no Activo badge, no differentiated border) _(Open)_

### Test Plan (1)

- [BK-1056](https://jira.upexgalaxy.com/browse/BK-1056): ATP: BK-89: TMS-Workspace | View the workspaces I belong to _(Completed)_

### Test Set (1)

- [BK-1055](https://jira.upexgalaxy.com/browse/BK-1055): ATS: BK-89: TMS-Workspace | View the workspaces I belong to _(Close)_

---

## Metadata

- **Created:** 2026-06-08
- **Updated:** 2026-09-18
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** implementation-plan-ready, shift-left-2026-06-10, shift-left-reviewed

---

_Synced from Jira by sync-jira-issues_
