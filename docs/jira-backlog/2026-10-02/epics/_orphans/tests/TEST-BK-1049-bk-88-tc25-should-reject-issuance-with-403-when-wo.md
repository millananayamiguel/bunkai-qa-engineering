# TEST: BK-88: TC25: should reject issuance with 403 when workspace:admin is requested without a target workspace

**Jira Key:** [BK-1049](https://jira.upexgalaxy.com/browse/BK-1049)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: authenticated cookie session.

Steps: 1) POST /api/v1/tokens with scopes ["workspace:admin"] and no workspace_id.

Expected: HTTP 403 with a forbidden envelope stating the scope must target a specific workspace; no row is created.

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
