# TEST: BK-498: TC12: should accept writes across all authoring families given a PAT scoped exactly atc:write

**Jira Key:** [BK-561](https://jira.upexgalaxy.com/browse/BK-561)
**Status:** AUTOMATED
**Components:** Bunkai Acceptance Criteria, Bunkai API Tokens, Bunkai Environments, Bunkai Imports, Bunkai Milestones, Bunkai User Stories

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

- `{atc*write*pat`} exists — a PAT scoped exactly `atc:write`

### Action

Perform one write per authoring resource family, using `{atc*write*pat`} as the Bearer token:

| ***family**** | ****endpoint*** |
| --- | --- |
| User Stories | `POST /modules/{module_id}/user-stories` |
| Acceptance Criteria | `POST /user-stories/{id}/acceptance-criteria` |
| Environments | `POST /projects/{project_id}/environments` |
| Milestones | `POST /projects/{project_id}/milestones` |
| Imports | `POST /imports` |

### Expected Results (assertions of this TC — same precondition+action)

- Response status is `2xx` on every row above
- A DB side-effect row is created for each family
- These created rows become TC13's read fixtures (User Stories, Acceptance Criteria, Environments, Milestones, and Imports rows created here are what TC13 subsequently reads)

### Gherkin (Candidate)

```
@high @regression @automation-candidate @BK-498
Scenario Outline: should accept a write to <family> given a PAT scoped exactly atc:write
  Given a PAT scoped exactly atc:write exists ({atc*write*pat})
  When the user sends <endpoint> using the atc:write-scoped token
  Then the response status is a 2xx success
  And a <family> row is created as a side effect

  Examples:
    | family               | endpoint                                          |
    | User Stories          | POST /modules/{module_id}/user-stories           |
    | Acceptance Criteria   | POST /user-stories/{id}/acceptance-criteria      |
    | Environments           | POST /projects/{project_id}/environments        |
    | Milestones              | POST /projects/{project_id}/milestones          |
    | Imports                  | POST /imports                                    |
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
