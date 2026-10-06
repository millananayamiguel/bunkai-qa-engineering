# TEST: BK-3: TC05: Tampered OAuth state cookie returns 403 (CSRF protection)

**Jira Key:** [BK-474](https://jira.upexgalaxy.com/browse/BK-474)
**Status:** Draft
**Components:** Bunkai Auth

---

## Test Description

Story: [https://jira.upexgalaxy.com/browse/BK-3#icft=BK-3](https://jira.upexgalaxy.com/browse/BK-3#icft=BK-3) · AC-5

Given an OAuth sign-in flow is in progress with a custom state cookie
When the state cookie is tampered with before the callback
Then the server returns 403 on mismatch

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
