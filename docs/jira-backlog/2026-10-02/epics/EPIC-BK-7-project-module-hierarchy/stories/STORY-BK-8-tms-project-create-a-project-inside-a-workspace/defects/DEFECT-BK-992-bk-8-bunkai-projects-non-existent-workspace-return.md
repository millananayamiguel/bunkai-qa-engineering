# DEFECT: BK-8: Bunkai Projects: non-existent workspace returns 422 project_limit_reached instead of 403 not_a_member

**Jira Key:** [BK-992](https://jira.upexgalaxy.com/browse/BK-992)
**Related Story:** [BK-8](https://jira.upexgalaxy.com/browse/BK-8) - TMS-Project | Create a project inside a workspace
**Priority:** Low
**Status:** In Review
**Components:** Bunkai Projects
**Severity:** Menor
**Error Type:** Functional
**Test Environment:** Staging
**Fix Type:** Bugfix

---

## Description

## Summary

POST /api/v1/workspaces/{id}/projects returns `422 project*limit*reached` for a non-existent workspace ID instead of `403 not*a*member`.

## Context

Regression introduced by the project-limit trigger (BK-230, migration `0077*billing*upgrade*checkout.sql`). The `bunkai*enforce*project*limit()` trigger runs `BEFORE INSERT` and treats a NULL workspace plan (non-existent workspace) as the "unrecognized plan" fallback `v*limit = -1`, so `0 >= -1` always raises `45700 project*limit_reached`.

## Steps to reproduce

1. Authenticate with a valid PAT holding the `atc:write` scope.
2. `POST /api/v1/workspaces/00000000-0000-0000-0000-000000000000/projects` with a valid JSON body (e.g. `{"name":"probe"}`).
3. Observe the response status and error code.

## Expected

`403 forbidden` with code `not*a*member` (BK-8 AC: an authenticated user who is not a member of the workspace is rejected with 403).

## Actual

`422` with code `project*limit*reached` ("This workspace has reached its Billing Plan's project limit. Upgrade to create more projects.").

## Root cause

`supabase/migrations/0077*billing*upgrade*checkout.sql` lines 171-205: `bunkai*enforce*project*limit()` maps a NULL plan to `v*limit = -1`, making `0 >= -1` always true for a non-existent workspace. Before migration 0077, this path hit RLS `42501 -> 403 not*a_member` correctly.

## Impact

Wrong status code and a misleading billing error on an access-control path. The request is still denied (no unauthorized creation), so there is no data or security exposure. The true non-member case is unaffected. Affects API consumers and automated tests asserting `403 not*a*member`.

---

## 🐞 Actual Result

POST /api/v1/workspaces/00000000-0000-0000-0000-000000000000/projects returns 422 project*limit*reached ('This workspace has reached its Billing Plan's project limit. Upgrade to create more projects.').

---

## ✅ Expected Result

403 forbidden with code not*a*member (BK-8 AC: an authenticated user who is not a member of the workspace is rejected with 403).

---

## 🔍 Root Cause

**Category:** Code Error

---

## 🧫 Evidence

Live probe on staging (2026-09-11): POST to a non-existent workspace returns 422 project*limit*reached. Root cause: bunkai*enforce*project*limit() trigger (migration 0077) maps NULL plan -> v*limit=-1 -> 0>=-1 always raises 45700.

---

## Related Issues

- is caused by: [BK-8](https://jira.upexgalaxy.com/browse/BK-8) - TMS-Project | Create a project inside a workspace

---

## Metadata

- **Created:** 2026-09-11
- **Updated:** 2026-09-24
- **Reporter:** Nahuel Gomez
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_
