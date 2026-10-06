# ACCEPTANCE TEST RESULTS (ATR): ATR: BK-46: Story Testing

**Jira Key:** [BK-1077](https://jira.upexgalaxy.com/browse/BK-1077)
**Status:** Close
**Components:** Bunkai Coverage, Bunkai Metrics

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

# ATR — BK-46: TMS-Coverage | Surface untested ACs and modules with not-run filter

> ***NOTE:**** Verdict: ****FAILED*** — 10 of 12 test cases passed. Two defects block QA sign-off, both in the story's own core promise: surfacing coverage gaps.

## Run context

|  |  |
|  |
| Environment | ***Staging*** — `https://staging-upexbunkai.vercel.app` |
| Build under test | PR #93, merge commit `c9155e7` |
| Surfaces exercised | UI (`/projects/{slug}/metrics`) · API (`GET /api/v1/projects/{id}/coverage`) · DB (RPC `bunkai*report*project_coverage`) |
| Executed by | Ely (QA), fleet worker W3 |
| Test Plan | BK-1078 · Test Set BK-1076 · 12 tests |
| Date | 2026-09-17 |

This is the ***first*** execution of BK-46. The story had an ATP from the 2026-06-26 shift-left pass but no prior ATR.

## Fixture

The coverage view is meaningless without a hierarchy that exercises every state, so one isolated project was seeded on staging — `BK-46 W3 Coverage Fixture` (`bk-46-w3-coverage-fixture`) — with each module engineered to land on a different coverage status. No pre-existing project data was read or mutated.

| Module | Set-up | Expected | Observed |
| --- | --- | --- | --- |
| M1 Uncovered | 2 ACs, no ATC | `uncovered` | `uncovered` ✅ |
| M2 NotRun | 1 AC, 1 ATC, never run | `not*run` | `not*run` ✅ |
| M3 FullyCovered | 1 AC, 1 ATC, marked passed | `fully*covered` | `fully*covered` ✅ |
| M4 NoAcs | no user stories | `no*acs` | `no*acs` ✅ |
| M5 UnionRule | 1 AC, 2 ATCs (one passed, one never run) | `not*run` | `not*run` ✅ |
| M6 MixedPriority | AC1 unbound + AC2 executed | `uncovered` | `uncovered` ✅ |
| M7 SkippedProbe | 1 AC, 1 ATC, run ***aborted*** | `not*run` | `fully*covered` ❌ |
| M8 BlockedProbe | 1 AC, 1 ATC, step ***blocked*** | `not*run` | `fully*covered` ❌ |
| M9 FailedProbe | 1 AC, 1 ATC, marked failed | `fully*covered` | `fully*covered` ✅ |
| M10 BVA Boundary | 191 ACs, 190 bound | KPI must not read a clean 100% | ***KPI read 100%*** ❌ |

## Results

| TC | Title | Result |
| --- | --- | --- |
| BK-1064 | TC1: classify every module's coverage status | PASSED |
| BK-1065 | TC2: itemize each uncovered AC with story and module | PASSED |
| BK-1066 | TC3: not-run filter lists only never-executed coverage | PASSED |
| BK-1067 | TC4: union rule keeps an AC not-run | PASSED |
| BK-1068 | TC5: fully covered module reports no gaps | PASSED |
| BK-1069 | TC6: KPI rollup consistent with the breakdown | PASSED |
| BK-1070 | TC7: KPI must not read 100% beside a listed gap | ***FAILED*** → BK-1082 |
| BK-1071 | TC8: skipped/blocked must not count as executed | ***FAILED*** → BK-1081 |
| BK-1072 | TC9: access control and non-disclosure | PASSED |
| BK-1073 | TC10: degenerate states return a zeroed rollup | PASSED |
| BK-1074 | TC11: coverage reflects a newly linked ATC | PASSED |
| BK-1075 | TC12: executed state visible on the screen after a real run | PASSED |

## Acceptance criteria

| AC | Verdict |
| --- | --- |
| AC1 — list acceptance criteria with no ATC | ***PASS.*** Every uncovered AC is itemized with its acceptance criterion, user story and module context. An AC with any linked ATC is correctly excluded regardless of run status. |
| AC2 — filter to never-run coverage | ***PARTIAL.*** The filter itself is correct per module (5 of 10 modules shown, exactly those with never-run ACs). Two gaps: skipped/blocked coverage is wrongly excluded from it (BK-1081), and AC2's literal "criteria and modules" is delivered per module only (BK-1083). |
| AC3 — fully covered module | ***FAIL.*** Correct for `passed` and `failed`, but a module whose only ATC was skipped or blocked reports "fully covered with no gaps" (BK-1081). |

AC-conformance is the floor, not the verdict. Everything below the line was probed as well, and that is where both defects were found.

## Defects raised

| Key | Type | Severity | What |
| --- | --- | --- | --- |
| BK-1081 | Defect | Mayor | `skipped` and `blocked` ATC runs count as executed coverage, so modules with nothing executed report "Fully covered". Affects ***130 of the 152*** ACs with run history on staging. |
| BK-1082 | Defect | Moderada | The "AC coverage" KPI rounds to `100%` while the same screen lists an unbound acceptance criterion. |
| BK-1083 | Improvement | Moderada | The AC set does not specify run-status semantics, the KPI tiles, or the per-criteria not-run list. |

## Verified correct (no action needed)

Recorded so the next pass does not re-litigate these:

- ***Union rule (PO Q3)*** — one executed ATC does not clear a sibling that never ran.
- `fully_covered`*** (PO Q2)**** — requires linked **and* executed; `failed` correctly counts as executed, since coverage and health are separate axes.
- ***Project-scope isolation*** — an ATC only counts as coverage inside its own project.
- `ac*outside*user_story`*** guard*** — the API rejects binding an AC that belongs to another user story (HTTP 422).
- ***Non-disclosure*** — a real project in a workspace the caller is not a member of returns `404`, identical to a non-existent project. No existence leak. Unauthenticated `401`, malformed id `400`.
- ***Freshness*** — after marking a step passed, the executed and fully-covered state appears correctly on a reload and on in-app navigation, with no stale count. This was the developer's flagged priority, since the executed path had never been observed in a real browser. It renders correctly. The screen does not live-update without a reload, which no acceptance criterion requires.
- ***Performance*** — 0.46 s to 0.56 s over five sequential reads at 201 ACs across 10 modules. No budget is defined (see BK-1083).

## Traceability note

The direction of the three `Test` links between BK-46 and its ATS/ATP/ATR is ***held pending a ruling**** and is deliberately not asserted here. `bun xray trace` reports all four edges PASS, but that gate is under review for an inverted link-side mapping, so this ATR records that result as ****provisional****. Separately, this Jira instance already carries ****both*** link shapes on pre-existing stories (BK-512 and BK-508 one way, BK-497/498/499 the other), which is worth resolving project-wide.

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
_Source: Xray Test Execution [BK-1077](https://jira.upexgalaxy.com/browse/BK-1077) description · ATR · synced by sync-jira-issues_
