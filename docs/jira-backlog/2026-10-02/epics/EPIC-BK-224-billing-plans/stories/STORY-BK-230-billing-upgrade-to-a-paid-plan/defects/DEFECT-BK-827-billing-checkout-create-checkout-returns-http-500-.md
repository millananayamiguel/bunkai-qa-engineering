# DEFECT: Billing: Checkout: create-checkout returns HTTP 500 and leaks the raw internal error to the client when the payment processor is unconfigured

**Jira Key:** [BK-827](https://jira.upexgalaxy.com/browse/BK-827)
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

`POST /api/v1/workspaces/{workspaceId}/billing/checkout` responds ***HTTP 500**** with `error.code = internal*error` and an `error.message` that contains the raw internal reason ("The payment processor is not configured for this environment"), which the upgrade UI then renders verbatim in an inline error paragraph. The Stripe ****webhook**** route (`POST /api/v1/billing/webhook`) handles the **identical** unconfigured state correctly as ****HTTP 503 ***`payment*processor_unavailable` with no internal detail. So the same root condition produces an inconsistent status class across two routes, a 5xx for a deterministic known-configuration state, and internal-detail disclosure to an unauthenticated-of-detail client.

This is also the environment blocker for every real-payment test case on BK-230 (TC4 / TC9 / TC10 / TC11 / TC20 / TC21) — staging is missing `STRIPE*SECRET*KEY`, `STRIPE*WEBHOOK*SECRET` and `STRIPE*CLOUD*PRICE_ID`.

---

**STEPS TO REPRODUCE**

#### 1 - Precondition: authenticate as the owner of a `community` (Free) plan workspace on staging (`https://staging-upexbunkai.vercel.app`). Staging has no Stripe test-mode keys configured.
#### 2 - Navigate to `/settings/billing/upgrade`, choose "Upgrade to Cloud", leave the seat selector at its default (1).
#### 3 - Click "Continue to payment". The client issues `POST /api/v1/workspaces/{id}/billing/checkout` with body `{"seat_quantity":1}` and an `idempotency-key` header.
#### 4 - Observe the response: `HTTP 500 {"error":{"code":"internal*error","message":"Stripe checkout session creation failed: The payment processor is not configured for this environment.","request*id":"..."}}`. The UI shows that message verbatim in an inline error paragraph (no crash).
#### 5 - Compare: `POST /api/v1/billing/webhook` with a signature header but no secret configured returns `HTTP 503 payment*processor*unavailable` (generic, no internal detail).

---

**TECHNICAL ANALYSIS**

- **Route****:** `app/api/v1/workspaces/[id]/billing/checkout` (create-checkout) vs `app/api/v1/billing/webhook` (Stripe webhook receiver)
- **Network****:** create-checkout -> 500 `internal*error`, `message` carries the internal reason string; webhook -> 503 `payment*processor_unavailable`
- **Observed****:** the failed checkout DID insert a `billing*checkout*sessions` row, then the failure path transitioned it `open -> expired` (no stranded `one*open*per*workspace` lock); `stripe*checkout*session*id` stays NULL
- **Trigger****:** staging Vercel deploy missing `STRIPE*SECRET*KEY` / `STRIPE*WEBHOOK*SECRET` / `STRIPE*CLOUD*PRICE_ID` (ADR-0014). The code-level defect is the inconsistent + over-detailed error handling on the create-checkout route, independent of the environment gap.

---

**IMPACT**

- Any owner attempting an upgrade on a misconfigured environment sees a raw internal string instead of a friendly "payments temporarily unavailable" message.
- A 5xx for a deterministic configuration state pollutes error dashboards / alerting and masks genuine incidents.
- Internal environment/configuration detail is disclosed to the client.
- Blocks QA of the real-payment path for BK-230 (TC4/9/10/11/20/21) on staging.

---

**RELATED STORIES**

- Source: BK-230 (Billing | Upgrade to a paid plan)
- Epic (product area): BK-224 (Billing & Plans)

---

## 🐞 Actual Result

- `POST /api/v1/workspaces/{id}/billing/checkout` -> ***HTTP 500*** `{"error":{"code":"internal*error","message":"Stripe checkout session creation failed: The payment processor is not configured for this environment.","request*id":"..."}}`
- The upgrade UI renders that exact message in an inline error paragraph.
- The webhook route returns ***HTTP 503 ***`payment*processor*unavailable` for the same unconfigured condition — inconsistent.

---

## ✅ Expected Result

- A misconfigured / unavailable payment processor should produce a ***503**** (or 502) with a ****generic*** client-facing message (e.g. "Payments are temporarily unavailable, please try again later").
- The internal reason ("...not configured for this environment") should be logged server-side only, never returned in the response body.
- create-checkout and the webhook route should classify the identical condition consistently.

---

## 🔍 Root Cause

**Category:** Configuration Error 

---

## 🧫 Evidence

- Screenshot: `.context/PBI/epics/EPIC-BK-224-billing-plans/stories/STORY-BK-230-billing-upgrade-to-a-paid-plan/evidence/S2-smoke-upgrade-page.png`
- Session record: `.session/sprint-testing/BK-230/test-session-memory.md` (Stage 2 "Stripe readiness probe" + Finding 1)
- Reproduced 2026-09-01 on staging (`https://staging-upexbunkai.vercel.app`); ~11 manual attempts + a 5-way concurrent burst, all 500, sessions self-expired, 0 stranded locks.

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
