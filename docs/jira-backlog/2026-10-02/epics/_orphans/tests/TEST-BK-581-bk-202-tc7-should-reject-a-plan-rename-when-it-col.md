# TEST: BK-202: TC7: should reject a plan rename when it collides with another plan's name

**Jira Key:** [BK-581](https://jira.upexgalaxy.com/browse/BK-581)
**Status:** Candidate
**Components:** Bunkai Milestones

---

## Test Description

## Test Case: BK-202: TC7

| Field | Value |
| --- | --- |
| Related Story | BK-202 |
| Acceptance scenarios | 2.5 |
| Priority | high |
| ROI | 48 (F3 I4 S4 / E1 D1) |
| Verdict | Candidate |
| Test level | Integration (API + DB) |
| Prior bugs | none |

## Precondition

Plans "Release 2.4 regression" and "Smoke pass" exist

## Action

PATCH "Smoke pass" to "release 2.4 regression"

## Expected Results

409 duplicate message; rename not persisted

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
- **Labels:** automation-candidate, high, integration, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
