# TEST: BK-260: TC3: should navigate to /activity when link is selected from empty state

**Jira Key:** [BK-626](https://jira.upexgalaxy.com/browse/BK-626)
**Status:** AUTOMATED
**Components:** None

---

## Test Description

Fallback note: Xray credentials unavailable this session — plain Jira "Test" issue (Jira-layer only). Promote into Xray's native Gherkin field via `bun xray test update-gherkin` once credentials are set.

Feature: Home condensed recent activity feed — navigation

Scenario: View all link (empty state) navigates to the full activity view
Given the QA engineer's workspace has no recent activity
And she is viewing the empty condensed activity feed on Home
When she selects the "Browse the full activity feed" link
Then she is taken to the full activity view at /activity

Covers: AC2 (empty-state variant of the link, distinct DOM location from TC2). Technique: EP.

---

## Related Issues

- is tested by: [BK-632](https://jira.upexgalaxy.com/browse/BK-632) - ATS: BK-260: TMS-Home | Show a condensed recent activity feed
- is tested by: [BK-260](https://jira.upexgalaxy.com/browse/BK-260) - TMS-Home | Show a condensed recent activity feed
- is executed by: [BK-634](https://jira.upexgalaxy.com/browse/BK-634) - ATR: BK-260: Story Testing

---

## Metadata

- **Created:** 2026-08-27
- **Updated:** 2026-09-21
- **Reporter:** Carlos C
- **Assignee:** Carlos C
- **Labels:** automated, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
