# TEST: BK-88: TC16: should show only the bk_pat prefix in the list and drop the secret from the DOM after the reveal dialog is dismissed

**Jira Key:** [BK-1040](https://jira.upexgalaxy.com/browse/BK-1040)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: TC15 has just issued a token and the "Token created" dialog is open.

Steps: 1) Note the full secret. 2) Click the done control. 3) Inspect the token row for the new token. 4) Search the rendered DOM for the secret substring.

Expected: the row shows name + bk*pat*<12-char-prefix> only; the secret node is unmounted; the full secret appears nowhere in the DOM.

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
