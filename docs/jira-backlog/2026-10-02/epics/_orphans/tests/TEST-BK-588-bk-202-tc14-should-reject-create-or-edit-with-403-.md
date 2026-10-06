# TEST: BK-202: TC14: should reject create or edit with 403 when the client-cached role is stale

**Jira Key:** [BK-588](https://jira.upexgalaxy.com/browse/BK-588)
**Status:** MANUAL
**Components:** Bunkai Milestones

---

## Test Description

## Test Case: BK-202: TC14

| Field | Value |
| --- | --- |
| Related Story | BK-202 |
| Acceptance scenarios | 4.5 |
| Priority | high |
| ROI | 3.1 (F2 I5 S5 / E4 D4), downgraded to Manual |
| Verdict | Manual |
| Test level | Integration (API + DB) |
| Prior bugs | none |

## Precondition

User loaded the app as member, then was demoted to viewer server-side

## Action

Submit create/edit from the stale client state without reloading

## Expected Results

403 from the live role check; nothing persisted

## Test Design

Gherkin lives in the Xray Cucumber definition of this Test (source of truth).

## Traceability

- Story: BK-202 · ATS: BK-1028 · ATP: BK-573 · ATR: BK-590
- Regression Test Plan: BK-831

> ***INFO:*** Manual: no API exists to change another member's role, so the demote needs a DB write role. Run before releases touching auth/RLS.

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
- **Labels:** high, integration, manual-only, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
