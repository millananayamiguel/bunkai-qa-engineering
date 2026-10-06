# TEST: BK-269: TC02: should NOT close active Run within threshold

**Jira Key:** [BK-654](https://jira.upexgalaxy.com/browse/BK-654)
**Status:** READY
**Components:** None

---

## Test Description

## Related Story

[https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269](https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269): Automatically abort abandoned runs after inactivity

## Priority

Critical

## ROI

Frequency: Every sprint | Impact: Blocks feature | Stability: Stable | Effort: Trivial | Dependencies: None

## Preconditions

- Run exists in `running` status
- A step was marked within the last 4 hours (recent activity)

## Action

Trigger the sweep

## Expected Results

- Run status remains `running`
- `abort_reason` stays null
- `finished_at` stays null
- No changes to any Run field

## Test Design

```
@critical @regression @automation-candidate @BK-269
Scenario: should NOT close a running Run with step activity within threshold
  Given a Run in "running" status with a step marked within the inactivity threshold
  When the scheduled sweep executes
  Then the Run status remains "running"
  And abort_reason stays null
  And finished_at stays null
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
