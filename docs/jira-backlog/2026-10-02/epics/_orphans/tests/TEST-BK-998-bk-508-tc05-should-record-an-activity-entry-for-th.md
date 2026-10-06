# TEST: BK-508: TC05: should record an activity entry for the archive download

**Jira Key:** [BK-998](https://jira.upexgalaxy.com/browse/BK-998)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

## Related Story

BK-508

## Priority

Medium

## ROI Verdict

Candidate — Compliance/audit-critical — GDPR audit trail.

## Test Design

```gherkin
@medium @regression @automation-candidate @BK-508 @compliance
Feature: Export download audit trail
  """
  Related Story: BK-508
  ROI verdict: Candidate (compliance/audit-critical)
  """
  Scenario: Activity Stream records the download
    # === PRECONDITIONS ===
    Given a ready, unexpired archive exists for workspace "{workspace_id}"

    # === ACTION ===
    When I download the archive

    # === VALIDATIONS ===
    Then the Activity Stream shows an "export.downloaded" entry attributed to me
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
