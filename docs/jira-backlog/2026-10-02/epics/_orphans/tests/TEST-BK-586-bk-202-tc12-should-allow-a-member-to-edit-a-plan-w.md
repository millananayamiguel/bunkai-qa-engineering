# TEST: BK-202: TC12: should allow a member to edit a plan when they did not create it

**Jira Key:** [BK-586](https://jira.upexgalaxy.com/browse/BK-586)
**Status:** Candidate
**Components:** Bunkai Milestones

---

## Test Description

## Test Case: BK-202: TC12

| Field | Value |
| --- | --- |
| Related Story | BK-202 |
| Acceptance scenarios | 4.3 |
| Priority | high |
| ROI | 6 (F3 I3 S4 / E2 D3) |
| Verdict | Candidate |
| Test level | Integration (API + DB) |
| Prior bugs | none |

## Precondition

Plan created by member A; member B in the same project

## Action

Member B PATCHes the description

## Expected Results

200; DB row updated

## Test Design

Gherkin lives in the Xray Cucumber definition of this Test (source of truth).

## Traceability

- Story: BK-202 · ATS: BK-1028 · ATP: BK-573 · ATR: BK-590
- Regression Test Plan: BK-831

> ***INFO:*** Needs a second member-role fixture.

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
- **Labels:** automation-candidate, high, integration, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
