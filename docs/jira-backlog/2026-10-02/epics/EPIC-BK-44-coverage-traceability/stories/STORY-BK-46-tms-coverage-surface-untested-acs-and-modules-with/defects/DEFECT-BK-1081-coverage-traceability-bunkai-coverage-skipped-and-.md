# DEFECT: Coverage & Traceability: Bunkai Coverage: skipped and blocked ATC runs count as executed coverage, so modules with nothing executed report Fully covered

**Jira Key:** [BK-1081](https://jira.upexgalaxy.com/browse/BK-1081)
**Related Story:** [BK-46](https://jira.upexgalaxy.com/browse/BK-46) - TMS-Coverage | Surface untested ACs and modules with not-run filter
**Priority:** High
**Status:** In Review
**Components:** Bunkai Coverage, Bunkai Metrics
**Severity:** Mayor
**Error Type:** Functional
**Test Environment:** Staging
**Fix Type:** Bugfix

---

## Description

## Summary

The coverage rollup treats ***every**** run result that is not `pending` as **executed coverage**. `skipped` and `blocked` are therefore counted as executed, so an acceptance criterion whose only ATC was never actually run is reported as covered, and its module is reported as ****Fully covered***.

This inverts the purpose of the story: the screen exists to surface gaps, and in this path it hides them.

## Steps to reproduce

1. Create a project with one module, one user story and one acceptance criterion.
2. Create an ATC linked to that acceptance criterion, and a Test containing it.
3. Start a Run for that Test, then ***abort*** it (`POST /api/v1/runs/{id}/abort`). The abort marks every not-yet-executed step `skipped`.
4. Read `GET /api/v1/projects/{id}/coverage`, or open `/projects/{slug}/metrics`.

Repeat with a step marked `blocked` instead of aborting the run.

## Reproduced on

Fixture project `BK-46 W3 Coverage Fixture` (`bk-46-w3-coverage-fixture`) on staging:

| Module | What happened to its only ATC | Reported status | Reported breakdown |
| --- | --- | --- | --- |
| M7 SkippedProbe | run aborted, zero steps executed | `fully_covered` | 1 executed, 0 never run |
| M8 BlockedProbe | step marked `blocked` | `fully_covered` | 1 executed, 0 never run |
| M2 NotRun (control) | never in any run | `not_run` | 0 executed, 1 never run |
| M3 FullyCovered (control) | step marked `passed` | `fully_covered` | 1 executed, 0 never run |

## Blast radius on real data

This is not an edge case on this instance. Querying the same predicate the RPC uses, across all projects on staging:

| Latest run status of the ATC | Acceptance criteria affected |
| --- | --- |
| `skipped` | ***130*** |
| `passed` | 11 |
| `failed` | 8 |
| `blocked` | 3 |

130 of the 152 acceptance criteria that have any run history at all are in the `skipped` bucket, so they are currently reported as executed coverage.

## Root cause

`bunkai*report*project_coverage` classifies per-AC state with:

```sql
bool*or(coalesce(ars.status, 'pending') = 'pending') as has*unrun
```

`run_atcs.status` is constrained to `pending | passed | failed | blocked | skipped`. Only `pending` is treated as not-executed, so `skipped` and `blocked` fall through into `executed`.

PO decision Q2 (2026-06-27) defined "fully covered" as `status != 'unrun'` against the old `atcs.status` column, whose vocabulary had no `skipped` or `blocked`. When the implementation correctly moved to real Run history it inherited a 5-value vocabulary that the 2-value decision never covered.

## Actual result

An acceptance criterion whose coverage was skipped or blocked is reported as executed, and its module is reported as `fully_covered` with zero gaps.

## Expected result

`skipped` and `blocked` mean the ATC was ***not*** executed. Both should classify the acceptance criterion as `not*run`, exactly like `pending`, so the module reports `not*run` rather than `fully_covered`. `failed` correctly stays `executed` (coverage and health are separate axes, per the PO's own note on Q2).

## Suggested fix

Treat the not-executed set as an explicit allowlist rather than "anything but pending":

```sql
bool*or(coalesce(ars.status, 'pending') in ('pending', 'skipped', 'blocked')) as has*unrun
```

## Notes

Filed as a ***Defect***, not a Bug: the feature reached `staging` via PR #93 (merge `c9155e7`) and has not crossed into a superior environment.

---

## 🐞 Actual Result

An acceptance criterion whose only linked ATC ended its most recent run as `skipped` (run aborted) or `blocked` is counted as ***executed coverage***. Its module is reported as `fully_covered` with "1 executed, 0 never run", although nothing was actually executed. On staging this currently affects 130 of the 152 acceptance criteria that have any run history.

---

## ✅ Expected Result

`skipped` and `blocked` mean the ATC was not executed, so the acceptance criterion should be classified `not*run` (exactly like `pending`) and the module should report `not*run`, not `fully_covered`. Only `passed` and `failed` are real executions.

---

## 🔍 Root Cause

**Category:** Code Error

---

## 🧫 Evidence

Screenshot: `.context/PBI/epics/EPIC-BK-44-coverage-traceability/stories/STORY-BK-46-tms-coverage-surface-untested-acs-and-modules-with/evidence/bug-01-ac-coverage-100pct-with-one-gap.png`

API payload showing M7/M8 as `fully_covered`: `evidence/api-coverage-payload.json`

UI snapshot of the module table: `evidence/10-metrics-coverage.yml`

Fixture project on staging: `bk-46-w3-coverage-fixture`, modules `M7 SkippedProbe` and `M8 BlockedProbe`.

---

## Related Issues

- created: [BK-46](https://jira.upexgalaxy.com/browse/BK-46) - TMS-Coverage | Surface untested ACs and modules with not-run filter
- is blocked by: [BK-46](https://jira.upexgalaxy.com/browse/BK-46) - TMS-Coverage | Surface untested ACs and modules with not-run filter

---

## Metadata

- **Created:** 2026-09-18
- **Updated:** 2026-09-24
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** bk-46, coverage, qa-found, sprint-4

---

_Synced from Jira by sync-jira-issues_
