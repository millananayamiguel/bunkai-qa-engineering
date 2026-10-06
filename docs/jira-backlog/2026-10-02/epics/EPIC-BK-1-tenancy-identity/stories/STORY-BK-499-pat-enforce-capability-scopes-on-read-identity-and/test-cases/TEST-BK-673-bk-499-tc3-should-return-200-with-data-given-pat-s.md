# TEST: BK-499: TC3: should return 200 with data given PAT scoped atc:read

**Jira Key:** [BK-673](https://jira.upexgalaxy.com/browse/BK-673)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens

---

## Test Description

## Related Story

[BK-499](https://jira.upexgalaxy.com/browse/BK-499) — PAT | Enforce capability scopes on read, identity and notification routes

## Priority

Critical

## ROI

25 — Frequency=5, Impact=5, Stability=4, Effort=2, Dependencies=2

## Prior bugs

None on this specific flow — this is the core positive path of the capability gate.

## Test Design

```
@critical @regression @automation-candidate @BK-499
Scenario Outline: should return 200 with data given PAT scoped atc:read
  """
  Related Story: BK-499
  Sampling: 4 of the 14 atc:read-gated routes (Stage 1 code audit confirmed all 14 wired identically)
  """

  # === PRECONDITIONS ===
  Given Karim holds a valid Personal Access Token scoped atc:read

  # === ACTION ===
  When Karim sends GET <route>

  # === VALIDATIONS ===
  Then the response returns 200 with the expected payload

  Examples: Sampled read-gated routes
    | route |
    | /api/v1/activity |
    | /api/v1/projects/{id}/traceability |
    | /api/v1/tests/{id}/runs |
    | /api/v1/workspaces/{id} |
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{pat_token`} | Mint via `POST /api/v1/tokens` with `scopes: ['atc:read']` |
| `{project*id`} / `{test*id`} / `{workspace_id`} | Seeded QA sandbox entities ([https://jira.upexgalaxy.com/browse/BK-264#icft=BK-264](https://jira.upexgalaxy.com/browse/BK-264#icft=BK-264) QA Sandbox) |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Route handlers | 14 handlers, posture {{{ auth: 'required', requires: ['atc:read'] }}} — full list in BK-499's Implementation Plan |
| KATA component | Not yet built — candidate for per-domain Api components in `/test-automation` |

## Architecture

Capability gate runs at the `withApiHandler` middleware level, before the handler body — confirmed by the ratified 24-handler posture map. This TC is the positive-path proof that a correctly-scoped PAT is never blocked.

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim holds a valid, non-expired PAT scoped `atc:read`.

## Expected Results

HTTP 200 with the route's normal response payload, on all 4 sampled routes.

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
