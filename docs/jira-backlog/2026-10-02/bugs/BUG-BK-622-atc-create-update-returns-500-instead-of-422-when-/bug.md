# BUG: ATC create/update returns 500 instead of 422 when the title trims below 3 chars (SQLSTATE 23514 unmapped)

**Jira Key:** [BK-622](https://jira.upexgalaxy.com/browse/BK-622)
**Priority:** Medium
**Status:** Ready For QA
**Components:** None
**Severity:** Moderada
**Error Type:** Functional
**Test Environment:** Staging
**Fix Type:** Bugfix

---

## Description

## Summary

`POST /api/v1/atcs` returns ***500*** `internal_error` when the `title` contains leading or trailing whitespace that pushes its trimmed length below 3 characters. The caller sees an opaque server error instead of a 422 validation message.

The same defect reaches the API through three entry points:

| ***Endpoint**** | ****Field**** | ****Source*** |
| --- | --- | --- |
| `POST /api/v1/atcs` | `title` | `app/api/v1/atcs/route.ts:38` |
| `PATCH /api/v1/atcs/{id`} | `title` | `app/api/v1/atcs/[id]/route.ts:93` |
| `POST /api/v1/atcs/{id}/duplicate` | `new_title` | `app/api/v1/atcs/[id]/duplicate/route.ts:43` |

## Root cause

Validation runs ***pre-trim**** and persistence runs ****post-trim***, so a value can pass Zod and still violate the database CHECK.

1. `lib/atcs/validation.ts:36` declares `title: z.string().min(ATC*TITLE*MIN).max(ATC*TITLE*MAX)` with ***no*** `.trim()`. `"  ab  "` is 6 characters, so `.min(3)` passes.
2. `app/api/v1/atcs/route.ts:37` then writes `title: body.title.trim()` — the stored value is `"ab"`, 2 characters.
3. The constraint `atcs*title*min*length` (`supabase/migrations/0058*atc*title*min_length.sql:50-53`, `check (length(title) >= 3)`) rejects it with SQLSTATE `23514`.
4. `lib/atcs/errors.ts` maps `42501`, `P0002`, `23505` and the `45xxx` domain codes. `23514` ***is not handled***, so execution falls through to the default branch and throws `ApiError('internal_error', ...)` — HTTP 500.

> ***INFO:*** This is a contract defect, not a data-integrity one. The CHECK constraint is doing its job; the API is simply reporting the rejection with the wrong status and an unhelpful message.

## Proposed fix

Either option closes it. They are not mutually exclusive.

- ***Validate post-trim (preferred).*** Add `.trim()` to the Zod schema in `lib/atcs/validation.ts` so `title` and `new_title` are normalized before `.min()` runs. The caller then gets a 422 naming the field, and the constraint stops being reachable from this path. Matches how `lib/bugs/validation.ts` and `lib/runs/validation.ts` already handle their string fields.
- ***Map the SQLSTATE.*** Add a `23514` case to `lib/atcs/errors.ts` returning 422 `validation_failed`. This is defence in depth: it also covers any future CHECK constraint on the table, which the Zod fix alone would not.

## Notes

Found during a documentation-parity audit of the OpenAPI spec against the handlers (2026-08-24), not by a QA run. No user has reported it yet.

---

## 🐞 Actual Result

HTTP ***500*** with the generic internal-error envelope:

```json
{
  "error": {
    "code": "internal_error",
    "message": "new row for relation \"atcs\" violates check constraint \"atcs*title*min_length\"",
    "request_id": "<uuid>"
  }
}
```

The raw Postgres constraint message leaks to the caller, and the status code says the server broke rather than that the input was rejected.

---

## ✅ Expected Result

HTTP ***422*** `validation_failed`, naming the offending field, consistent with every other input rejection in the API:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "Request body failed validation.",
    "details": { "title": "Must be 3 to 200 characters after trimming." },
    "request_id": "<uuid>"
  }
}
```

---

## 🔍 Root Cause

**Category:** Code Error

---

## 🚩 Workaround

Trim the `title` client-side before sending. Any value whose trimmed length is 3 characters or more behaves correctly.

No data is corrupted by the defect — the constraint blocks the write, so nothing invalid is persisted.

---

## 🧫 Evidence

## Reproduction

```java
curl -sS -X POST "$API*BASE*URL/atcs" \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer bk*pat*<prefix>.<secret>" \
  -d '{
    "project_id": "<uuid>",
    "title": "  ab  "
  }'
# → HTTP 500  {"error":{"code":"internal_error", ...}}
```

Variants that reproduce the same 500:

- `PATCH /api/v1/atcs/{id`} with `{"title": "  ab  "`}
- `POST /api/v1/atcs/{id}/duplicate` with `{"new_title": "   "`} — an all-whitespace title trims to the empty string

## Code trail

| ***Step**** | ****Location*** |
| --- | --- |
| Pre-trim validation | `lib/atcs/validation.ts:36` |
| Post-trim persistence | `app/api/v1/atcs/route.ts:37` |
| CHECK constraint | `supabase/migrations/0058*atc*title*min*length.sql:50-53` |
| Unmapped SQLSTATE `23514` | `lib/atcs/errors.ts` (handles `42501`, `P0002`, `23505`; default throws `internal_error`) |

---

## Metadata

- **Created:** 2026-08-27
- **Updated:** 2026-08-31
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** api, atc, validation

---

_Synced from Jira by sync-jira-issues_
