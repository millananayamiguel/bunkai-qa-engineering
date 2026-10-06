# TEST: BK-202: TC10: should hide the New plan option given a viewer-role user

**Jira Key:** [BK-584](https://jira.upexgalaxy.com/browse/BK-584)
**Status:** Candidate
**Components:** Bunkai Milestones

---

## Test Description

## Test Case: BK-202: TC10

| Field | Value |
| --- | --- |
| Related Story | BK-202 |
| Acceptance scenarios | 4.1 |
| Priority | critical |
| ROI | 8 (F3 I4 S4 / E2 D3) |
| Verdict | Candidate |
| Test level | E2E (UI) |
| Prior bugs | none |

## Precondition

Viewer-role user signed in

## Action

Open the project's Test Plans tab

## Expected Results

"New plan" is not rendered

## Test Design

Gherkin lives in the Xray Cucumber definition of this Test (source of truth).

## Traceability

- Story: BK-202 · ATS: BK-1028 · ATP: BK-573 · ATR: BK-590
- Regression Test Plan: BK-831

> ***INFO:*** Needs a viewer-role fixture before automation.

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
- **Labels:** automation-candidate, critical, e2e, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
