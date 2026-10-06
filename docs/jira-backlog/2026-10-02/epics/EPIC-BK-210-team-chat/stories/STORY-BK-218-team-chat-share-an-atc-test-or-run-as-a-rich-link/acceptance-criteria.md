# BK-218 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-218)

# Refined Acceptance Criteria — BK-218

## Scenario: Run card reflects the persisted Run status

Given Elena can read the Payments API Project
And a Run for Test "Checkout happy path" has environment "Staging"
When Elena pastes or inserts the Run reference into the channel
Then the card shows the Test name, environment, and the Run's persisted status
And the card opens that Run when selected

## Scenario: Run status labels remain at Run grain

Given an authorized reader references a Run with status `running`, `passed`, `failed`, or `aborted`
When the card is rendered
Then it displays Running, Passed, Failed, or Aborted respectively
And a child position with status `blocked` is not displayed as the Run verdict

## Scenario: ATC card uses the latest applicable execution result

Given Sara can read the Payments API Project
And an ATC appears in one or more Runs
When Sara inserts the ATC reference
Then the card shows the ATC title and its Execution Status from the latest applicable Run position
And the card opens that ATC when selected
And the latest Run is selected by `runs.started_at DESC`, then `runs.id DESC`
And repeated positions in that Run are selected by `run*atcs.position DESC`, then `run*atcs.id DESC`

## Scenario: ATC without an execution position is unrun

Given Sara can read an ATC with no applicable `run_atcs` position
When the ATC reference is rendered
Then its Execution Status is `unrun`
And the card does not use stale `atcs.status` or another Test or Run's status

## Scenario: ATC execution status maps each position state

Given Sara can read an ATC whose selected Run is not running
When its selected `run_atcs.status` is `pending`, `passed`, `failed`, `blocked`, or `skipped`
Then the card displays `unrun`, `pass`, `fail`, `blocked`, or `skipped` respectively
And when the selected Run is `running`, the card displays `running`

## Scenario: Test card shows its Automation Status

Given Sara can read a Test with Automation Status `manual-only`, `candidate`, or `automated`
When she pastes or inserts the Test reference
Then the card shows the Test title and its Automation Status
And the card does not substitute the Test's latest Run result

## Scenario: Authorized reader sees an entity card

Given Sara has read access to the referenced entity's Project
And the ATC, Test, or Run is available
When the message is rendered
Then the card shows that entity's title and approved entity-specific status
And selecting the card opens the referenced entity

## Scenario: Reader without Project access sees a restricted placeholder

Given Mateo can read the channel but does not have access to the referenced entity's Project
And a visible message or picker search refers to an ATC, Test, or Run in that Project
When Mateo reads the message or searches the picker
Then he sees no entity title, identifier, Project name, environment, state, or result count
And the reference is an inert restricted placeholder
And inaccessible entities are omitted from picker results

## Scenario: Deleted or archived ATC or Test remains unavailable in message history

Given a saved message refers to an ATC or Test
And that entity is deleted or archived after the message is posted
When an authorized channel reader opens or reloads the message
Then the reference is an inert "No longer available" placeholder
And the surrounding message text remains unchanged and readable

## Scenario: Picker inserts supported references without replacing adjacent text

Given Sara has access to a Project and the composer caret is between existing text
When she opens the entity picker, searches by ID or title, and selects an ATC, Test, or Run with the keyboard
Then the selected reference is inserted at the caret
And arrow keys select results, Enter confirms the selection, and Escape dismisses the picker

## Scenario: Multiple supported references render independently

Given a message contains explanatory text and references to an ATC, Test, and Run
When an authorized reader renders the message
Then each supported reference displays its own card
And the surrounding text remains intact

## Scenario: Unsupported links remain plain links

Given a message contains an arbitrary external URL or a reference to a User Story, AC, Module, or Bug
When the message is rendered
Then the reference remains a plain link or text
And no rich preview is generated

## Scenario: Malformed reference syntax remains text and valid missing references are unavailable

Given a message contains malformed reference syntax and a separate valid ATC reference whose entity is missing
When an authorized channel reader renders the message
Then malformed syntax remains ordinary text without invoking the resolver
And the valid supported reference is an inert "No longer available" placeholder
And surrounding text remains intact without resolver-error details

## Scenario: Entity state is refreshed on a new message render

Given a supported entity's state changes after a message is posted
When a reader loads or re-renders the message
Then the card shows the latest authorized state
And an already-mounted card is not required to update live

---
_Synced from Jira by sync-jira-issues_
