# TEST: BK-508: TC18: should exclude every PAT secret from the archive

**Jira Key:** [BK-1011](https://jira.upexgalaxy.com/browse/BK-1011)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

Related Story: BK-508
Test Documentation phase: Promoted (Candidate) - enriched 2026-09-12

Test Design (Gherkin):
```gherkin
@high @regression @automation-candidate @BK-508
Feature: PAT secret exclusion
  """
  Related Story: BK-508
  Bugs covered: none
  ROI: 6.67 (Frequency 2, Impact 5, Stability 4 / Effort 3, Dependencies 2) - security-class, credential leak risk
  """

  Scenario: Archive never contains a PAT secret value
    # === PRECONDITIONS ===
    Given workspace "{workspace_id}" has issued one or more Personal Access Tokens

    # === ACTION ===
    When the Owner exports and downloads the archive for workspace "{workspace_id}"

    # === VALIDATIONS ===
    Then no PAT secret value is present anywhere in the archive

  # Variables:
  #   {workspace_id} - a workspace with at least one live PAT minted for the assertion
  #                     to check against; assert the raw secret string is absent from
  #                     every entity file, not just the tokens metadata file.
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
