# TEST: BK-202: TC8: should accept exactly one of two concurrent create requests for the same name

**Jira Key:** [BK-582](https://jira.upexgalaxy.com/browse/BK-582)
**Status:** Candidate
**Components:** Bunkai Milestones

---

## Test Description

## Test Case: BK-202: TC8

| Field | Value |
| --- | --- |
| Related Story | BK-202 |
| Acceptance scenarios | 2.6 |
| Priority | high |
| ROI | 10 (F3 I4 S5 / E3 D2) |
| Verdict | Candidate |
| Test level | Integration (API + DB) |
| Prior bugs | none |

## Precondition

No plan with the name exists yet

## Action

Fire two POSTs with the same name in parallel

## Expected Results

Exactly one 201 and one 409; one DB row (guarded by unique index on project_id, lower(name))

## Test Design

Gherkin lives in the Xray Cucumber definition of this Test (source of truth).

## Traceability

- Story: BK-202 · ATS: BK-1028 · ATP: BK-573 · ATR: BK-590
- Regression Test Plan: BK-831

> ***INFO:*** Flake-watch: keep both requests un-awaited until both are in flight.

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
