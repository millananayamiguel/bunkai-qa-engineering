# TEST: BK-88: TC19: should list every token with name, scopes, workspace, created and expiry and no full secret anywhere

**Jira Key:** [BK-1043](https://jira.upexgalaxy.com/browse/BK-1043)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: the caller holds at least one token.

Steps: 1) Open Settings > Tokens. 2) Read the table columns. 3) Grep the DOM and the GET /api/v1/tokens response body for a full secret.

Expected: columns Token / Scopes / Workspace / Created / Expires / Actions are populated; only the 12-char prefix is shown; no secret in the DOM or the API payload.

Auth: cookie session (browser) + Bearer PAT for the API leg.

---

## Metadata

- **Created:** 2026-09-18
- **Updated:** 2026-09-18
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** bk88, sprint-4, ui-surface

---

_Synced from Jira by sync-jira-issues_
