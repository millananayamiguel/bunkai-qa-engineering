# TEST: BK-229: TC01: should show the plan card name, price, and renewal note per tier

**Jira Key:** [BK-719](https://jira.upexgalaxy.com/browse/BK-719)
**Status:** Candidate
**Components:** None

---

## Test Description

BK-229: TC01: should show the plan card name, price, and renewal note per tier

Related Story: BK-229
Priority: Critical
ROI: 8.0 (Candidate)
Coverage: AC1 (cloud), AC2/AC6 (enterprise), AC3/AC6 (community)
Prior bugs: none

Preconditions: workspace on the target plan; caller is owner or admin.
Action: open Settings, then Billing.
Expected: plan card shows the tier display name, the price, and the renewal note; a non-paid plan also shows a live Upgrade entry linking to /settings/billing/upgrade.

Test Design: Scenario Outline over community, cloud, enterprise (see the Xray Gherkin). Values from lib/billing/plan-tiers.ts.
Variables: plan = workspaces.plan seed.
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
