# TEST: BK-256: TC5: should show a run as blocked when one of its steps is blocked

**Jira Key:** [BK-853](https://jira.upexgalaxy.com/browse/BK-853)
**Status:** AUTOMATED
**Components:** Bunkai Runs

---

## Test Description

## Related Story
BK-256 — TMS-Home | Show active test runs summary and table

## Priority / ROI
- Priority: High
- ROI score: 6 (Freq3 x Impact4 x Stability3 / Effort3 x Dependencies2)
- Outcome: Candidate

## Prior bugs covered
- (none) first time

## Test Design

### Preconditions
- Run `{run_id}` has status `running`
- One of run `{run_id}`'s steps has status `blocked`

### Action
QA Lead opens the Home screen

### Expected Results
- Run `{run_id}` renders with a "Blocked" chip in the active runs table
- The underlying `runs.status` remains `running` — Blocked is a derived, presentation-only sub-state, never a `runs.status` value

### Gherkin (Candidate)
```gherkin
@high @regression @automation-candidate @BK-256
Scenario: should show a run as blocked when one of its steps is marked blocked
  Given run {run_id} has status running
  And one of run {run_id}'s steps has status blocked
  When the QA Lead opens the Home screen
  Then run {run_id} renders with a Blocked chip in the active runs table
  And the underlying run status remains running
```

## Variables
| Variable | How to obtain |
|----------|---------------|
| `{run*id}` | Run with `runs.status='running'` and one `run*steps.status='blocked'` row |

## Implementation Code (filled by test-automation)
| Layer | File |
|-------|------|
| API component | TBD (`lib/home/active-runs.ts`, `run_steps` batched read) |
| UI component | TBD (status-chip grammar, `app/globals.css` `.status-chip[data-status]`) |
| Test file | TBD |
| Fixture | TBD |

## Architecture
API + DB (derived sub-state) + UI (chip rendering) — follows KATA layers.

## Available Test IDs (UI)
- `[data-testid="home-active-runs-row-{run.id}"]`

## Refinement Notes
Confirmed directly against source and DB during original QA pass (2026-08-26): `run a90ecfd9` had `runs.status='running'` with one `run_steps.status='blocked'` -> API correctly returned `"state":"blocked"`. Matches implementation-plan.md D2 exactly.


---

## Metadata

- **Created:** 2026-09-03
- **Updated:** 2026-09-21
- **Reporter:** Carlos C
- **Assignee:** Carlos C
- **Labels:** automated, high, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
