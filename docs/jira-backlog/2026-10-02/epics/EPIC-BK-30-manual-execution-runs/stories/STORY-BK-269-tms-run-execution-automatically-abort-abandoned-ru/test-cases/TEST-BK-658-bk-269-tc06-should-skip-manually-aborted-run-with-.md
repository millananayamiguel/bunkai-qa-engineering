# TEST: BK-269: TC06: should skip manually aborted Run with person reason

**Jira Key:** [BK-658](https://jira.upexgalaxy.com/browse/BK-658)
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

- Run exists in `aborted` status
- `abort_reason` contains a person-typed free-text reason
- Last activity older than 4 hours

## Action

Trigger the sweep

## Expected Results

- Status and `abort_reason` are unchanged
- Person's reason is never overwritten by system-generated text

## Test Design

```
@high @regression @automation-candidate @BK-269
Scenario: should skip a manually aborted Run with person-typed reason
  Given a Run in "aborted" status with a person-typed abort_reason
  When the sweep executes
  Then the abort_reason remains the person's original text
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
