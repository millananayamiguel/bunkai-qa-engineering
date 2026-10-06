# DEFECT: Coverage & Traceability: Bunkai Metrics: the AC coverage KPI rounds to 100% while the same screen still lists an unbound acceptance criterion

**Jira Key:** [BK-1082](https://jira.upexgalaxy.com/browse/BK-1082)
**Related Story:** [BK-46](https://jira.upexgalaxy.com/browse/BK-46) - TMS-Coverage | Surface untested ACs and modules with not-run filter
**Priority:** Medium
**Status:** In Review
**Components:** Bunkai Coverage, Bunkai Metrics
**Severity:** Moderada
**Error Type:** Functional
**Test Environment:** Staging
**Fix Type:** Bugfix

---

## Description

## Summary

The KPI tiles on the Coverage section round with `Math.round`, so a project with a real, listed coverage gap can display ***"AC coverage 100%"***. The same screen simultaneously lists the gap. A QA Lead reading the tile concludes there is nothing to chase.

## Steps to reproduce

1. Create a project with ***201*** acceptance criteria.
2. Bind ***200*** of them to an ATC. Leave exactly one unbound.
3. Open `/projects/{slug}/metrics` and read the Coverage section.

## Observed on staging

Fixture project `BK-46 W3 Coverage Fixture` (`bk-46-w3-coverage-fixture`), at `ac*bound = 200`, `ac*total = 201`:

| Surface | Value shown |
| --- | --- |
| "AC coverage" KPI tile | ***100%*** |
| Module table, row `M10 BVA Boundary` | `190 / 191` — "1 unbound of 191" — ***1 uncovered*** |
| "No coverage" panel | ***1 ACs*** — "Zero linked ATCs: nothing bound at all" |

200 / 201 = 99.5025%, and `Math.round` lifts it to 100%. The screen contradicts itself.

## Root cause

`lib/coverage/coverage-view.ts:155`

```ts
export function percentLabel(numerator: number, denominator: number): string {
  return `${Math.round((numerator / denominator) * 100)}%`;
}
```

Consumed twice in `components/coverage/ProjectCoverageView.tsx:115` and `:120`.

Any ratio at or above 0.995 renders as `100%`, so the tile reads clean from 200 criteria upward while up to one criterion in every 200 is unbound.

## The symmetric case

The same rounding hides the opposite end: with `ac*executed = 1` and `ac*total = 201`, "Executed coverage" renders `0%` even though one criterion genuinely has executed coverage (1/201 = 0.4975% → `0%`). Confirmed by the same fixture before the last run was recorded.

## Actual result

"AC coverage" reads `100%` while an unbound acceptance criterion is listed in the no-coverage panel on the same screen. Symmetrically, `0%` can be shown while executed coverage exists.

## Expected result

A KPI tile must never round to a clean `100%` while a gap is listed, nor to `0%` while coverage exists. Reserve the extremes for the exact states: show `100%` only when `numerator === denominator`, and `0%` only when `numerator === 0`; otherwise clamp (for example to `99%` / `1%`) or carry a decimal.

## Suggested fix

```ts
export function percentLabel(numerator: number, denominator: number): string {
  if (denominator === 0) return "—";
  if (numerator === denominator) return "100%";
  if (numerator === 0) return "0%";
  const raw = (numerator / denominator) * 100;
  return `${Math.min(99, Math.max(1, Math.round(raw)))}%`;
}
```

## Notes

Filed as a ***Defect***: the feature is on `staging` (PR #93, merge `c9155e7`) and has not reached a superior environment. No acceptance criterion mentions the KPI tiles at all, which is itself tracked separately as an Improvement on the AC set.

---

## 🐞 Actual Result

With `ac*bound = 200` and `ac*total = 201`, the "AC coverage" KPI tile renders ***100%**** while the module table shows "1 unbound of 191" and the "No coverage" panel lists ****1 ACs**** on the same screen. Symmetrically, 1 executed of 201 renders as ****0%***.

---

## ✅ Expected Result

A KPI percentage must never round into a clean extreme that contradicts the breakdown beside it: `100%` only when every criterion is bound, `0%` only when none is. Otherwise the value must be clamped or carry a decimal.

---

## 🔍 Root Cause

**Category:** Code Error

---

## 🧫 Evidence

Screenshot (tile reading 100% with the gap listed below it): `.context/PBI/epics/EPIC-BK-44-coverage-traceability/stories/STORY-BK-46-tms-coverage-surface-untested-acs-and-modules-with/evidence/bug-01-ac-coverage-100pct-with-one-gap.png`

UI snapshot: `evidence/11-bva-boundary.yml` (lines 361-368 KPI tiles, 462 module row, 473-475 no-coverage panel)

API payload: `evidence/api-coverage-payload-bva.json` (`ac*bound` 200 / `ac*total` 201)

Fixture: staging project `bk-46-w3-coverage-fixture`, module `M10 BVA Boundary`.

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
