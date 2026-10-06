# TEST: BK-508: TC11: should reject a PAT calling the export request or download endpoint

**Jira Key:** [BK-1004](https://jira.upexgalaxy.com/browse/BK-1004)
**Status:** READY
**Components:** Bunkai Workspaces

---

## Test Description

Related Story: BK-508
Test Documentation phase: Promoted (Candidate) - enriched 2026-09-12

Test Design (Gherkin):
```gherkin
@high @regression @automation-candidate @BK-508
Feature: Cookie-session-only enforcement
  """
  Related Story: BK-508
  Bugs covered: none
  ROI: 18.75 (Frequency 3, Impact 5, Stability 5 / Effort 2, Dependencies 2) - security-class
  """

  Scenario Outline: A PAT is rejected on the export endpoints
    # === PRECONDITIONS ===
    Given a Personal Access Token "{pat*token}" scoped "workspace:admin" for workspace "{workspace*id}", held by a non-Owner user

    # === ACTION ===
    When the token calls the export <action> endpoint for workspace "{workspace_id}"

    # === VALIDATIONS ===
    Then the request is rejected because the route is cookie-session-only

    # === EQUIVALENT PARTITIONS ===
    Examples: Both export endpoints reject PAT auth
      | action   |
      | request  |
      | download |

  # Variables:
  #   {pat_token} - minted via POST /api/v1/tokens as a non-Owner role, revoked after the test.
  #   {workspace_id} - target workspace id, any role membership.
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
