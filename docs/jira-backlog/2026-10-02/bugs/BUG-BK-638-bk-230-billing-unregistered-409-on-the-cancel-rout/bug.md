# BUG: BK-230 billing: unregistered 409 on the cancel route, an unguarded Stripe retrieve, and four untested guards on the payment path

**Jira Key:** [BK-638](https://jira.upexgalaxy.com/browse/BK-638)
**Priority:** Medium
**Status:** Ready For QA
**Components:** None
**Fix Type:** Bugfix

---

## Description

## Summary

Leftovers from the [https://jira.upexgalaxy.com/browse/BK-230#icft=BK-230](https://jira.upexgalaxy.com/browse/BK-230#icft=BK-230) conductor review (PR #208, merged as 404cd40). Two MINOR defects introduced by fix round 2, plus four test-coverage items raised in the round-2 review that the fix round did not touch. None of them block the feature; all of them are cheap and they sit on a payment path, which is why they are being tracked rather than dropped.

## Defect 1 -- the cancel route can return 409 but the OpenAPI spec does not declare it

app/api/v1/workspaces/[id]/billing/checkout/cancel/route.openapi.ts:19-23 declares only 204, 401 and 403. Round 2 added two new client-visible 409 outcomes – checkout*in*progress and checkout*already*completed, mapped at lib/api/error-envelope.ts:88.

openapi:diff passes because public/openapi.json is generated from this same incomplete file, so the drift is invisible to the existing gate. A generated API client or a contract test built from the spec treats the 409 as an unmodelled response.

Fix: register the 409 in route.openapi.ts, regenerate with bun run openapi:gen, and re-sync types with bun run api:sync --file public/openapi.json.

## Defect 2 -- the new Stripe retrieve() call on the cancel path is unguarded

lib/billing/checkout.ts:351 calls stripe.checkout.sessions.retrieve() outside any try/catch. Before round 2 the whole Stripe interaction on this path sat inside a try/catch, so cancel always succeeded.

Now any Stripe failure – an outage, a 5xx, a rotated key, a session id belonging to another account – propagates as a raw Error to lib/api/handler.ts:140, which wraps it as internal_error and echoes raw.message verbatim to the caller.

The direction is correct and deliberate: refusing to cancel beats cancelling a session that was already paid. The defect is the missing ApiError wrap. Its sibling at checkout.ts:188-197 wraps Stripe failures in a prefixed ApiError; this one does not.

Consequence: during a Stripe incident the owner cannot release their own checkout lock and is stuck behind the 30-minute TTL, and the 500 body carries Stripe's upstream text. Stripe masks its own key hints so no secret leaks, but it is upstream detail disclosure that the begin path deliberately avoids.

Fix: wrap it the way checkout.ts:188-197 does.

## Test-coverage items raised in the round-2 review and not addressed

None of these four were touched by the fix round, and neither the commits nor the PR body mention them, so it is not clear whether they were declined or overlooked.

1. ***No test asserts that an authenticated PostgREST PATCH on billing*checkout*sessions is denied.*** This was the round-1 item-3 exploit: an owner could PATCH their own row to canceled, release the partial unique index, and open a second payable checkout. The live posture is correct and was verified directly – pg*policies returns exactly one row, billing*checkout*sessions*select*owner, SELECT only, with*check null, relrowsecurity true – but nothing guards a future migration re-adding a write policy.
2. ***cancelBillingCheckout's owner gate is untested.*** checkout.ts:315-323 is the only thing standing between a non-owner member and cancelling the owner's checkout, now that the RLS write policies on that table are gone. lib/billing/checkout.test.ts:78-110 covers beginBillingCheckout only, and its own comment says so.
3. ***cancelBillingCheckout's already-complete branch is untested.*** checkout.ts:353-361 is the round-2 item-2 fix. It reads correctly but no test executes it.
4. ***Three webhook tests are gated on Supabase secrets they do not need.*** app/api/v1/billing/webhook/route.test.ts:39-40 computes describeOrSkip from NEXT*PUBLIC*SUPABASE*URL and SUPABASE*SERVICE*ROLE*KEY, and line 74 is the file's only describeOrSkip. Missing-header, forged-signature and tampered-body need no database at all, so on a CI runner without Supabase secrets the signature-verification coverage silently vanishes. It reports as skip rather than pass, so it is not the fail-open anti-pattern – but it is coverage that disappears exactly where it would matter.

## Known exposure, deliberately not closed here

After reuseOpenCheckoutSession locally expires the first row and mints a second, ***both*** Stripe URLs are payable, and round 2 now correctly applies either one. Two payments would apply the plan twice – idempotent on the plan, not on the money.

This is not a round-2 regression. Round 2 closed the "neither applies" half of the problem. Recording it so it is not mistaken for a new hole, and so whoever picks up seat enforcement ([https://jira.upexgalaxy.com/browse/BK-636#icft=BK-636](https://jira.upexgalaxy.com/browse/BK-636#icft=BK-636)) can decide whether it belongs there.

## Also worth a look

- components/billing/UpgradeView.tsx:93-99 – on the already-paid path setCanceledBanner(true) fires before the cancel POST, and the 409 is swallowed (fetch does not reject on 4xx and there is a bare .catch). A user who actually paid and lands on a lingering ?checkout=canceled URL sees a "canceled" banner while the upgrade is being applied. Pre-existing shape, but round 2 makes 409 the normal answer on that path rather than a silent 204.
- app/(app)/settings/billing/upgrade/page.tsx:13-16 – stale comment. It still cites "the billing*checkout*sessions RLS policies" as part of the authorization mechanism. Those write policies were dropped in round 1.

## Provenance

Surfaced by the conductor re-review of PR #208 fix round 2. The PR was merged rather than held because all eight round-1 items and all three round-2 items were verified fixed – several against the live database rather than the migration text – and holding it would have queued the rest of the Ready-For-Dev sweep behind two MINORs and four test gaps.

---

## Metadata

- **Created:** 2026-08-27
- **Updated:** 2026-08-31
- **Reporter:** Ely
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_
