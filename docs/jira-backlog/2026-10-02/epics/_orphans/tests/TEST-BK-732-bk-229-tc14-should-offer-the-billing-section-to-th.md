# TEST: BK-229: TC14: should offer the Billing section to the workspace owner and admin

**Jira Key:** [BK-732](https://jira.upexgalaxy.com/browse/BK-732)
**Status:** Candidate
**Components:** None

---

## Test Description

BK-229: TC14: should offer the Billing section to the workspace owner and admin

Related Story: BK-229
Priority: Critical
ROI: 12.0 (Candidate)
Coverage: AC7 (owner), AC8 (admin)
Prior bugs: none

Preconditions: a user with the target role in the workspace.
Action: sign in, open the Settings hub.
Expected: the Billing nav entry is shown to owner and admin, and the Billing page renders the overview.

Test Design: Scenario Outline over owner and admin (see the Xray Gherkin). Gate from lib/settings/nav-items.ts BILLING*NAV*ROLES.
Variables: user role.
Automation: pending (Stage 5).


---

## Metadata

- **Created:** 2026-08-30
- **Updated:** 2026-09-27
- **Reporter:** pinto.lucas.nahuel
- **Assignee:** pinto.lucas.nahuel
- **Labels:** critical, e2e, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
