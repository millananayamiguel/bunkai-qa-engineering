# TEST: BK-3: TC06: Cross-provider auto-link — GitHub then Google with the same email lands on the same workspace

**Jira Key:** [BK-475](https://jira.upexgalaxy.com/browse/BK-475)
**Status:** Draft
**Components:** Bunkai Auth

---

## Test Description

Story: [https://jira.upexgalaxy.com/browse/BK-3#icft=BK-3](https://jira.upexgalaxy.com/browse/BK-3#icft=BK-3) · AC-7

Given a user already has a workspace linked via GitHub
When they sign in with Google using the same email
Then the identity auto-links to the same workspace (no duplicate, no EMAIL_EXISTS error)

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
