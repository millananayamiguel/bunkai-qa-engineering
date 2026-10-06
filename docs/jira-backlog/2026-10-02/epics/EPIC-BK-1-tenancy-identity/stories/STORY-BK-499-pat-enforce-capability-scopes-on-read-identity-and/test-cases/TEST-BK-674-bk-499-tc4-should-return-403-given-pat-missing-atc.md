# TEST: BK-499: TC4: should return 403 given PAT missing atc:read

**Jira Key:** [BK-674](https://jira.upexgalaxy.com/browse/BK-674)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens

---

## Test Description

## Related Story

[BK-499](https://jira.upexgalaxy.com/browse/BK-499) — PAT | Enforce capability scopes on read, identity and notification routes

## Priority

Critical

## ROI

25 — Frequency=5, Impact=5, Stability=4, Effort=2, Dependencies=2

## Prior bugs

None — this is the negative-path twin of TC3, arguably the more security-critical of the two (a false-negative here is a data leak).

## Test Design

```
@critical @regression @automation-candidate @BK-499
Scenario Outline: should return 403 given PAT missing atc:read
  """
  Related Story: BK-499
  Sampling: same 4 routes as TC3
  """

  # === PRECONDITIONS ===
  Given Karim holds a valid Personal Access Token scoped only run:execute

  # === ACTION ===
  When Karim sends GET <route>

  # === VALIDATIONS ===
  Then the response is 403 "Missing required capability: atc:read"
  And no data is returned

  Examples: Sampled read-gated routes
    | route |
    | /api/v1/activity |
    | /api/v1/projects/{id}/traceability |
    | /api/v1/tests/{id}/runs |
    | /api/v1/workspaces/{id} |
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{pat_token`} | Mint via `POST /api/v1/tokens` with `scopes: ['run:execute']` |
| `{project*id`} / `{test*id`} / `{workspace_id`} | Seeded QA sandbox entities ([https://jira.upexgalaxy.com/browse/BK-264#icft=BK-264](https://jira.upexgalaxy.com/browse/BK-264#icft=BK-264) QA Sandbox) |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Route handlers | Same 14 handlers as TC3 |
| Capability check | `lib/api/principal.ts:84` `requireCapability` — exact match, no hierarchy |

## Architecture

Proves the gate actually rejects, not just that it doesn't interfere with correctly-scoped callers. Pairing with TC3 is deliberate (per BK-499's Implementation Plan TD-3): a 403 alone could also mean a broken route, so the positive and negative paths are both required.

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim holds a valid PAT scoped only `run:execute` (no `atc:read`).

## Expected Results

HTTP 403 naming the missing capability, on all 4 sampled routes. No data leaks into the response body.

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
- **Labels:** automation-candidate, critical, regression

---

_Synced from Jira by sync-jira-issues_
