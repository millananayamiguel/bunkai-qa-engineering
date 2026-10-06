# TEST: BK-499: TC5: should reject given PAT scoped atc:write only on a read-gated route

**Jira Key:** [BK-675](https://jira.upexgalaxy.com/browse/BK-675)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens

---

## Test Description

## Related Story

[BK-499](https://jira.upexgalaxy.com/browse/BK-499) — PAT | Enforce capability scopes on read, identity and notification routes

## Priority

Critical

## ROI

60 — Frequency=3, Impact=5, Stability=4, Effort=1, Dependencies=1

## Prior bugs

None — boundary/security test. A failure here would mean a write-scoped token could read data it was never meant to see: a privilege-escalation-shaped bug.

## Test Design

```
@critical @regression @automation-candidate @BK-499
Scenario: should reject given PAT scoped atc:write only on a read-gated route
  """
  Related Story: BK-499
  Confirms no write-to-read scope hierarchy exists
  """

  # === PRECONDITIONS ===
  Given Karim holds a valid Personal Access Token scoped only atc:write

  # === ACTION ===
  When Karim sends GET /api/v1/activity

  # === VALIDATIONS ===
  Then the response is 403 — atc:write does NOT substitute for atc:read
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{pat_token`} | Mint via `POST /api/v1/tokens` with `scopes: ['atc:write']` |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Capability check | `lib/api/principal.ts:84` — `principal.capabilities.includes(capability)`, exact match only, confirmed no hierarchy in code |

## Architecture

This resolved Shift-Left's "Edge case #2" (originally `NEEDS PO/DEV CONFIRMATION`) directly from code during Stage 1 — no PO input was needed once the exact-match logic was read.

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim holds a PAT scoped only `atc:write`.

## Expected Results

HTTP 403 on the read-gated route.

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
