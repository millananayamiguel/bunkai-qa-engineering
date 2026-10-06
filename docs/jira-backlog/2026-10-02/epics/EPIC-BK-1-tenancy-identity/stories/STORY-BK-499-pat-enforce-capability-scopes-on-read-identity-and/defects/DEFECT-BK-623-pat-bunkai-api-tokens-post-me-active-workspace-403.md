# DEFECT: PAT: Bunkai API Tokens: POST /me/active-workspace 403 message omits "Use a browser session." required by AC5

**Jira Key:** [BK-623](https://jira.upexgalaxy.com/browse/BK-623)
**Related Story:** [BK-499](https://jira.upexgalaxy.com/browse/BK-499) - PAT | Enforce capability scopes on read, identity and notification routes
**Priority:** Low
**Status:** Closed
**Components:** Bunkai API Tokens
**Severity:** Menor
**Error Type:** Content
**Test Environment:** Staging
**Fix Type:** Bugfix

---

## Description

**SUMMARY**
`POST /me/active-workspace` correctly rejects every Bearer PAT with a 403 (the security mechanism is correct — no PAT ever bypasses the session-only guard), but the response message does not contain the literal phrase "Use a browser session." that AC5 requires for both session-only routes. The sibling route (`DELETE /workspaces/{id}/membership`) already carries that phrase; this route's message diverges.

---

**STEPS TO REPRODUCE**

#### Mint any Bearer PAT (any scope, any role — the guard rejects unconditionally).

#### Call `POST /me/active-workspace` with `Authorization: Bearer <PAT>`.

#### Observe the response body.

---

**TECHNICAL ANALYSIS**

- **File:** `app/api/v1/me/active-workspace/route.ts` (the route's `why:` string under its `auth: 'cookie-only'` config)
- **Function:** the declarative cookie-only guard, surfaced verbatim by `lib/api/handler.ts:56`
- **Network:** `POST /api/v1/me/active-workspace` -> `403 forbidden`

---

**IMPACT**

- Affected users: none functionally — the PAT is still correctly rejected either way, no security bypass exists.
- Blocked functionality: none.
- Business impact: minor API-consistency issue. An API consumer who reads the message from the sibling route (`DELETE /workspaces/{id}/membership`, which correctly says "Use a browser session.") may be confused that this route's message gives different guidance for the same class of rejection.

---

**RELATED STORIES**

- Related: [https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499](https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499)

---

## 🐞 Actual Result

HTTP 403 with body message: "Personal access tokens have no switchable active workspace. Pass workspace_id explicitly on each request instead." (no mention of browser session)

---

## ✅ Expected Result

HTTP 403 with a message containing the literal phrase "Use a browser session.", matching the sibling route DELETE /workspaces/{id}/membership (which correctly says "Personal access tokens cannot leave a workspace. Use a browser session.")

---

## 🔍 Root Cause

**Category:** Code Error

---

## 🚩 Workaround

None needed — the security mechanism is correct (every PAT rejected either way); this is a message-contract issue only.

---

## Related Issues

- is caused by: [BK-499](https://jira.upexgalaxy.com/browse/BK-499) - PAT | Enforce capability scopes on read, identity and notification routes
- is tested by: [BK-679](https://jira.upexgalaxy.com/browse/BK-679) - BK-499: TC9: should reject Bearer PAT on POST active-workspace with the browser-session message

---

## Metadata

- **Created:** 2026-08-27
- **Updated:** 2026-08-30
- **Reporter:** Luis Eduardo Flores Villarroel
- **Assignee:** Luis Eduardo Flores Villarroel
- **Labels:** api, defect, exploratory-testing

---

_Synced from Jira by sync-jira-issues_
