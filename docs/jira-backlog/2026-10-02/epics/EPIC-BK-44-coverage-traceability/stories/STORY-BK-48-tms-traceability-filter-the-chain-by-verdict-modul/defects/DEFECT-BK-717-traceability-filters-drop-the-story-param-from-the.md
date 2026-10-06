# DEFECT: Traceability filters drop the ?story param from the URL, breaking filter persistence and sharing (AC5.1/5.2)

**Jira Key:** [BK-717](https://jira.upexgalaxy.com/browse/BK-717)
**Related Story:** [BK-48](https://jira.upexgalaxy.com/browse/BK-48) - TMS-Traceability | Filter the chain by verdict, module, and date range
**Priority:** High
**Status:** Closed
**Components:** Bunkai Traceability
**Severity:** Mayor
**Error Type:** Functional
**Test Environment:** Staging
**Fix Type:** Bugfix

---

## Description

## Actual Result

Applying any traceability filter (Result, Module, or date range) rewrites the URL via `history.replaceState` with ONLY the filter params, dropping the pre-existing `?story=` query param. Reloading the resulting URL (e.g. `?result=fail`) renders the "Select a user story" empty state — the evidence chain is not restored.

## Expected Result

The filter URL must preserve the `?story=` param so the filtered view is fully reproducible from the URL alone (AC5.1 "the filter state is fully reproducible from the URL alone"; AC5.2 "restore filter state from URL query params on page load").

## Repro Steps

1. Open a story's traceability chain: `/projects/<slug>/traceability?story=<userStoryId>`.
2. Press the "Fail" result toggle.
3. Observe the URL becomes `?result=fail` — the `story` param is dropped.
4. Reload the page → "Select a user story" empty state (chain lost).

A manually-authored URL with both params (`?story=<id>&result=fail`) restores correctly — the defect is that the URL the app itself generates loses `story`.

## Root Cause

`components/traceability/TraceabilityChainView.tsx` — `syncFilterUrl()` builds the URL from `window.location.pathname` + `filterStateToParams(next)`, discarding any pre-existing query params (including `story`). `lib/traceability/chain-view.ts` — `filterStateToParams()` writes only the 4 filter axes (`result`, `module`, `from`, `to`).

## Impact

URL-based filter sharing and reload (the PO-approved AC5 value proposition) do not work end-to-end. The in-page filtering itself is unaffected.

---

## 🐞 Actual Result

Applying any traceability filter rewrites the URL with only the filter params, dropping `?story=`. Reloading shows 'Select a user story' (chain not restored).

---

## ✅ Expected Result

The filter URL preserves `?story=` so the filtered view is reproducible from the URL alone.

---

## 🔍 Root Cause

**Category:** Code Error

---

## 🧫 Evidence

- ***BK-48-BUG-BK-717-broken.png*** — broken state (bug): filter URL `?result=fail` missing `?story=` → reload shows "Select a user story" (chain lost)


---

## Related Issues

- is caused by: [BK-48](https://jira.upexgalaxy.com/browse/BK-48) - TMS-Traceability | Filter the chain by verdict, module, and date range
- blocks: [BK-48](https://jira.upexgalaxy.com/browse/BK-48) - TMS-Traceability | Filter the chain by verdict, module, and date range

---

## Metadata

- **Created:** 2026-08-28
- **Updated:** 2026-09-03
- **Reporter:** pinto.lucas.nahuel
- **Assignee:** pinto.lucas.nahuel

---

_Synced from Jira by sync-jira-issues_
