# TEST: BK-508: TC01: should show the Data export section to the Owner

**Jira Key:** [BK-994](https://jira.upexgalaxy.com/browse/BK-994)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

## Related Story

BK-508

## Priority

Critical

## ROI Verdict

Candidate — Critical happy path, smoke-tagged.

## Test Design

```gherkin
@critical @regression @automation-candidate @BK-508 @smoke
Feature: Data export visibility
  """
  Related Story: BK-508
  ROI verdict: Candidate (critical happy path, smoke-tagged)
  """
  Scenario: Owner sees the Data export section
    # === PRECONDITIONS ===
    Given I am signed in as the workspace "{owner_email}" Owner

    # === ACTION ===
    When I open the Settings hub

    # === VALIDATIONS ===
    Then the Data export section is listed in the navigation
    And the section explains what an export covers
```

## Variables

| Variable | How to obtain |
| --- | --- |
| `{owner*email}` | `STAGING*OWNER_EMAIL` in `.env` |
| `{workspace_id}` | Active workspace id, from `GET /api/v1/me` after login |
| `{workspace*1*id}` / `{workspace*2*id}` | Two workspaces owned by the same Owner test account |

## Execution history

Executed once during `/sprint-testing` Stage 2 (2026-09-11) against staging — PASSED. Promoted to the Regression Test Plan (BK-831) during `/test-documentation` Stage 4 (2026-09-12).

---

## Metadata

- **Created:** 2026-09-11
- **Updated:** 2026-09-30
- **Reporter:** GENESIS OJOSE
- **Assignee:** GENESIS OJOSE
- **Labels:** automation-candidate, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
