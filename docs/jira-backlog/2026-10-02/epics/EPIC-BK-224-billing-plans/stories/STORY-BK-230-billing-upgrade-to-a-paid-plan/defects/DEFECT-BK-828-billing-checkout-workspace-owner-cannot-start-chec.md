# DEFECT: Billing: Checkout: workspace owner cannot start checkout via API bearer/PAT token (403 "Missing required capability: workspace:admin")

**Jira Key:** [BK-828](https://jira.upexgalaxy.com/browse/BK-828)
**Related Story:** [BK-230](https://jira.upexgalaxy.com/browse/BK-230) - Billing | Upgrade to a paid plan
**Priority:** High
**Status:** In Review
**Components:** Bunkai Billing
**Severity:** Mayor
**Error Type:** Functional
**Test Environment:** Staging
**Fix Type:** Bugfix

---

## Description

**SUMMARY**

A workspace ***owner****, authenticating with an API ****bearer / PAT token****, is rejected from `POST /api/v1/workspaces/{id}/billing/checkout` with ****HTTP 403 ****`forbidden`**** "Missing required capability******:****** workspace******:******admin"**** for every workspace id (own, foreign, random, malformed). The ****same token**** passes the same-named capability gate on `GET /api/v1/workspaces/{id}/billing`. Only a browser ****cookie session*** as the owner can drive checkout. The behavior is fail-closed (safe) but internally inconsistent and it blocks API-level automation of AC2 / AC5.1.

---

**STEPS TO REPRODUCE**

#### 1 - Precondition: obtain a bearer token for a user who is the ***owner*** of a workspace (`bun run api:login staging`; the token user owns "Sir Tests A Lot").
#### 2 - `GET /api/v1/workspaces/{ownWorkspaceId}/billing` with `Authorization: Bearer <token>` -> ***200 OK*** (billing overview returned; capability gate passes).
#### 3 - `POST /api/v1/workspaces/{ownWorkspaceId}/billing/checkout` with the same header and body `{"seat_quantity":1}` -> ***403 ****`forbidden`**** "Missing required capability******:****** workspace******:******admin"***.
#### 4 - Repeat step 3 for a foreign / random / malformed workspace id -> same blanket 403 (the gate never distinguishes owner from non-owner for token auth).
#### 5 - Compare: a browser cookie session as the same owner reaches the create-checkout route and is stopped only by the Stripe env gap (500), not by authz.

---

**TECHNICAL ANALYSIS**

- **Route****:** `POST /api/v1/workspaces/[id]/billing/checkout` — capability check `workspace:admin`
- **Contrast****:** `GET /api/v1/workspaces/[id]/billing` accepts the same token under a same-named capability
- **Auth mechanisms exercised****:** cookie session (owner) -> passes authz; bearer/PAT (owner) -> 403; no-auth -> 401; garbage token -> 401 "Invalid token."
- **Assessment****:** the capability resolution for token principals does not grant `workspace:admin` (or owner-equivalent) on the checkout route even when the token's user is the workspace owner; it also fails to isolate owner vs non-owner (blanket 403), so it cannot be used as the owner-only server gate for AC5.2 either.

---

**IMPACT**

- Owners cannot initiate an upgrade through the public API / a PAT — only through the web UI.
- API-level regression automation of AC2 (successful upgrade) and AC5.1 (owner can complete) is not possible.
- Inconsistent capability behavior between GET billing and POST checkout is a latent source of confusion / future regressions.

---

**RELATED STORIES**

- Source: BK-230 (Billing | Upgrade to a paid plan)
- Epic (product area): BK-224 (Billing & Plans)

---

## 🐞 Actual Result

- Bearer/PAT token, user is the workspace ***owner****: `POST /api/v1/workspaces/{ownId}/billing/checkout` -> ****403 ***`forbidden` "Missing required capability: workspace:admin".
- Same token: `GET /api/v1/workspaces/{ownId}/billing` -> ***200 OK***.
- The 403 is identical for own / foreign / random / malformed workspace ids (no owner-vs-non-owner isolation).

---

## ✅ Expected Result

- An owner-scoped bearer/PAT token should be able to drive `POST .../billing/checkout` for a workspace it owns, matching the cookie session's behavior (reaching the Stripe step).
- The capability gate should behave consistently between `GET .../billing` and `POST .../billing/checkout`.
- For a non-owner token the route should return the owner-only rejection (`not*workspace*owner`), distinct from a generic capability error.

---

## 🔍 Root Cause

**Category:** Code Error

---

## 🧫 Evidence

- Session record: `.session/sprint-testing/BK-230/test-session-memory.md` (Stage 2 "API exploration" TC14 row + Finding 2; Stage 2b TC14 bearer-token leg)
- Reproduced 2026-09-01 on staging with `bun run api:login staging` + curl.

---

## Related Issues

- is caused by: [BK-230](https://jira.upexgalaxy.com/browse/BK-230) - Billing | Upgrade to a paid plan

---

## Metadata

- **Created:** 2026-09-01
- **Updated:** 2026-09-24
- **Reporter:** Carlos C
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_
