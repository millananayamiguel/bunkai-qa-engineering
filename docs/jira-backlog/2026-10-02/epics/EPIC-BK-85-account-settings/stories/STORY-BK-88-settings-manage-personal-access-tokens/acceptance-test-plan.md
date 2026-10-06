# ACCEPTANCE TEST PLAN (ATP): ATP: BK-88: Settings | Manage Personal Access Tokens

**Jira Key:** [BK-1059](https://jira.upexgalaxy.com/browse/BK-1059)
**Status:** Completed
**Components:** Bunkai API Tokens

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

# ATP - BK-88: Settings | Manage Personal Access Tokens

***Status****: ACTIVE - full surface (API + UI) ****Revision****: 2026-09-17, W1 (fleet run, sprint 4). Supersedes the 2026-06-12 API-only phase. ****Environment****: staging (https://staging-upexbunkai.vercel.app) ****Coverage backbone***: ATS BK-1058 (30 Tests) -> this Plan and Execution BK-1060 derive their lists from it.

## Why this revision exists

The 2026-06-12 pass was partial by force: the Settings Hub (BK-87) had not shipped, so 17 UI outlines were parked, and TC08 failed on a real privilege-escalation defect (BK-135). Three things changed since:

| Dependency | Then | Now |
| --- | --- | --- |
| BK-87 Settings Hub | Ready For Dev | Ready For Release - UI surface unblocked |
| BK-135 privilege escalation | Open (crítica) | Closed - regression owed |
| BK-167 workspace:admin enforcement | - | FIXED (consumption side) |

So this is a re-test, not a confirmation of the earlier verdict.

## Scope

| Surface | In scope | Out |
| --- | --- | --- |
| UI | Settings > Tokens: list, empty state, issue flow, one-time secret reveal, copy, revoke confirmation | Settings hub chrome (BK-87 owns it) |
| API | POST / GET / DELETE /api/v1/tokens, auth boundaries, scope enum, role gate, name boundaries | CLI auth flow (EPIC-BK-009) |
| DB | access*tokens row state: revoked*at, workspace*id, scopes, expires*at | - |

## Test design

Derived from the 8 acceptance criteria plus risk beyond them. Techniques applied: equivalence partitioning on scope sets and auth modes; boundary analysis on the name length (80 / 81) and the expiry window; state transition on active -> revoked -> re-revoke; decision table on the three-way `workspace:admin` guard (scope requested x workspace targeted x caller role).

### API (TC01-TC14, BK-120..BK-133)

| TC | Key | Assertion | Auth |
| --- | --- | --- | --- |
| TC01 | BK-120 | POST issues a token and returns the full secret once, 201 | cookie |
| TC02 | BK-121 | GET returns prefix only in a `{tokens:[...]}` envelope, 200 | Bearer |
| TC03 | BK-122 | DELETE soft-revokes and stamps revoked_at | cookie |
| TC04 | BK-123 | POST unauthenticated, 401 | none |
| TC05 | BK-124 | GET unauthenticated, 401 | none |
| TC06 | BK-125 | DELETE unauthenticated, 401 | none |
| TC07 | BK-126 | POST with a scope outside the enum, 422 | cookie |
| TC08 | BK-127 | POST workspace:admin without the required role, 403 (BK-135 regression) | cookie |
| TC09 | BK-128 | POST accepts a name of exactly 80 chars, 201 | cookie |
| TC10 | BK-129 | POST rejects a name of 81 chars, 422 | cookie |
| TC11 | BK-130 | GET returns only the caller's tokens (RLS) | Bearer |
| TC12 | BK-131 | DELETE on another user's token, 404 (RLS, no existence leak) | cookie |
| TC13 | BK-132 | DELETE on an already-revoked token, 404 | cookie |
| TC14 | BK-133 | A revoked PAT is refused on the next call, 401 | revoked PAT |

### UI and risk (TC15-TC30, BK-1039..BK-1054)

| TC | Key | Assertion | AC |
| --- | --- | --- | --- |
| TC15 | BK-1039 | The secret is revealed exactly once with the store-now warning | AC1 |
| TC16 | BK-1040 | Only the prefix survives in the list; the secret leaves the DOM | AC1 |
| TC17 | BK-1041 | The copy control puts the secret on the clipboard | AC1 |
| TC18 | BK-1042 | A zero-scope submission creates nothing and is explained to the user | AC2 |
| TC19 | BK-1043 | The list shows name, scopes, workspace, created, expiry and no secret | AC5 |
| TC20 | BK-1044 | A revoked token is visually distinct and offers no revoke action | AC5 |
| TC21 | BK-1045 | Revocation asks for explicit confirmation first | AC7 |
| TC22 | BK-1046 | Confirming updates the row without a full page reload | AC7 |
| TC23 | BK-1047 | Cancelling leaves the token active | AC7 |
| TC24 | BK-1048 | An empty collection guides first issuance | AC8 |
| TC25 | BK-1049 | workspace:admin without a target workspace, 403 | AC4 |
| TC26 | BK-1050 | workspace:admin on a workspace where the caller is a viewer, 403 | AC4 |
| TC27 | BK-1051 | workspace:admin on a workspace the caller owns, 201 | AC4 |
| TC28 | BK-1052 | A name with spaces and capitals is normalized, and the user is told | risk |
| TC29 | BK-1053 | A failed clipboard write is reported, not acknowledged as success | risk |
| TC30 | BK-1054 | An expiry window is reflected on the row and in expires_at | risk |

## The role-gate decision table (AC4, BK-135)

| workspace:admin requested | workspace_id supplied | caller role there | Expected |
| --- | --- | --- | --- |
| yes | no | any | 403 - the scope must target a workspace |
| yes | yes | viewer or member | 403 - only admins and owners may issue it |
| yes | yes | admin or owner | 201 |
| no | no | any | 201 |

The staging owner account holds three memberships (owner, admin, viewer in different workspaces), so all four rows are reachable from one session. The 2026-06-12 claim that this needed a second user no longer holds.

## Risks

- Three QA sessions share one staging account, so the token list moves under the tester. Every assertion filters on the session's own `bk88-w1-` name prefix and no token created by another session is ever revoked.
- The one-time secret is unrecoverable by design: a copy control that reports success without copying would cost a real user their credential. TC29 exists for exactly that.
- AC2 asks for an inline validation message; a disabled control is a different user experience. TC18 records which one ships.

---

## Related Issues

- tests: [BK-88](https://jira.upexgalaxy.com/browse/BK-88) - Settings | Manage Personal Access Tokens

---

## Metadata

- **Created:** 2026-09-18
- **Updated:** 2026-09-18
- **Reporter:** Ely
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Plan [BK-1059](https://jira.upexgalaxy.com/browse/BK-1059) description · ATP · synced by sync-jira-issues_
