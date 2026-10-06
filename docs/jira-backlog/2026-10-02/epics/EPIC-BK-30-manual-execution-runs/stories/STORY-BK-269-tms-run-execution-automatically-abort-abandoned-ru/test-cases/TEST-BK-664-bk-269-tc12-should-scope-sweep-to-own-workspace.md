# TEST: BK-269: TC12: should scope sweep to own Workspace

**Jira Key:** [BK-664](https://jira.upexgalaxy.com/browse/BK-664)
**Status:** READY
**Components:** None

---

## Test Description

## Related Story

[https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269](https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269): Automatically abort abandoned runs after inactivity

## Priority

High

## ROI

Frequency: Every release | Impact: Blocks feature | Stability: Stable | Effort: Moderate | Dependencies: 3-4

## Preconditions

- Workspace A has an idle Run past the threshold
- Workspace B has an active Run within the threshold

## Action

Trigger the sweep

## Expected Results

- Workspace A's Run becomes `aborted`
- Workspace B's Run remains `running`
- Each activity*log row carries the `workspace*id` of the Run it closed

## Test Design

```
@high @regression @automation-candidate @BK-269
Scenario: should scope sweep to Run own Workspace
  Given Workspace A with idle Run and Workspace B with active Run
  When the sweep executes
  Then Workspace A Run is closed
  And Workspace B Run remains running
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
