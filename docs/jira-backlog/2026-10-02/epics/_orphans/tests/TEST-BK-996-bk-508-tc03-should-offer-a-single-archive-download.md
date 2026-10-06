# TEST: BK-508: TC03: should offer a single-archive download once ready

**Jira Key:** [BK-996](https://jira.upexgalaxy.com/browse/BK-996)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

## Related Story

BK-508

## Priority

High

## ROI Verdict

Candidate — Core happy path — ready-state download.

## Test Design

```gherkin
@high @regression @automation-candidate @BK-508
Feature: Export ready for download
  """
  Related Story: BK-508
  ROI verdict: Candidate
  """
  Scenario: Owner sees the ready archive
    # === PRECONDITIONS ===
    Given an export for workspace "{workspace_id}" has finished preparing

    # === ACTION ===
    When I open the Data export section

    # === VALIDATIONS ===
    Then the section shows status "ready"
    And it states the download window is "168 hours"
    And it offers a working download link
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
