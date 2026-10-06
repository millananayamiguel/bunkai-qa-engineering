# TEST: BK-89: TC13: should return Workspace detail consistent with its list entry when fetched by ID

**Jira Key:** [BK-1089](https://jira.upexgalaxy.com/browse/BK-1089)
**Status:** Draft
**Components:** Bunkai Workspaces

---

## Test Description

## Related Story

BK-89 - TMS-Workspace | View the workspaces I belong to

## Priority / ROI

- Priority: High
- ROI score: 4.0 = (Frequency 5 x Impact 4 x Stability 4) / (Effort 1 x Dependencies 2) / 10
- Outcome: Candidate

## Prior bugs covered

None. This Test protects an API contract boundary already exercised by the critical smoke path.

## Test Design

### Preconditions

- Caller is authenticated for the Workspace API.
- GET /api/v1/workspaces returns at least one visible Workspace.

### Action

Select a visible Workspace from GET /api/v1/workspaces and request GET /api/v1/workspaces/{workspace_id}.

### Expected Results

- List and detail requests return HTTP 200.
- Detail response contains a Workspace object.
- Detail matches the selected list entry exactly for id, slug, name, owner*user*id, plan, and created_at.

### Gherkin

```gherkin
@critical @regression @automation-candidate @integration @BK-89
Scenario: should return Workspace detail consistent with its list entry when fetched by ID
  Given an authenticated caller can see at least one Workspace
  When the caller requests that Workspace by its listed ID
  Then the detail request succeeds
  And id, slug, name, owner*user*id, plan, and created_at match the list entry
```

## Variables

- {listed_workspace}: first visible Workspace returned by GET /api/v1/workspaces.
- {workspace*id}: {listed*workspace}.id.
- {api_auth}: configured authenticated API context; no credential is stored in this Test.

## Implementation Code

- API component: tests/components/api/WorkspaceApi.ts
- Test file: tests/integration/workspaces/listWorkspaces.test.ts
- Fixture: tests/components/TestFixture.ts

## Architecture

Integration API test following KATA component and fixture layers.

## Available Test IDs (UI)

N/A - API-only coverage.

## Refinement Notes

Existing smoke coverage currently combines BK-136 list validation with this detail/coherence behavior. Phase 9B must update source traceability before BK-1089 can move from Candidate to AUTOMATED.

---

## Metadata

- **Created:** 2026-09-22
- **Updated:** 2026-09-22
- **Reporter:** José Andrés Lorca
- **Assignee:** José Andrés Lorca
- **Labels:** BK-89, automation-candidate, critical, integration, regression

---

_Synced from Jira by sync-jira-issues_
