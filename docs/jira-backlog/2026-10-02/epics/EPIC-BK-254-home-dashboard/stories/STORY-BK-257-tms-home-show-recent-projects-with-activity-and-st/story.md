# TMS-Home | Show recent projects with activity and stats

**Jira Key:** [BK-257](https://jira.upexgalaxy.com/browse/BK-257)
**Epic:** [BK-254](https://jira.upexgalaxy.com/browse/BK-254) (Home Dashboard)
**Type:** Story
**Status:** Deployed to Production
**Priority:** Medium
**Story Points:** 3

---

## Overview

## User story

As a Senior QA Engineer, I want to see the projects with the most recent activity in the workspace so that I can jump back into the project I was working in without hunting for it.

## Definition of done

- The recent-projects list appears on Home and reflects the workspace's projects ordered by activity.
- The change does not regress existing Home navigation or other screens.

## Technical notes

Renders into `home.jsx` (master-design-plan.md §4.2), the "Recent projects" section.

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)

---

## Traceability

### Test Execution (1)

- [BK-845](https://jira.upexgalaxy.com/browse/BK-845): ATR: BK-257: Story Testing _(Close)_

### Test Plan (1)

- [BK-844](https://jira.upexgalaxy.com/browse/BK-844): ATP: BK-257: TMS-Home | Show recent projects with activity and stats _(READY)_

### Test Set (1)

- [BK-856](https://jira.upexgalaxy.com/browse/BK-856): ATS: BK-257: TMS-Home | Show recent projects with activity and stats _(Designing)_

---

## Metadata

- **Created:** 2026-07-31
- **Updated:** 2026-09-03
- **Reporter:** Ely
- **Assignee:** Gianluca Módena
- **Labels:** p2

---

_Synced from Jira by sync-jira-issues_
