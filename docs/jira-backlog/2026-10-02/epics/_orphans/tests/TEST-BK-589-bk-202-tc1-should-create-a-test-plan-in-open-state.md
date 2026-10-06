# TEST: BK-202: TC1: should create a test plan in Open state with 0 tests when the name is valid and description and goal are optional

**Jira Key:** [BK-589](https://jira.upexgalaxy.com/browse/BK-589)
**Status:** Candidate
**Components:** Bunkai Milestones

---

## Test Description

## Test Case: BK-202: TC1

| Field | Value |
| --- | --- |
| Related Story | BK-202 |
| Acceptance scenarios | 1.1, 1.2 |
| Priority | high |
| ROI | 40 (F4 I5 S4 / E2 D1) |
| Verdict | Candidate |
| Test level | E2E (UI) |
| Prior bugs | none |
| Absorbs | BK-574 (minimal plan, name only) as an Examples row |

## Precondition

Member-role user signed in, viewing project > Test Plans

## Action

Submit the create dialog with the Examples data

## Expected Results

201 Created; row in test_plans with status Open and 0 tests; empty description/goal default to "" and the detail view renders without layout breakage

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
- **Labels:** automation-candidate, e2e, high, regression, regression-candidate, smoke

---

_Synced from Jira by sync-jira-issues_
