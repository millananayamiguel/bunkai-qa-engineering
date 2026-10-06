# TEST: BK-269: TC07: should remove swept Run from widget

**Jira Key:** [BK-659](https://jira.upexgalaxy.com/browse/BK-659)
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

- Run appears in Home "active test runs" widget (status `running`)
- Run is idle past the threshold

## Action

Trigger the sweep

## Expected Results

- On next page load, Run no longer appears in the widget
- Widget count decrements by 1

## Test Design

```
@high @regression @automation-candidate @BK-269
Scenario: should remove swept Run from active-runs widget
  Given a Run visible in the Home active test runs widget
  When the sweep closes that Run
  Then on next page load the Run no longer appears
  And the widget count decrements by 1
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
