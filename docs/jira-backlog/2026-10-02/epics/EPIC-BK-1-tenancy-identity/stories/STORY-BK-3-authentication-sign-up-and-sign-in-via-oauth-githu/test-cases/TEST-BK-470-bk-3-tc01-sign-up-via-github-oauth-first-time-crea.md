# TEST: BK-3: TC01: Sign up via GitHub OAuth (first time) creates a workspace and redirects to /onboarding

**Jira Key:** [BK-470](https://jira.upexgalaxy.com/browse/BK-470)
**Status:** Draft
**Components:** Bunkai Auth

---

## Test Description

Story: [https://jira.upexgalaxy.com/browse/BK-3#icft=BK-3](https://jira.upexgalaxy.com/browse/BK-3#icft=BK-3) — Authentication | Sign up and sign in via OAuth (GitHub / Google) · AC-1

Given an unauthenticated visitor on the login page
When they sign in with GitHub for the first time (consent screen → callback → state validation + code exchange)
Then a workspace is created and they are redirected to /onboarding

Unassigned — available for UPEX students to automate.

---

## Related Issues

- tests: [BK-3](https://jira.upexgalaxy.com/browse/BK-3) - Authentication | Sign up and sign in via OAuth (GitHub / Google)

---

## Metadata

- **Created:** 2026-08-14
- **Updated:** 2026-09-22
- **Reporter:** Nahuel Gomez
- **Assignee:** Ely
- **Labels:** oauth

---

_Synced from Jira by sync-jira-issues_
