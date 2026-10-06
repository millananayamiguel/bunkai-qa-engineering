# TEST: BK-256: TC4: should exclude a run from the active table once its status becomes <status>

**Jira Key:** [BK-852](https://jira.upexgalaxy.com/browse/BK-852)
**Status:** AUTOMATED
**Components:** Bunkai Runs

---

## Test Description

## Related Story
BK-256 — TMS-Home | Show active test runs summary and table

## Priority / ROI
- Priority: High
- ROI score: 12 (Freq3 x Impact4 x Stability4 / Effort2 x Dependencies2)
- Outcome: Candidate

## Prior bugs covered
- (none) first time

## Test Design

Merges original ATP outlines TC4 (Finished) + TC6 (Aborted): same action + same expected outcome (excluded from active table), differing only in the precondition status — parametrized as one Scenario Outline per the 1:N parametrization rule (same-behavior data variants -> one Test).

### Preconditions
- Run `{run*id}` in workspace `{workspace*id}` transitions from `running` to `<status>`

### Action
QA Lead opens the Home screen

### Expected Results
- Run `{run_id}` no longer appears in the active runs table
- The active run count does not include `{run_id}`

### Gherkin (Candidate)
```gherkin
@high @regression @automation-candidate @BK-256
Scenario Outline: should exclude run from active table once status becomes <status>
  Given run {run*id} in workspace {workspace*id} transitions from running to <status>
  When the QA Lead opens the Home screen
  Then run {run_id} no longer appears in the active runs table
  And the active run count does not include {run_id}

  Examples:
    | status   |
    | Finished |
    | Aborted  |
```

## Variables
| Variable | How to obtain |
|----------|---------------|
| `{run*id}` | Run whose status is transitioned to `passed`/`failed` (Finished) or `aborted` via `bunkai*finish*run` / `bunkai*abort_run` RPCs |

## Implementation Code (filled by test-automation)
| Layer | File |
|-------|------|
| API component | TBD (`GET /api/v1/workspaces/{id}/active-runs`) |
| UI component | TBD |
| Test file | TBD |
| Fixture | TBD |

## Architecture
API + UI (state-transition check) — follows KATA layers.

## Available Test IDs (UI)
- `[data-testid="home-active-runs-table"]`
- `[data-testid="home-active-runs-count"]`

## Refinement Notes
Business Rule confirmed against source: `runs.status` constrained to `running | passed | failed | aborted` (no `blocked` run status — see TC5). "Finished" in the Business Rule maps to `status IN ('passed','failed')`, both terminal and both excluded identically to `aborted`. No divergence found (`implementation-plan.md` D1).


---

## Metadata

- **Created:** 2026-09-03
- **Updated:** 2026-09-21
- **Reporter:** Carlos C
- **Assignee:** Carlos C
- **Labels:** automated, high, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
