# TEST: BK-508: TC17: should reject a download request whose window has elapsed even when the route is hit directly

**Jira Key:** [BK-1010](https://jira.upexgalaxy.com/browse/BK-1010)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

Related Story: BK-508
Test Documentation phase: Promoted (Candidate) - enriched 2026-09-12

Test Design (Gherkin):
```gherkin
@high @regression @automation-candidate @BK-508
Feature: Route-level expiry re-verification
  """
  Related Story: BK-508
  Bugs covered: none
  ROI: 2.67 (case-by-case band, promoted as critical-flow: defense-in-depth on the download route)
  """

  Scenario: Download route rejects an elapsed window independent of UI state
    # === PRECONDITIONS ===
    Given an archive's expiry timestamp for workspace "{workspace_id}" has passed

    # === ACTION ===
    When the download route is called directly for workspace "{workspace_id}", bypassing any cached UI state

    # === VALIDATIONS ===
    Then the request is rejected
    And the rejection matches the route's collapsed not-available response (404)

  # Variables:
  #   {workspace*id} - id of a workspace whose workspace*exports row has an
  #                     expires_at backdated directly via the DB fixture (same
  #                     helper as TC13), then hit the download route with curl,
  #                     never through the UI, to prove server-side re-verification.
```


---

## Metadata

- **Created:** 2026-09-11
- **Updated:** 2026-09-30
- **Reporter:** GENESIS OJOSE
- **Assignee:** GENESIS OJOSE
- **Labels:** regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
