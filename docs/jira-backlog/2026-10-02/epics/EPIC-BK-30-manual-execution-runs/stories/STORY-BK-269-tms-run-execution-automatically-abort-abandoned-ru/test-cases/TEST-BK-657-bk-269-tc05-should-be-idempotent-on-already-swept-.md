# TEST: BK-269: TC05: should be idempotent on already-swept Run

**Jira Key:** [BK-657](https://jira.upexgalaxy.com/browse/BK-657)
**Status:** READY
**Components:** None

---

## Test Description

## Related Story

[https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269](https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269): Automatically abort abandoned runs after inactivity

## Priority

High

## ROI

Frequency: Every sprint | Impact: Minor | Stability: Stable | Effort: Trivial | Dependencies: None

## Preconditions

- Run was already closed by the sweep on a previous execution

## Action

Trigger the sweep again

## Expected Results

- Status, `finished*at`, and `abort*reason` unchanged from the first sweep
- Only one `run.aborted` entry in `activity_log`

## Test Design

```
@high @regression @automation-candidate @BK-269
Scenario: should be idempotent on an already-swept Run
  Given a Run that was closed by sweep on a previous execution
  When the sweep executes again
  Then all fields remain unchanged
  And only one run.aborted activity_log entry exists
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
