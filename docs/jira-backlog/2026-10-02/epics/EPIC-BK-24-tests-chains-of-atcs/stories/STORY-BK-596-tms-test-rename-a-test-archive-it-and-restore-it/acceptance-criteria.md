# BK-596 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-596)

## AC-01 — Rename a Test

```
Scenario: Renaming a Test updates it everywhere it is named
  Given I am a Senior QA Engineer viewing a Test called "Checkout - guest" that I can edit
  When I rename it to "Checkout - guest, card payment"
  Then the Test shows its new name
  And every surface that names it shows the new name: search, the command palette, its Run history, and the Traceability chain it appears in
  And nothing about its chain of ATCs changes
```

```
Scenario: A name the product would refuse at creation is refused at rename
  Given I am renaming a Test
  When I submit a name that is empty, only whitespace, or longer than the product allows
  Then the rename is refused
  And I am told what is wrong with the name
  And the Test keeps the name it had
```

```
Scenario: Renaming does not disturb recorded history
  Given a Test has finished Runs recorded against it
  When I rename the Test
  Then every one of those Runs still opens and still shows the result it recorded
```

## AC-02 — Archive a Test

```
Scenario: Archiving a Test asks for an explicit confirmation first
  Given I am viewing a Test called "Checkout - guest" that I can edit
  When I choose to archive it
  Then I am asked to confirm, and the confirmation names the Test and states that archiving is reversible
  And the confirmation states how many Runs have been recorded against it
  When I confirm
  Then the Test is archived
  And I am told it was archived and how to restore it
```

```
Scenario: Cancelling the confirmation leaves the Test untouched
  Given I am asked to confirm archiving a Test
  When I dismiss the confirmation without confirming
  Then the Test is not archived
  And nothing about it has changed
```

```
Scenario: A Test that has been run is archived after a warning, never refused
  Given a Test has 12 Runs recorded against it
  When I choose to archive it
  Then the confirmation tells me those 12 Runs are kept and stay readable
  And I am still able to proceed
  And confirming archives the Test
```

```
Scenario: A Test that has never been run needs no usage warning
  Given a Test that has never been run
  When I choose to archive it
  Then the confirmation states that no Run has been recorded against it
  And no usage warning is shown
```

## AC-03 — An archived Test stops being offered for use

```
Scenario: An archived Test disappears from every surface that offers a Test to use
  Given a Test has been archived
  When I search the workspace for it by name
  Then it is absent from the results
  And it is absent from the command palette
  And it is absent when I filter Tests by any tag it carries
  And it is absent from the "used in N Tests" report of every ATC its chain includes
  And any count shown alongside those surfaces no longer includes it
```

```
Scenario: Archiving one Test leaves its siblings alone
  Given a Project holds four Tests that share a tag
  When I archive exactly one of them
  Then filtering by that tag still returns the other three, exactly as before
```

```
Scenario: A new Run cannot be started from an archived Test
  Given a Test is archived
  When I open it
  Then no action to start a Run is offered
  And an attempt to start a Run against it is refused, telling me the Test is archived and must be restored first
```

## AC-04 — Historical Run evidence is never blanked by archiving

```
Scenario: Every Run recorded against an archived Test still renders in full
  Given a Test finished several Runs, each recording a result for every step
  When the Test is archived afterwards
  And I open any one of those Runs
  Then every step still renders, with its content, its assertions and the result it recorded
  And no step renders blank, missing, or as "not found"
  And the Run's own outcome is unchanged
```

```
Scenario: The Test's Run history stays reachable and complete after archiving
  Given a Test with 12 recorded Runs is archived
  When I open that Test's Run history
  Then all 12 Runs are listed
  And the Test is shown as archived
```

```
Scenario: Archiving changes no report, metric or count of what already happened
  Given reports and metrics that count Runs, results and coverage over a period
  When a Test that contributed to that period is archived
  Then every one of those numbers reads exactly as it did before the archive
```

```
Scenario: A Defect raised from a Run of an archived Test keeps its evidence
  Given a Defect was raised from a step of a Run whose Test is later archived
  When I open that Defect
  Then it still resolves and displays the Test and Run it was anchored to
```

## AC-05 — Traceability keeps counting an archived Test as evidence

```
Scenario: An Acceptance Criterion whose only Test is archived is not reported as uncovered
  Given an Acceptance Criterion's only evidence runs through exactly one Test
  And that Test has been run at least once
  When the Test is archived
  And I open the User Story's Traceability chain
  Then the Acceptance Criterion still shows that Test and its Run as evidence
  And the Test is marked as archived in that chain
  And the Acceptance Criterion is not reported as "uncovered"
```

## AC-06 — An archived Test is frozen until it is restored

```
Scenario: An archived Test cannot be changed
  Given a Test is archived
  When I try to rename it, reorder its chain, add or remove a chained ATC, or change its tags
  Then the change is refused
  And I am told the Test is archived and must be restored first
```

```
Scenario: An archived Test stays fully readable
  Given a Test is archived
  When I open it directly
  Then it opens
  And it is clearly marked as archived
  And its whole chain of ATCs still renders in order, read-only
```

## AC-07 — Restore an archived Test

```
Scenario: Restoring an archived Test returns it to full use
  Given a Test called "Checkout - guest" is archived
  When I restore it
  Then it is no longer marked as archived
  And it reappears in search, in the command palette, in tag filtering, and in the "used in N Tests" report of each ATC in its chain
  And a Run can be started from it again
  And it can be renamed, reordered and retagged again
```

```
Scenario: Restoring reports what happened
  Given I restore an archived Test
  Then I am told which Test was restored
  And its chain, its tags and its whole Run history are exactly as they were before it was archived
```

## AC-08 — Only someone who could change the Test can rename, archive or restore it

```
Scenario: A member without write access is offered none of these actions
  Given I can read a Project but not write to it
  When I open one of its Tests
  Then no rename, archive or restore action is offered to me
  And an attempt at any of them is refused
```

```
Scenario: An archived Test in a Project I cannot reach stays invisible
  Given a Test was archived in a Project I am not a member of
  When I search the workspace
  Then that Test never appears, archived or not
```

## AC-09 — Rename, archive and restore are each recorded in the workspace Activity Stream

```
Scenario: Each action leaves its own audit entry
  Given I rename a Test, then archive it, then later restore it
  When I open the workspace Activity Stream
  Then I see three separate entries in that order
  And each names the Test and me
  And the rename entry shows the name before and the name after
```

## AC-10 — Repeating the action is harmless

```
Scenario: Archiving an already-archived Test changes nothing
  Given a Test is already archived
  When an archive is attempted on it again
  Then the outcome is reported as success
  And neither who archived it nor when it was archived changes
```

```
Scenario: Restoring a Test that is not archived changes nothing
  Given a Test is not archived
  When a restore is attempted on it
  Then the outcome is reported as success
  And the Test is unchanged
```

## AC-11 — Archiving never destroys anything

```
Scenario: No action in this story permanently removes a Test or a Run
  Given a Test has been archived
  Then the Test still exists and still opens
  And every Run recorded against it still exists
  And no action offered on this screen permanently deletes either
```

```
Scenario: A failed archive leaves everything as it was
  Given archiving a Test fails partway
  When I reopen the Test
  Then it is not archived
  And I see a named error explaining what failed
  And I can retry the same action
```

---
_Synced from Jira by sync-jira-issues_
