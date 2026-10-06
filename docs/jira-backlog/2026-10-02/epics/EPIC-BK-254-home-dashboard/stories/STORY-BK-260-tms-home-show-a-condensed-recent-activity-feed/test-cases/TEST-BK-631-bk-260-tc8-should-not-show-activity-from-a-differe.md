# TEST: BK-260: TC8: should not show activity from a different workspace given RLS scoping

**Jira Key:** [BK-631](https://jira.upexgalaxy.com/browse/BK-631)
**Status:** AUTOMATED
**Components:** None

---

## Test Description

Fallback note: Xray credentials unavailable this session — plain Jira "Test" issue (Jira-layer only). Promote into Xray's native Gherkin field via `bun xray test update-gherkin` once credentials are set.

Feature: Home condensed recent activity feed — workspace isolation

Scenario: Activity from a different workspace is never shown
Given activity events exist in a workspace the QA engineer does not belong to
When she opens Home with her own active workspace selected
Then the condensed feed shows only her own workspace's activity
And no foreign workspace event appears, even with a forged active-workspace cookie

Covers: risk beyond AC — RLS scoping (activity*log*select*workspace*member). Technique: Decision table / security risk (error-guessing).

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
