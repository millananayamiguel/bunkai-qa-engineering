# BUG: Digest cron route (/api/v1/admin/send-digest) exposes only POST — Vercel Cron GET invocation gets 405

**Jira Key:** [BK-882](https://jira.upexgalaxy.com/browse/BK-882)
**Priority:** Medium
**Status:** Closed
**Components:** Bunkai Notifications
**Severity:** Mayor
**Error Type:** Integration
**Fix Type:** Bugfix

---

## Description

## Summary

The daily digest cron route only exports a `POST` handler, but Vercel Cron invokes the configured path with a `GET` request. Once BK-214 is promoted to `main`, the cron will fire daily at 08:00 UTC and receive `405 Method Not Allowed` on every invocation, silently, forever.

## Evidence

- `vercel.json` declares one cron entry:

```json
{
  "crons": [
    { "path": "/api/v1/admin/send-digest", "schedule": "0 8 ** ** *" }
  ]
}
```

- `app/api/v1/admin/send-digest/route.ts:23` exports ***only*** `POST`:

```ts
export const POST = withApiHandler(async (request) => {
  if (!isValidCronSecret(request.headers.get('authorization'), env.CRON_SECRET)) {
    throw new ApiError('unauthorized', 'Invalid or missing CRON_SECRET.');
  }
  ...
}, { auth: 'public' });
```

There is no `GET` export in the file.

- Vercel's own Cron Jobs quickstart defines the handler shape as `export function GET(request)` — Vercel Cron invokes the configured path with a ***GET*** request, not POST.

- Consequence: `GET /api/v1/admin/send-digest` hits Next.js's default route-handler behavior for an undeclared method and returns `405 Method Not Allowed`. The digest email never sends, and nothing surfaces the failure (no alert, no log line reaches an operator).

## Related but out of scope

BK-214 (the digest feature this route belongs to) has never been promoted to `main`, so today the cron is ***not registered at all*** (`vercel crons list` → `Status: not deployed`; the Vercel API returns `crons.definitions: []` with `disabledAt: null`). That is why the 405 has not been observed in production yet. This context explains why the bug is latent rather than currently firing — it is not itself part of the fix. The fix in scope here is exclusively the missing HTTP method on the route.

## Steps to reproduce

1. Promote BK-214 to `main` so `vercel.json`'s cron entry is registered on the production deployment.
2. Wait for (or manually trigger) the `0 8 ** ** *` cron invocation, or simulate it with `curl -X GET https://<prod-domain>/api/v1/admin/send-digest -H "Authorization: Bearer $CRON_SECRET"`.

## Expected result

The route accepts the cron's `GET` request, validates the `CRON_SECRET` bearer header exactly as it does today, runs `runDigestSend`, and returns the `RunDigestSendResult` JSON body.

## Actual result

`GET /api/v1/admin/send-digest` returns `405 Method Not Allowed` because the route module exports no `GET` handler. The digest never runs on schedule.

## Proposed fix direction

Add `export const GET = withApiHandler(...)` to `app/api/v1/admin/send-digest/route.ts`, reusing the same `CRON_SECRET` bearer check and calling into `runDigestSend` exactly as `POST` does today. Decide whether `POST` should remain in place afterward — the route's own comment documents it as supporting a same-day manual retry path (`send-digest-run.ts`'s claim-before-send logic already makes a same-day re-invocation idempotent, returning `skipped` for already-claimed users), so keeping both methods pointed at the same handler logic is likely correct rather than replacing `POST` with `GET`.

## Affected files

- `vercel.json`
- `app/api/v1/admin/send-digest/route.ts`
- `lib/notifications/send-digest-run.ts` (unchanged, but is the shared orchestration core both methods would call)

---

## 🐞 Actual Result

`GET /api/v1/admin/send-digest` returns `405 Method Not Allowed`. The route module (`app/api/v1/admin/send-digest/route.ts`) exports only `POST`; there is no `GET` handler for Vercel Cron's invocation to hit. The digest never runs on its schedule, and nothing surfaces the failure to an operator.

---

## ✅ Expected Result

The route accepts Vercel Cron's `GET` invocation, validates the `CRON_SECRET` bearer header exactly as the existing `POST` handler does, runs `runDigestSend`, and returns the `RunDigestSendResult` JSON body with HTTP 200.

---

## Related Issues

- is caused by: [BK-214](https://jira.upexgalaxy.com/browse/BK-214) - Notifications | Receive an email digest of unread notifications

---

## Metadata

- **Created:** 2026-09-06
- **Updated:** 2026-09-08
- **Reporter:** Ely
- **Assignee:** pinto.lucas.nahuel
- **Labels:** cron, digest

---

_Synced from Jira by sync-jira-issues_
