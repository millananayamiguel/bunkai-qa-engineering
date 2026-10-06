# TEST: BK-498: TC1: should create module successfully given a PAT scoped exactly atc:write

**Jira Key:** [BK-556](https://jira.upexgalaxy.com/browse/BK-556)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens, Bunkai Modules

---

## Test Description

## Related Story

[https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) — PAT | Enforce capability scopes on the authoring domain

## Priority / ROI

- Priority: Critical
- ROI score: 25.0 (Frequency x Impact x Stability / Effort x Dependencies)
- Outcome: Candidate

## Prior bugs covered

- (none)

## Test Design

### Preconditions

- `{atc*write*pat`} bound to `{workspace_id`}
- User is an active member of `{project_id`}'s workspace

### Action

`POST /api/v1/projects/{project*id}/modules` with a valid module payload, using `{atc*write_pat`}.

### Expected Results (assertions of this TC — same precondition+action)

- `201` is returned
- The created module row exists in the `modules` table

### Gherkin (Candidate)

```
@critical @regression @automation-candidate @BK-498
Scenario: Create a module successfully with a PAT scoped exactly atc:write
  Given a PAT `{atc*write*pat}` bound to `{workspace_id}`
  And the underlying user is an active member of `{project_id}`'s workspace
  When the user sends POST /api/v1/projects/{project*id}/modules with a valid module payload using `{atc*write_pat}`
  Then the response status is 201
  And the created module row exists in the modules table
```

## Variables

| ***Variable**** | ****Description**** | ****How to obtain*** |
| --- | --- | --- |
| `{project_id`} | Target project UUID | `BK264 Defect Triage` project, id `2fee236f-1246-40c4-bfc4-d332287f9548` (staging DB, `staging-dbhub`) |
| `{workspace_id`} | Bound workspace UUID | `BK-264 QA Sandbox`, id `6646f244-a28c-441e-8486-9af33bdb5c11` |
| `{module_id`} | Existing module UUID (for GET routes) | `Defect Triage Module`, id `175f8a08-20b9-4c96-a21a-e02dcae2837e` |
| `{atc*write*pat`} | Freshly minted PAT scoped exactly `atc:write` | `POST /api/v1/auth/signin` (cookie jar) -> `POST /api/v1/tokens` with `scopes: ["atc:write"]` + `workspace_id` |
| `{atc*read*pat`} | Freshly minted PAT scoped exactly `atc:read` | same mint flow, `scopes: ["atc:read"]` |

## Implementation Code (filled by test-automation)

| ***Layer**** | ****File*** |
| --- | --- |

## Architecture

Integration (API-only) — no UI surface, follows KATA API layers (ApiBase -> AuthApi/etc component -> ATC).

## Available Test IDs (UI)

N/A — API-only Story, no UI surface in scope.

## Refinement Notes

None — ATP validated against live code at Session Start, no discrepancies found.

---

## Related Issues

- tests: [BK-498](https://jira.upexgalaxy.com/browse/BK-498) - PAT | Enforce capability scopes on the authoring domain

---

## Metadata

- **Created:** 2026-08-21
- **Updated:** 2026-08-23
- **Reporter:** Luis Eduardo Flores Villarroel
- **Assignee:** Luis Eduardo Flores Villarroel
- **Labels:** automation-candidate, critical, integration, regression

---

_Synced from Jira by sync-jira-issues_
