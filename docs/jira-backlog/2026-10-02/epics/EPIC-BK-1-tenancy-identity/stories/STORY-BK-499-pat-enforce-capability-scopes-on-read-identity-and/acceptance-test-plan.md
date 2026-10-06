# ACCEPTANCE TEST PLAN (ATP): ATP: BK-499: PAT | Enforce capability scopes on read, identity and notification routes

**Jira Key:** [BK-669](https://jira.upexgalaxy.com/browse/BK-669)
**Status:** Planning
**Components:** Bunkai API Tokens

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

## Acceptance Test Plan

Formal Test Plan item for [https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499](https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499), promoted from the Story's `Acceptance Test Plan (QA)` field (written during `/sprint-testing` Stage 1, 2026-08-25) into a native Jira Test Plan issue during `/test-documentation` Stage 4.

Full test-analysis content (24-handler code audit, sampling strategy, 15 outline definitions, test data) lives in the Story's ATP field — see [BK-499](https://jira.upexgalaxy.com/browse/BK-499). This item exists so the Plan has its own trackable issue and can be linked bidirectionally to the Test Execution (ATR) and to each of the 15 Test Cases ("designed by").

***Total outlines***: 15, all promoted to Candidate in Stage 4 ROI scoring (range 9-64, threshold 3.0).

---

## Related Issues

- designs: [BK-672](https://jira.upexgalaxy.com/browse/BK-672) - BK-499: TC2: should reject token issuance given zero scopes requested
- designs: [BK-681](https://jira.upexgalaxy.com/browse/BK-681) - BK-499: TC11: should serve a capability-gated route to a browser session with no scope check
- designs: [BK-684](https://jira.upexgalaxy.com/browse/BK-684) - BK-499: TC14: should create project given PAT scoped atc:write and member role
- designs: [BK-677](https://jira.upexgalaxy.com/browse/BK-677) - BK-499: TC7: should succeed for any authenticated PAT regardless of scope given identity or notification route
- designs: [BK-678](https://jira.upexgalaxy.com/browse/BK-678) - BK-499: TC8: should reject Bearer PAT on DELETE workspace membership
- designs: [BK-683](https://jira.upexgalaxy.com/browse/BK-683) - BK-499: TC13: should accept viewer-role PAT holding required capability
- tests: [BK-499](https://jira.upexgalaxy.com/browse/BK-499) - PAT | Enforce capability scopes on read, identity and notification routes
- designs: [BK-674](https://jira.upexgalaxy.com/browse/BK-674) - BK-499: TC4: should return 403 given PAT missing atc:read
- designs: [BK-680](https://jira.upexgalaxy.com/browse/BK-680) - BK-499: TC10: should succeed via browser session on session-only routes
- designs: [BK-682](https://jira.upexgalaxy.com/browse/BK-682) - BK-499: TC12: should reject owner-role PAT missing required capability
- designs: [BK-685](https://jira.upexgalaxy.com/browse/BK-685) - BK-499: TC15: should reject given PAT missing atc:write checked before membership
- designs: [BK-675](https://jira.upexgalaxy.com/browse/BK-675) - BK-499: TC5: should reject given PAT scoped atc:write only on a read-gated route
- designs: [BK-676](https://jira.upexgalaxy.com/browse/BK-676) - BK-499: TC6: should pass given PAT holds required scope plus an unrelated extra scope
- designs: [BK-679](https://jira.upexgalaxy.com/browse/BK-679) - BK-499: TC9: should reject Bearer PAT on POST active-workspace with the browser-session message
- relates to: [BK-670](https://jira.upexgalaxy.com/browse/BK-670) - ATR: BK-499: Story Testing
- designs: [BK-671](https://jira.upexgalaxy.com/browse/BK-671) - BK-499: TC1: should create workspace given PAT holds at least one scope
- designs: [BK-673](https://jira.upexgalaxy.com/browse/BK-673) - BK-499: TC3: should return 200 with data given PAT scoped atc:read

---

## Metadata

- **Created:** 2026-08-28
- **Updated:** 2026-08-31
- **Reporter:** Luis Eduardo Flores Villarroel
- **Assignee:** Unassigned
- **Labels:** regression

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Plan [BK-669](https://jira.upexgalaxy.com/browse/BK-669) description · ATP · synced by sync-jira-issues_
