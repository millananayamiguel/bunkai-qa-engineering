# TEST: BK-498: TC15: should complete a full import lifecycle (create then poll) successfully given a PAT scoped both atc:write and atc:read

**Jira Key:** [BK-568](https://jira.upexgalaxy.com/browse/BK-568)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens, Bunkai Imports

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

- `{dual*scope*pat`} exists — a PAT scoped with BOTH `atc:write` and `atc:read`

### Action

Send `POST /api/v1/imports` (queues the import job) using `{dual*scope*pat`}, then poll `GET /api/v1/imports/{id`} (using the id from the create response) using the same dual-scope token, repeating until the job completes.

### Expected Results (assertions of this TC — same precondition+action)

- `POST /api/v1/imports` returns `202 Accepted` with a job id
- `GET /api/v1/imports/{id`} returns `200 OK` once the job has completed
- ***This is the positive control proving TC11's and TC14's Import-family**** `403` ****rows are expected behavior, not a defect*** — a client needs BOTH `atc:write` and `atc:read` scopes for the full import workflow (create + poll), per the ratified 2026-08-19 AI Product Owner decision on BK-498's comments

### Gherkin (Candidate)

```
@high @regression @automation-candidate @BK-498
Scenario: should complete a full import lifecycle (create then poll) successfully given a PAT scoped both atc:write and atc:read
  Given a PAT scoped with both atc:write and atc:read exists ({dual*scope*pat})
  When the user sends POST /api/v1/imports using the dual-scope token
  Then the response status is 202 with a job id
  When the user polls GET /api/v1/imports/{id} using the dual-scope token until the job completes
  Then the response status is 200
  And this proves a client needs both atc:write and atc:read to complete the Imports workflow, confirming the 403s seen in TC11/TC14 for the Imports family are expected, not a defect
```

## Variables

| ***Variable**** | ****Description**** | ****How to obtain*** |
| --- | --- | --- |
| `{project_id`} | Target project UUID | `BK264 Defect Triage` project, id `2fee236f-1246-40c4-bfc4-d332287f9548` (staging DB, `staging-dbhub`) |
| `{workspace_id`} | Bound workspace UUID | `BK-264 QA Sandbox`, id `6646f244-a28c-441e-8486-9af33bdb5c11` |
| `{module_id`} | Existing module UUID | `Defect Triage Module`, id `175f8a08-20b9-4c96-a21a-e02dcae2837e` |
| `{atc*write*pat`} | Freshly minted PAT scoped exactly `atc:write` | `POST /api/v1/auth/signin` (cookie jar) -> `POST /api/v1/tokens` with `scopes: ["atc:write"]` + `workspace_id` |
| `{atc*read*pat`} | Freshly minted PAT scoped exactly `atc:read` | same mint flow, `scopes: ["atc:read"]` |
| `{revoked*atc*write_pat`} | A `atc:write` PAT minted then immediately revoked | mint as above, then `DELETE /api/v1/tokens/{id`} cookie-authenticated |
| `{dual*scope*pat`} | PAT with both `atc:write` + `atc:read` | mint with `scopes: ["atc:write","atc:read"]`, or reuse an existing default-scope `.auth/tokens.env` token |

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
