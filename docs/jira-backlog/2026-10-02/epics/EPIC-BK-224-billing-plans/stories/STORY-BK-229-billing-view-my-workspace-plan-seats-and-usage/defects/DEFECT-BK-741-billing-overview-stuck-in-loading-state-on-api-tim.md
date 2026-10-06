# DEFECT: Billing overview stuck in loading state on API timeout (>10s)

**Jira Key:** [BK-741](https://jira.upexgalaxy.com/browse/BK-741)
**Related Story:** [BK-229](https://jira.upexgalaxy.com/browse/BK-229) - Billing | View my workspace plan, seats, and usage
**Priority:** Medium
**Status:** Closed
**Components:** Bunkai Billing
**Severity:** Moderada
**Error Type:** Functional
**Test Environment:** Staging
**Fix Type:** Bugfix

---

## Description

## Billing overview stuck in loading state on API timeout (>10s)

***AC18*** (`Billing view handles API timeout gracefully`) is broken.

### Expected

When the billing API takes longer than 10s, the view should leave the loading skeleton and render the error card ("Unable to load billing info" + Retry).

### Actual

The view stays on the loading skeleton indefinitely. The 10s `AbortController` timeout fires, the fetch rejects, and the `catch` block's supersede-guard {{if (controller.signal.aborted) { return; }}} swallows the timeout abort — it cannot distinguish "aborted by timeout" from "aborted by a newer load()", so `setState('error')` is never reached.

### Root cause

`components/billing/BillingOverviewView.tsx` — the `catch` block treats every abort as a superseded request. The timeout path (`setTimeout(() => controller.abort(), FETCH*TIMEOUT*MS)`) aborts the same controller, so the abort guard returns before setting the error state.

### Repro

Open Settings > Billing with the billing endpoint hanging (or >10s latency). The loading skeleton persists; no error, no retry.

---

## 🐞 Actual Result

Component remains in the loading skeleton indefinitely; the error card never renders.

---

## ✅ Expected Result

After the 10s timeout the view should render the error card (Unable to load billing info) and a Retry button per AC18.

---

## 🔍 Root Cause

**Category:** Code Error

---

## Related Issues

- created by: [BK-739](https://jira.upexgalaxy.com/browse/BK-739) - ATR: BK-229: Story Testing
- is blocked by: [BK-229](https://jira.upexgalaxy.com/browse/BK-229) - Billing | View my workspace plan, seats, and usage
- created by: [BK-736](https://jira.upexgalaxy.com/browse/BK-736) - BK-229: TC18: should show the error card and retry when the billing API times out

---

## Metadata

- **Created:** 2026-08-30
- **Updated:** 2026-09-03
- **Reporter:** pinto.lucas.nahuel
- **Assignee:** pinto.lucas.nahuel

---

_Synced from Jira by sync-jira-issues_
