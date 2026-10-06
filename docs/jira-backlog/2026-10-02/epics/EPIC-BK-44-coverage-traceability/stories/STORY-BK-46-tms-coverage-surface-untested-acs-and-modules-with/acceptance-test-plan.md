# ACCEPTANCE TEST PLAN (ATP): ATP: BK-46: TMS-Coverage | Surface untested ACs and modules with not-run filter

**Jira Key:** [BK-1078](https://jira.upexgalaxy.com/browse/BK-1078)
**Status:** Completed
**Components:** Bunkai Coverage, Bunkai Metrics

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

# ATP — BK-46: TMS-Coverage | Surface untested ACs and modules with not-run filter

> Refined in-sprint (2026-09-17) from the 2026-06-26 shift-left draft. The draft's 20 outlines are preserved and collapsed into ***12 parameterized test cases*** — one artifact per equivalence partition, with the variants as `Examples` rows rather than as separate tests.

## Scope

`GET /api/v1/projects/{id}/coverage` and the Coverage section of `/projects/{slug}/metrics`. Test Set ***BK-1076*** holds the 12 tests; this plan and the execution derive their lists from it.

## Test cases

| TC | Key | Covers | Technique |
| --- | --- | --- | --- |
| TC1 | BK-1064 | Module status classification across all four states | Decision Table + State-Transition |
| TC2 | BK-1065 | Uncovered ACs itemized with story and module context | EP |
| TC3 | BK-1066 | Not-run filter selects only never-executed coverage | EP |
| TC4 | BK-1067 | Union rule on multi-ATC criteria (PO Q3) | Decision Table |
| TC5 | BK-1068 | Fully-covered indicator (PO Q2) | EP |
| TC6 | BK-1069 | KPI rollup consistent with the per-module breakdown | Invariant check |
| TC7 | BK-1070 | KPI percentage at the rounding output boundary | ***BVA on the derived value*** |
| TC8 | BK-1071 | Skipped / blocked coverage is not executed coverage | EP over the run-status domain |
| TC9 | BK-1072 | Access control and non-disclosure | Decision Table |
| TC10 | BK-1073 | Degenerate hierarchies (no stories, no ACs) | BVA (empty boundary) |
| TC11 | BK-1074 | Coverage reflects a newly linked ATC | State-Transition |
| TC12 | BK-1075 | Executed state visible on the screen after a real run | Integration |

## Coverage beyond the acceptance criteria

The three ACs are the floor. These were derived on top of them, and both defects found in this story came from this half of the plan:

- ***Run-status domain (TC8).*** The ACs assume a two-value world (`unrun` / not). The implementation reads real run history, whose domain is `pending | passed | failed | blocked | skipped`. Every value was partitioned and tested.
- ***Derived-value boundary (TC7).**** The KPI tiles round with `Math.round`, so input-boundary testing alone cannot catch a `100%` that hides a gap. Cases were derived at the ****output*** boundary: 200 of 201 bound.
- ***Non-disclosure (TC9).*** A real project in a foreign workspace must be indistinguishable from a missing one.
- ***Scope isolation.*** An ATC must only count as coverage inside its own project, and an AC may not be bound across user stories.

## Test data

One isolated fixture project on staging, `bk-46-w3-coverage-fixture`, with ten modules each engineered to land on a different coverage state, plus a 191-AC module for the rounding boundary. No pre-existing project data is read or mutated.

## Test-Design Checklist

| Check | Answer |
| --- | --- |
| P1 — beyond "every AC passes"? | Yes. TC7, TC8, TC9 are all risk-beyond-AC, and both defects came from them. |
| P2 — AC treated as the floor? | Yes. AC verdicts are reported separately from the probe results. |
| P3 — each case a concrete exploration? | Yes. Every case carries seeded data and an observed payload, not a restatement. |
| P4 — 1:N per non-trivial AC? | Yes. AC1 → TC1/TC2/TC11; AC2 → TC3/TC4/TC8; AC3 → TC5/TC1/TC8. No AC collapsed to one case. |
| P5 — boundary / exception / anomaly cases? | Yes. TC7 (rounding), TC10 (empty), TC9 (auth and foreign), TC8 (aborted and blocked runs). |
| EP — partitions identified? | Yes. Run-status domain fully partitioned; request-validity domain partitioned in TC9. |
| BVA — ranges and limits? | Yes. Empty module, empty project, 190/191 and 200/201 ratios. |
| BVA-D — rounding on a derived value? | Yes, and it found BK-1082. `percentLabel` uses `Math.round`, so cases sit at the output boundary. |
| ST — stateful entity? | Yes. AC coverage state moves uncovered → not_run → executed; TC11 and TC12 cover the transitions. |
| DT — 2+ interacting conditions? | Yes. TC1 (binding × run history), TC4 (per-ATC statuses), TC9 (auth × id validity × membership). |
| PW — 3+ combinable factors? | N/A. The factors collapse to two independent axes, so a decision table is exact and pairwise would only lose precision. |
| PARAM — same-behaviour variants collapsed? | Yes. 20 outlines became 12 parameterized Cucumber tests, variants as `Examples` rows. |
| RISK — prioritized, drops logged? | Yes. Nothing dropped. Live viewer-role verification was not performed (token minting is conductor-only in this run); the access contract was verified by its OpenAPI definition and by the RPC's membership assertion instead, and that limitation is stated rather than hidden. |

---

## Related Issues

- tests: [BK-46](https://jira.upexgalaxy.com/browse/BK-46) - TMS-Coverage | Surface untested ACs and modules with not-run filter

---

## Metadata

- **Created:** 2026-09-18
- **Updated:** 2026-09-18
- **Reporter:** Ely
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Plan [BK-1078](https://jira.upexgalaxy.com/browse/BK-1078) description · ATP · synced by sync-jira-issues_
