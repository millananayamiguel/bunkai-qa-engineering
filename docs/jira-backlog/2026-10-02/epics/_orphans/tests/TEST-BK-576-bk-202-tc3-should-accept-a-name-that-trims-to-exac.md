# TEST: BK-202: TC3: should accept a name that trims to exactly 1 character

**Jira Key:** [BK-576](https://jira.upexgalaxy.com/browse/BK-576)
**Status:** Candidate
**Components:** Bunkai Milestones

---

## Test Description

## Test Case: BK-202: TC3

| Field | Value |
| --- | --- |
| Related Story | BK-202 |
| Acceptance scenarios | 1.5 |
| Priority | medium |
| ROI | 36 (F3 I3 S4 / E1 D1) |
| Verdict | Candidate |
| Test level | Integration (API + DB) |
| Prior bugs | none |

## Precondition

Member-role user, any project

## Action

POST a plan named " A "

## Expected Results

201 Created; stored name is "A"

## Test Design

Gherkin lives in the Xray Cucumber definition of this Test (source of truth).

## Traceability

- Story: BK-202 · ATS: BK-1028 · ATP: BK-573 · ATR: BK-590
- Regression Test Plan: BK-831

---

## Related Issues

- is designed by: [BK-573](https://jira.upexgalaxy.com/browse/BK-573) - ATP: BK-202: TMS-Test Plan | Create a test plan grouping tests for a goal
- is executed by: [BK-590](https://jira.upexgalaxy.com/browse/BK-590) - ATR: BK-202: Story Testing

---

## Metadata

- **Created:** 2026-08-21
- **Updated:** 2026-09-22
- **Reporter:** Alfonso Hernandez
- **Assignee:** Alfonso Hernandez
- **Labels:** automation-candidate, integration, medium, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
