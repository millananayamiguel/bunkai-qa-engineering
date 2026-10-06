# TEST: BK-88: TC24: should guide first issuance with an empty state given the caller has zero tokens

**Jira Key:** [BK-1048](https://jira.upexgalaxy.com/browse/BK-1048)
**Status:** READY
**Components:** Bunkai API Tokens

---

## Test Description

Precondition: GET /api/v1/tokens returns an empty collection for the caller (forced by a response stub when the account cannot be emptied).

Steps: 1) Open Settings > Tokens with an empty token collection. 2) Read the empty state.

Expected: an empty state explains what personal access tokens are for and offers a primary action to issue the first one.

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
