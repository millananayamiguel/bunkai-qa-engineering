# TEST: BK-202: TC2: should accept a 100-character name and reject a 101-character name

**Jira Key:** [BK-575](https://jira.upexgalaxy.com/browse/BK-575)
**Status:** Candidate
**Components:** Bunkai Milestones

---

## Test Description

## Test Case: BK-202: TC2

| Field | Value |
| --- | --- |
| Related Story | BK-202 |
| Acceptance scenarios | 1.3, 1.4 |
| Priority | high |
| ROI | 36 (F3 I3 S4 / E1 D1) + prior bug |
| Verdict | Candidate |
| Test level | Integration (API + DB) |
| Prior bugs | BK-592 |

## Precondition

Member-role user, any project

## Action

POST a plan with a 100-char name, then a 101-char name

## Expected Results

100 chars: 201. 101 chars: 422 with copy "Name must be between 1 and 100 characters." and no DB row

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
- **Labels:** automation-candidate, high, integration, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
