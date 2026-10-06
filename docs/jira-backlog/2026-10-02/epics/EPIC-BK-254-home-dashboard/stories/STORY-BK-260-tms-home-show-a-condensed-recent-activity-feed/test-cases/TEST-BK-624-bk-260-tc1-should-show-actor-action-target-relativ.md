# TEST: BK-260: TC1: should show actor, action, target, relative time, glyph and verdict for each event type given workspace has recent tracked activity

**Jira Key:** [BK-624](https://jira.upexgalaxy.com/browse/BK-624)
**Status:** AUTOMATED
**Components:** None

---

## Test Description

Fallback note: Xray credentials unavailable this session — this Test is a plain Jira "Test" issue (Jira-layer only). Gherkin recorded here in Description as the content of record; promote into Xray's native Gherkin field via `bun xray test update-gherkin` once XRAY*CLIENT*ID/SECRET are set.

Feature: Home condensed recent activity feed — item rendering

Scenario Outline: Row renders actor, action, target, relative time, glyph and verdict for <entity*type> event <elapsed*ago>
Given a workspace activity event of entity*type "<entity*type>" and action "<action>" occurred <elapsed_ago>
When the QA engineer opens the Home screen
Then the row shows the actor, the action label, and the item label
And the row shows relative time "<expected*time*label>"
And the row shows the "<entity_type>" glyph
And the row shows verdict chip "<expected_chip>"

Examples:

| entity*type  | action                   | elapsed*ago  | expected*time*label  | expected_chip  |
| --- | --- | --- | --- | --- |
| module       | module.created           | 30 seconds   | just now              | none           |
| test         | test.created             | 5 minutes    | 5m ago                | none           |
| bug          | bug.created              | 2 hours      | 2h ago                | none           |
| run          | run.finished (passed)    | 10 minutes   | 10m ago               | Passed         |
| run          | run.finished (failed)    | 20 minutes   | 20m ago               | Failed         |

Covers: AC1. Techniques: EP (entity type / action variety), BVA (time-bucket boundaries: just-now <1min, minutes <1h, hours <1d).

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
