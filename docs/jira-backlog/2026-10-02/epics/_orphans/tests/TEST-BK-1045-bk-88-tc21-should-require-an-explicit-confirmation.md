# TEST: BK-88: TC21: should require an explicit confirmation dialog before revoking a token

**Jira Key:** [BK-1045](https://jira.upexgalaxy.com/browse/BK-1045)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: the caller holds an active token named bk88-w1-*.

Steps: 1) Click Revoke on that row. 2) Read the dialog.

Expected: a confirmation dialog appears naming the token and warning the action cannot be undone; nothing is revoked until it is confirmed.

Auth: cookie session (browser).

---

## Metadata

- **Created:** 2026-09-18
- **Updated:** 2026-09-18
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** bk88, sprint-4, ui-surface

---

_Synced from Jira by sync-jira-issues_
