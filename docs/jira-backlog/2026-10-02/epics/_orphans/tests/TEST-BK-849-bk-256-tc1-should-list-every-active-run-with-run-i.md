# TEST: BK-256: TC1: should list every active run with run id, project, mode, status, progress and executor given 2+ projects have active runs

**Jira Key:** [BK-849](https://jira.upexgalaxy.com/browse/BK-849)
**Status:** AUTOMATED
**Components:** Bunkai Runs

---

## Test Description

## Related Story
BK-256 — TMS-Home | Show active test runs summary and table

## Priority / ROI
- Priority: Critical
- ROI score: 16.7 (Freq5 x Impact5 x Stability4 / Effort3 x Dependencies2)
- Outcome: Candidate

## Prior bugs covered
- (none) first time

## Test Design

### Preconditions
- Workspace has active runs (status=running) in 2+ different projects

### Action
QA Lead opens the Home screen

### Expected Results
- Active runs table lists every run currently in progress across all projects in the workspace
- Each row shows run identifier, project, execution mode, status, step-completion progress, and executor

### Gherkin (Candidate)
```gherkin
@critical @regression @automation-candidate @BK-256
Scenario: should list every active run across 2+ projects with all required columns
  Given the workspace {workspace_id} has active runs in at least 2 different projects
  When the QA Lead opens the Home screen
  Then the active runs table lists every one of those runs
  And each row shows run identifier, project, execution mode, status, step-completion progress and executor
```

## Variables
| Variable | How to obtain |
|----------|---------------|
| `{workspace_id}` | `SELECT id FROM workspaces WHERE slug = 'sir-tests-a-lot'` or via `POST /api/v1/auth/signin` session workspace context |

## Implementation Code (filled by test-automation)
| Layer | File |
|-------|------|
| API component | TBD (`lib/home/active-runs.ts` rollup) |
| UI component | TBD (`components/home/ActiveRuns.tsx`) |
| Test file | TBD |
| Fixture | TBD |

## Architecture
E2E (UI + API + DB) — follows KATA layers.

## Available Test IDs (UI)
- `[data-testid="home-active-runs"]`
- `[data-testid="home-active-runs-table"]`
- `[data-testid="home-active-runs-row-{run.id}"]`
- `[data-testid="home-active-runs-count"]`

## Refinement Notes
None. Source-verified against `lib/home/active-runs.ts` and `components/home/ActiveRuns.tsx` on 2026-09-03 — test-ids and endpoint shape match the ATP's original design exactly.


---

## Metadata

- **Created:** 2026-09-03
- **Updated:** 2026-09-21
- **Reporter:** Carlos C
- **Assignee:** Carlos C
- **Labels:** automated, critical, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
