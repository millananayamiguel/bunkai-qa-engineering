# TEST: BK-229: TC09: should render the projects meter state by usage ratio

**Jira Key:** [BK-727](https://jira.upexgalaxy.com/browse/BK-727)
**Status:** Candidate
**Components:** None

---

## Test Description

BK-229: TC09: should render the projects meter state by usage ratio

Related Story: BK-229
Priority: High
ROI: 4.0 (Candidate)
Coverage: AC3 (warning band), AC15 (exactly 80%), AC4 (100%), AC5 (exceeded)
Prior bugs: none

Preconditions: workspace on the cloud plan with a 50-project limit; owner or admin caller.
Action: open Settings, then Billing.
Expected: meter state follows usage ratio — normal below 80%, warning at 80-99%, limit-reached at 100% and above; over-limit renders the true count, never clamped.

Test Design: Scenario Outline over the boundary values 39 / 40 / 45 / 50 / 55 (see the Xray Gherkin). Threshold logic from lib/billing/plan-tiers.ts meterState().
Variables: project count seed.
Automation: pending (Stage 5).


---

## Metadata

- **Created:** 2026-08-30
- **Updated:** 2026-09-27
- **Reporter:** pinto.lucas.nahuel
- **Assignee:** pinto.lucas.nahuel
- **Labels:** functional, high, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
