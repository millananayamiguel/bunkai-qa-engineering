# TEST: BK-508: TC13: should mark the archive expired exactly at the stated window boundary

**Jira Key:** [BK-1006](https://jira.upexgalaxy.com/browse/BK-1006)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

Related Story: BK-508
Test Documentation phase: Promoted (Candidate) - enriched 2026-09-12

Test Design (Gherkin):
```gherkin
@medium @regression @automation-candidate @BK-508
Feature: Expiry boundary
  """
  Related Story: BK-508
  Bugs covered: none
  ROI: 5.3 (Frequency 3, Impact 4, Stability 4 / Effort 3, Dependencies 3) - BVA on the 168h window
  """

  Scenario: Archive expires at the 168-hour boundary
    # === PRECONDITIONS ===
    Given an export for workspace "{workspace_id}" finished preparing and exactly 168 hours have elapsed since ready

    # === ACTION ===
    When the Owner opens the Data export section for workspace "{workspace_id}"

    # === VALIDATIONS ===
    Then the archive is shown as expired
    And no live download is offered

  # Variables:
  #   {workspace*id} - id of a workspace whose workspace*exports row has
  #                     ready_at backdated 168h (fixture helper: insert a completed
  #                     export row with expires*at = ready*at + 168h, then set
  #                     ready*at/expires*at to the boundary instant under test).
  #                     BVA companions to consider in the fixture helper: 167h59m
  #                     (still valid) and 168h01m (already expired) as sibling cases.
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
