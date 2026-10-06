# TEST: BK-202: TC9: should reject a blank plan name when it is empty or whitespace-only

**Jira Key:** [BK-583](https://jira.upexgalaxy.com/browse/BK-583)
**Status:** Candidate
**Components:** Bunkai Milestones

---

## Test Description

## Test Case: BK-202: TC9

| Field | Value |
| --- | --- |
| Related Story | BK-202 |
| Acceptance scenarios | 3.1, 3.2, 3.3 |
| Priority | critical |
| ROI | 48 + prior bug |
| Verdict | Candidate |
| Test level | Integration (API + DB) |
| Prior bugs | BK-592 |

## Precondition

Member-role user, any project

## Action

POST names "   ", "" and "\t\n"

## Expected Results

422 "Name must be between 1 and 100 characters." for every row; no DB row

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
- **Labels:** automation-candidate, critical, integration, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
