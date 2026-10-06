# TEST: BK-499: TC8: should reject Bearer PAT on DELETE workspace membership

**Jira Key:** [BK-678](https://jira.upexgalaxy.com/browse/BK-678)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens

---

## Test Description

## Related Story

[BK-499](https://jira.upexgalaxy.com/browse/BK-499) — PAT | Enforce capability scopes on read, identity and notification routes

## Priority

Critical

## ROI

48 — Frequency=3, Impact=4, Stability=4, Effort=1, Dependencies=1

## Prior bugs

None on this route. (Its sibling route, `POST /me/active-workspace`, is TC9 — tied to open defect [https://jira.upexgalaxy.com/browse/BK-623#icft=BK-623](https://jira.upexgalaxy.com/browse/BK-623#icft=BK-623).)

## Test Design

```
@critical @regression @automation-candidate @BK-499
Scenario: should reject Bearer PAT on DELETE workspace membership
  """
  Related Story: BK-499
  """

  # === PRECONDITIONS ===
  Given Karim holds a Personal Access Token with every scope in the catalog

  # === ACTION ===
  When Karim sends DELETE /api/v1/workspaces/{id}/membership via Authorization: Bearer

  # === VALIDATIONS ===
  Then the response is 403 and the message contains "Use a browser session."
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{pat_token`} | Mint via `POST /api/v1/tokens` with every scope in the catalog |
| `{workspace_id`} | Seeded QA sandbox workspace where Karim is a member |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Route handler | `app/api/v1/workspaces/[id]/membership/route.ts` (DELETE), posture {{{ auth: 'cookie-only', why: '...Use a browser session.' }}} |

## Architecture

Session-only posture rejects every Bearer PAT unconditionally, regardless of scope — this is the correctly-worded sibling of TC9's divergent-message route.

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim holds a PAT with every scope (scope is irrelevant — this route rejects all Bearer callers).

## Expected Results

HTTP 403, message contains the literal phrase "Use a browser session."

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
