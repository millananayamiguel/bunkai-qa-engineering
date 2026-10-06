# TEST: BK-260: TC4: should show empty state given workspace has no tracked activity in last 24h

**Jira Key:** [BK-627](https://jira.upexgalaxy.com/browse/BK-627)
**Status:** AUTOMATED
**Components:** None

---

## Test Description

Fallback note: Xray credentials unavailable this session — plain Jira "Test" issue (Jira-layer only). Promote into Xray's native Gherkin field via `bun xray test update-gherkin` once credentials are set.

Feature: Home condensed recent activity feed — empty state

Scenario: Empty state shown when there is no recent tracked activity
Given nothing has happened in the QA engineer's workspace in the last 24 hours
When she opens the Home screen
Then the condensed activity feed shows an empty state
And the empty state names only the events this feed tracks (modules, ATCs, tests, runs, bug triage), not the whole workspace
And the empty state offers the "Browse the full activity feed" link

Covers: AC3. Technique: EP.

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
