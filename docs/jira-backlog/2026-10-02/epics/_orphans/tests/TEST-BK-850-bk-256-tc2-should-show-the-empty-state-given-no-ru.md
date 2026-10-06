# TEST: BK-256: TC2: should show the empty state given no run in the workspace is active

**Jira Key:** [BK-850](https://jira.upexgalaxy.com/browse/BK-850)
**Status:** AUTOMATED
**Components:** Bunkai Runs

---

## Test Description

## Related Story
BK-256 — TMS-Home | Show active test runs summary and table

## Priority / ROI
- Priority: High
- ROI score: 60 (Freq4 x Impact3 x Stability5 / Effort1 x Dependencies1)
- Outcome: Candidate

## Prior bugs covered
- (none) first time

## Test Design

### Preconditions
- No run in the workspace has status running or blocked

### Action
QA Lead opens the Home screen

### Expected Results
- Active runs table shows an empty state indicating nothing is running right now

### Gherkin (Candidate)
```gherkin
@high @regression @automation-candidate @BK-256
Scenario: should show empty state when no run in the workspace is active
  Given no run in the workspace {workspace_id} has status running or blocked
  When the QA Lead opens the Home screen
  Then the active runs table shows an empty state indicating nothing is running right now
```

## Variables
| Variable | How to obtain |
|----------|---------------|
| `{workspace_id}` | `SELECT id FROM workspaces WHERE slug = 'sir-tests-a-lot'` |

## Implementation Code (filled by test-automation)
| Layer | File |
|-------|------|
| API component | TBD |
| UI component | TBD (`components/home/ActiveRuns.tsx`) |
| Test file | TBD |
| Fixture | TBD |

## Architecture
UI-only (empty-state render) — follows KATA layers.

## Available Test IDs (UI)
- `[data-testid="home-active-runs-empty"]`

## Refinement Notes
None. Matches source (`ActiveRuns.tsx:93`).


---

## Metadata

- **Created:** 2026-09-03
- **Updated:** 2026-09-21
- **Reporter:** Carlos C
- **Assignee:** Carlos C
- **Labels:** automated, high, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
