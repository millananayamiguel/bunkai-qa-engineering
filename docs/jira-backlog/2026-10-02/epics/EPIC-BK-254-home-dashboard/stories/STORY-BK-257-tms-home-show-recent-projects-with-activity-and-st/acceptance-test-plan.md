# ACCEPTANCE TEST PLAN (ATP): ATP: BK-257: TMS-Home | Show recent projects with activity and stats

**Jira Key:** [BK-844](https://jira.upexgalaxy.com/browse/BK-844)
**Status:** READY
**Components:** None

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

ATP: BK-257: TMS-Home | Show recent projects with activity and stats

GROUP 1 — Orden y contenido (3 TCs)
- BK-257: TC01: should order recent projects with created_at floor — 3 projects, 1 touched
- BK-257: TC02: should show newly created project even when never touched
- BK-257: TC03: should show name, module count, ATC count and last-activity per row

GROUP 2 — Navegacion (1 TC)
- BK-257: TC04: should navigate to project when selected

GROUP 3 — Limites y vacio (2 TCs)
- BK-257: TC05: should limit to 5 rows and show View all when more than 5 projects
- BK-257: TC06: should show empty state when workspace has no projects

GROUP 4 — Reloj (3 TCs)
- BK-257: TC07: should move project to top after ATC revision
- BK-257: TC08: should move on module addition but not on rename or move
- BK-257: TC09: should move on run start/finish/abort but not on in-progress step mark

GROUP 5 — Espejo UI API (1 TC)
- BK-257: TC10: should mirror UI order via GET /recent-projects

ATS: BK-856 — contains all 10 TCs
ATP: BK-844 — this plan

---

## Related Issues

- is tested by: [BK-257](https://jira.upexgalaxy.com/browse/BK-257) - TMS-Home | Show recent projects with activity and stats

---

## Metadata

- **Created:** 2026-09-03
- **Updated:** 2026-09-03
- **Reporter:** Gianluca Módena
- **Assignee:** Gianluca Módena

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Plan [BK-844](https://jira.upexgalaxy.com/browse/BK-844) description · ATP · synced by sync-jira-issues_
