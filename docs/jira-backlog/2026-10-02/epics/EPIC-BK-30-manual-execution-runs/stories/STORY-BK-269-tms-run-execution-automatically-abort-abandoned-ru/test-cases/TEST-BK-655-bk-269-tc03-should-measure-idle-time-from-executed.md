# TEST: BK-269: TC03: should measure idle time from executed_at not updated_at

**Jira Key:** [BK-655](https://jira.upexgalaxy.com/browse/BK-655)
**Status:** READY
**Components:** None

---

## Test Description

## Related Story

[https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269](https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269): Automatically abort abandoned runs after inactivity

## Priority

High

## ROI

Frequency: Every release | Impact: Blocks feature | Stability: Stable | Effort: Trivial | Dependencies: None

## Preconditions

- Run exists in `running` status
- A step was marked 5 hours ago (executed_at = 5h ago)
- `runs.updated_at` was updated 10 minutes ago by non-step activity

## Action

Trigger the sweep

## Expected Results

- Run is closed as `aborted`
- Idle time was measured from `run*steps.executed*at` (5h ago), NOT from `runs.updated_at` (10min ago)

## Test Design

```
@high @regression @automation-candidate @BK-269
Scenario: should measure idle time from executed*at not runs.updated*at
  Given a Run in "running" with step marked 5h ago and updated_at 10min ago
  When the sweep executes
  Then the Run is closed
  And idle time was computed from executed_at
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
