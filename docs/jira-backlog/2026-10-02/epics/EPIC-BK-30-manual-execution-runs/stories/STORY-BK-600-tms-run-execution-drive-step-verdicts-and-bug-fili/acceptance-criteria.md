# BK-600 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-600)

```
Feature: Drive a Run from the keyboard

  Background:
    Given Elena is a Senior QA Engineer with permission to record step results
    And she has an open Run "RUN-1839" in status running
    And the Run holds 2 Acceptance Test Cases of 3 steps each, 6 steps in total
    And every step is currently Unrun

  # ---------- The focused-step cursor ----------

  Scenario: The cursor starts on the first unrun step
    When Elena opens the Run
    Then exactly one step is marked as the current step
    And that step is step 01 of the first Acceptance Test Case
    And no other step is marked as current

  Scenario: The cursor starts on the first step when nothing is unrun
    Given every step in the Run already carries a verdict
    When Elena opens the Run
    Then step 01 of the first Acceptance Test Case is the current step

  Scenario Outline: Arrow keys move the cursor one step at a time
    Given the current step is step 02 of the first Acceptance Test Case
    When Elena presses "<key>"
    Then the current step is "<result>"
    And that step is scrolled into view

    Examples:
      | key        | result                                        |
      | ArrowDown  | step 03 of the first Acceptance Test Case     |
      | ArrowUp    | step 01 of the first Acceptance Test Case     |

  Scenario: The cursor crosses an Acceptance Test Case boundary
    Given the current step is step 03 of the first Acceptance Test Case
    When Elena presses "ArrowDown"
    Then the current step is step 01 of the second Acceptance Test Case

  Scenario: The cursor does not wrap at either end
    Given the current step is step 03 of the second Acceptance Test Case
    When Elena presses "ArrowDown"
    Then the current step is unchanged
    And no verdict is recorded

  Scenario: Clicking a step moves the cursor to it
    Given the current step is step 01 of the first Acceptance Test Case
    When Elena clicks anywhere on step 02 of the second Acceptance Test Case
    Then the current step is step 02 of the second Acceptance Test Case

  Scenario: The current step is announced, not only coloured
    When Elena inspects the current step with a screen reader
    Then it is announced as the current step
    And the cue is not carried by colour alone

  Scenario: A deep-linked bug highlight and the cursor stay distinguishable
    Given Elena arrived from a filed bug that highlights step 02 of the first Acceptance Test Case
    And the current step is that same step
    Then both the bug highlight and the current-step cue are visible
    And they are visually distinct from each other

  # ---------- Verdict keys ----------

  Scenario Outline: A verdict key opens the step-result form pre-set to that verdict
    Given the current step is step 01 of the first Acceptance Test Case
    And no step-result form is open
    When Elena presses "<key>"
    Then the step-result form opens on the current step
    And its confirm button reads "<confirm>"
    And the step is still Unrun
    And the note field holds the keyboard focus

    Examples:
      | key | confirm      |
      | P   | Mark passed  |
      | F   | Mark failed  |
      | B   | Mark blocked |

  Scenario: Committing the verdict requires the confirm action
    Given Elena pressed "P" on step 01 of the first Acceptance Test Case
    When she activates "Mark passed"
    Then step 01 of the first Acceptance Test Case reads Passed
    And the step-result form closes

  Scenario: A verdict key re-picks the verdict on an already open form
    Given Elena pressed "P" on step 01 of the first Acceptance Test Case
    And she typed "checkout total was 49.99" into the note field
    And she moved focus out of the note field
    When she presses "F"
    Then the confirm button reads "Mark failed"
    And the note field still holds "checkout total was 49.99"

  Scenario: The cursor advances after a verdict is committed
    Given the current step is step 02 of the first Acceptance Test Case
    And Elena pressed "P" on it
    When she activates "Mark passed"
    Then step 02 of the first Acceptance Test Case reads Passed
    And the current step is step 03 of the first Acceptance Test Case

  Scenario: The cursor holds still after committing the last step
    Given the current step is step 03 of the second Acceptance Test Case
    And Elena pressed "P" on it
    When she activates "Mark passed"
    Then the current step is still step 03 of the second Acceptance Test Case

  Scenario: Cancelling the form leaves the step unmarked and the cursor still
    Given Elena pressed "F" on step 01 of the first Acceptance Test Case
    When she activates "Cancel"
    Then step 01 of the first Acceptance Test Case is still Unrun
    And the current step is step 01 of the first Acceptance Test Case

  # ---------- Advancing without a verdict ----------

  Scenario: The advance shortcut moves to the next step in order
    Given the current step is step 01 of the first Acceptance Test Case
    When Elena presses "Cmd+Enter" on macOS or "Ctrl+Enter" elsewhere
    Then the current step is step 02 of the first Acceptance Test Case
    And step 01 of the first Acceptance Test Case is still Unrun

  Scenario: The advance shortcut steps onto an already marked step
    Given step 02 of the first Acceptance Test Case reads Failed
    And the current step is step 01 of the first Acceptance Test Case
    When Elena presses "Cmd+Enter"
    Then the current step is step 02 of the first Acceptance Test Case

  Scenario: The advance shortcut is a no-op on the last step
    Given the current step is step 03 of the second Acceptance Test Case
    When Elena presses "Cmd+Enter"
    Then the current step is unchanged
    And the Run is not finished

  Scenario: The advance shortcut also commits an open step-result form
    Given Elena pressed "P" on step 01 of the first Acceptance Test Case
    And the step-result form is open
    When she presses "Cmd+Enter"
    Then step 01 of the first Acceptance Test Case reads Passed
    And the current step is step 02 of the first Acceptance Test Case

  Scenario: A bare Enter never advances the cursor
    Given the current step is step 01 of the first Acceptance Test Case
    And no text field holds the focus
    When Elena presses "Enter"
    Then the current step is unchanged

  # ---------- Opening the Report-bug dialog ----------

  Scenario: The bug shortcut opens the dialog for the current step
    Given step 02 of the first Acceptance Test Case reads Failed
    And it is the current step
    When Elena presses "Cmd+B"
    Then the Report-bug dialog opens
    And its steps-to-reproduce field holds the content of that same step
    And its severity reads "P3 · Minor"

  Scenario: The bug shortcut is refused on a step that is not failed
    Given the current step reads Passed
    When Elena presses "Cmd+B"
    Then the Report-bug dialog does not open
    And a short message explains that a bug is filed from a failed step

  Scenario: The bug shortcut is refused when the actor may not report bugs
    Given Elena has no permission to report bugs on this project
    And the current step reads Failed
    When Elena presses "Cmd+B"
    Then the Report-bug dialog does not open

  Scenario: The bug shortcut is inert while the dialog is already open
    Given the Report-bug dialog is open
    When Elena presses "Cmd+B"
    Then a second dialog does not open
    And the open dialog keeps every value already typed into it

  # ---------- Severity keys inside the dialog ----------

  Scenario Outline: A digit sets the severity while the dialog is open
    Given the Report-bug dialog is open
    And the focus is not in a text field
    When Elena presses "<key>"
    Then the severity reads "<severity>"

    Examples:
      | key | severity      |
      | 1   | P1 · Critical |
      | 2   | P2 · Major    |
      | 3   | P3 · Minor    |
      | 4   | P4 · Trivial  |

  Scenario: A digit typed into the bug title does not change the severity
    Given the Report-bug dialog just opened with severity "P3 · Minor"
    And the focus is in the title field, where it landed on open
    When Elena types "4 promo codes rejected at checkout"
    Then the title field holds "4 promo codes rejected at checkout"
    And the severity still reads "P3 · Minor"

  Scenario: Digits outside one to four do nothing
    Given the Report-bug dialog is open with severity "P2 · Major"
    And the focus is not in a text field
    When Elena presses "5"
    Then the severity still reads "P2 · Major"

  Scenario: Severity keys do nothing outside the dialog
    Given the Report-bug dialog is closed
    And the focus is not in a text field
    When Elena presses "1"
    Then nothing on the Run changes

  # ---------- Guards ----------

  Scenario Outline: Typing into a text field never triggers a shortcut
    Given the focus is in "<field>"
    When Elena types "<text>"
    Then "<field>" holds "<text>"
    And no verdict is recorded
    And the current step is unchanged

    Examples:
      | field                     | text                        |
      | the step note field       | Payment form blocked         |
      | the evidence link field   | https://build/p4-fail.png    |
      | the abort reason field    | Blocking defect on payment   |

  Scenario Outline: Shortcuts are inert while a confirmation is open
    Given the "<overlay>" confirmation is open
    When Elena presses "P"
    Then no verdict is recorded
    And the "<overlay>" confirmation stays open

    Examples:
      | overlay |
      | abort   |
      | finish  |

  Scenario Outline: A held modifier suppresses the bare verdict keys
    When Elena presses "<combination>"
    Then no verdict is recorded
    And the browser handles the combination as it normally would

    Examples:
      | combination |
      | Cmd+P       |
      | Ctrl+F      |
      | Alt+B       |

  Scenario: Verdict keys are inert once the Run is closed
    Given the Run reads Aborted
    And the current step is step 01 of the first Acceptance Test Case
    When Elena presses "P"
    Then no step-result form opens
    And no verdict is recorded

  Scenario: The bug shortcut still works on a failed step of a closed Run
    Given the Run reads Failed
    And the current step reads Failed
    When Elena presses "Cmd+B"
    Then the Report-bug dialog opens

  Scenario: Verdict keys are inert for an actor who may not record results
    Given Elena is viewing a Run she may not record results on
    When she presses "P"
    Then no step-result form opens

  Scenario: A verdict recorded elsewhere does not move this tester's cursor
    Given the current step is step 02 of the first Acceptance Test Case
    When another tester marks that same step Passed in their own window
    Then the step reads Passed for Elena
    And the current step is still step 02 of the first Acceptance Test Case

  # ---------- Discoverability ----------

  Scenario: Every verdict button carries its key badge
    When Elena looks at the step-result controls on the current step
    Then the Pass control shows the badge "P"
    And the Fail control shows the badge "F"
    And the Block control shows the badge "B"

  Scenario: The Run screen shows the shortcut legend
    When Elena opens the Run
    Then a legend is visible without scrolling to it
    And it names P for pass, F for fail, B for block, Cmd+Enter for the next step and Cmd+B for a bug

  Scenario: The legend matches the platform
    Given Elena is on Windows
    When she reads the legend
    Then it names "Ctrl" where a macOS reader would see "Cmd"

  Scenario: The severity keys are discoverable inside the dialog
    When Elena opens the Report-bug dialog
    Then each severity control shows its digit
```

---
_Synced from Jira by sync-jira-issues_
