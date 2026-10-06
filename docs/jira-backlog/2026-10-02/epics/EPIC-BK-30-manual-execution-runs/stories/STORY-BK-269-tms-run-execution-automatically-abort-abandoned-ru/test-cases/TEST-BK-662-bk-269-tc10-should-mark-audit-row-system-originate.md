# TEST: BK-269: TC10: should mark audit row system-originated

**Jira Key:** [BK-662](https://jira.upexgalaxy.com/browse/BK-662)
**Status:** READY
**Components:** None

---

## Test Description

## Related Story

[https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269](https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269): Automatically abort abandoned runs after inactivity

## Priority

Medium

## ROI

Frequency: Every release | Impact: Minor | Stability: Stable | Effort: Low | Dependencies: 1-2

## Preconditions

- Run closed by sweep

## Action

Read the resulting `activity_log` row

## Expected Results

- `action` = `run.aborted`
- `actor*user*id` = null (system-originated)
- `payload->>'via'` = `sweep`

## Test Design

```
@medium @regression @automation-candidate @BK-269
Scenario: should mark audit row as system-originated
  Given a Run closed by sweep
  When the activity_log row is read
  Then action is "run.aborted"
  And actor*user*id is null
  And payload->>'via' is "sweep"
```

---

## Related Issues

- is tested by: [BK-269](https://jira.upexgalaxy.com/browse/BK-269) - TMS-Run Execution | Automatically abort abandoned runs after inactivity

---

## Metadata

- **Created:** 2026-08-27
- **Updated:** 2026-09-03
- **Reporter:** Gianluca Módena
- **Assignee:** Gianluca Módena
- **Labels:** automation-candidate, regression

---

_Synced from Jira by sync-jira-issues_
