# TEST: BK-499: TC9: should reject Bearer PAT on POST active-workspace with the browser-session message

**Jira Key:** [BK-679](https://jira.upexgalaxy.com/browse/BK-679)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens

---

## Test Description

## Related Story

[BK-499](https://jira.upexgalaxy.com/browse/BK-499) — PAT | Enforce capability scopes on read, identity and notification routes

## Priority

Critical

## ROI

48 — Frequency=3, Impact=4, Stability=4, Effort=1, Dependencies=1. Prior-bug rule reinforces the Candidate verdict independently of the numeric score.

## ⚠️ Known failing — tied to open defect [https://jira.upexgalaxy.com/browse/BK-623#icft=BK-623](https://jira.upexgalaxy.com/browse/BK-623#icft=BK-623)

This TC is the exact outline that discovered [BK-623](https://jira.upexgalaxy.com/browse/BK-623) during `/sprint-testing` Stage 2 (2026-08-27). Per the test-documentation bug-driven golden rule, the Test that found a regression-worthy bug is REUSED (not duplicated) as the permanent regression check. ***This TC will FAIL until BK-623 is fixed*** — that is intentional, not a documentation error. Linked directly to [https://jira.upexgalaxy.com/browse/BK-623#icft=BK-623](https://jira.upexgalaxy.com/browse/BK-623#icft=BK-623) below for traceability.

## Prior bugs

[https://jira.upexgalaxy.com/browse/BK-623#icft=BK-623](https://jira.upexgalaxy.com/browse/BK-623#icft=BK-623) (Open, Low/Menor) — `POST /me/active-workspace`'s 403 message omits "Use a browser session." The security mechanism itself is correct (every Bearer PAT is rejected); only the message text diverges from AC5's literal requirement.

## Test Design

```
@critical @regression @automation-candidate @BK-499 @BK-623
Scenario: should reject Bearer PAT on POST active-workspace with the browser-session message
  """
  Related Story: BK-499
  Bugs covered: BK-623
  """

  # === PRECONDITIONS ===
  Given Karim holds a Personal Access Token with every scope in the catalog

  # === ACTION ===
  When Karim sends POST /api/v1/me/active-workspace via Authorization: Bearer

  # === VALIDATIONS ===
  Then the response is 403
  And the message contains "Use a browser session." (currently FAILS — see BK-623)
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{pat_token`} | Mint via `POST /api/v1/tokens` with every scope in the catalog |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Route handler | `app/api/v1/me/active-workspace/route.ts` (POST), posture {{{ auth: 'cookie-only', why: 'Personal access tokens have no switchable active workspace...' }}} — message diverges from AC5 |

## Architecture

Same session-only mechanism as TC8's sibling route — the 403 itself is correct, only the `why:` message text is wrong. Fix is a one-line message-text edit at the file/line named in [https://jira.upexgalaxy.com/browse/BK-623#icft=BK-623](https://jira.upexgalaxy.com/browse/BK-623#icft=BK-623).

## Available Test IDs

N/A — not yet automated. When automated, this test should assert on BK-623's fix and go green.

## Preconditions

Karim holds a PAT with every scope.

## Expected Results

HTTP 403, message contains "Use a browser session." — ***currently the message reads "Personal access tokens have no switchable active workspace. Pass workspace_id explicitly on each request instead." (BK-623, no browser-session mention). This TC records that gap and will pass once BK-623 ships.***

---

## Related Issues

- tests: [BK-668](https://jira.upexgalaxy.com/browse/BK-668) - ATS: BK-499: PAT | Enforce capability scopes on read, identity and notification routes
- tests: [BK-623](https://jira.upexgalaxy.com/browse/BK-623) - PAT: Bunkai API Tokens: POST /me/active-workspace 403 message omits "Use a browser session." required by AC5
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
