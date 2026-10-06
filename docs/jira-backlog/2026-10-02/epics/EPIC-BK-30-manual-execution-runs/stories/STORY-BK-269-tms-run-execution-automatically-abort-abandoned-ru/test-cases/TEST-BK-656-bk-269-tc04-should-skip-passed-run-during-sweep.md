# TEST: BK-269: TC04: should skip passed Run during sweep

**Jira Key:** [BK-656](https://jira.upexgalaxy.com/browse/BK-656)
**Status:** READY
**Components:** None

---

## Test Description

## Related Story

[https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269](https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269): Automatically abort abandoned runs after inactivity

## Priority

High

## ROI

Frequency: Every sprint | Impact: Degrades UX | Stability: Stable | Effort: Trivial | Dependencies: None

## Preconditions

- Run exists in `passed` status
- Last activity older than 4 hours

## Action

Trigger the sweep

## Expected Results

- Status, `finished*at`, and `abort*reason` are unchanged

## Test Design

```
@high @regression @automation-candidate @BK-269
Scenario: should skip a passed Run during sweep
  Given a Run in "passed" status with last activity older than threshold
  When the sweep executes
  Then the Run status remains "passed"
  And finished*at and abort*reason are unchanged
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
