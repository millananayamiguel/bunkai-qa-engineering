# TEST: BK-508: TC19: should exclude every pending invite or magic-link token from the archive

**Jira Key:** [BK-1012](https://jira.upexgalaxy.com/browse/BK-1012)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

Related Story: BK-508
Test Documentation phase: Promoted (Candidate) - enriched 2026-09-12

Test Design (Gherkin):
```gherkin
@high @regression @automation-candidate @BK-508
Feature: Invite/magic-link token exclusion
  """
  Related Story: BK-508
  Bugs covered: none
  ROI: 6.67 (Frequency 2, Impact 5, Stability 4 / Effort 3, Dependencies 2) - security-class, credential leak risk
  """

  Scenario: Archive never contains an invite or magic-link token
    # === PRECONDITIONS ===
    Given workspace "{workspace_id}" has outstanding invites

    # === ACTION ===
    When the Owner exports and downloads the archive for workspace "{workspace_id}"

    # === VALIDATIONS ===
    Then no invite or magic-link token value is present in the archive

  # Variables:
  #   {workspace_id} - a workspace with at least one pending invite for the
  #                     assertion to check against.
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
