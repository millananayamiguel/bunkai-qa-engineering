# TEST: BK-508: TC08: should not show the Data export section to non-Owner roles

**Jira Key:** [BK-1001](https://jira.upexgalaxy.com/browse/BK-1001)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

## Related Story

BK-508

## Priority

Critical

## ROI Verdict

Candidate — Security-critical — Owner-only enforcement (ATP Risk #1).

## Test Design

```gherkin
@critical @regression @automation-candidate @BK-508 @security
Feature: Owner-only section visibility
  """
  Related Story: BK-508
  ROI verdict: Candidate (Owner-only enforcement, Risk #1 in the ATP: capability-check vs role-check)
  Recalibration note: a direct hit on the route renders the page shell before the
  blocked state (same non-disclosure pattern as settings/billing) - deliberate
  per the codebase's convention, not a defect. Assertion below matches verified
  behavior instead of the original "not reachable" wording.
  """
  Scenario Outline: Non-Owner roles never see the section or its data
    # === PRECONDITIONS ===
    Given I am signed in as workspace "<role>" for "{workspace_id}"

    # === ACTION ===
    When I open the Settings hub
    And I hit the export route directly at "/settings/data-export"

    # === VALIDATIONS ===
    Then no Data export section is listed in the navigation
    And the direct route shows the page shell only, with no export data returned (server rejects with 403)

    # === EQUIVALENT PARTITIONS ===
    Examples: Non-Owner roles
      | role   |
      | Admin  |
      | Member |
      | Viewer |
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
