# TEST: BK-499: TC15: should reject given PAT missing atc:write checked before membership

**Jira Key:** [BK-685](https://jira.upexgalaxy.com/browse/BK-685)
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

None — proves an architecturally important invariant: the capability gate runs BEFORE the RLS membership check, not after.

## Test Design

```
@critical @regression @automation-candidate @BK-499
Scenario: should reject given PAT missing atc:write, checked before membership
  """
  Related Story: BK-499
  Ruling Q6 (2026-08-21): gateway evaluates the capability before the handler body
  """

  # === PRECONDITIONS ===
  Given Karim holds a valid PAT without atc:write, and Karim is NOT a member of the target workspace

  # === ACTION ===
  When Karim sends POST /api/v1/workspaces/{id}/projects

  # === VALIDATIONS ===
  Then Karim receives 403 "Missing required capability: atc:write" — not the membership error
  And no project is created
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{pat_token`} | Mint via `POST /api/v1/tokens` with `scopes: ['atc:read']` (excludes atc:write) |
| `{workspace_id`} | Seeded QA sandbox workspace where Karim is deliberately NOT a member |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Route handler | `app/api/v1/workspaces/[id]/projects/route.ts` (POST) — capability check at gateway level, unconditional; RLS 42501 membership error is a distinct, later failure mode never reached here |

## Architecture

Deliberately combines TWO reasons to fail (missing capability AND missing membership) to prove which one wins — the capability check must win, because it runs first and unconditionally. If the membership error surfaced instead, it would mean the capability gate was bypassed or ordered wrong.

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim holds a PAT without `atc:write`, and is not a member of the target workspace.

## Expected Results

HTTP 403 naming the missing capability specifically — never the membership/RLS error.

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
