# TEST: BK-88: TC28: should normalize the token name to lowercase hyphenated form when the submitted name has spaces or capitals

**Jira Key:** [BK-1052](https://jira.upexgalaxy.com/browse/BK-1052)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: the issue-token dialog is open.

Steps: 1) Type a name with capitals and spaces. 2) Submit. 3) Read the created row and the database row.

Expected: the stored name is the normalized lowercase hyphenated form; record whether the user was told this would happen, since a silent rewrite of a user-supplied label is a usability risk.

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
