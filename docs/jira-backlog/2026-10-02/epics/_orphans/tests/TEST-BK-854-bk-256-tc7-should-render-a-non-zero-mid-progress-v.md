# TEST: BK-256: TC7: should render a non-zero mid-progress value while a run is still active

**Jira Key:** [BK-854](https://jira.upexgalaxy.com/browse/BK-854)
**Status:** AUTOMATED
**Components:** Bunkai Runs

---

## Test Description

## Related Story
BK-256 — TMS-Home | Show active test runs summary and table

## Priority / ROI
- Priority: Medium
- ROI score: 18 (Freq3 x Impact3 x Stability4 / Effort2 x Dependencies1)
- Outcome: Candidate

## Prior bugs covered
- (none) first time

## Test Design

### Preconditions
- Run `{run_id}` has status `running`
- Run `{run*id}` has `{done*steps}` of `{total*steps}` steps done, where `0 < done*steps < total_steps`

### Action
QA Lead opens the Home screen

### Expected Results
- Run `{run*id}`'s progress renders as `"{done*steps}/{total_steps}"`
- Run `{run*id}` remains listed as active even when `done*steps == total_steps`, as long as `status` is still `running` (status-driven, not completion-driven — Business Rule)

### Gherkin (Candidate)
```gherkin
@medium @regression @automation-candidate @BK-256
Scenario: should render non-zero mid-progress correctly while status remains active
  Given run {run_id} has status running
  And run {run*id} has {done*steps} of {total*steps} steps done, where 0 < done*steps < total_steps
  When the QA Lead opens the Home screen
  Then run {run*id}'s progress renders as "{done*steps}/{total_steps}"
```

## Variables
| Variable | How to obtain |
|----------|---------------|
| `{done*steps}` / `{total*steps}` | Batched `.in()` read of `run*atcs` / `run*steps` for `{run_id}` |

## Implementation Code (filled by test-automation)
| Layer | File |
|-------|------|
| API component | TBD |
| UI component | TBD |
| Test file | TBD |
| Fixture | TBD |

## Architecture
API + UI (boundary rendering) — follows KATA layers.

## Available Test IDs (UI)
- `[data-testid="home-active-runs-row-{run.id}"]`

## Refinement Notes
None. Source-confirmed (2026-08-26): run `1c158e83` showed `3/3` while `status` stayed `running` — a run can reach 100% step-completion and remain active until explicitly finished, per Business Rule.


---

## Metadata

- **Created:** 2026-09-03
- **Updated:** 2026-09-21
- **Reporter:** Carlos C
- **Assignee:** Carlos C
- **Labels:** automated, medium, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
