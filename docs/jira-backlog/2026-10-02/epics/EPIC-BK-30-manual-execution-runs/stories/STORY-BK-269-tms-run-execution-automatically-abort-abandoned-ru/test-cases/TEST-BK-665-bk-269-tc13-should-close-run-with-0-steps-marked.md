# TEST: BK-269: TC13: should close Run with 0 steps marked

**Jira Key:** [BK-665](https://jira.upexgalaxy.com/browse/BK-665)
**Status:** READY
**Components:** None

---

## Test Description

## Related Story

[https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269](https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269): Automatically abort abandoned runs after inactivity

## Priority

High

## ROI

Frequency: Every sprint | Impact: Blocks feature | Stability: Stable | Effort: Trivial | Dependencies: None

## Preconditions

- Run exists in `running` status
- All `run_steps` are at `pending` (no step was ever marked)
- `started_at` is older than the configured inactivity threshold (4h)

## Action

Trigger the sweep

## Expected Results

- Run is closed as `aborted`
- Idle time was measured from `runs.started*at` (not from `runs.updated*at`)
- System-generated reason is set

## Test Design

```
@high @regression @automation-candidate @BK-269
Scenario: should close Run whose steps were never marked
  Given a Run in "running" with all steps at "pending" and started_at >4h ago
  When the sweep executes
  Then the Run is closed as "aborted"
  And idle time was measured from started_at
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
