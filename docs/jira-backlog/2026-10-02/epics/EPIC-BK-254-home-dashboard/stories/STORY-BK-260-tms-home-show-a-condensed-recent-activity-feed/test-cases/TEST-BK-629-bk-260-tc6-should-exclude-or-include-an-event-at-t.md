# TEST: BK-260: TC6: should exclude or include an event at the 24h window boundary

**Jira Key:** [BK-629](https://jira.upexgalaxy.com/browse/BK-629)
**Status:** Draft
**Components:** None

---

## Test Description

Fallback note: Xray credentials unavailable this session — plain Jira "Test" issue (Jira-layer only). Promote into Xray's native Gherkin field via `bun xray test update-gherkin` once credentials are set.

Feature: Home condensed recent activity feed — 24h window boundary

Scenario Outline: Feed includes or excludes an event at the 24h window boundary
Given a workspace activity event created <offset> the 24h window boundary
When the QA engineer opens the Home screen
Then the event is <inclusion> in the condensed feed

Examples:

| offset            | inclusion  |
| --- | --- |
| 1 minute before    | included   |
| 1 minute after     | excluded   |

Covers: risk beyond AC — HOME*CHANGE*WINDOW_HOURS boundary (selectRecentActivity). Technique: BVA.

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
