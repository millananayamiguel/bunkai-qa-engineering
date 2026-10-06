# TEST: BK-499: TC2: should reject token issuance given zero scopes requested

**Jira Key:** [BK-672](https://jira.upexgalaxy.com/browse/BK-672)
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

None. This TC exists because of Shift-Left Finding B: AC1 Scenario 1.2 could not be exercised as originally written — the DB `CHECK` + Zod validation reject a zero-scope token at **issuance**, not at `POST /workspaces` as the original AC text assumed.

## Test Design

```
@medium @regression @automation-candidate @BK-499
Scenario: should reject token issuance given zero scopes requested
  """
  Related Story: BK-499
  Refinement: Shift-Left Finding B (2026-08-21) — rejection happens at issuance, not at bootstrap
  """

  # === PRECONDITIONS ===
  Given Karim is authenticated via browser session (token issuance is cookie-only, a PAT cannot mint a PAT)

  # === ACTION ===
  When Karim sends POST /api/v1/tokens with {scopes: []}

  # === VALIDATIONS ===
  Then the response is rejected with 422 (Zod validation error, not a 403 authorization error)
  And no token is created
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{cookie_session`} | Browser/cookie-based sign-in (`POST /api/v1/auth/signin`), NOT a Bearer PAT — token issuance is cookie-only |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Route handler | `app/api/v1/tokens/route.ts` (POST) |
| DB constraint | `0008*access*tokens.sql` — `CHECK (array_length(scopes,1) >= 1)` (defense in depth behind the Zod `.min(1)`) |
| KATA component | Not yet built — candidate for `tests/components/api/TokensApi.ts` in `/test-automation` |

## Architecture

`POST /api/v1/tokens` validates the request body with Zod (`scopes` array `.min(1)`) before ever reaching the DB `CHECK` constraint. The 422 is a validation-layer rejection, not a capability/authorization rejection — this TC exists specifically to prove the rejection happens at the right layer and the right endpoint (not at `POST /workspaces`, which is where the original, since-corrected AC text pointed).

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim authenticated via browser session (cookie). No PAT involved — a PAT cannot mint another PAT.

## Expected Results

HTTP 422 with a Zod validation error body. No row is written to the access tokens table.

---

## Related Issues

- is designed by: [BK-669](https://jira.upexgalaxy.com/browse/BK-669) - ATP: BK-499: PAT | Enforce capability scopes on read, identity and notification routes
- is executed by: [BK-670](https://jira.upexgalaxy.com/browse/BK-670) - ATR: BK-499: Story Testing
- tests: [BK-668](https://jira.upexgalaxy.com/browse/BK-668) - ATS: BK-499: PAT | Enforce capability scopes on read, identity and notification routes

---

## Metadata

- **Created:** 2026-08-28
- **Updated:** 2026-08-30
- **Reporter:** Luis Eduardo Flores Villarroel
- **Assignee:** Luis Eduardo Flores Villarroel
- **Labels:** automation-candidate, regression

---

_Synced from Jira by sync-jira-issues_
