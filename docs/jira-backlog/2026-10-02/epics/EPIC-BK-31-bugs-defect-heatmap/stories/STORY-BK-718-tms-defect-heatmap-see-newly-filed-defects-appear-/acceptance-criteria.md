# BK-718 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-718)

```
Feature: The defect heatmap keeps itself current while a QA Lead watches it

  Background:
    Given Mateo is a member of the "Acme QA" workspace
    And he is viewing the Heatmap view of the Bug Reports screen for the "Checkout" project
    And the module "Checkout / Payments" shows 2 defects with trend "Flat ±0" for the 30d window
```

```
Scenario: AC-1 — A defect filed by somebody else arrives without Mateo touching anything
    Given Elena is signed in as a member of the same workspace in a separate session
    When Elena files a defect against the module "Checkout / Payments"
    Then the "Checkout / Payments" cell reflects the new defect
    And Mateo has neither reloaded the page, navigated away, nor pressed any control
```

```
Scenario: AC-2 — The update lands inside the agreed five-second budget
    Given Elena is filing a defect against a module Mateo can see
    When the defect is recorded
    Then the heatmap reflects it within 5 seconds of it being recorded
```

```
Scenario: AC-3 — Both the count and the week-over-week trend move, not just the count
    Given the module "Checkout / Payments" shows 2 defects and trend "Flat ±0"
    And that module recorded 2 defects in the prior week and 2 in the latest week
    When a further defect is filed against "Checkout / Payments"
    Then its defect count reads 3
    And its trend reads "Rising +1"
    And its heat tag is recomputed from the new count
```

```
Scenario: AC-4 — A defect filed against an archived module stays out of the heatmap
    Given the module "Checkout / Legacy" has been archived
    And it is therefore absent from the heatmap grid and from the defect list
    When a defect is filed that is attributed to "Checkout / Legacy"
    Then no cell for "Checkout / Legacy" appears
    And no other module's count or trend changes
    And the heatmap continues to agree with what the defect list shows for the same project
```

```
Scenario: AC-5 — A defect in a workspace Mateo does not belong to never reaches him
    Given a defect is filed inside the "Globex QA" workspace, of which Mateo is not a member
    When that defect is recorded
    Then Mateo's heatmap does not change in any way
    And no count, trend, heat tag, or freshness stamp on his screen moves
```

```
Scenario Outline: AC-6 — The window selector keeps working while updates are arriving live
    Given Mateo is watching the 30d window
    When he switches the window to <window>
    Then the heatmap reloads for <window>
    And a defect filed after the switch is reflected in the <window> figures
    And switching back and forth does not stack up duplicate updates or double-count a defect

    Examples:
      | window |
      | 7d     |
      | 90d    |
```

```
Scenario: AC-7 — When the live connection drops, the existing fallbacks are still there
    Given Mateo is watching the heatmap and live updates are working
    When the connection to the live update stream is lost
    Then the last-loaded figures stay on screen rather than being blanked or replaced by an error
    And the "as of" freshness stamp still states the moment the figures were produced
    And the manual refresh control is still present and still works
```

```
Scenario: AC-8 — Anything missed while disconnected is picked up on reconnection
    Given the live connection has dropped
    And two defects are filed while Mateo is disconnected
    When the connection is restored
    Then the heatmap reconciles to the true current figures, including both defects filed during the outage
    And the freshness stamp advances to the moment of that reconciliation
```

```
Scenario: AC-9 — A defect filed by an automated agent behaves exactly like one filed by a person
    Given an automated test agent is filing defects on behalf of the team during a regression run
    When the agent files a defect against a module Mateo can see
    Then Mateo's heatmap reflects it on the same terms and inside the same 5-second budget as AC-1 and AC-2
    And nobody has to reload anything for the agent's work to become visible
```

```
Scenario: AC-10 — Leaving the screen stops the updates
    Given Mateo is watching the heatmap with live updates running
    When he switches to the List view, opens another project, or navigates away
    Then the heatmap stops listening for updates
    And returning to the Heatmap view starts a fresh listener and shows current figures
```

---
_Synced from Jira by sync-jira-issues_
