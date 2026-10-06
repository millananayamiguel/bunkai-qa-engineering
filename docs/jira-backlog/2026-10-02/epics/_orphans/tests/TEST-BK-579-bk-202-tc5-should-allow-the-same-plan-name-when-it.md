# TEST: BK-202: TC5: should allow the same plan name when it is reused in a different project

**Jira Key:** [BK-579](https://jira.upexgalaxy.com/browse/BK-579)
**Status:** Candidate
**Components:** Bunkai Milestones

---

## Test Description

## Test Case: BK-202: TC5

| Field | Value |
| --- | --- |
| Related Story | BK-202 |
| Acceptance scenarios | 2.3 |
| Priority | medium |
| ROI | 9 (F3 I3 S4 / E2 D2) |
| Verdict | Candidate |
| Test level | Integration (API + DB) |
| Prior bugs | none |

## Precondition

Plan "Smoke pass" exists in project A; member of project B

## Action

POST "Smoke pass" in project B

## Expected Results

201 Created; uniqueness is per project

## Test Design

Gherkin lives in the Xray Cucumber definition of this Test (source of truth).

## Traceability

- Story: BK-202 · ATS: BK-1028 · ATP: BK-573 · ATR: BK-590
- Regression Test Plan: BK-831

---

## Related Issues

- is executed by: [BK-590](https://jira.upexgalaxy.com/browse/BK-590) - ATR: BK-202: Story Testing
- is designed by: [BK-573](https://jira.upexgalaxy.com/browse/BK-573) - ATP: BK-202: TMS-Test Plan | Create a test plan grouping tests for a goal

---

## Metadata

- **Created:** 2026-08-21
- **Updated:** 2026-09-22
- **Reporter:** Alfonso Hernandez
- **Assignee:** Alfonso Hernandez
- **Labels:** automation-candidate, integration, medium, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
