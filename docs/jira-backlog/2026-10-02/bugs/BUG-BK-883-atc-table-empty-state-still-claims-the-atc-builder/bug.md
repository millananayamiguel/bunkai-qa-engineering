# BUG: ATC table empty state still claims the ATC builder "ships next sprint" (stale since BK-19)

**Jira Key:** [BK-883](https://jira.upexgalaxy.com/browse/BK-883)
**Priority:** Low
**Status:** In Review
**Components:** None
**Severity:** Trivial
**Error Type:** Content
**Fix Type:** Bugfix

---

## Description

## Summary

The ATC table's empty state on the project workbench (`components/atcs/AtcTable.tsx`) still shows copy claiming the ATC builder has not shipped yet, but it shipped with BK-19.

## Evidence

The current empty state (`components/atcs/AtcTable.tsx`, the `table.getRowModel().rows.length === 0` branch) renders, verbatim:

> "No ATCs yet"

"Acceptance Test Cases are assembled in the ATC builder, which ships next sprint. For now, capture expected behaviour as acceptance criteria inside your user stories."

The header strip above the table also carries the same stale claim in its right-side hint: "ATCs arrive with the builder next sprint" — both strings need the same correction.

## Actual result

The empty state tells users the ATC builder "ships next sprint," implying it does not exist today.

## Expected result

The empty state should reflect that the ATC builder is live (BK-19) and guide the user to it, instead of claiming a future ship date.

## Coordination note (please read before starting the fix)

BK-399 is concurrently adding a ***second, distinct*** empty state to this same component (`atc-list-no-match`, for the filtered/no-results case) and is giving this existing "No ATCs yet" block the `data-testid` `atc-list-empty`. Whoever picks up this copy fix should coordinate with, or land after, BK-399 lands to avoid a merge conflict in `components/atcs/AtcTable.tsx`.

## Proposed fix direction

Update both stale strings (the empty-state body copy and the header hint) to reflect that the ATC builder has shipped, and consider linking directly to the builder / an ATC creation action from the empty state instead of describing it in prose.

---

## 🐞 Actual Result

The ATC table's "No ATCs yet" empty state (`components/atcs/AtcTable.tsx`) reads: "Acceptance Test Cases are assembled in the ATC builder, which ships next sprint. For now, capture expected behaviour as acceptance criteria inside your user stories." The header hint above the table reads: "ATCs arrive with the builder next sprint." Both claim the builder is not yet available.

---

## ✅ Expected Result

The empty state and header hint should reflect that the ATC builder shipped with BK-19, not claim it ships "next sprint."

---

## Metadata

- **Created:** 2026-09-06
- **Updated:** 2026-09-24
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** atc-library, copy

---

_Synced from Jira by sync-jira-issues_
