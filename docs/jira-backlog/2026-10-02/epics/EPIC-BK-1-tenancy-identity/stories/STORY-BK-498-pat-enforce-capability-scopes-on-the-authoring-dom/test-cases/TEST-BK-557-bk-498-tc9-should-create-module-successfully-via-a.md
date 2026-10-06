# TEST: BK-498: TC9: should create module successfully via an authenticated browser session regardless of any PAT scope restriction

**Jira Key:** [BK-557](https://jira.upexgalaxy.com/browse/BK-557)
**Status:** AUTOMATED
**Components:** Bunkai Auth, Bunkai Modules

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

- An authenticated browser session exists (cookie set from `POST /api/v1/auth/signin`)
- No PAT is involved in the request at all

### Action

Send `POST /api/v1/projects/{project_id}/modules` using the browser session cookie, not a PAT.

### Expected Results (assertions of this TC — same precondition+action)

- Response status is `201 Created`
- The module is created successfully
- Browser sessions always carry the full capability set and are never narrowed like a PAT can be — this is the regression control that matters most, since it is the most common real-world request shape

### Gherkin (Candidate)

```
@critical @regression @automation-candidate @BK-498
Scenario: should create a module successfully via an authenticated browser session regardless of any PAT scope restriction
  Given an authenticated browser session exists, established via a cookie from POST /api/v1/auth/signin, with no PAT involved
  When the user sends POST /api/v1/projects/{project_id}/modules using the session cookie
  Then the response status is 201
  And the module is created successfully, since browser sessions always carry the full capability set and are never narrowed like a PAT can be
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
- **Labels:** automation-candidate, critical, integration, regression

---

_Synced from Jira by sync-jira-issues_
