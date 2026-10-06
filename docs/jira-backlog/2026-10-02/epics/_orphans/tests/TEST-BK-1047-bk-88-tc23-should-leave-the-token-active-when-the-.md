# TEST: BK-88: TC23: should leave the token active when the revoke confirmation is cancelled

**Jira Key:** [BK-1047](https://jira.upexgalaxy.com/browse/BK-1047)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: the revoke confirmation dialog is open for an active bk88-w1-* token.

Steps: 1) Cancel the dialog. 2) Re-read the row. 3) Cross-check revoked_at in the database.

Expected: the dialog closes, the row stays active, and revoked_at stays null.

Auth: cookie session (browser) + DB read.

---

## Metadata

- **Created:** 2026-09-18
- **Updated:** 2026-09-18
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** bk88, sprint-4, ui-surface

---

_Synced from Jira by sync-jira-issues_
