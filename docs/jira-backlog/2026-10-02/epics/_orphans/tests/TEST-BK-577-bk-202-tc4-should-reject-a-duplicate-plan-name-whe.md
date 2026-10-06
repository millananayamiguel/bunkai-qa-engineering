# TEST: BK-202: TC4: should reject a duplicate plan name when it differs only by case or surrounding spaces

**Jira Key:** [BK-577](https://jira.upexgalaxy.com/browse/BK-577)
**Status:** Candidate
**Components:** Bunkai Milestones

---

## Test Description

## Test Case: BK-202: TC4

| Field | Value |
| --- | --- |
| Related Story | BK-202 |
| Acceptance scenarios | 2.1, 2.2 |
| Priority | critical |
| ROI | 48 (F3 I4 S4 / E1 D1) |
| Verdict | Candidate |
| Test level | Integration (API + DB) |
| Prior bugs | none |
| Absorbs | BK-578 (leading/trailing ASCII spaces) as an Examples row |

## Precondition

A plan with the base name already exists in the project

## Action

POST a plan whose name normalizes to the existing one

## Expected Results

409 "A test plan with this name already exists."; no new row; original plan unaffected

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
- **Labels:** automation-candidate, critical, integration, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
