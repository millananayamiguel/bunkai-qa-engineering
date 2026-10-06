# DEFECT: Soft-deleted workspace: ATCs, Tests, Runs and Environments remain fully readable/actionable during the 30-day grace period (AC-07)

**Jira Key:** [BK-991](https://jira.upexgalaxy.com/browse/BK-991)
**Related Story:** [BK-512](https://jira.upexgalaxy.com/browse/BK-512) - TMS-| Delete a workspace I own
**Priority:** High
**Status:** In Review
**Components:** Bunkai ATCs, Bunkai Environments, Bunkai Runs, Bunkai Tests, Bunkai Workspaces
**Severity:** Mayor
**Error Type:** Security
**Fix Type:** Bugfix

---

## Description

## Summary

AC-07 requires that after a workspace is soft-deleted, all 10 owned entity types become unreachable (`404`) for the remainder of the 30-day grace period, until either restore or physical purge. Testing found that ***4 of the 10 entity types stay fully reachable and functional***: ATCs, Tests, Runs, and Environments.

## Steps to reproduce

1. Create a workspace as Owner.
2. Create one instance of each: Project, Module, User Story, Acceptance Criterion, ATC, Test, Run, Bug, Milestone, Environment.
3. Delete the workspace (`DELETE /api/v1/workspaces/{id}`) — confirmed via DB that `deleted_at` is set, no physical row removal.
4. Attempt to read/act on each of the 10 created entities.

## Actual result

| Entity | Request | Response |
| --- | --- | --- |
| Module | `PATCH` | `404` (correct) |
| User Story | `GET` | `404` (correct) |
| Acceptance Criterion | `GET` | `404` (correct) |
| Bug | `GET` | `404` (correct) |
| Milestone | `PATCH` | `404` (correct) |
| ***ATC**** | `GET .../atcs/{id}/usage` | `200`****, full data returned*** |
| ***Test**** | `GET .../tests/{id}` | `200`****, full data returned*** |
| ***Run**** | `GET .../runs/{id}` | `200`****, still shows ***`running` |
| ***Environment*** | `DELETE .../environments/{id}` | `409 "in use"` — implies the resource is still live business state, not a workspace that no longer exists |

Project had no direct single-item read route to check; inconclusive, not counted either way.

## Expected result

All 10 entity types should behave like the 6 that already pass: `404` once the parent workspace has `deleted_at` set, regardless of the caller's prior membership.

## Root cause

The 6 passing entity types resolve their access check through the standard RLS path (`workspaces*select*active*member` / the four helpers in `supabase/migrations/0005*rls*helpers.sql`), which ADR-0015 already amended to include `deleted*at is null`.

The 4 failing routes (`atcs/[id]/usage`, `tests/[id]`, `runs/[id]`, `environments/[id]`) instead use `createAdminClient()` (a service-role client that bypasses RLS entirely) paired with a membership check that only verifies `workspace*members.status = 'active'` — it never checks the parent workspace's `deleted*at`. ADR-0015's migration (0084) never touched these 4 routes' authorization helper. Notably, this is not a new class of gap: migration 0039's own comments already flagged the identical admin-client-bypasses-RLS risk once before, without a fix landing.

## Impact

For the full 30-day grace period, any account that was previously an active member of a soft-deleted workspace can still:

- Read complete ATC usage data.
- Read complete Test definitions.
- Read Run state (and it will incorrectly report as still `running`).
- Trigger real business-logic responses from Environments (`409` implies live-state handling, not a deleted-parent refusal).

This is broader than BK-988 (which only leaked "this token/invite once existed") — here full entity content and live business logic remain exposed, not just an existence signal.

## Suggested fix

Add the same `deleted_at is null` (or equivalent workspace-not-deleted) condition to the authorization check backing these 4 routes, matching the pattern already applied to the RLS-path entities.

## Test coverage

Covered by `BK-938` (Xray Test on BK-512's Test Set BK-985), marked FAILED with this evidence.

---

## 🔍 Root Cause

**Category:** Code Error

---

## Related Issues

- created by: [BK-987](https://jira.upexgalaxy.com/browse/BK-987) - ATR: BK-512: Story Testing
- created by: [BK-974](https://jira.upexgalaxy.com/browse/BK-974) - BK-512: TC59: should refuse the Run as not-found on the Runner view's next server round-trip, tell the teammate the workspace was deleted, and re-point them via the AC-09 resolver
- created by: [BK-959](https://jira.upexgalaxy.com/browse/BK-959) - BK-512: TC44: should erase the in-flight Run and its recorded steps with the workspace
- causes: [BK-512](https://jira.upexgalaxy.com/browse/BK-512) - TMS-| Delete a workspace I own
- is blocked by: [BK-512](https://jira.upexgalaxy.com/browse/BK-512) - TMS-| Delete a workspace I own

---

## Metadata

- **Created:** 2026-09-10
- **Updated:** 2026-09-24
- **Reporter:** GENESIS OJOSE
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_
