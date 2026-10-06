# TEST: BK-498: TC7: should reject module creation with a membership-403 given a correctly-scoped atc:write PAT whose user is not a workspace member

**Jira Key:** [BK-569](https://jira.upexgalaxy.com/browse/BK-569)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens, Bunkai Modules

---

## Test Description

## Related Story

[https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) — PAT | Enforce capability scopes on the authoring domain

## Priority / ROI

- Priority: High
- ROI score: 16.0 (Frequency x Impact x Stability / Effort x Dependencies)
- Outcome: Candidate

## Prior bugs covered

- (none)

## Test Design

### Preconditions

- PAT correctly scoped `atc:write`, bound
- The underlying user is NOT a member of the target project's workspace

### Action

`POST /api/v1/projects/{project_id}/modules` using that PAT.

### Expected Results (assertions of this TC — same precondition+action)

- `403` is returned but with reason `"not*a*member"` (message differs from TC2's capability-403) — proves the gate correctly separates "wrong scope" from "not a workspace member" instead of conflating the two
- Zero DB side effect

### Gherkin (Candidate)

```
@high @regression @automation-candidate @BK-498
Scenario: Reject module creation with a membership-403 given a correctly-scoped atc:write PAT whose user is not a workspace member
  Given a PAT correctly scoped atc:write, bound to a workspace
  And the underlying user is NOT a member of {project_id}'s workspace
  When the user sends POST /api/v1/projects/{project_id}/modules using that PAT
  Then the response status is 403 with reason "not*a*member"
  And zero rows are inserted into the modules table for this attempt
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
- **Labels:** automation-candidate, high, integration, regression

---

_Synced from Jira by sync-jira-issues_
