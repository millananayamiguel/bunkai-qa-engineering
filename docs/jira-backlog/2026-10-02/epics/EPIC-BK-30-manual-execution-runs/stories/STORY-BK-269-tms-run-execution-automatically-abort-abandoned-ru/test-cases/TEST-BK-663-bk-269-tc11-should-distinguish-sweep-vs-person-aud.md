# TEST: BK-269: TC11: should distinguish sweep vs person audit

**Jira Key:** [BK-663](https://jira.upexgalaxy.com/browse/BK-663)
**Status:** READY
**Components:** None

---

## Test Description

## Related Story

[https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269](https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269): Automatically abort abandoned runs after inactivity

## Priority

Medium

## ROI

Frequency: Every release | Impact: Minor | Stability: Stable | Effort: Low | Dependencies: 1-2

## Preconditions

- One Run closed by sweep
- One Run aborted by a person

## Action

Compare both `activity_log` rows

## Expected Results

- Sweep row: `actor*user*id` = null, `payload->>'via'` = `sweep`
- Person row: `actor*user*id` = non-null, `payload->>'via'` = `cookie` or `bearer`

## Test Design

```
@medium @regression @automation-candidate @BK-269
Scenario: should distinguish sweep audit from person-abort audit
  Given one Run closed by sweep and one by person
  When both activity_log rows are compared
  Then sweep row has null actor and via="sweep"
  And person row has non-null actor and via="cookie" or "bearer"
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
