# TEST: BK-499: TC14: should create project given PAT scoped atc:write and member role

**Jira Key:** [BK-684](https://jira.upexgalaxy.com/browse/BK-684)
**Status:** AUTOMATED
**Components:** Bunkai API Tokens

---

## Test Description

## Related Story

[BK-499](https://jira.upexgalaxy.com/browse/BK-499) — PAT | Enforce capability scopes on read, identity and notification routes

## Priority

Medium

## ROI

12 — Frequency=3, Impact=4, Stability=4, Effort=2, Dependencies=2

## Prior bugs

None.

## Test Design

```
@medium @regression @automation-candidate @BK-499
Scenario: should create project given PAT scoped atc:write and member role
  """
  Related Story: BK-499
  """

  # === PRECONDITIONS ===
  Given Karim holds a valid PAT scoped atc:write, and is a member (role >= member) of the target workspace

  # === ACTION ===
  When Karim sends POST /api/v1/workspaces/{id}/projects with a valid name

  # === VALIDATIONS ===
  Then the response returns 201 with the created project
```

## Variables

| ***Variable**** | ****How to obtain*** |
| --- | --- |
| `{pat_token`} | Mint via `POST /api/v1/tokens` with `scopes: ['atc:write']` |
| `{workspace_id`} | Seeded QA sandbox workspace, Karim = member |
| `{project_name`} | Faker-generated string |

## Implementation Code

| ***Layer**** | ****Reference*** |
| --- | --- |
| Route handler | `app/api/v1/workspaces/[id]/projects/route.ts` (POST), posture {{{ auth: 'required', requires: ['atc:write'] }}} — gateway evaluates the capability before the handler body |

## Architecture

The one write-capability route this Story covers (the other 24 handlers are reads or capability-free). Positive path of the create-project flow.

## Available Test IDs

N/A — not yet automated.

## Preconditions

Karim holds a PAT scoped `atc:write`, member of the target workspace.

## Expected Results

HTTP 201 with the created project.

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
