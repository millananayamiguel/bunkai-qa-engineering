# TEST: BK-88: TC20: should render a revoked token as visually distinct and without a revoke action given the token was revoked

**Jira Key:** [BK-1044](https://jira.upexgalaxy.com/browse/BK-1044)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: the caller holds one revoked token.

Steps: 1) Open Settings > Tokens. 2) Locate the revoked row. 3) Compare it to an active row.

Expected: the revoked row is visually distinct (struck-through name plus a revoked badge) and its action cell shows a revoked date instead of a Revoke button; the active count excludes it.

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
