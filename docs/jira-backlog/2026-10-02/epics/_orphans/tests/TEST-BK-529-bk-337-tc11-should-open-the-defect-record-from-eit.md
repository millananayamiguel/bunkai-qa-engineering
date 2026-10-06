# TEST: BK-337: TC11: should open the defect record from either the Bug cell or the Run cell of the defects list

**Jira Key:** [BK-529](https://jira.upexgalaxy.com/browse/BK-529)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

> ***INFO:**** Promoted to the regression repository by `/test-documentation` Stage 4 on 2026-09-01. Verdict ****Candidate**** at ROI ****9.0***. Executed and PASSED in sprint on Test Execution BK-518.

## Traceability

| Axis | Value |
| --- | --- |
| Source Story | BK-337 TMS-Defect Detail | Open a defect and read its full record |
| Acceptance Criteria covered | AC 5.1, 5.2 |
| Acceptance Test Set | BK-541 |
| Acceptance Test Plan | BK-516 |
| Regression Test Plan | BK-831 |
| Feature Test Set | BK-402 |
| Supersedes | BK-530 |

## ROI

| Factor | Score | Reading |
| --- | --- | --- |
| Frequency | 4 | every release; the defects list changes often |
| Impact | 3 | a dead cell strands the reader with no route into the record |
| Stability | 3 | the list surface is under active development |
| Effort (divisor) | 2 | two clicks on one seeded row |
| Dependencies (divisor) | 2 | one run-linked fixture visible in the list |

`ROI = (4 x 3 x 3) / (2 x 2) = 9.0`

## The assertion that carries the value

Both cells landing on the record is the easy half. The load-bearing assertion is the negative one: the ***Run cell must not open the run report***. That was decided on BK-337 on 2026-08-10 and it is counter-intuitive enough that a future developer will reasonably assume the opposite. The Origin panel inside the record is the single route onward to the run.

BK-530 held the Run-cell leg as a separate Test. One behaviour, one variable, so one parameterized Test.

## Variables

| Variable | How to obtain |
| --- | --- |
| `bug_id` | `10000000-0000-4000-8000-000000000011`, visible in the defects list |
| `project_slug` | `new-project-example-qa2` |
| `cell` | the `Bug` and `Run` columns of the defects-list row |

## Expected results

Both cells resolve to `/projects/{slug}/bugs/{bugId}` for the same defect. Neither resolves to the run report. Before this Story the Run reference rendered as plain text with no link at all.

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
- **Labels:** automation-candidate, e2e, high, regression

---

_Synced from Jira by sync-jira-issues_
