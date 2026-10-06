# DEFECT: BK-254: Bunkai Coverage: Coverage percentage rounds to a false 100%/0% extreme at scale

**Jira Key:** [BK-881](https://jira.upexgalaxy.com/browse/BK-881)
**Related Story:** [BK-259](https://jira.upexgalaxy.com/browse/BK-259) - TMS-Home | Show workspace test coverage summary
**Priority:** Medium
**Status:** In Review
**Components:** Bunkai Coverage
**Severity:** Moderada
**Error Type:** Functional
**Test Environment:** Staging
**Fix Type:** Bugfix

---

## Description

## Summary

The Home "Coverage" stat card's headline percentage (`ac*coverage*percent`, computed by `coveragePercent()` in `lib/home/coverage.ts`, shared with `GET /api/v1/workspaces/{id}/coverage`) rounds to a whole percent using `Math.round`. At scale this rounds to the literal extremes (100% or 0%) even when the workspace is NOT literally fully covered or fully uncovered — contradicting the breakdown chips shown on the same card.

## Steps to reproduce

Reproduced deterministically by calling the shipped function directly (same computation the UI and the API both use — no UI seeding required to prove the defect):

```
function coveragePercent(numerator, denominator) {
  if (denominator === 0) return null;
  return Math.round((numerator / denominator) * 100);
}

coveragePercent(199, 200) // -> 100   (1 of 200 ACs has NO test case bound)
coveragePercent(1, 201)   // -> 0     (1 of 201 ACs DOES have a test case bound)
```

Both are real, reachable workspace states (a workspace with ~200 acceptance criteria is a realistic mid-adoption scenario for this product).

## Where

- `lib/home/coverage.ts` — `coveragePercent()` (the shared rounding function)
- `app/api/v1/workspaces/[id]/coverage/route.ts` — publishes `ac*coverage*percent` computed the same way
- `components/home/CoverageSummary.tsx` — renders the headline percentage next to the 3-way breakdown chips

## Business impact

BK-259's AC1 exists so a QA Lead "can build a coverage story I trust." A headline that reads 100% while the adjacent "no coverage" chip reads 1 (or 0% while the "executed"/"awaiting execution" chip reads a nonzero count) is a visible self-contradiction on the same card, and undermines exactly the trust the story exists to build.

---

## 🐞 Actual Result

`coveragePercent(199, 200)` returns `100`. `coveragePercent(1, 201)` returns `0`. The headline can display a literal extreme (100% or 0%) while the workspace is demonstrably not at that extreme.

---

## ✅ Expected Result

***CONFIRMED policy (PO decision, 2026-09-05, during BK-259 sprint-testing Stage 2)******:***

- Display ***100%**** only when `ac*bound === ac*total` (every acceptance criterion literally has a test case bound). Any other case, even `ac*bound / ac*total` rounding to 99.5%+, must display ****99%*** at most.
- Display ***0%**** only when `ac*bound === 0` (nothing at all bound). Any other case where `ac*bound >= 1`, even if the raw ratio rounds below 0.5%, must display ****1%*** at minimum — 1% is the smallest unit of progress this card can represent, and showing 0% while real coverage exists is a false "nothing done" reading.

In other words: clamp the rounded value to `[1, 99]` whenever `0 < ac*bound < ac*total`, and only let `0` / `100` through when they are the literal, exact values.

Open question for Dev to resolve at fix time (not blocking this report): whether `executed*coverage*percent` (published on the API but not rendered as a headline on Home today) should get the same clamp for consistency, since it is computed by the same `coveragePercent()` function and any future consumer of that field would hit the identical illusion.

---

## 🔍 Root Cause

**Category:** Requirement Error

---

## 🧫 Evidence

Deterministic proof against the shipped function (no seeded workspace needed — the math is denominator-only):

```
$ bun -e "..."
200 -> 199/200 = 99.500% -> rounds to 100
201 -> 1/201   = 0.4975% -> rounds to 0
```

Verified interactively during BK-259 sprint-testing Stage 2 (2026-09-05), cross-checked against `lib/home/coverage.ts`'s live source in `upex-bunkai-tms`. Linked Xray Tests: BK-879 (TC14, high-end), BK-880 (TC15, low-end) — both FAILED.

---

## Related Issues

- is caused by: [BK-259](https://jira.upexgalaxy.com/browse/BK-259) - TMS-Home | Show workspace test coverage summary
- created by: [BK-878](https://jira.upexgalaxy.com/browse/BK-878) - ATR: BK-259: Story Testing
- created by: [BK-879](https://jira.upexgalaxy.com/browse/BK-879) - BK-259: TC14: should never read 100% unless every acceptance criterion is literally bound
- created by: [BK-880](https://jira.upexgalaxy.com/browse/BK-880) - BK-259: TC15: should never read 0% given at least one acceptance criterion is bound
- is blocked by: [BK-259](https://jira.upexgalaxy.com/browse/BK-259) - TMS-Home | Show workspace test coverage summary

---

## Metadata

- **Created:** 2026-09-05
- **Updated:** 2026-09-24
- **Reporter:** Luis Eduardo Flores Villarroel
- **Assignee:** Luis Eduardo Flores Villarroel

---

_Synced from Jira by sync-jira-issues_
