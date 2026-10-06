# TEST: BK-88: TC17: should place the secret on the clipboard when the copy control is used given the reveal dialog is open

**Jira Key:** [BK-1041](https://jira.upexgalaxy.com/browse/BK-1041)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: the "Token created" dialog is open with a fresh secret.

Steps: 1) Click the copy control. 2) Read navigator.clipboard.readText().

Expected: the clipboard holds the exact secret; the control acknowledges the copy.

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
