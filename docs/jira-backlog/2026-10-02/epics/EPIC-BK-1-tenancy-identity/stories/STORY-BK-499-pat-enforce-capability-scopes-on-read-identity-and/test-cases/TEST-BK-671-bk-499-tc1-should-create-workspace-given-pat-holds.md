# TEST: BK-499: TC1: should create workspace given PAT holds at least one scope

**Jira Key:** [BK-671](https://jira.upexgalaxy.com/browse/BK-671)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens

---

## Test Description

## Related Story

[BK-499](https://jira.upexgalaxy.com/browse/BK-499) — PAT | Enforce capability scopes on read, identity and notification routes

## Priority

Critical (smoke — bootstrap is the entry point for every other capability-gated flow)

## ROI

64 — Frequency=4, Impact=4, Stability=4, Effort=1, Dependencies=1

## Prior bugs

None on this specific flow.

## Test Design

```
@critical @regression @smoke @automation-candidate @BK-499
Scenario: should create workspace given PAT holds at least one scope
  """
  Related Story: BK-499
  """

  # === PRECONDITIONS ===
  Given Karim holds a valid, non-expired, non-revoked Personal Access Token with at least one scope

  # === ACTION ===
  When Karim sends POST /api/v1/workspaces with {workspace*name} and {workspace*slug}

  # === VALIDATIONS ===
  Then the response returns 201
  And Karim becomes the workspace's owner
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{pat_token`} | Mint via `POST /api/v1/tokens` with any non-empty `scopes` array (e.g. `['atc:read']`) |
| `{workspace_name`} | Faker-generated string, unique per run |
| `{workspace_slug`} | Faker-generated slug, unique per run |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Route handler | `app/api/v1/workspaces/route.ts` (POST) — capability-free by design, the sole bootstrap exception |
| KATA component | Not yet built — candidate for `tests/components/api/WorkspacesApi.ts` in `/test-automation` |

## Architecture

Bootstrap route. Posture: {{{ auth: 'authenticated' }}} (no `requires` key) — any authenticated PAT with >=1 scope passes, per the ratified 24-handler posture map in BK-499's Implementation Plan.

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim holds a valid, non-expired, non-revoked PAT with at least one scope (any scope value satisfies AC1).

## Expected Results

HTTP 201. Response body includes the created workspace, and Karim is set as its owner/admin.

---

## Related Issues

- tests: [BK-668](https://jira.upexgalaxy.com/browse/BK-668) - ATS: BK-499: PAT | Enforce capability scopes on read, identity and notification routes
- is designed by: [BK-669](https://jira.upexgalaxy.com/browse/BK-669) - ATP: BK-499: PAT | Enforce capability scopes on read, identity and notification routes
- is executed by: [BK-670](https://jira.upexgalaxy.com/browse/BK-670) - ATR: BK-499: Story Testing

---

## Metadata

- **Created:** 2026-08-28
- **Updated:** 2026-08-30
- **Reporter:** Luis Eduardo Flores Villarroel
- **Assignee:** Luis Eduardo Flores Villarroel
- **Labels:** automation-candidate, regression, smoke

---

_Synced from Jira by sync-jira-issues_
