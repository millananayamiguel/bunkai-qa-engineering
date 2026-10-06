# TEST: BK-499: TC12: should reject owner-role PAT missing required capability

**Jira Key:** [BK-682](https://jira.upexgalaxy.com/browse/BK-682)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens

---

## Test Description

## Related Story

[BK-499](https://jira.upexgalaxy.com/browse/BK-499) — PAT | Enforce capability scopes on read, identity and notification routes

## Priority

Critical

## ROI

15 — Frequency=3, Impact=5, Stability=4, Effort=2, Dependencies=2

## Prior bugs

None — proves Business Rule 1 (role never substitutes for a missing capability). A failure here is a privilege-escalation-shaped bug (any owner could bypass scope restriction on their own tokens).

## Test Design

```
@critical @regression @automation-candidate @BK-499
Scenario: should reject owner-role PAT missing required capability
  """
  Related Story: BK-499
  Business Rule 1
  """

  # === PRECONDITIONS ===
  Given Karim is the owner of the target workspace, holding a PAT scoped only run:execute

  # === ACTION ===
  When Karim sends GET /api/v1/activity inside that workspace

  # === VALIDATIONS ===
  Then the response is 403 — owner role does NOT substitute for the missing atc:read scope
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{pat_token`} | Mint via `POST /api/v1/tokens` with `scopes: ['run:execute']`, minted by the owner identity |
| `{workspace_id`} | Seeded QA sandbox workspace, Karim = owner |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Capability check | `lib/api/principal.ts:84` — runs independently of and before any RLS role-based check |

## Architecture

The capability gate and the workspace-role (RLS) gate are two independent layers — this TC proves the capability layer is not short-circuited by a high-privilege role.

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim is workspace owner, PAT scoped only `run:execute`.

## Expected Results

HTTP 403 despite owner role.

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
