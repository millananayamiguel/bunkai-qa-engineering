# TEST: BK-88: TC22: should flip the row to the revoked state without a full page reload when the revocation is confirmed

**Jira Key:** [BK-1046](https://jira.upexgalaxy.com/browse/BK-1046)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: the revoke confirmation dialog is open for a bk88-w1-* token.

Steps: 1) Record a page-identity marker (window-level sentinel). 2) Confirm the revocation. 3) Re-read the row and the marker.

Expected: DELETE returns success, the row shows the revoked state, and the sentinel survives, proving no full document reload.

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
