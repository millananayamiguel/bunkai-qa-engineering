# TEST: BK-499: TC13: should accept viewer-role PAT holding required capability

**Jira Key:** [BK-683](https://jira.upexgalaxy.com/browse/BK-683)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens

---

## Test Description

## Related Story

[BK-499](https://jira.upexgalaxy.com/browse/BK-499) — PAT | Enforce capability scopes on read, identity and notification routes

## Priority

Medium

## ROI

9 — Frequency=3, Impact=3, Stability=4, Effort=2, Dependencies=2

## Prior bugs

None — the low-privilege-role positive twin of TC12.

## Test Design

```
@medium @regression @automation-candidate @BK-499
Scenario: should accept viewer-role PAT holding required capability
  """
  Related Story: BK-499
  Business Rule 1 (converse case)
  """

  # === PRECONDITIONS ===
  Given Karim is a viewer in the target workspace, holding a PAT scoped atc:read

  # === ACTION ===
  When Karim sends GET /api/v1/activity inside that workspace

  # === VALIDATIONS ===
  Then the response returns 200 — viewer role is sufficient once the capability is present
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{pat_token`} | Mint via `POST /api/v1/tokens` with `scopes: ['atc:read']`, minted by the viewer identity |
| `{workspace_id`} | Seeded QA sandbox workspace, Karim = viewer |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Capability check | Same as TC12, opposite direction — proves a low role is NOT penalized once it holds the right capability |

## Architecture

Completes the 2x2 matrix with TC12: {owner, viewer} x {missing capability, has capability}. Confirms the gate is purely capability-driven, with role neither helping nor hurting.

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim is workspace viewer, PAT scoped `atc:read`.

## Expected Results

HTTP 200 with data.

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
- **Labels:** automation-candidate, regression

---

_Synced from Jira by sync-jira-issues_
