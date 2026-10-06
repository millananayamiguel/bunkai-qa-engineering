# TEST: BK-269: TC08: should decrement widget count by one

**Jira Key:** [BK-660](https://jira.upexgalaxy.com/browse/BK-660)
**Status:** READY
**Components:** None

---

## Test Description

## Related Story

[https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269](https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269): Automatically abort abandoned runs after inactivity

## Priority

High

## ROI

Frequency: Every sprint | Impact: Degrades UX | Stability: Moderate | Effort: Moderate | Dependencies: 3-4

## Preconditions

- Home widget shows count N of running Runs
- One Run is idle past the threshold

## Action

Trigger the sweep

## Expected Results

- Widget count becomes N-1 on next page load

## Test Design

```
@high @regression @automation-candidate @BK-269
Scenario: should decrement active-runs widget count by one
  Given the Home widget shows N active runs with one idle past threshold
  When the sweep closes that idle Run
  Then the widget count becomes N-1
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
