# TEST: BK-499: TC6: should pass given PAT holds required scope plus an unrelated extra scope

**Jira Key:** [BK-676](https://jira.upexgalaxy.com/browse/BK-676)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens

---

## Test Description

## Related Story

[BK-499](https://jira.upexgalaxy.com/browse/BK-499) — PAT | Enforce capability scopes on read, identity and notification routes

## Priority

Low

## ROI

16 — Frequency=2, Impact=2, Stability=4, Effort=1, Dependencies=1

## Prior bugs

None.

## Test Design

```
@low @regression @automation-candidate @BK-499
Scenario: should pass given PAT holds required scope plus an unrelated extra scope
  """
  Related Story: BK-499
  """

  # === PRECONDITIONS ===
  Given Karim holds a Personal Access Token scoped atc:read and run:execute

  # === ACTION ===
  When Karim sends GET /api/v1/activity

  # === VALIDATIONS ===
  Then the response returns 200 with data — the extra unrelated scope does not interfere
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{pat_token`} | Mint via `POST /api/v1/tokens` with `scopes: ['atc:read', 'run:execute']` |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Capability check | `lib/api/principal.ts:84` — array `.includes()` check, additional unrelated entries in the array are inert |

## Architecture

Guards against a naive future implementation that might treat scope arrays positionally or exclusively instead of as a simple membership set.

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim holds a PAT scoped `atc:read` plus an unrelated extra scope.

## Expected Results

HTTP 200 with data — behaves identically to a PAT scoped `atc:read` alone.

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
