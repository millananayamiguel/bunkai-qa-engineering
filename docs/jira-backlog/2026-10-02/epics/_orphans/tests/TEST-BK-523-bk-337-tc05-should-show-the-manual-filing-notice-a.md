# TEST: BK-337: TC05: should show the manual-filing notice and exactly six Details rows when the defect has no run provenance

**Jira Key:** [BK-523](https://jira.upexgalaxy.com/browse/BK-523)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

> ***INFO:**** Promoted to the regression repository by `/test-documentation` Stage 4 on 2026-09-01. Verdict ****Candidate**** at ROI ****12.0***. Executed and PASSED in sprint on Test Execution BK-518.

## Traceability

| Axis | Value |
| --- | --- |
| Source Story | BK-337 TMS-Defect Detail | Open a defect and read its full record |
| Acceptance Criteria covered | AC 2.1 |
| Acceptance Test Set | BK-541 |
| Acceptance Test Plan | BK-516 |
| Regression Test Plan | BK-831 |
| Feature Test Set | BK-402 |
| Supersedes | none |

## ROI

| Factor | Score | Reading |
| --- | --- | --- |
| Frequency | 4 | every release, and every change to the Origin panel |
| Impact | 3 | a standalone defect reading as an error state misleads triage |
| Stability | 4 | rule written down in the Business Rules field |
| Effort (divisor) | 2 | one page load, one seeded fixture |
| Dependencies (divisor) | 2 | standalone fixture only |

`ROI = (4 x 3 x 4) / (2 x 2) = 12.0`

## The distinction under guard

The Business Rules field states it plainly: "filed manually" and "the originating run is no longer available" are two different states. Provenance foreign keys null out on delete, so a deleted run leaves exactly the same null columns a manual filing does. If the record ever shows the manual notice for a deleted run, it asserts something false about how the defect was created.

This Test pins the manual case. The deleted-run case has no storage to distinguish it today, which was raised as edge case #1 in the Shift-Left refinement and is not resolved in this Story.

## Variables

| Variable | How to obtain |
| --- | --- |
| `bug_id` | seeded standalone fixture `10000000-0000-4000-8000-000000000012` |
| `project_slug` | `new-project-example-qa2` |

## Expected results

Origin panel shows an informational "Filed manually" notice. Details panel renders exactly six rows and no more: severity, status, module path, reporter, filed date, assignee. The layer and environment rows were struck by the Product Owner's Q2 ruling and must not reappear.

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
