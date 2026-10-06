# TEST: BK-508: TC09: should refuse a second request while one is preparing

**Jira Key:** [BK-1002](https://jira.upexgalaxy.com/browse/BK-1002)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

Related Story: BK-508
Test Documentation phase: Promoted (Candidate) - enriched 2026-09-12

Test Design (Gherkin):
```gherkin
@medium @regression @automation-candidate @BK-508
Feature: Single in-flight export per workspace
  """
  Related Story: BK-508
  Bugs covered: none
  ROI: 9.0 (Frequency 3, Impact 3, Stability 4 / Effort 2, Dependencies 2)
  """

  Scenario: Second request refused while preparing
    # === PRECONDITIONS ===
    Given an export of workspace "{workspace_id}" is in status "preparing"

    # === ACTION ===
    When the Owner requests another export of workspace "{workspace_id}"

    # === VALIDATIONS ===
    Then the second request is refused with a stated reason
    And the original "preparing" request is unchanged

  # Variables:
  #   {workspace_id} - id of a workspace with an export already in `preparing` status,
  #                     obtained by inserting a synthetic `workspace_exports` row with
  #                     status='preparing' via the test fixture, or by requesting a real
  #                     export and asserting before it completes.
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
