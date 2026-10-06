# TEST: BK-508: TC16: should keep only the newest archive offered after a fresh export completes

**Jira Key:** [BK-1009](https://jira.upexgalaxy.com/browse/BK-1009)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

Related Story: BK-508
Test Documentation phase: Promoted (Candidate) - enriched 2026-09-12

Test Design (Gherkin):
```gherkin
@medium @regression @automation-candidate @BK-508
Feature: Newest archive supersedes prior
  """
  Related Story: BK-508
  Bugs covered: none
  ROI: 6.0 (Frequency 2, Impact 3, Stability 4 / Effort 2, Dependencies 2) - AC-14
  """

  Scenario: A fresh export supersedes a still-valid prior archive
    # === PRECONDITIONS ===
    Given a ready, unexpired archive already exists for workspace "{workspace_id}"

    # === ACTION ===
    When the Owner requests a fresh export of workspace "{workspace_id}" and it completes

    # === VALIDATIONS ===
    Then the Data export section offers only the new archive
    And the prior archive's own expiry is superseded, not independently tracked

  # Variables:
  #   {workspace_id} - a workspace with one completed, unexpired export already on record.
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
