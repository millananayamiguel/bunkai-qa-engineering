# TEST: BK-3: TC03: Returning OAuth user signs in without creating a duplicate workspace

**Jira Key:** [BK-472](https://jira.upexgalaxy.com/browse/BK-472)
**Status:** Draft
**Components:** Bunkai Auth

---

## Test Description

Story: [https://jira.upexgalaxy.com/browse/BK-3#icft=BK-3](https://jira.upexgalaxy.com/browse/BK-3#icft=BK-3) · AC-3

Given a user with an existing workspace linked to an OAuth provider
When they sign in with the same provider again
Then no duplicate workspace is created and they are redirected to /projects

Unassigned — available for UPEX students to automate.

---

## Related Issues

- tests: [BK-3](https://jira.upexgalaxy.com/browse/BK-3) - Authentication | Sign up and sign in via OAuth (GitHub / Google)

---

## Metadata

- **Created:** 2026-08-14
- **Updated:** 2026-09-11
- **Reporter:** Nahuel Gomez
- **Assignee:** Unassigned
- **Labels:** oauth

---

_Synced from Jira by sync-jira-issues_
