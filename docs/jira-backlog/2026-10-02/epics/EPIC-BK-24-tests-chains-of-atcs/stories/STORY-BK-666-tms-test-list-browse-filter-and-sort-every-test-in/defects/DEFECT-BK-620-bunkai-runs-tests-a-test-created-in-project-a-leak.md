# DEFECT: Bunkai Runs/Tests: a Test created in Project A leaks into Project B's Explorer and is runnable from there (422 is only the downstream symptom)

**Jira Key:** [BK-620](https://jira.upexgalaxy.com/browse/BK-620)
**Related Story:** [BK-666](https://jira.upexgalaxy.com/browse/BK-666) - TMS-Test List | Browse, filter and sort every Test in a Project
**Priority:** Medium
**Status:** Open
**Components:** Bunkai Runs
**Severity:** Moderada
**Error Type:** Functional
**Test Environment:** Staging
**Fix Type:** Bugfix

---

## Description

## The actual defect (corrected framing)

A Test must belong ***exclusively*** to the Project it was created in. It must never be listed in, or reachable from, any other Project's Explorer/Tests panel.

What we observed: a Test created inside ***Energy Insights**** ("Visual confirmation", built on ATC `atc-eb9b1d65`) also appears under ****TMS Bunkai***'s own Explorer -> Tests panel — a completely unrelated project with 0 ATCs of its own at the time. From there it is directly clickable and, once an Environment exists on TMS Bunkai, directly runnable — all from a project that has nothing to do with it.

The confusing `422 environment_invalid` described below is a ***downstream symptom***, not the defect itself. The defect is that the Test is exposed outside its own project's boundary in the first place; the 422 is only what happens when you push that leak all the way to "Start run".

## Steps to reproduce

1. In ***Energy Insights***, create a Test (e.g. "Visual confirmation") using one of its own ATCs.
2. Without doing anything else to associate it, open ***TMS Bunkai*** (a different, unrelated project) and look at its Explorer -> Tests panel.
3. Observe: the Energy Insights Test is listed there too, as if it belonged to TMS Bunkai.
4. Click it from that context — it opens normally at `/projects/tms-bunkai/tests/{test-id`} (same test id as Energy Insights' own URL), with a fully working "Start run" control offering TMS Bunkai's own Environments.
5. Optional, to see the downstream symptom: select a TMS Bunkai Environment and click Start run -> `422 environment_invalid` ("The selected environment is not configured for this Project.").

None of steps 2-4 should be possible in the first place — a Test from Project A should not exist anywhere in Project B's UI.

## Actual result

Test `5d2d0ed2-1eb1-4033-b242-c8c03713afd4` (home project: Energy Insights) is listed and fully reachable/runnable from TMS Bunkai's Explorer, which has no ATCs and no legitimate relationship to that Test. See attached screenshots.

## Expected result

A Test created in Project A must be scoped to Project A only:

- It must not appear in any other project's Explorer/Tests panel.
- It must not be reachable via another project's `/projects/{other-slug}/tests/{id`} route.
- (Compounding, same root cause) When creating a NEW Test, the "ATC Library" picker should only offer ATCs that belong to the current project — not ATCs from every project in the workspace.

## Root cause (technical, DB-verified)

```
tests: id, workspace*id, title...        -- no project*id column at all
test*steps: test*id, atc_id, position    -- a Test is just an ordered chain of ATCs
atcs: id, project*id, module*id...       -- only the ATC carries project_id
```

Because `tests` has no `project_id`, the app has nothing to scope a Test's visibility by, so every project's Explorer ends up listing it (or the Explorer query for "this project's Tests" isn't filtering by the project of the Test's ATC(s) — either way, the missing/ignored constraint is the same). Confirmed the specific instance:

- Test `5d2d0ed2-1eb1-4033-b242-c8c03713afd4` ~~> its only ATC {{de70a4d3~~...}} ~~> ~~`project_id`~~ = Energy Insights ({{5b75a743~~...}})
- That Test nonetheless renders and runs from `/projects/tms-bunkai/...` (project `1495ebc9-...`)
- `POST /api/v1/runs` with a TMS Bunkai environment*id against this Test -> `422 environment*invalid` (backend catches it here, but only here — everything upstream of that call should have refused to show/allow this combination)

## Expected fix direction

Either add `project_id` to `tests` (set at creation, immutable) and filter every Explorer/list/New-Test-ATC-library query by it, or derive and enforce "the Test's project" from its ATC(s) consistently everywhere a Test is listed, opened, or composed — not only at Run-creation time.

## Workaround

None from the UI — a user can currently open and run a foreign project's Test by direct/incidental navigation.

## Found during

Sprint-testing [https://jira.upexgalaxy.com/browse/BK-256#icft=BK-256](https://jira.upexgalaxy.com/browse/BK-256#icft=BK-256) (TMS-Home | Show active test runs summary and table), while creating cross-project test-run fixtures to validate the "workspace has active runs across multiple projects" AC scenario.

---

## 🐞 Actual Result

A Test created in Energy Insights (project*id 5b75a743-...) is listed in and runnable from TMS Bunkai's own Explorer (project*id 1495ebc9-...), a completely unrelated project with 0 ATCs of its own. The 422 environment_invalid on POST /api/v1/runs is only what happens when that leak is pushed to Start Run — the leak itself (Test visible/reachable outside its own project) is the defect.

---

## ✅ Expected Result

A Test must belong exclusively to the project it was created in: it must not appear in another project's Explorer, must not be reachable via another project's /tests/{id} route, and another project's New-Test ATC Library must not offer its ATCs either.

---

## 🔍 Root Cause

**Category:** Code Error

---

## 🧫 Evidence

DB-verified repro: test*id 5d2d0ed2-1eb1-4033-b242-c8c03713afd4 -> ATC project Energy Insights; environment*id 78042f59-db29-4b37-b907-896501d5e7bf -> project TMS Bunkai. POST /api/v1/runs with that pair -> HTTP 422 environment_invalid.

---

## Related Issues

- is caused by: [BK-256](https://jira.upexgalaxy.com/browse/BK-256) - TMS-Home | Show active test runs summary and table
- relates to: [BK-666](https://jira.upexgalaxy.com/browse/BK-666) - TMS-Test List | Browse, filter and sort every Test in a Project

---

## Metadata

- **Created:** 2026-08-26
- **Updated:** 2026-08-31
- **Reporter:** Carlos C
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_
