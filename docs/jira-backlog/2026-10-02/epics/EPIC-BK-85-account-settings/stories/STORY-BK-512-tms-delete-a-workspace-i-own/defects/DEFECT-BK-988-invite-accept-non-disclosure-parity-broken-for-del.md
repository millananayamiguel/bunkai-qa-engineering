# DEFECT: Invite-accept non-disclosure parity broken for deleted-workspace tokens (AC-14)

**Jira Key:** [BK-988](https://jira.upexgalaxy.com/browse/BK-988)
**Related Story:** [BK-512](https://jira.upexgalaxy.com/browse/BK-512) - TMS-| Delete a workspace I own
**Priority:** Low
**Status:** In Review
**Components:** Bunkai Invites
**Severity:** Menor
**Error Type:** Security
**Test Environment:** Staging
**Fix Type:** Bugfix

---

## Description

## Summary

`POST /api/v1/invites/accept` does not give a deleted-workspace invite token the same refusal as a token that never existed, breaking the non-disclosure parity AC-14 requires for BK-512 ("TMS-Workspace | Delete a workspace I own").

## Steps to reproduce

1. Create a workspace, invite a teammate (issue an invite token), then delete the workspace as the Owner (`bunkai*request*workspace*deletion`, migration `0084*workspace_deletion.sql`).
2. `POST /api/v1/invites/accept` with the now-orphaned invite token:

   `
   POST /api/v1/invites/accept
   { "token": "<token issued before deletion>" }
   `
   Response: `409 Conflict` — `{"error":{"code":"conflict","message":"Invite has been revoked."}}`

1. `POST /api/v1/invites/accept` with a syntactically valid token that was never issued:

   `
   POST /api/v1/invites/accept
   { "token": "<random 32-char token, never issued>" }
   `
   Response: `404 Not Found` — `{"error":{"code":"not_found","message":"Invite token is invalid."}}`

## Actual result

The two calls return different HTTP status codes and different messages (409 "Invite has been revoked." vs 404 "Invite token is invalid."). An outside caller can distinguish "this invite/workspace once existed" from "this token never existed."

## Expected result

Per AC-14, a deleted-workspace invite must be refused with the ***identical*** shape (status + body) as a token that never existed — the same non-disclosure guarantee AC-13 already gives PATs.

## Root cause (verified against `origin/staging`)

`app/api/v1/invites/accept/route.ts` checks `revoked_at` **before** falling through to the generic not-found branch:

```ts
if (!invite) {
  throw new ApiError('not_found', 'Invite token is invalid.');   // never-existed shape
}
if (invite.revoked_at) {
  throw new ApiError('conflict', 'Invite has been revoked.');    // distinguishable shape
}
```

`bunkai*request*workspace*deletion` (migration `0084*workspace_deletion.sql`, lines ~300-304) revokes rather than deletes outstanding invites at deletion time:

```sql
update public.workspace_invites
set revoked_at = now()
where workspace*id = p*workspace_id
  and accepted_at is null
  and revoked_at is null;
```

So the invite row (and its `workspace*invite*secrets` row) survives the deletion, and the route's early `revoked_at` check fires — leaking that the workspace/invite once existed.

***The fix pattern already exists in the codebase and just needs to be copied****: `lib/api/middleware/bearer.ts` (the PAT path, AC-13) deliberately collapses every failure mode — revoked, expired, hash-mismatch, nonexistent — into the **same* `ApiError('unauthorized', 'Invalid token.')` (see the file's own header comment: "All failures collapse to `ApiError('unauthorized')` — never leak which check failed... vs revoked vs expired"). The invites/accept route should do the same: treat `revoked*at` (and `accepted*at`/expiry, for that matter — those are lower-severity variants of the same disclosure) as equivalent to not-found for a caller who isn't the invite's own recipient, or at minimum for the deleted-workspace case.

## Impact

Low real-world risk: confirms only that a workspace/invite once existed, no data or names disclosed. But it is a concrete break of an explicit, deliberately-designed non-disclosure AC (AC-14), and the parity fixture this AC exists to protect is exactly what it caught.

## Associated Tests

BK-941 (TC41) and BK-942 (TC42) — the AC-14 outline pair — both FAILED on this finding; their Xray runs on ATR BK-987 carry this Defect via `run defect`.

---

## 🐞 Actual Result

`409 Conflict` — `{"error":{"code":"conflict","message":"Invite has been revoked."}}` for a deleted-workspace invite token, vs `404 Not Found` — `{"error":{"code":"not_found","message":"Invite token is invalid."}}` for a token that never existed. See the Description field for the full repro.

---

## ✅ Expected Result

Both calls should return the identical refusal shape (status + body) — the same non-disclosure guarantee AC-13 already gives PATs.

---

## 🔍 Root Cause

**Category:** Code Error

---

## Related Issues

- causes: [BK-512](https://jira.upexgalaxy.com/browse/BK-512) - TMS-| Delete a workspace I own
- is blocked by: [BK-512](https://jira.upexgalaxy.com/browse/BK-512) - TMS-| Delete a workspace I own
- created by: [BK-987](https://jira.upexgalaxy.com/browse/BK-987) - ATR: BK-512: Story Testing
- created by: [BK-956](https://jira.upexgalaxy.com/browse/BK-956) - BK-512: TC41: should refuse an outstanding invite to a deleted workspace when opened afterward
- created by: [BK-957](https://jira.upexgalaxy.com/browse/BK-957) - BK-512: TC42: should return the identical refusal shape for a deleted-workspace invite and an invite token that never existed
- created by: [BK-972](https://jira.upexgalaxy.com/browse/BK-972) - BK-512: TC57: should refuse a concurrent write still in flight when the deletion is recorded, with the same not-found refusal the product gives for any workspace the caller cannot see, never a server error

---

## Metadata

- **Created:** 2026-09-09
- **Updated:** 2026-09-24
- **Reporter:** GENESIS OJOSE
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_
