# TEST: BK-269: TC09: should show system reason with exact format

**Jira Key:** [BK-661](https://jira.upexgalaxy.com/browse/BK-661)
**Status:** READY
**Components:** None

---

## Test Description

## Related Story

[https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269](https://jira.upexgalaxy.com/browse/BK-269#icft=BK-269): Automatically abort abandoned runs after inactivity

## Priority

Medium

## ROI

Frequency: Every release | Impact: Minor | Stability: Stable | Effort: Trivial | Dependencies: None

## Preconditions

- Run closed by sweep at 4-hour threshold

## Action

Read `abort_reason`

## Expected Results

- Exact match: `Auto-closed by inactivity sweep: no step activity for 4h (closed {YYYY-MM-DD HH:MM} UTC)`
- Prefix distinguishes it from any free-text reason a person typed

## Test Design

```
@medium @regression @automation-candidate @BK-269
Scenario: should show system-generated reason with exact format
  Given a Run closed by sweep at 4h threshold
  When the abort_reason is read
  Then it matches "Auto-closed by inactivity sweep: no step activity for 4h (closed {YYYY-MM-DD HH:MM} UTC)"
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
