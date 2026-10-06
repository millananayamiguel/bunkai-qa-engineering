# ACCEPTANCE TEST RESULTS (ATR): ATR: BK-89: Story Testing

**Jira Key:** [BK-1057](https://jira.upexgalaxy.com/browse/BK-1057)
**Status:** Close
**Components:** Bunkai Workspaces

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

# ATR — BK-89: TMS-Workspace | View the workspaces I belong to

***Verdict******:**** PASSED WITH ISSUES · ****Session******:**** 2026-09-17 · ****Tester******:**** Ely (QA) · ****Environment******:*** staging
***Execution******:**** BK-1057 · ****Plan******:**** BK-1056 · ****Set******:**** BK-1055 · ****Result******:*** 11 passed, 1 failed, 0 blocked
***Supersedes******:*** the 2026-06-12 PARTIAL PASS on this field.

> ***NOTE:*** The previous ATR's CRITICAL blocker no longer exists. `GET /api/v1/workspaces` returns `role` per
workspace (PR #71, merged 2026-07-31), the active-workspace contract is the `bk*active*ws` cookie
shipped by BK-87, and `/settings/workspaces` is live. Every functional clause of AC 1, AC 3 and AC 4
was executed against the real build this session. The one failure is a specification conflict, not
a product defect, and is explained below.

## Results

| TC | Key | Surface | Result |
| --- | --- | --- | --- |
| TC01 | BK-136 | API | PASSED |
| TC02 | BK-139 | API | PASSED |
| TC03 | BK-140 | API + DB | PASSED |
| TC04 | BK-141 | API | PASSED |
| TC05 | BK-1030 | UI + DB | PASSED |
| TC06 | BK-1031 | UI | PASSED |
| TC07 | BK-1032 | UI | PASSED |
| TC08 | BK-1033 | UI | PASSED |
| TC09 | BK-1034 | UI | PASSED |
| TC10 | BK-1035 | UI | PASSED |
| TC11 | BK-1036 | API + DB | PASSED |
| TC12 | BK-1037 | UI | ***FAILED*** — against AC 2 as written; see below |

## What was verified

### API — `GET /api/v1/workspaces`

HTTP 200 with the wrapped object `{ workspaces: [...] }`. Each entry carries `id`, `slug`, `name`, `owner*user*id`, `plan`, `created_at` and, since PR #71, `role`. The three roles the test account holds come back correctly: `owner`, `admin`, `viewer`. Unauthenticated calls return 401 `Authentication required.`; a malformed Bearer token returns 401 `Invalid token.`

### UI — `/settings/workspaces`

The page lists all three active memberships with name and slug, a header badge reading "3 workspaces", and the capitalised role label per row (Owner / Admin / Viewer). The null-role sentinel never appears. Exactly one row carries the active marker at all times.

Worth recording because it is easy to assume otherwise: ***the page does not call the REST endpoint.*** It is a server component querying Supabase directly, so the two surfaces were covered separately and neither result stands in for the other.

### Active-workspace resolution — the part the old plan called undefined

| Cookie state | Expected | Observed |
| --- | --- | --- |
| absent | oldest visible workspace marked | `bunkai-qa-auto-ec8c39` marked, one marker only |
| set to a visible workspace | that row marked | marker moved to `bk337-admin-role-qa` |
| set to a workspace the caller cannot see | fall back, no error | fell back to `bunkai-qa-auto-ec8c39`, zero console errors |

### Isolation and the active-only filter

The instance holds ***689 live workspaces****; the caller sees exactly the ****3*** it actively belongs to. The seeded foreign-tenant fixture `bk337-foreign-tenant-qa` never appears, and the caller holds no membership row in it. The active-only filter is enforced twice — by the RLS policy `workspaces*select*active*member` (which resolves through `bunkai*is*workspace*member`, requiring `status = 'active'`) and by an explicit `.eq('status','active')` on both surfaces' membership query. API count and DB count agree at 3.

***One honest limit on AC 3.*** The account holds no suspended or invited membership, and seeding one means writing shared fixture data that parallel sessions depend on. So the exclusion was verified positively (everything returned is active, counts match) and structurally (RLS + explicit filter), but not by observing a non-active membership being dropped. That negative half is code-verified, not live-verified.

## The failure, and why it is not a blocker

TC12 asserts AC 2's clause that ***no leave or add control is visible****, reinforced by PO Decision 3's read-only ruling. On staging the section renders a ****Leave**** button on the two non-sole-owner workspaces and a ****Delete*** button on the owner one.

Those controls are intentional and traceable: Leave arrived with ***BK-90**** Slice B (the page passes `enableLeaveAction`), Delete with ****BK-512*** under ADR-0015. Both stories were written after BK-89's ACs. The criterion is stale, the build is not wrong, and the functional verification of those two controls belongs to their own stories.

Recalibrated per the severity gate: reported as an Improvement, not a defect, and not treated as a release blocker.

## Findings raised

| Issue | Severity | What it is |
| --- | --- | --- |
| BK-1061 | Moderada | AC 2 still forbids the Leave and Delete controls that BK-90 and BK-512 shipped |
| BK-1062 | Moderada | AC 4 derives the Owner label from `owner*user*id`; the build derives it from the membership role, and the two disagree on real data |
| BK-1063 | Trivial | The active marker is a dot plus the word `active`, where PO Decision 2 asked for an "Activo" badge and a differentiated border |

BK-1062 deserves a second look from the PO rather than a rubber stamp: both BK-337 fixtures are owned by the test account yet grant it `admin` / `viewer`, so under AC 4 as written both rows would have to read "Owner" while the product reads the membership role. The product's reading is the defensible one, which is why this is an AC correction and not a bug.

## Not executed

***AC 2's single-workspace layout.*** The shared account holds three memberships and reducing it to one is a write to fixture data that three parallel sessions share. Every other clause of AC 2 was exercised on the three-workspace state. This is reported as not executed, never as passed.

## Verdict

***PASSED WITH ISSUES — QA sign-off granted.*** Every functional acceptance criterion passes against the live build on staging. The single failure is a documented conflict between BK-89's AC 2 and two stories that shipped after it, carried as BK-1061 and owned by the PO, not by this Story's implementation.

Two open questions still sit in the AC text as `NEEDS PO/DEV CONFIRMATION` markers even though the build answers them. Closing them is bookkeeping, and BK-1061 / BK-1062 are where that bookkeeping now lives.

---

## Related Issues

- created: [BK-1061](https://jira.upexgalaxy.com/browse/BK-1061) - BK-89: AC 2 still forbids the Leave and Delete controls that BK-90 and BK-512 shipped
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
_Source: Xray Test Execution [BK-1057](https://jira.upexgalaxy.com/browse/BK-1057) description · ATR · synced by sync-jira-issues_
