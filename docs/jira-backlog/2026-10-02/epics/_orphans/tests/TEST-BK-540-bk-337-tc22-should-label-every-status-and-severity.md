# TEST: BK-337: TC22: should label every status and severity chip with text alongside its colour

**Jira Key:** [BK-540](https://jira.upexgalaxy.com/browse/BK-540)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

> ***INFO:**** Promoted to the regression repository by `/test-documentation` Stage 4 on 2026-09-01. Verdict ****Candidate**** at ROI ****4.0***. Executed and PASSED in sprint on Test Execution BK-518.

## Traceability

| Axis | Value |
| --- | --- |
| Source Story | BK-337 TMS-Defect Detail | Open a defect and read its full record |
| Acceptance Criteria covered | risk beyond the written ACs |
| Acceptance Test Set | BK-541 |
| Acceptance Test Plan | BK-516 |
| Regression Test Plan | BK-831 |
| Feature Test Set | BK-402 |
| Supersedes | none |

## ROI

| Factor | Score | Reading |
| --- | --- | --- |
| Frequency | 4 | every release |
| Impact | 2 | chips are how a triager reads severity and status at a glance |
| Stability | 4 | the enums are stable |
| Effort (divisor) | 2 | one page load per status |
| Dependencies (divisor) | 4 | needs four fixtures pinned at distinct statuses |

`ROI = (4 x 2 x 4) / (2 x 4) = 4.0`

## Scope, and what was handed off

State coverage of the bug status lifecycle and of the full severity enum. What this Test guards is that the ***label text exists at all***, so the record stays readable when colour is unavailable or not perceived.

The colour half of the concern is an explicit handoff, not a silent drop: contrast ratio, focus order and screen-reader naming belong to the app-level accessibility suite, not to a per-feature Test. If no such suite exists yet, that is a gap worth filing rather than something to smuggle into this Test.

> ***ERROR:**** Automation blocker. Bug statuses are forward-only, enforced by `bunkai*bugs*check_consistency`. Cycling one fixture through the four statuses burns it permanently, which is exactly what happened to fixture `...013` during sprint execution. This Test needs ****four fixtures pinned at distinct statuses***, seeded fresh, not one fixture advanced four times.

## Variables

| Variable | How to obtain |
| --- | --- |
| `fixture*status*open` .. `fixture*status*closed` | four bugs seeded at `open`, `in_progress`, `resolved`, `closed` respectively; not yet created |
| `severity` | the `P1..P4` enum on the `bugs` table |

## Expected results

Every status chip and every severity chip carries its value as text alongside its colour. Neither conveys its value by colour alone.

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
