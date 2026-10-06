# TEST: BK-269: TC01: should close idle running Run

**Jira Key:** [BK-653](https://jira.upexgalaxy.com/browse/BK-653)
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
- At least one step was marked with `executed_at` older than 4 hours
- Sweep function is available (`bunkai*sweep*abandoned_runs`)

## Action

Trigger the sweep (via pg*cron tick or direct invocation of `select public.bunkai*sweep*abandoned*runs(4);`)

## Expected Results

- Run status becomes `aborted`
- `finished_at` is set to the sweep execution timestamp
- `abort_reason` is set to: `Auto-closed by inactivity sweep: no step activity for 4h (closed {YYYY-MM-DD HH:MM} UTC)`
- Pending `run_steps` are set to `skipped`
- `run_atcs` verdict is recomputed
- Activity log row: `action=run.aborted`, `actor*user*id=null`, `payload->>'via'='sweep'`

## Test Design

```
@critical @regression @automation-candidate @BK-269
Scenario: should close a running Run with step activity older than threshold
  Given a Run in "running" status whose last marked step is older than 4 hours
  When the scheduled sweep executes
  Then the Run status becomes "aborted"
  And finished_at is set
  And abort_reason matches "Auto-closed by inactivity sweep: no step activity for 4h"
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
