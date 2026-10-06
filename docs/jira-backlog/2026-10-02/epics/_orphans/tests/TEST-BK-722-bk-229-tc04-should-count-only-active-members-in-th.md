# TEST: BK-229: TC04: should count only active members in the seat meter

**Jira Key:** [BK-722](https://jira.upexgalaxy.com/browse/BK-722)
**Status:** Candidate
**Components:** None

---

## Test Description

BK-229: TC04: should count only active members in the seat meter

Related Story: BK-229
Priority: Critical
ROI: 3.0 (Candidate)
Coverage: AC10 (pending excluded), AC11 (suspended excluded), AC13 (over limit)
Prior bugs: none

Preconditions: workspace on the cloud plan; owner or admin caller; seeded member mix.
Action: open Settings, then Billing.
Expected: the seat meter counts only status = active; pending invitations and suspended members never count; over-limit renders the true count against the limit with a Limit reached chip.

Test Design: Scenario Outline over pending-excluded, suspended-excluded, over-limit (see the Xray Gherkin). Buckets from supabase 0005 rls helpers.
Variables: active / pending / suspended member counts.
Automation: pending (Stage 5).


---

## Metadata

- **Created:** 2026-08-30
- **Updated:** 2026-09-27
- **Reporter:** pinto.lucas.nahuel
- **Assignee:** pinto.lucas.nahuel
- **Labels:** critical, functional, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
