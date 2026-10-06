# ACCEPTANCE TEST RESULTS (ATR): ATR: BK-499: Story Testing

**Jira Key:** [BK-670](https://jira.upexgalaxy.com/browse/BK-670)
**Status:** ACTIVE
**Components:** Bunkai API Tokens

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

## Acceptance Test Results

Formal Test Execution item for [https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499](https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499), promoted from the Story's `Acceptance Test Results (QA)` field (written during `/sprint-testing` Stage 3, 2026-08-27) into a native Jira Test Execution issue during `/test-documentation` Stage 4.

***Environment***: Staging
***Tested***: 2026-08-27
***Tester***: Luis Eduardo Flores Villarroel
***Result***: PASSED WITH ISSUES — 14/15 outlines PASSED, 1 FAILED ([https://jira.upexgalaxy.com/browse/BK-623#icft=BK-623](https://jira.upexgalaxy.com/browse/BK-623#icft=BK-623), Low/Menor)

Full per-outline results, test data, and observations live in the Story's ATR field — see [BK-499](https://jira.upexgalaxy.com/browse/BK-499). This item exists so the Execution has its own trackable issue, linked to the ATP ("executes") and to each of the 15 Test Cases ("is executed by").

---

## Related Issues

- executes: [BK-672](https://jira.upexgalaxy.com/browse/BK-672) - BK-499: TC2: should reject token issuance given zero scopes requested
- executes: [BK-681](https://jira.upexgalaxy.com/browse/BK-681) - BK-499: TC11: should serve a capability-gated route to a browser session with no scope check
- executes: [BK-684](https://jira.upexgalaxy.com/browse/BK-684) - BK-499: TC14: should create project given PAT scoped atc:write and member role
- executes: [BK-677](https://jira.upexgalaxy.com/browse/BK-677) - BK-499: TC7: should succeed for any authenticated PAT regardless of scope given identity or notification route
- executes: [BK-678](https://jira.upexgalaxy.com/browse/BK-678) - BK-499: TC8: should reject Bearer PAT on DELETE workspace membership
- executes: [BK-683](https://jira.upexgalaxy.com/browse/BK-683) - BK-499: TC13: should accept viewer-role PAT holding required capability
- tests: [BK-499](https://jira.upexgalaxy.com/browse/BK-499) - PAT | Enforce capability scopes on read, identity and notification routes
- executes: [BK-674](https://jira.upexgalaxy.com/browse/BK-674) - BK-499: TC4: should return 403 given PAT missing atc:read
- executes: [BK-680](https://jira.upexgalaxy.com/browse/BK-680) - BK-499: TC10: should succeed via browser session on session-only routes
- executes: [BK-682](https://jira.upexgalaxy.com/browse/BK-682) - BK-499: TC12: should reject owner-role PAT missing required capability
- executes: [BK-685](https://jira.upexgalaxy.com/browse/BK-685) - BK-499: TC15: should reject given PAT missing atc:write checked before membership
- relates to: [BK-669](https://jira.upexgalaxy.com/browse/BK-669) - ATP: BK-499: PAT | Enforce capability scopes on read, identity and notification routes
- executes: [BK-673](https://jira.upexgalaxy.com/browse/BK-673) - BK-499: TC3: should return 200 with data given PAT scoped atc:read
- executes: [BK-675](https://jira.upexgalaxy.com/browse/BK-675) - BK-499: TC5: should reject given PAT scoped atc:write only on a read-gated route
- executes: [BK-676](https://jira.upexgalaxy.com/browse/BK-676) - BK-499: TC6: should pass given PAT holds required scope plus an unrelated extra scope
- executes: [BK-679](https://jira.upexgalaxy.com/browse/BK-679) - BK-499: TC9: should reject Bearer PAT on POST active-workspace with the browser-session message
- executes: [BK-671](https://jira.upexgalaxy.com/browse/BK-671) - BK-499: TC1: should create workspace given PAT holds at least one scope

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
_Source: Xray Test Execution [BK-670](https://jira.upexgalaxy.com/browse/BK-670) description · ATR · synced by sync-jira-issues_
