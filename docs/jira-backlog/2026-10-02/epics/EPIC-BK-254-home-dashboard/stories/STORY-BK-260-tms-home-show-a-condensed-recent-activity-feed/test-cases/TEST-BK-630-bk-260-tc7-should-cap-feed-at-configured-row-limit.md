# TEST: BK-260: TC7: should cap feed at configured row limit given more tracked events than the limit

**Jira Key:** [BK-630](https://jira.upexgalaxy.com/browse/BK-630)
**Status:** Draft
**Components:** None

---

## Test Description

Fallback note: Xray credentials unavailable this session — plain Jira "Test" issue (Jira-layer only). Promote into Xray's native Gherkin field via `bun xray test update-gherkin` once credentials are set.

Feature: Home condensed recent activity feed — row cap

Scenario: Feed caps at the configured row limit
Given more tracked events exist in the last 24 hours than the feed's row limit
When the QA engineer opens the Home screen
Then the feed shows exactly the configured limit of rows
And the rows shown are the most recent ones, newest first

Covers: risk beyond AC — HOME*ACTIVITY*FEED_LIMIT boundary (selectRecentActivity). Technique: BVA.

---

## Related Issues

- is tested by: [BK-632](https://jira.upexgalaxy.com/browse/BK-632) - ATS: BK-260: TMS-Home | Show a condensed recent activity feed
- is tested by: [BK-260](https://jira.upexgalaxy.com/browse/BK-260) - TMS-Home | Show a condensed recent activity feed
- is executed by: [BK-634](https://jira.upexgalaxy.com/browse/BK-634) - ATR: BK-260: Story Testing

---

## Metadata

- **Created:** 2026-08-27
- **Updated:** 2026-08-31
- **Reporter:** Carlos C
- **Assignee:** Carlos C

---

_Synced from Jira by sync-jira-issues_
