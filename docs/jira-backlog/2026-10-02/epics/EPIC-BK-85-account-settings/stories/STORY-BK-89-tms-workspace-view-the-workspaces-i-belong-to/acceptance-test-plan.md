# ACCEPTANCE TEST PLAN (ATP): ATP: BK-89: TMS-Workspace | View the workspaces I belong to

**Jira Key:** [BK-1056](https://jira.upexgalaxy.com/browse/BK-1056)
**Status:** Completed
**Components:** Bunkai Workspaces

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

# ATP — BK-89: TMS-Workspace | View the workspaces I belong to

***Status******:**** ACTIVE — full re-test (UI + API + DB) · ****Session******:**** 2026-09-17 · ****Tester******:*** Ely (QA)
***Environment******:**** staging (`https://staging-upexbunkai.vercel.app`) · ****Modality******:*** Xray on Jira
***Supersedes******:*** the 2026-06-12 API-only partial plan on this field.

> ***NOTE:*** This is a RE-TEST, not a first pass. The two blockers that froze the previous plan are gone:
PR #71 (merged 2026-07-31) added the `role` field to `GET /api/v1/workspaces`, and the
active-workspace contract turned out to already exist as the `bk*active*ws` cookie plus
`resolveActiveWorkspaceId`, shipped by BK-87. Every outline the old plan parked as "blocked" is
re-evaluated below on its merits, not inherited.

## What changed since the last plan

| Old blocker | State today | Evidence |
| --- | --- | --- |
| `role` absent from `GET /api/v1/workspaces` | RESOLVED | live GET returns `role` per workspace |
| "active workspace" has no data contract | RESOLVED | `bk*active*ws` cookie + `resolveActiveWorkspaceId` |
| BK-87 Settings Hub not shipped | RESOLVED | BK-87 Ready For Release; `/settings/workspaces` live |
| test account is single-workspace | WRONG | the account holds 3 active memberships, 3 distinct roles |

## Surfaces under test — they are NOT the same code path

The UI does ***not*** consume `GET /api/v1/workspaces`. `settings/workspaces/page.tsx` is a server
component that queries Supabase directly. Covering the endpoint therefore proves nothing about the
page, and vice versa, so both surfaces carry their own cases.

| Surface | Path | Auth |
| --- | --- | --- |
| UI | `/settings/workspaces` | cookie session |
| API | `GET /api/v1/workspaces` | Bearer PAT (scope `atc:read`) |
| DB | `workspaces` + `workspace_members` | direct, read-only cross-validation |

## Test data actually available

| Workspace | Slug | Role | Membership status |
| --- | --- | --- | --- |
| Bunkai QA Automation | `bunkai-qa-auto-ec8c39` | owner | active |
| BK-337 Admin Role (QA fixture) | `bk337-admin-role-qa` | admin | active |
| BK-337 Viewer Role (QA fixture) | `bk337-viewer-role-qa` | viewer | active |

No suspended or invited membership exists for this account, and the instance holds only two
non-active membership rows in total, both belonging to other users.

## Coverage — 12 cases, all in ATS BK-1055

| TC | Key | Surface | Covers | Technique |
| --- | --- | --- | --- | --- |
| TC01 | BK-136 | API | AC1 response shape | positive path |
| TC02 | BK-139 | API | security floor | negative auth |
| TC03 | BK-140 | API + DB | AC3 active-only filter | integration cross-check |
| TC04 | BK-141 | API | AC1 + AC4 role per workspace | contract, ***expected result inverted by PR #71*** |
| TC05 | BK-1030 | UI + DB | AC1 list completeness | equivalence partition |
| TC06 | BK-1031 | UI | AC1 + AC4 role labels | decision table over the role enum |
| TC07 | BK-1032 | UI | AC1 + AC2 active marker | positive path |
| TC08 | BK-1033 | UI | active marker follows the cookie | state transition |
| TC09 | BK-1034 | UI | absent / unresolvable cookie | boundary + error guessing |
| TC10 | BK-1035 | UI | unauthenticated access | negative auth |
| TC11 | BK-1036 | API + DB | cross-tenant isolation | risk beyond the ACs |
| TC12 | BK-1037 | UI | AC2 read-only surface | negative, per PO Decision 3 |

TC04's title and expected result were rewritten this session: it used to assert that `role` is
**absent** and to stand as proof of the blocker. Asserting the old expectation today would fail against
correct behaviour, which is why the flip happens in planning rather than in execution.

## Risk beyond the acceptance criteria

1. ***Cross-tenant leakage*** is the highest-cost failure on this surface and no AC names it. TC11

   covers it, anchored on the RLS policy `workspaces*select*active_member`.

1. ***Unresolvable cookie value.*** `resolveActiveWorkspaceId` falls back to the first visible

   workspace. A stale or foreign id must not error, and must not mark a row the caller cannot see.

1. ***Null role rendering.*** `roleLabel(null)` returns the sentinel `No workspace yet`. Any row that

   renders it in a list context is a defect, because the row only exists if a membership exists.

## Known specification gaps carried into execution

- AC1 and AC3 still carry unresolved `NEEDS PO/DEV CONFIRMATION` markers. The build answers them;

  the ACs do not. Execution reports what the build does and raises the gap, it does not invent intent.

- ***AC4 vs the build.*** AC4 says the "Owner" label resolves from `owner*user*id == the user`. The

  build labels from the caller's membership `role`. Both BK-337 fixtures are owned by this account
  yet carry `admin` / `viewer` memberships, so the two readings visibly disagree on real data.

- ***AC2 vs BK-90.*** AC2 and PO Decision 3 freeze this surface read-only, but the page now passes

  `enableLeaveAction` because BK-90 Slice B shipped on top of it. TC12 records what is actually there.

- ***PO Decision 2 vs the build.*** The decision asked for an "Activo" badge plus a differentiated

  border. The component renders a dot and the lowercase word `active`, no border change.

## Not executable this session

***AC2's single-workspace state.*** The shared account holds three memberships, and reducing it to one
means writing to shared fixture data that three parallel sessions depend on. Every other clause of
AC2 (role label present, no broken layout, no leave/add control) is exercised on the three-workspace
state. The single-workspace layout itself is reported as NOT EXECUTED with this reason, never as passed.

## Exit criteria

Every AC either carries an executed case with evidence, or a stated reason it could not run. The
verdict names the blocking findings explicitly and does not average them away.

---

## Related Issues

- tests: [BK-89](https://jira.upexgalaxy.com/browse/BK-89) - TMS-Workspace | View the workspaces I belong to

---

## Metadata

- **Created:** 2026-09-18
- **Updated:** 2026-09-18
- **Reporter:** Ely
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Plan [BK-1056](https://jira.upexgalaxy.com/browse/BK-1056) description · ATP · synced by sync-jira-issues_
