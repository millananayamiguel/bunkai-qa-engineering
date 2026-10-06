# TEST: BK-88: TC15: should reveal the full token secret exactly once with the store-now warning when a token is issued from Settings > Tokens

**Jira Key:** [BK-1039](https://jira.upexgalaxy.com/browse/BK-1039)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: authenticated as the staging owner on [https://staging-upexbunkai.vercel.app](https://staging-upexbunkai.vercel.app/), Settings > Tokens open.

Steps: 1) Click "New token". 2) Fill "Token name" with bk88-w1-reveal. 3) Check scope run:execute. 4) Click "Create token".

Expected: the dialog switches to "Token created"; the full bk*pat*<prefix>.<secret> string is rendered once; the warning "Store this token now - it cannot be retrieved later." is shown; a copy control is offered.

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
