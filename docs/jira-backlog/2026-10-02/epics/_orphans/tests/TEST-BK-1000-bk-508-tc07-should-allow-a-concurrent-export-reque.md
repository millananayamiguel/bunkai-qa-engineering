# TEST: BK-508: TC07: should allow a concurrent export request for a different workspace the same Owner owns

**Jira Key:** [BK-1000](https://jira.upexgalaxy.com/browse/BK-1000)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

## Related Story

BK-508

## Priority

High

## ROI Verdict

Candidate — Data-isolation architecture rule (AC-05 scope confirmation).

## Test Design

```gherkin
@high @regression @automation-candidate @BK-508 @data-isolation
Feature: Per-workspace concurrent exports
  """
  Related Story: BK-508
  ROI verdict: Candidate (data-isolation architecture rule, AC-05 scope confirmation)
  """
  Scenario: Owner requests an export on a second workspace while the first is preparing
    # === PRECONDITIONS ===
    Given I own workspace "{workspace*1*id}" with an export in status "preparing"
    And I own workspace "{workspace*2*id}" with no export in flight

    # === ACTION ===
    When I switch active workspace to "{workspace*2*id}"
    And I request an export of "{workspace*2*id}"

    # === VALIDATIONS ===
    Then the "{workspace*2*id}" request is accepted
    And it prepares independently of "{workspace*1*id}"'s export
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
