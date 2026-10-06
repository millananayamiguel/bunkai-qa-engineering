# TEST: BK-229: TC16: should hide the Billing section from a workspace member

**Jira Key:** [BK-734](https://jira.upexgalaxy.com/browse/BK-734)
**Status:** Candidate
**Components:** None

---

## Test Description

BK-229: TC16: should hide the Billing section from a workspace member

Related Story: BK-229
Priority: Critical
ROI: 5.0 (Candidate)
Coverage: AC9 (member cannot view)
Prior bugs: none; regression for BK-740 (Billing nav was visible to members)

Preconditions: a workspace member without the owner or admin role.
Action: sign in as the member, open the Settings hub.
Expected: the Billing nav entry is not offered; a direct navigation to /settings/billing shows the not-available state backed by a server 404 (non-disclosure, never 403).

Test Design: single negative access-control scenario (see the Xray Gherkin). Gate from lib/settings/nav-items.ts BILLING*NAV*ROLES and the getWorkspaceBillingOverview RPC returning null to non-admins.
Variables: member user.
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
