# TEST: BK-88: TC27: should issue the token when workspace:admin targets a workspace where the caller is owner

**Jira Key:** [BK-1051](https://jira.upexgalaxy.com/browse/BK-1051)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: the caller is owner of the target workspace.

Steps: 1) POST /api/v1/tokens with scopes ["workspace:admin"] and that workspace_id. 2) Cross-check the row in the database.

Expected: HTTP 201; the persisted row carries workspace_id and the workspace:admin scope; the positive half of the role gate still works.

Auth: cookie session (in-page fetch) + DB read.

---

## Metadata

- **Created:** 2026-09-18
- **Updated:** 2026-09-18
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** bk88, sprint-4, ui-surface

---

_Synced from Jira by sync-jira-issues_
