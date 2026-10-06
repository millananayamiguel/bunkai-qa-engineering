# ACCEPTANCE TEST RESULTS (ATR): ATR: BK-88: Story Testing

**Jira Key:** [BK-1060](https://jira.upexgalaxy.com/browse/BK-1060)
**Status:** Close
**Components:** Bunkai API Tokens

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

# ATR - BK-88: Settings | Manage Personal Access Tokens

***Verdict****: PASSED WITH ISSUES - the feature works end to end; two quality issues are filed and one acceptance criterion could not be observed on the available fixture. ****Session****: 2026-09-17, tester Ely (fleet worker W1, sprint 4) ****Environment****: staging - https://staging-upexbunkai.vercel.app ****Execution***: BK-1060 (30 runs) - Plan BK-1059, Set BK-1058

## What this session changes about the previous verdict

The 2026-06-12 ATR read PARTIAL FAIL on an API-only pass, with 17 UI outlines parked and a critical privilege-escalation defect open. Every one of those conditions has moved.

| Then (2026-06-12) | Now (2026-09-17) |
| --- | --- |
| UI unreachable: BK-87 Settings Hub was Ready For Dev | Settings > Tokens is live and fully walked |
| 1 of 14 TCs executed | 29 of 30 executed, 27 PASSED |
| BK-135 privilege escalation OPEN (critica) | Verified fixed, three-way role gate confirmed |
| 19 workspace:admin PATs held by a member-role user | Zero active workspace:admin PATs held by any non-admin, confirmed in the database |

## Results

| Outcome | Count | Tests |
| --- | --- | --- |
| PASSED | 27 | TC01-TC17, TC19-TC23, TC25-TC28, TC30 |
| FAILED | 2 | TC18 (BK-1042), TC29 (BK-1053) |
| NOT OBSERVED | 1 | TC24 (BK-1048) - fixture limitation, not a product failure |

### API surface - 14 of 14 PASSED

Executed against the live staging API with a real cookie session and a real Bearer PAT, every result cross-checked in the database.

| TC | Assertion | Observed |
| --- | --- | --- |
| TC01 | POST issues a token, secret returned once | 201, secret matches bk*pat*<12>.<secret>, warning present |
| TC02 | GET returns prefix only | 200, 9 fields per row, no secret pattern anywhere in the payload, prefix exactly 12 chars |
| TC03 | DELETE soft-revokes | 204 (not the 200 the TC documented; the OpenAPI contract says 204), revoked_at stamped |
| TC04 | POST unauthenticated | 401 unauthorized |
| TC05 | GET unauthenticated | 401 unauthorized |
| TC06 | DELETE unauthenticated | 401 unauthorized |
| TC07 | Scope outside the enum | 422 validation_failed |
| TC08 | workspace:admin without the role | 403 - see the role gate below |
| TC09 | Name of exactly 80 chars | 201, persisted name length 80 |
| TC10 | Name of 81 chars | 422 validation_failed |
| TC11 | RLS isolation on GET | GET returned 39 rows; the database holds exactly 39 rows for this user. No leakage |
| TC12 | Cross-user DELETE | 404 "Token not found or already revoked." and the other user's revoked_at stayed null |
| TC13 | Double revoke | 404, same message - no existence leak between the two cases |
| TC14 | Revoked PAT reused | 401 "Invalid token." on the next call |

### The BK-135 regression, in full

The role gate is now enforced on all four rows of its decision table, verified from a single session because the staging owner account holds three different roles in three workspaces.

| workspace:admin requested | workspace_id | caller role there | Expected | Observed |
| --- | --- | --- | --- | --- |
| yes | omitted | owner elsewhere | 403 | 403 "workspace:admin tokens must target a specific workspace (workspace_id required)." |
| yes | supplied | viewer | 403 | 403 "Only workspace admins or owners can issue workspace:admin tokens." |
| yes | supplied | owner | 201 | 201, row persisted with that workspace_id and the workspace:admin scope |
| no | omitted | any | 201 | 201 |

Database corroboration: zero active workspace:admin tokens are held by a user without an admin or owner role, and zero scoped ones by a user lacking that role in the targeted workspace. The last unscoped workspace:admin token on the instance was created 2026-08-05, before the gate landed; 17 such rows survive, all belonging to one owner-role user, so they are residue rather than exposure.

### UI surface

| TC | Assertion | Observed |
| --- | --- | --- |
| TC15 | Secret revealed once with the warning | "Token created" dialog, full secret, "Store this token now - it cannot be retrieved later.", copy and done controls present |
| TC16 | Secret leaves the DOM after dismissal | Dialog unmounted, secret absent from the rendered HTML, only the 12-char prefix remains in the row |
| TC17 | Copy control works | Clipboard contents matched the secret exactly; live region announced the copy |
| TC18 | Zero-scope submission | Submit disabled, no POST sent - but no inline validation error. ***FAILED***, Defect BK-1079 |
| TC19 | List columns and no secret | Token / Scopes / Workspace / Created / Expires / Actions all populated; no full-secret pattern in the DOM |
| TC20 | Revoked row is distinct | Struck-through name, "revoked" badge, revoke action replaced by a revoked date, active count decremented |
| TC21 | Revocation asks first | Alert dialog naming the token and warning the action cannot be undone |
| TC22 | Row updates without a reload | Row flipped to revoked and a window-level sentinel set before the action survived, proving no document reload |
| TC23 | Cancel leaves it active | Dialog closed, revoke control still present, token still active |
| TC24 | Empty state | ***NOT OBSERVED*** - see below |
| TC28 | Name normalization | "BK88 W1 UI Token" was stored as "bk88-w1-ui-token"; the field hint discloses the convention but the input never shows the rewrite |
| TC29 | Clipboard failure | Reports success when the write fails. ***FAILED***, Improvement BK-1080 |
| TC30 | Expiry window | A 30-day choice produced an Expires cell of 2026-10-18 and expires_at 30 days out |

## Why TC24 was not observed

The empty state could not be reached, and the reason is worth recording because it will recur. The shared staging account holds 38 active tokens; the list is rendered on the server, so there is no client request to stub; and revoked tokens are never removed from the list. Together those mean ***an account that has ever issued a token can never return to the empty state***. AC8 is only observable on a never-used user. This is a fixture gap, not evidence of a defect - the empty state exists in the shipped code - but it stays unverified until such a fixture exists.

## Quality issues filed

| Key | Type | Severity | What |
| --- | --- | --- | --- |
| BK-1079 | Defect | menor | Zero-scope submission gives no inline validation error, only a silently disabled control, which AC2 explicitly asks for and which leaves screen-reader users with no stated reason |
| BK-1080 | Improvement | mayor | The copy control reports "Copied" even when the clipboard write fails, and the secret is unrecoverable once the dialog closes. This is PO Open Question #4, still unanswered |

Neither blocks release. The defect is a conformance and accessibility gap with no data or security impact; the improvement is an unspecified failure path that the acceptance criteria never defined.

## Open PO questions, revisited

1. **Should revoked tokens appear in the list?** Answered by the implementation: they stay, struck through with a badge, permanently. Worth an explicit PO decision because it is what makes AC8 unverifiable after first use.
2. **Exact copy for the revocation dialog?** Shipped and observed.
3. **Are expiry and workspace shown?** Yes, both as columns in the list and as optional controls in the form.
4. **Clipboard fallback?** Still unanswered, and BK-1080 is the cost of leaving it that way.

## Test data hygiene

Four tokens were created by this session, all named `bk88-w1-*`, and all four were revoked before reporting. No token created by another session was touched. Verified in the database.

---

## Related Issues

- created: [BK-1079](https://jira.upexgalaxy.com/browse/BK-1079) - Settings > Tokens: zero-scope submission gives no inline validation error, only a silently disabled control (AC2)
- created: [BK-1080](https://jira.upexgalaxy.com/browse/BK-1080) - Settings > Tokens: copy control reports 'Copied' even when the clipboard write fails, risking loss of an unrecoverable secret
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
_Source: Xray Test Execution [BK-1060](https://jira.upexgalaxy.com/browse/BK-1060) description · ATR · synced by sync-jira-issues_
