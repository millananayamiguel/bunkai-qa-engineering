# DEFECT: Billing: Checkout: workspace-existence enumeration oracle on POST /billing/checkout (403 for foreign vs 422 for non-existent)

**Jira Key:** [BK-829](https://jira.upexgalaxy.com/browse/BK-829)
**Related Story:** [BK-230](https://jira.upexgalaxy.com/browse/BK-230) - Billing | Upgrade to a paid plan
**Priority:** High
**Status:** In Review
**Components:** Bunkai Billing
**Severity:** Mayor
**Error Type:** Security
**Test Environment:** Staging
**Fix Type:** Bugfix

---

## Description

**SUMMARY**

`POST /api/v1/workspaces/{id}/billing/checkout` returns ***distinguishable*** responses for "workspace exists but caller is not the owner" versus "workspace does not exist":

- existing-but-foreign workspace -> ***HTTP 403*** `not*workspace*owner` ("Only the workspace owner can start a plan upgrade")
- non-existent workspace -> ***HTTP 422*** ("workspace_id does not reference an existing workspace")

Any authenticated user can therefore probe whether an arbitrary workspace id exists. `GET /api/v1/workspaces/{id}/billing` is clean by contrast (uniform ***404 "Workspace not found."*** for both cases). Mitigating factors: workspace ids are UUIDv4 (not enumerable by increment) and no workspace data is returned either way — so this is a hardening gap, not a data-exposure breach.

---

**STEPS TO REPRODUCE**

#### 1 - Precondition: authenticate (cookie session) as a user who is ***not*** a member of the target workspace.
#### 2 - `POST /api/v1/workspaces/{existingForeignWorkspaceId}/billing/checkout` body `{"seat*quantity":1}` -> ***HTTP 403*** `not*workspace_owner`.
#### 3 - `POST /api/v1/workspaces/{randomNonExistentUuid}/billing/checkout` body `{"seat*quantity":1}` -> ***HTTP 422*** "workspace*id does not reference an existing workspace".
#### 4 - The two responses differ in status and body -> the caller learns whether the id exists.
#### 5 - Compare: `GET /api/v1/workspaces/{id}/billing` returns a uniform ***404 "Workspace not found."*** for both, disclosing nothing.

---

**TECHNICAL ANALYSIS**

- **Route****:** `POST /api/v1/workspaces/[id]/billing/checkout`
- **Ordering****:** the existence check (422) and the ownership check (403) surface as separate outcomes rather than collapsing to one uniform response
- **Reference****:** master-test-plan section 4 (tenant isolation / non-disclosure)
- **No row created** on either the 403 or the 422 path (verified in `billing*checkout*sessions`)

---

**IMPACT**

- An authenticated tenant can confirm the existence of workspace ids belonging to other tenants (existence oracle).
- Low exploitability (UUIDv4 ids, no data returned), but it is an explicit deviation from the non-disclosure standard the sibling GET route already meets.

---

**RELATED STORIES**

- Source: BK-230 (Billing | Upgrade to a paid plan)
- Epic (product area): BK-224 (Billing & Plans)
- Related class: BK-135 (privilege-escalation via direct API call)

---

## 🐞 Actual Result

- Foreign existing workspace: `POST .../billing/checkout` -> ***403*** `not*workspace*owner`.
- Non-existent workspace: `POST .../billing/checkout` -> ***422*** "workspace_id does not reference an existing workspace".
- Responses are distinguishable -> workspace-existence enumeration oracle for any authenticated user.
- `GET .../billing` is uniform (404 both cases).

---

## ✅ Expected Result

- `POST .../billing/checkout` should return an ***identical*** response (same status + body) whether the target workspace exists-but-is-foreign or does not exist — e.g. a uniform 404 / 403, matching the non-disclosure behavior of `GET .../billing`.
- The caller must not be able to infer workspace-id existence across tenants.

---

## 🔍 Root Cause

**Category:** Code Error

---

## 🧫 Evidence

- Session record: `.session/sprint-testing/BK-230/test-session-memory.md` (Stage 2 "API exploration" TC23 row + Finding 5)
- Reproduced 2026-09-01 on staging with a cookie session (non-member of target) via in-page fetch + curl.

---

## Related Issues

- is caused by: [BK-230](https://jira.upexgalaxy.com/browse/BK-230) - Billing | Upgrade to a paid plan

---

## Metadata

- **Created:** 2026-09-01
- **Updated:** 2026-09-24
- **Reporter:** Carlos C
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_
