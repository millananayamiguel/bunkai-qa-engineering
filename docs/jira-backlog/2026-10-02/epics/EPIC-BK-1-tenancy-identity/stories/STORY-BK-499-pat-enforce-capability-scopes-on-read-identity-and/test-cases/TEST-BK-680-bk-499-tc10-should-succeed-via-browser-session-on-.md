# TEST: BK-499: TC10: should succeed via browser session on session-only routes

**Jira Key:** [BK-680](https://jira.upexgalaxy.com/browse/BK-680)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens

---

## Test Description

## Related Story

[BK-499](https://jira.upexgalaxy.com/browse/BK-499) — PAT | Enforce capability scopes on read, identity and notification routes

## Priority

Medium

## ROI

18 — Frequency=3, Impact=3, Stability=4, Effort=2, Dependencies=1

## Prior bugs

None.

## Test Design

```
@medium @regression @automation-candidate @BK-499
Scenario Outline: should succeed via browser session on session-only routes
  """
  Related Story: BK-499
  """

  # === PRECONDITIONS ===
  Given Karim is authenticated via browser session (cookie)

  # === ACTION ===
  When Karim sends <method> <route>

  # === VALIDATIONS ===
  Then the request succeeds normally

  Examples: Session-only routes
    | method | route |
    | DELETE | /api/v1/workspaces/{id}/membership |
    | POST   | /api/v1/me/active-workspace |
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{cookie_session`} | Browser/cookie-based sign-in, no PAT involved |
| `{workspace_id`} | Seeded QA sandbox workspace where Karim is a member |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Route handlers | Both session-only handlers, `auth: 'cookie-only'` — a cookie session always passes this guard |

## Architecture

Confirms the session-only guard is a Bearer-PAT-specific block, not a blanket rejection — a real browser session is the intended caller for both routes.

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim authenticated via browser session, member of the target workspace.

## Expected Results

200/204 on both routes via cookie session.

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
