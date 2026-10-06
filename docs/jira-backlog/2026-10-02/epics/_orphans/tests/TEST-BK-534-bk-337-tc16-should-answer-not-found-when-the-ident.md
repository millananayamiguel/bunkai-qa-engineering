# TEST: BK-337: TC16: should answer not-found when the identifier is real but the URL names a different project

**Jira Key:** [BK-534](https://jira.upexgalaxy.com/browse/BK-534)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

> ***INFO:**** Promoted to the regression repository by `/test-documentation` Stage 4 on 2026-09-01. Verdict ****Candidate**** at ROI ****8.0***. Executed and PASSED in sprint on Test Execution BK-518.

## Traceability

| Axis | Value |
| --- | --- |
| Source Story | BK-337 TMS-Defect Detail | Open a defect and read its full record |
| Acceptance Criteria covered | AC E-3 |
| Acceptance Test Set | BK-541 |
| Acceptance Test Plan | BK-516 |
| Regression Test Plan | BK-831 |
| Feature Test Set | BK-402 |
| Supersedes | none |

## ROI

| Factor | Score | Reading |
| --- | --- | --- |
| Frequency | 3 | every release |
| Impact | 4 | a sibling project's slug reading another project's defect is a within-tenant leak |
| Stability | 4 | the re-check is an explicit criterion |
| Effort (divisor) | 2 | one page load |
| Dependencies (divisor) | 3 | needs a second project in the same workspace |

`ROI = (3 x 4 x 4) / (2 x 3) = 8.0`

## Why row-level security does not catch this

Both projects sit in the ***same workspace***, so the reader is entitled to the row and the row-level policy grants it. The only thing standing between the reader and a record belonging to a project the URL did not name is the page re-checking the resolved project against the record. If the route ever trusts the slug it was handed, this fails silently and nothing else in the stack notices.

This is the page leg only. The API route is keyed by identifier and never receives a slug, so it has nothing to re-check and needs no equivalent guard.

## Variables

| Variable | How to obtain |
| --- | --- |
| `bug_id` | `10000000-0000-4000-8000-000000000011`, owned by `new-project-example-qa2` |
| `other*project*slug` | `bk337-project-b-qa`, same workspace, holds no defect of its own |

## Expected results

Not-found surface under the wrong slug. The very same identifier still renders in full under its owning slug, which is what separates this from a broken route.

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
- **Labels:** automation-candidate, e2e, high, regression, security

---

_Synced from Jira by sync-jira-issues_
