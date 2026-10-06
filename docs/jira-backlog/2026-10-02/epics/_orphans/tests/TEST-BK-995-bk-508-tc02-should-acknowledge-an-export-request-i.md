# TEST: BK-508: TC02: should acknowledge an export request immediately

**Jira Key:** [BK-995](https://jira.upexgalaxy.com/browse/BK-995)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

## Related Story

BK-508

## Priority

High

## ROI Verdict

Candidate — Core happy path — request acknowledgement.

## Test Design

```gherkin
@high @regression @automation-candidate @BK-508
Feature: Export request acknowledgement
  """
  Related Story: BK-508
  ROI verdict: Candidate
  """
  Scenario: Owner requests an export with none in flight
    # === PRECONDITIONS ===
    Given I am signed in as the workspace "{owner_email}" Owner
    And no export is currently in flight for workspace "{workspace_id}"

    # === ACTION ===
    When I request an export of workspace "{workspace_id}" data

    # === VALIDATIONS ===
    Then the request is accepted synchronously
    And the section shows status "preparing" with a requested-at timestamp
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
