# TEST: BK-202: TC11: should return 403 when a viewer calls the create-plan API directly

**Jira Key:** [BK-585](https://jira.upexgalaxy.com/browse/BK-585)
**Status:** Candidate
**Components:** Bunkai Milestones

---

## Test Description

## Test Case: BK-202: TC11

| Field | Value |
| --- | --- |
| Related Story | BK-202 |
| Acceptance scenarios | 4.2 |
| Priority | critical |
| ROI | 16.7 (F4 I5 S5 / E2 D3) |
| Verdict | Candidate |
| Test level | Integration (API + DB) |
| Prior bugs | none |

## Precondition

Viewer-role user with a valid session

## Action

POST /api/v1/projects/{id}/test-plans bypassing the UI

## Expected Results

403 Forbidden; no plan created

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
