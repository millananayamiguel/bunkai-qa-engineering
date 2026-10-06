# TEST: BK-499: TC7: should succeed for any authenticated PAT regardless of scope given identity or notification route

**Jira Key:** [BK-677](https://jira.upexgalaxy.com/browse/BK-677)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens

---

## Test Description

## Related Story

[BK-499](https://jira.upexgalaxy.com/browse/BK-499) — PAT | Enforce capability scopes on read, identity and notification routes

## Priority

Medium

## ROI

24 — Frequency=4, Impact=3, Stability=4, Effort=2, Dependencies=1

## Prior bugs

None — but this bucket had a stale doc-comment contradiction ("mirrors GET /api/v1/activity") corrected in this Story's implementation, worth confirming live.

## Test Design

```
@medium @regression @automation-candidate @BK-499
Scenario Outline: should succeed for any authenticated PAT regardless of scope given an identity or notification route
  """
  Related Story: BK-499
  Sampling: 2 of the 6 identity/notification routes
  """

  # === PRECONDITIONS ===
  Given Karim holds a Personal Access Token scoped only run:execute

  # === ACTION ===
  When Karim calls <route>

  # === VALIDATIONS ===
  Then the request succeeds normally — no 403 for lacking a specific capability

  Examples: Sampled identity/notification routes
    | route |
    | GET /api/v1/me |
    | GET /api/v1/workspaces/{id}/notifications |
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{pat_token`} | Mint via `POST /api/v1/tokens` with `scopes: ['run:execute']` |
| `{workspace_id`} | Seeded QA sandbox workspace |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Route handlers | {{{ auth: 'authenticated' }}}, no `requires` key — category boundary is "caller's OWN data" vs "workspace-shared data", not read vs write |

## Architecture

Ruling Q1 (2026-08-21) draws this category boundary explicitly — `GET /workspaces/{id}/notifications` (caller's own copies) takes no capability while `GET /activity` (whole-workspace feed) does, despite both being reads.

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim holds any authenticated PAT (scope irrelevant to this bucket).

## Expected Results

200/201 on both sampled routes, no 403 for missing capability.

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
