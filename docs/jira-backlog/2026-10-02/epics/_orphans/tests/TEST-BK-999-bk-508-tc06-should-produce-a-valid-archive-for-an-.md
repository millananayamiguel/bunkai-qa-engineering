# TEST: BK-508: TC06: should produce a valid archive for an empty workspace

**Jira Key:** [BK-999](https://jira.upexgalaxy.com/browse/BK-999)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

## Related Story

BK-508

## Priority

Medium

## ROI Verdict

Candidate — Boundary case — empty-workspace export.

## Test Design

```gherkin
@medium @regression @automation-candidate @BK-508 @boundary
Feature: Empty workspace export
  """
  Related Story: BK-508
  ROI verdict: Candidate
  """
  Scenario: Export a brand-new workspace with no content
    # === PRECONDITIONS ===
    Given workspace "{workspace_id}" has zero Projects, Modules, Tests, Runs, and Bugs

    # === ACTION ===
    When I request and download an export

    # === VALIDATIONS ===
    Then the export succeeds
    And the archive is structurally valid and empty of content records
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
