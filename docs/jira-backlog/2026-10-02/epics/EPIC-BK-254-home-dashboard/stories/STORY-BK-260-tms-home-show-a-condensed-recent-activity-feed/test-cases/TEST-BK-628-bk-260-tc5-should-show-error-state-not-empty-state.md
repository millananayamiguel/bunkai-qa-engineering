# TEST: BK-260: TC5: should show error state, not empty state, given activity read fails

**Jira Key:** [BK-628](https://jira.upexgalaxy.com/browse/BK-628)
**Status:** MANUAL
**Components:** None

---

## Test Description

Fallback note: Xray credentials unavailable this session — plain Jira "Test" issue (Jira-layer only). Promote into Xray's native Gherkin field via `bun xray test update-gherkin` once credentials are set.

Feature: Home condensed recent activity feed — failure handling

Scenario: Error state shown, not empty state, when the activity read fails
Given the activity read fails when Home loads
When the QA engineer opens the Home screen
Then the condensed activity feed shows an error state, not the empty state
And the error state tells her to reload to try again
And the error state does not claim the workspace itself is empty

Covers: risk beyond AC — a failed read must never render as "nothing happened" (false statement about the workspace). Technique: Error-guessing.

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
- **Labels:** regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
