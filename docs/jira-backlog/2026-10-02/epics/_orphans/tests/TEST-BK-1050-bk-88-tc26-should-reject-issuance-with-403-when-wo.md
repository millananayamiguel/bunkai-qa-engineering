# TEST: BK-88: TC26: should reject issuance with 403 when workspace:admin targets a workspace where the caller is only a viewer

**Jira Key:** [BK-1050](https://jira.upexgalaxy.com/browse/BK-1050)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: the caller is an active viewer of a second workspace.

Steps: 1) POST /api/v1/tokens with scopes ["workspace:admin"] and that workspace_id.

Expected: HTTP 403 stating only workspace admins or owners can issue workspace:admin tokens; no row is created. This is the [https://jira.upexgalaxy.com/browse/BK-135#icft=BK-135](https://jira.upexgalaxy.com/browse/BK-135#icft=BK-135) privilege-escalation regression.

Auth: cookie session (in-page fetch).

---

## Metadata

- **Created:** 2026-09-18
- **Updated:** 2026-09-18
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** bk88, sprint-4, ui-surface

---

_Synced from Jira by sync-jira-issues_
