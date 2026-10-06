# TEST: BK-508: TC10: should not allow download via an expired link

**Jira Key:** [BK-1003](https://jira.upexgalaxy.com/browse/BK-1003)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

Related Story: BK-508
Test Documentation phase: Promoted (Candidate) - enriched 2026-09-12

Test Design (Gherkin):
```gherkin
@medium @regression @automation-candidate @BK-508
Feature: Expired download link rejection
  """
  Related Story: BK-508
  Bugs covered: none
  ROI: 5.3 (Frequency 3, Impact 4, Stability 4 / Effort 3, Dependencies 3)
  """

  Scenario: Owner attempts to use an expired download reference
    # === PRECONDITIONS ===
    Given an archive for workspace "{workspace_id}" is expired

    # === ACTION ===
    When the Owner attempts the stored download reference for "{workspace_id}"

    # === VALIDATIONS ===
    Then the download fails or is not offered
    And the Data export section shows the expired state instead

  # Variables:
  #   {workspace*id} - id of a workspace whose workspace*exports row has
  #                     expires_at in the past (backdated via fixture, see TC13/TC17).
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
