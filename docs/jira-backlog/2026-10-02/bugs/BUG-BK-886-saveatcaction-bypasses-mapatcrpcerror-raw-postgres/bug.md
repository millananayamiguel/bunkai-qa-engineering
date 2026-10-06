# BUG: saveAtcAction bypasses mapAtcRpcError — raw Postgres constraint text reaches the caller

**Jira Key:** [BK-886](https://jira.upexgalaxy.com/browse/BK-886)
**Priority:** Low
**Status:** In Review
**Components:** None
**Severity:** Trivial
**Error Type:** Functional
**Fix Type:** Bugfix

---

## Description

## Actual result

`saveAtcAction` (`app/(app)/projects/[projectSlug]/atcs/[atcId]/actions.ts:75-77`) calls `updateAtc` and, on RPC failure, returns `error.message` ***raw***:

```ts
if (error) {
  return { ok: false, error: error.message };
}
```

It never calls `mapAtcRpcError` (`lib/atcs/errors.ts:7`). So a tampered or stale client posting an out-of-set `layer`, `technique`, or `priority` value reaches the Postgres `CHECK` constraint on the `atcs` table, and the raw driver text (e.g. `new row for relation "atcs" violates check constraint "atcs*technique*allowed"`) is what the caller receives.

## Expected result

Every other write path to the same RPC family already routes failures through `mapAtcRpcError` — confirmed at `app/api/v1/atcs/route.ts:50`, `app/api/v1/atcs/[id]/route.ts:106`, and `app/api/v1/atcs/[id]/duplicate/route.ts:46`. The AI Tech Lead ruling T4 on BK-399 is explicit about the shape a constraint violation should surface: a mapped `validation*failed` result with `details.reason` naming the specific field (`technique*invalid`, `priority_invalid`, etc. — see `lib/atcs/errors.ts:29-38`), never the raw Postgres constraint text.

## Scope: pre-existing class, not a BK-399 regression

`layer` already went through this same raw-passthrough path before BK-399 — `saveAtcAction` never validated or mapped it either. What BK-399 changed is that it added two more constrained fields (`technique`, `priority`) flowing through the same unmapped path, doubling the surface. This is not new breakage introduced by BK-399; it is a pre-existing gap that BK-399 made twice as wide.

## Severity note

This is ***not reachable through the ****`<select>`**** controls in the current web editor UI*** — the dropdowns only ever submit values from the allowed set. It requires a tampered or stale client (a client that got out of sync with the option list, or one that sends a raw request bypassing the `<select>`) to hit the constraint. Filed as low severity: the fix exists to stop the server action from being the one path in the codebase that answers differently from every route, not because of an observed customer-facing incident.

## Scope of fix (do not implement here — file only)

Route `saveAtcAction`'s RPC failure branch (`app/(app)/projects/[projectSlug]/atcs/[atcId]/actions.ts:75-77`) through `mapAtcRpcError` so all three constrained fields (`layer`, `technique`, `priority`) answer identically to the API route path, and add a test proving a constraint violation on this action surfaces the mapped contract (`validation_failed` + field-specific `reason`) rather than raw driver text.

---

## 🐞 Actual Result

A tampered or stale client posting an out-of-set `layer`, `technique`, or `priority` value to `saveAtcAction` (`app/(app)/projects/[projectSlug]/atcs/[atcId]/actions.ts:75-77`) receives the raw Postgres `CHECK`-constraint driver text as `error.error`, because that function returns `error.message` verbatim instead of calling `mapAtcRpcError`.

---

## ✅ Expected Result

Per `mapAtcRpcError` (`lib/atcs/errors.ts:7`) and the AI Tech Lead ruling T4 on BK-399, a constraint violation should surface as a mapped `validation_failed` result with `details.reason` naming the field, matching every other write path to the same RPC family (`app/api/v1/atcs/route.ts:50`, `app/api/v1/atcs/[id]/route.ts:106`, `app/api/v1/atcs/[id]/duplicate/route.ts:46`).

---

## Related Issues

- relates to: [BK-399](https://jira.upexgalaxy.com/browse/BK-399) - TMS-ATC Classification | Classify by test-design technique and priority

---

## Metadata

- **Created:** 2026-09-06
- **Updated:** 2026-09-24
- **Reporter:** Ely
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_
