# TEST: BK-498: TC10: should return 401 for a revoked atc:write token, distinct from the 403 an under-scoped-but-valid token receives

**Jira Key:** [BK-558](https://jira.upexgalaxy.com/browse/BK-558)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens, Bunkai Modules

---

## Test Description

## Related Story

[https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) — PAT | Enforce capability scopes on the authoring domain

## Priority / ROI

- Priority: Medium
- ROI score: 12.0 (Frequency x Impact x Stability / Effort x Dependencies)
- Outcome: Candidate

## Prior bugs covered

- (none)

## Test Design

### Preconditions

- `{revoked*atc*write_pat`} exists — an `atc:write`-scoped PAT that was minted then immediately revoked

### Action

Send `POST /api/v1/projects/{project_id}/modules` using the revoked token as the Bearer token.

### Expected Results (assertions of this TC — same precondition+action)

- Response status is `401 Unauthorized`
- Response body indicates `Invalid token.`
- This is a distinct failure surface from the valid-but-under-scoped `403` seen in TC2/TC5 — it proves token-revocation is checked before the capability gate

### Gherkin (Candidate)

```
@medium @regression @automation-candidate @BK-498
Scenario: should return 401 for a revoked atc:write token, distinct from the 403 an under-scoped-but-valid token receives
  Given a revoked atc:write PAT exists ({revoked*atc*write_pat}), minted then immediately revoked
  When the user sends POST /api/v1/projects/{project_id}/modules using the revoked token
  Then the response status is 401
  And the response indicates "Invalid token.", distinct from the 403 an under-scoped-but-valid token would receive
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
- **Labels:** automation-candidate, integration, medium, regression

---

_Synced from Jira by sync-jira-issues_
