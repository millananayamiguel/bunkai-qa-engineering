# ACCEPTANCE TEST RESULTS (ATR): ATR: BK-258: Story Testing

**Jira Key:** [BK-1108](https://jira.upexgalaxy.com/browse/BK-1108)
**Status:** Close
**Components:** Bunkai Bugs

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

## BK-258 TEST RESULTS

| Field | Value |
| --- | --- |
| Story | BK-258: TMS-Home | Show open bug count and severity breakdown |
| Tested | 2026-09-29 |
| Environment | Staging (https://staging-upexbunkai.vercel.app), app code at origin/staging@36198b9d |
| Tester | Benjamin Segovia (test user: staging-qa3, Owner of "QA Automation Workspace") |
| Result | ***PASSED WITH ISSUES*** (11/13 passed, 0 failed, 2 blocked) |

## Summary

The Home "Open bugs" card was tested end to end on staging: total count and P1-P4 severity breakdown (AC1), zero state (AC2), plus risk beyond the ACs: status rule, archived-module exclusion, count 0/1/many, live updates across the bug lifecycle, workspace isolation, API contract, auth and input validation, and presentation (not colour-only, Home layout intact, mobile width).

Every executed case passed and no defect was found in BK-258 scope. Two cases are blocked by preconditions that cannot be reached on staging (not defects), detailed below.

| Metric | Value |
| --- | --- |
| Total | 13 |
| Passed | 11 |
| Failed | 0 |
| Blocked | 2 |
| Pass rate (executed) | 11/11 (100%) |
| Pass rate (total) | 11/13 (85%) |

## Test Cases

| TC | Xray key | Scenario | Result |
| --- | --- | --- | --- |
| TC1 | BK-1093 | Total and P1-P4 breakdown, total equals sum of chips | PASSED |
| TC2 | BK-1094 | open and in_progress counted, resolved and closed not | PASSED |
| TC3 | BK-1095 | Bugs in an archived module excluded | PASSED |
| TC4 | BK-1096 | Zero state: 0 + "Nothing outstanding right now.", no chips (3 rows) | PASSED |
| TC5 | BK-1097 | Exactly one open bug, zero-count chips still shown | PASSED |
| TC6 | BK-1098 | Counts follow create and status transitions | PASSED |
| TC7 | BK-1099 | Only the active workspace's bugs are counted | PASSED |
| TC8 | BK-1100 | API contract and UI/API parity (bearer, PAT, cookie) | PASSED |
| TC9 | BK-1101 | 401 without auth, 403 PAT without atc:read, 200 with it | PASSED |
| TC10 | BK-1102 | 400 bad_request on non-UUID id | PASSED |
| TC11 | BK-1103 | Foreign or nonexistent workspace id returns zeroes, no leak | BLOCKED |
| TC12 | BK-1104 | Error state instead of zero when the count cannot be read | BLOCKED |
| TC13 | BK-1105 | Severity not shown by colour only, Home layout intact | PASSED |

- ***TC11 BK-1103******:****** BLOCKED — foreign-workspace-with-bugs row unreachable.*** It needs a second staging account or DB access to find a workspace the test user is not a member of that has open bugs; only one staging account has credentials and no DB access was available. The executed rows passed: random nonexistent UUID and nil UUID return 200 with zeroes, byte-identical to an empty workspace (bearer and PAT), and a forged active-workspace cookie falls back to the user's own workspace.
- ***TC12 BK-1104******:****** BLOCKED — unreachable precondition.*** Staging has no fault hook to make the server-side count fail. Code review at origin/staging@36198b9d shows the card renders the error state (not a zero) on a failed read and the API returns 500 internal_error. Runtime behaviour is unverified.
- Xray run status for TC11 and TC12 is TODO (this Xray instance has no BLOCKED status); the reason is in each run comment.

## Coverage Notes

- AC1 verified by TC1, TC2, TC3, TC5, TC6, TC7, TC8. AC2 verified by TC4 (empty workspace, only resolved bugs, only bugs in an archived module).
- Accepted product decisions tested as rules: "open" = open + in_progress; bugs in archived modules excluded; zero state hides the severity chips.
- Edge cases beyond the TCs: backward and skip bug transitions rejected with 422; uppercase UUID accepted; UUID of 35/37 chars and SQL-like input rejected with 400; 390px viewport wraps correctly; accessibility tree exposes region, heading and list.
- DB leg not available in this session. The open-bugs API plus the project bug-list aggregates were used as the reconciliation oracle.

## Test Data

| Entity | Name | ID |
| --- | --- | --- |
| User | staging-qa3 (Owner) | from .env |
| Workspace A | QA Automation Workspace | a53d640a-23e7-4b74-b728-b32e31204941 |
| Workspace B (fixture) | BK-258 QA Fixture | 6fdd4771-e08a-4305-8723-1aec994d568a |
| Project (A) | BK258 QA Open Bugs | cd77f3ee-7dfa-4bc7-8174-f9532e93d0ea |
| Project (B) | BK258 Fixture Project | 27fcbe97-8bba-4409-87b4-2cfe18cfd4aa |
| Bugs | 15 bugs titled "[BK-258 QA] ..." | seeded for TC1-TC7 |
| PATs | 3 short-lived tokens (atc:read, run:execute, atc:read bound to B) | revoked |

## Evidence

Stored with the Story's QA evidence:

- BK-258-smoke-home.png
- BK-258-ac1-tc1-total-and-breakdown.png
- BK-258-ac1-tc2-status-rule.png
- BK-258-ac1-tc3-before-archive.png, BK-258-ac1-tc3-after-archive.png
- BK-258-ac2-tc4-row1-empty-workspace.png, BK-258-ac2-tc4-row2-only-resolved.png, BK-258-ac2-tc4-row3-only-archived.png
- BK-258-ac1-tc5-exactly-one-bug.png
- BK-258-ac1-tc6-1-created.png, BK-258-ac1-tc6-2-in-progress.png, BK-258-ac1-tc6-3-resolved.png, BK-258-ac1-tc6-4-closed.png
- BK-258-ac1-tc7-workspace-a-isolated.png
- BK-258-ac1-tc11-forged-cookie.png
- BK-258-ac1-tc13-home-layout-a11y.png, BK-258-ac1-tc13-mobile-390.png

## Bugs Found

None in BK-258 scope.

## Observations

Non-blocking, not BK-258 defects:

- ***BK-259 Coverage card returns 500 in workspace A.*** GET /api/v1/workspaces/{id}/coverage -> 500 internal*error (request*id c646076a-a1d2-4933-8874-2680b73a5e45); 200 in the small fixture workspace. Present at smoke before any seeding; likely scale related. Follow-up candidate for BK-259.
- ***Chip tooltip grammar at count 1*** reads "1 open P4 (Trivial) bugs" (plural). Cosmetic.
- ***Cache-Control "public"*** (max-age=0, must-revalidate) on an authenticated per-user payload. Framework default; max-age=0 + must-revalidate means no shared cache serves it stale.
- ***Duplicate test id during streaming******:*** home-open-bugs-count can briefly resolve to 2 elements while the Suspense placeholder is still attached. Not user-visible; automation should wait for the skeleton to detach.
- ***Workspace-bound PAT can read other workspaces of the same user.*** By design per ADR-0006 (PAT workspace binding enforced for admin operations only); not cross-tenant.
- ***Mockup deviations*** were reviewed and accepted as intentional.
- ***Xray has no BLOCKED run status*** on this instance; blocked cases are recorded as TODO with the reason in the run comment.

## Test Data Cleanup

- Done: all 15 "[BK-258 QA]" bugs moved forward to closed; all 4 QA modules archived; 3 PATs revoked; workspace A back to its exact baseline (4 open: P1 1, P2 2, P3 1, P4 0).
- Not possible: the fixture workspace "BK-258 QA Fixture" and the 2 QA projects cannot be deleted or archived through the product (no endpoint). Left empty: no open bugs, only archived modules.

## Recommendations

- Automation candidates for Stage 4 ROI: TC1, TC2, TC4, TC7 (P0) and the API cases TC8-TC10.
- Unblock TC11 with a second staging account (or DB read access), and TC12 with a Dev fault hook, before relying on them in regression.
- Raise the BK-259 coverage 500 as a separate report.

---

## Related Issues

- tests: [BK-258](https://jira.upexgalaxy.com/browse/BK-258) - TMS-Home | Show open bug count and severity breakdown

---

## Metadata

- **Created:** 2026-09-28
- **Updated:** 2026-09-29
- **Reporter:** Benjamin Segovia
- **Assignee:** Benjamin Segovia

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Execution [BK-1108](https://jira.upexgalaxy.com/browse/BK-1108) description · ATR · synced by sync-jira-issues_
