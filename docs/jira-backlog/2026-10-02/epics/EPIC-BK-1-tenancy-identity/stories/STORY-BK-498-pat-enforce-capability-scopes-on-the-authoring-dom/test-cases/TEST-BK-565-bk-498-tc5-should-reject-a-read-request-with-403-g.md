# TEST: BK-498: TC5: should reject a read request with 403 given a PAT scoped only atc:write

**Jira Key:** [BK-565](https://jira.upexgalaxy.com/browse/BK-565)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens, Bunkai User Stories

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

- `{atc*write*pat`}

### Action

`GET /api/v1/modules/{module*id}/user-stories` using `{atc*write_pat`}.

### Expected Results (assertions of this TC — same precondition+action)

- `403` is returned ("Missing required capability: atc:read") — read-mirror of TC2, proves the read gate is `atc:read` specifically, not "any authenticated capability"

### Gherkin (Candidate)

```
@medium @regression @automation-candidate @BK-498
Scenario: Reject a read request with 403 given a PAT scoped only atc:write
  Given a PAT `{atc*write*pat}`
  When the user sends GET /api/v1/modules/{module*id}/user-stories using `{atc*write_pat}`
  Then the response status is 403 with message "Missing required capability: atc:read"
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
- **Labels:** automation-candidate, integration, medium, regression

---

_Synced from Jira by sync-jira-issues_
