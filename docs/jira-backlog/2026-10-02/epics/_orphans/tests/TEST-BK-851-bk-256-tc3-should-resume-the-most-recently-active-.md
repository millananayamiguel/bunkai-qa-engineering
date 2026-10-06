# TEST: BK-256: TC3: should resume the most recently active run from Home

**Jira Key:** [BK-851](https://jira.upexgalaxy.com/browse/BK-851)
**Status:** AUTOMATED
**Components:** Bunkai Runs

---

## Test Description

## Related Story
BK-256 — TMS-Home | Show active test runs summary and table

## Priority / ROI
- Priority: Critical
- ROI score: 25 (Freq5 x Impact5 x Stability4 / Effort2 x Dependencies2)
- Outcome: Candidate

## Prior bugs covered
- (none) first time

## Test Design

### Preconditions
- Workspace has at least one run currently in progress
- Run `{run*id}` is the most recently started active run (`started*at desc`)

### Action
QA Lead clicks the resume action on the Home screen

### Expected Results
- QA Lead is taken directly into run `{run_id}`'s execution flow, without opening the project individually

### Gherkin (Candidate)
```gherkin
@critical @regression @automation-candidate @BK-256
Scenario: should resume the most recently active run directly from Home
  Given the workspace {workspace_id} has at least one run currently in progress
  And run {run_id} is the most recently started active run
  When the QA Lead clicks the resume action on the Home screen
  Then he is taken directly into run {run_id}'s execution flow
```

## Variables
| Variable | How to obtain |
|----------|---------------|
| `{run*id}` | `SELECT id FROM runs WHERE workspace*id = {workspace*id} AND status = 'running' ORDER BY started*at DESC LIMIT 1` |

## Implementation Code (filled by test-automation)
| Layer | File |
|-------|------|
| API component | TBD |
| UI component | TBD (`components/home/ActiveRuns.tsx`) |
| Test file | TBD |
| Fixture | TBD |

## Architecture
E2E (UI navigation) — follows KATA layers.

## Available Test IDs (UI)
- `[data-testid="home-active-runs-resume"]`

## Refinement Notes
None. Matches source (`ActiveRuns.tsx:78`).


---

## Metadata

- **Created:** 2026-09-03
- **Updated:** 2026-09-21
- **Reporter:** Carlos C
- **Assignee:** Carlos C
- **Labels:** automated, critical, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
