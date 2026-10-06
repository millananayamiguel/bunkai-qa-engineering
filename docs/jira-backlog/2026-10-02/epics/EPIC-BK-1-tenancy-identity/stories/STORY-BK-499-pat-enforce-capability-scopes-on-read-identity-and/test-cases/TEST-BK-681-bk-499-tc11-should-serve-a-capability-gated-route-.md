# TEST: BK-499: TC11: should serve a capability-gated route to a browser session with no scope check

**Jira Key:** [BK-681](https://jira.upexgalaxy.com/browse/BK-681)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens

---

## Test Description

## Related Story

[BK-499](https://jira.upexgalaxy.com/browse/BK-499) — PAT | Enforce capability scopes on read, identity and notification routes

## Priority

Critical

## ROI

64 — Frequency=4, Impact=4, Stability=4, Effort=1, Dependencies=1

## Prior bugs

None — this proves Business Rule 2 (a browser session is never scope-restricted).

## Test Design

```
@critical @regression @automation-candidate @BK-499
Scenario: should serve a capability-gated route to a browser session with no scope check
  """
  Related Story: BK-499
  Business Rule 2
  """

  # === PRECONDITIONS ===
  Given Karim is authenticated via browser session (no PAT, no scope concept applies)

  # === ACTION ===
  When Karim sends GET /api/v1/activity

  # === VALIDATIONS ===
  Then the response returns 200 with data — the capability check does not apply to session callers
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{cookie_session`} | Browser/cookie-based sign-in |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Gateway | `withApiHandler` — capability checks only run against a resolved PAT principal; a session-authenticated principal carries no `capabilities` array to check against |

## Architecture

The capability system is PAT-specific by design — session identity always carries the full effective permission set for its role, never scope-restricted.

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim authenticated via browser session.

## Expected Results

HTTP 200 with data — identical to what a fully-scoped PAT would receive.

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
