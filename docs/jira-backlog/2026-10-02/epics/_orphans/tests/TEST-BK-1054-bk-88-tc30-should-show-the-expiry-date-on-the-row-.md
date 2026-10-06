# TEST: BK-88: TC30: should show the expiry date on the row when the token is issued with an expiry window

**Jira Key:** [BK-1054](https://jira.upexgalaxy.com/browse/BK-1054)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: the issue-token dialog is open.

Steps: 1) Issue a token with a 30-day expiry. 2) Read the Expires cell and the persisted expires_at.

Expected: the row shows the concrete expiry date instead of never, and expires_at is about 30 days out.

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
