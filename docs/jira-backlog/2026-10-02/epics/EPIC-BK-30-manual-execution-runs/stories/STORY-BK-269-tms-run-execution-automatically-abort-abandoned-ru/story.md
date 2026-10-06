# TMS-Run Execution | Automatically abort abandoned runs after inactivity

**Jira Key:** [BK-269](https://jira.upexgalaxy.com/browse/BK-269)
**Epic:** [BK-30](https://jira.upexgalaxy.com/browse/BK-30) (Manual Execution & Runs)
**Type:** Story
**Status:** Ready For Release
**Priority:** Medium
**Story Points:** 3

---

## Overview

1. 

1. 

*****As a***** QA Lead
*****I want to***** have abandoned test runs close themselves automatically once they have sat idle past a threshold
*****So that***** the active-run dashboard and the coverage and progress reports built on top of it reflect what is actually happening, not runs someone forgot to finish

1. 

- [ ] Feature works end-to-end against staging
- [ ] Covered by an ATC chain anchored to a User Story + Acceptance Criterion
- [ ] Acceptance Criteria verified by QA
- [ ] Demoed to the team

—

1. 

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Workflow](./workflow.md)
- [Mockup](./mockup.md)

—

1. 

> Refined Acceptance Criteria live in the acceptance_criteria field.

1. 

|  | Edge case  | Criticality  | Action  |
| --- | --- | --- |
| --- | ----------- | ------------- | -------- |
| 1  | Sweep-step mark race condition  | High  | NEEDS PO/DEV CONFIRMATION  |
| 2  | 0-step run (created but never started)  | High  | NEEDS PO/DEV CONFIRMATION  |
| 3  | Sweep fails mid-batch (server crash)  | Medium  | Confirm idempotency  |
| 4  | Threshold misconfigured to 0  | Low  | NEEDS PO/DEV CONFIRMATION  |
| 5  | Sweep updates updated*at causing self-reference  | High  | Confirm sweep uses finish*time  |
| 6  | Run blocked status (step blocked)  | Medium  | Confirm qualifies as inactive  |

1. 

- Sweep reuses existing abort logic from [https://jira.upexgalaxy.com/browse/BK-36#icft=BK-36](https://jira.upexgalaxy.com/browse/BK-36#icft=BK-36)
- System-generated reason must be visually distinguishable from person-typed reason
- Sweep runs across every workspace in a single pass
- Sweep is safe to run repeatedly (idempotent)

1. 

1. ****What is the default inactivity threshold value?****

- Context: Scope says configurable but Out-of-Scope defers choosing the value
- Impact if unanswered: Cannot design time-based test scenarios
- Suggested answer: 4 hours (from business-rules.md)

2. ****What is the exact system-generated reason text?****

- Context: AC7 says reason must be distinguishable
- Impact if unanswered: Cannot assert exact reason string
- Suggested answer: 'Automatically closed by sweep after {threshold}h of inactivity'

3. ****How is the sweep triggered — cron, serverless, or API call?****

- Context: Scope says scheduled sweep but doesn't specify mechanism
- Impact if unanswered: Cannot trigger sweep manually for testing
- Suggested answer: Cron job every 15 minutes

1. 

1. ****Which timestamp column is used for inactivity check — runs.updated*at or a dedicated last*step*activity*at?****
2. ****Does the sweep reuse the exact same abort logic as BK-36?****
3. ****What is the cascade behavior on sweep abort — same as manual abort?****

> Full refinement (Phases 1-5, outline DRAFT, risk + data feasibility) lives in the ATP DRAFT custom field and the canonical comment below.

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Workflow](./workflow.md)
- [Mockup](./mockup.md)
- [Implementation Plan (Dev)](./implementation-plan.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)
- [Acceptance Test Results (QA)](./acceptance-test-results.md)

---

## Traceability

### Tests (13)

- [BK-653](https://jira.upexgalaxy.com/browse/BK-653): BK-269: TC01: should close idle running Run _(READY)_
- [BK-654](https://jira.upexgalaxy.com/browse/BK-654): BK-269: TC02: should NOT close active Run within threshold _(READY)_
- [BK-655](https://jira.upexgalaxy.com/browse/BK-655): BK-269: TC03: should measure idle time from executed_at not updated_at _(READY)_
- [BK-656](https://jira.upexgalaxy.com/browse/BK-656): BK-269: TC04: should skip passed Run during sweep _(READY)_
- [BK-657](https://jira.upexgalaxy.com/browse/BK-657): BK-269: TC05: should be idempotent on already-swept Run _(READY)_
- [BK-658](https://jira.upexgalaxy.com/browse/BK-658): BK-269: TC06: should skip manually aborted Run with person reason _(READY)_
- [BK-659](https://jira.upexgalaxy.com/browse/BK-659): BK-269: TC07: should remove swept Run from widget _(READY)_
- [BK-660](https://jira.upexgalaxy.com/browse/BK-660): BK-269: TC08: should decrement widget count by one _(READY)_
- [BK-661](https://jira.upexgalaxy.com/browse/BK-661): BK-269: TC09: should show system reason with exact format _(READY)_
- [BK-662](https://jira.upexgalaxy.com/browse/BK-662): BK-269: TC10: should mark audit row system-originated _(READY)_
- [BK-663](https://jira.upexgalaxy.com/browse/BK-663): BK-269: TC11: should distinguish sweep vs person audit _(READY)_
- [BK-664](https://jira.upexgalaxy.com/browse/BK-664): BK-269: TC12: should scope sweep to own Workspace _(READY)_
- [BK-665](https://jira.upexgalaxy.com/browse/BK-665): BK-269: TC13: should close Run with 0 steps marked _(READY)_

### Test Execution (1)

- [BK-833](https://jira.upexgalaxy.com/browse/BK-833): ATR: BK-269: Automatically abort abandoned runs after inactivity _(Close)_

### Test Set (1)

- [BK-639](https://jira.upexgalaxy.com/browse/BK-639): ATS: BK-269: Automatically abort abandoned runs after inactivity _(Designing)_

---

## Metadata

- **Created:** 2026-08-05
- **Updated:** 2026-09-03
- **Reporter:** Ely
- **Assignee:** Gianluca Módena
- **Labels:** shift-left-2026-08-17, shift-left-reviewed

---

_Synced from Jira by sync-jira-issues_
