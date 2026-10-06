# TEST: BK-256: TC8: should navigate to the correct run's execution screen when Resume is clicked

**Jira Key:** [BK-855](https://jira.upexgalaxy.com/browse/BK-855)
**Status:** AUTOMATED
**Components:** Bunkai Runs

---

## Test Description

## Related Story
BK-256 — TMS-Home | Show active test runs summary and table

## Priority / ROI
- Priority: High
- ROI score: 16 (Freq4 x Impact4 x Stability4 / Effort2 x Dependencies2)
- Outcome: Candidate

## Prior bugs covered
- (none) first time

## Test Design

### Preconditions
- Home screen's resume action targets run `{run*id}`, selected by `started*at desc` with `id desc` as a documented, deterministic stable tie-break

### Action
QA Lead clicks Resume on the Home screen

### Expected Results
- Browser navigates to `/projects/{project*slug}/runs/{run*id}`
- The execution screen loaded is run `{run_id}`'s own screen, not any other active run

### Gherkin (Candidate)
```gherkin
@high @regression @automation-candidate @BK-256
Scenario: should navigate to the correct run's execution screen when Resume is clicked
  Given the Home screen's resume action targets run {run_id}
  When the QA Lead clicks Resume on the Home screen
  Then the browser navigates to "/projects/{project*slug}/runs/{run*id}"
```

## Variables
| Variable | How to obtain |
|----------|---------------|
| `{project*slug}` | `SELECT slug FROM projects WHERE id = (SELECT project*id FROM runs WHERE id = {run_id})` |

## Implementation Code (filled by test-automation)
| Layer | File |
|-------|------|
| API component | TBD |
| UI component | TBD (`components/home/ActiveRuns.tsx` resume link target) |
| Test file | TBD |
| Fixture | TBD |

## Architecture
E2E (UI navigation, distinct assertion from TC3 — verifies the navigation TARGET, not just that resume is clickable) — follows KATA layers.

## Available Test IDs (UI)
- `[data-testid="home-active-runs-resume"]`

## Refinement Notes
Corrected during original QA pass (2026-08-26): the tie-break is NOT database-engine luck as first assumed — `lib/home/active-runs.ts` sorts explicitly by `max(run*steps.executed*at)` (falling back to `started_at`), with `id desc` as a documented, deterministic stable tie-break. Non-blocking; noted here so automation asserts the real mechanism, not the originally-assumed one.


---

## Metadata

- **Created:** 2026-09-03
- **Updated:** 2026-09-21
- **Reporter:** Carlos C
- **Assignee:** Carlos C
- **Labels:** automated, high, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
