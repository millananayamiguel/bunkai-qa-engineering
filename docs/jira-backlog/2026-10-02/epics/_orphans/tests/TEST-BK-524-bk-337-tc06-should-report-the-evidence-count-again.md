# TEST: BK-337: TC06: should report the evidence count against the ten-item cap at every boundary

**Jira Key:** [BK-524](https://jira.upexgalaxy.com/browse/BK-524)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

> ***INFO:**** Promoted to the regression repository by `/test-documentation` Stage 4 on 2026-09-01. Verdict ****Candidate**** at ROI ****8.0***. Executed and PASSED in sprint on Test Execution BK-518.

## Traceability

| Axis | Value |
| --- | --- |
| Source Story | BK-337 TMS-Defect Detail | Open a defect and read its full record |
| Acceptance Criteria covered | AC 3.1, 3.2, 3.3 |
| Acceptance Test Set | BK-541 |
| Acceptance Test Plan | BK-516 |
| Regression Test Plan | BK-831 |
| Feature Test Set | BK-402 |
| Supersedes | BK-525, BK-526 |

## ROI

| Factor | Score | Reading |
| --- | --- | --- |
| Frequency | 4 | every release |
| Impact | 3 | a wrong count misrepresents what evidence exists |
| Stability | 4 | the cap is a database check constraint, not a UI rule |
| Effort (divisor) | 2 | three page loads, all fixtures seeded |
| Dependencies (divisor) | 3 | needs three fixtures at distinct counts |

`ROI = (4 x 3 x 4) / (2 x 3) = 8.0`

## Technique

Boundary Value Analysis on the `0..10` range that `bunkai*bugs*check_consistency` enforces. The three rows are the lower boundary, a mid-range partition and the hard cap. `count = 11` is not testable through the product: the constraint rejects the row at filing time, so there is no state to render.

Three sprint Tests became one parameterized Test because the behaviour is identical across the three values; only the value changes. Splitting a single behaviour across its own boundary values inflates the repository without adding coverage.

## Variables

| Variable | How to obtain |
| --- | --- |
| `bug_id` at 0 | `10000000-0000-4000-8000-000000000012` |
| `bug_id` at 6 | `10000000-0000-4000-8000-000000000011` |
| `bug_id` at 10 | `10000000-0000-4000-8000-000000000013` |
| `count` | `array*length(evidence*urls, 1)`, coalesced to 0 |

## Expected results

Panel always present, never hidden. Reads `N / 10` at every count. Empty state at 0 only. No truncation and no show-more control at the cap.

---

## Related Issues

- is executed by: [BK-518](https://jira.upexgalaxy.com/browse/BK-518) - ATR: BK-337: Story Testing
- is designed by: [BK-516](https://jira.upexgalaxy.com/browse/BK-516) - ATP: BK-337: TMS-Defect Detail | Open a defect and read its full record

---

## Metadata

- **Created:** 2026-08-19
- **Updated:** 2026-09-02
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** automation-candidate, e2e, medium, regression

---

_Synced from Jira by sync-jira-issues_
