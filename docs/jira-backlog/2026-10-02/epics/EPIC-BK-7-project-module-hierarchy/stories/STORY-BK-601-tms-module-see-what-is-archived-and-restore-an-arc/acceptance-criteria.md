# BK-601 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-601)

## AC-01 — Opt into seeing archived Modules, User Stories and Acceptance Criteria

```
Scenario: Archived rows stay hidden unless they are explicitly asked for
  Given a Module in my Project has been archived
  When I browse that Project's Module tree without opting into archived rows
  Then the archived Module is absent
  And its descendant Modules, their User Stories and those Stories' Acceptance Criteria are absent with it
  And any count shown alongside those listings excludes every one of them
```

```
Scenario: Opting in shows the archived rows alongside the active ones, clearly marked
  Given a Module in my Project has been archived
  When I opt into including archived rows
  Then the archived Module appears in the tree
  And it is visibly marked as archived, never rendered as if it were active
  And its archived descendant Modules, User Stories and Acceptance Criteria appear and are marked the same way
```

```
Scenario: The opt-in is per view, not a setting I have to remember to switch back
  Given I opted into archived rows on one listing
  When I open a different Project or return later without opting in
  Then archived rows are hidden again
```

```
Scenario: A Project that has archived nothing says so without reading as an error
  Given nothing in my Project has ever been archived
  When I opt into including archived rows
  Then the listing reads exactly as it does with the opt-in off
  And an explicit note tells me nothing is archived
  And nothing on the screen reads as an error
```

```
Scenario: The opt-in never widens what I am allowed to see
  Given a Module was archived in a Project I am not a member of
  When I opt into including archived rows anywhere I can reach
  Then that Module never appears
```

## AC-02 — Restore an archived Module and everything its archive took down

```
Scenario: Restoring a Module brings back the whole set its archive took
  Given a Module named "Checkout" was archived, and its archive took down 2 descendant Modules, 5 User Stories, 14 Acceptance Criteria and 9 ATCs
  When I restore "Checkout"
  Then "Checkout" is active again and appears in the Module tree with the opt-in off
  And all 2 descendant Modules are active again
  And all 5 User Stories are active again
  And all 14 Acceptance Criteria are active again
  And all 9 ATCs are active again and offered for reuse again
  And every one of them sits exactly where it sat before the archive, at the same position in the tree and in the same order
```

```
Scenario: Restoring reports what came back
  Given I restore an archived Module
  Then I am told which Module was restored
  And I am told how many descendant Modules, User Stories, Acceptance Criteria and ATCs came back with it
  And the restored Module is no longer marked as archived
```

```
Scenario: Restoring one Module leaves every other archived Module alone
  Given three unrelated Modules in the same Project were archived on three different occasions
  When I restore exactly one of them
  Then that one is active again with its own set
  And the other two are still archived, with nothing about them changed
```

## AC-03 — A row archived on its own before the Module was archived stays archived

```
Scenario: An individually archived child does not ride back in on its parent's restore
  Given a User Story under the Module "Checkout" was archived on its own
  And the Module "Checkout" was archived afterwards, which archived the rest of its contents
  When I restore "Checkout"
  Then "Checkout" and everything its own archive took down are active again
  And that individually archived User Story is still archived
  And it is still reachable, still marked as archived, and can still be restored by its own owner story
```

```
Scenario: A sub-Module archived on its own stays archived when its parent is restored
  Given a sub-Module was archived on its own
  And its parent Module was archived afterwards
  When I restore the parent Module
  Then the parent and its other contents are active again
  And the individually archived sub-Module is still archived
  And nothing beneath that sub-Module is active
```

```
Scenario: Archiving twice does not merge the two sets
  Given a Module was archived, then restored, then archived a second time
  When I restore it after the second archive
  Then exactly the rows the second archive took down come back
  And no row that was already archived before the second archive comes back with them
```

## AC-04 — Restoring a Module whose parent is still archived is refused

```
Scenario: The refusal names the archived ancestor instead of leaving an unreachable Module
  Given a sub-Module is archived
  And its parent Module is also archived, by a separate archive
  When I try to restore the sub-Module on its own
  Then the restore is refused
  And I am told which ancestor Module is still archived and must be restored first
  And nothing is changed by the refused attempt
```

```
Scenario: Restoring the ancestor first makes the child restorable
  Given a restore was refused because an ancestor Module was archived
  When I restore that ancestor
  And I then restore the child Module
  Then the child is active again
  And it sits under the same parent it had before
```

```
Scenario: A Module directly under the Project root has no ancestor to block it
  Given an archived Module sits directly under its Project with no parent Module
  When I restore it
  Then the restore succeeds with no ancestor check standing in the way
```

## AC-05 — Restore is all-or-nothing

```
Scenario: A restore that fails partway leaves everything archived
  Given a restore of an archived Module fails partway through
  When I look at that Module and everything under it
  Then the Module is still archived
  And every descendant Module, User Story, Acceptance Criterion and ATC is still archived
  And nothing is half-restored
  And I see a named error explaining what failed
  And I can retry the same action
```

## AC-06 — Only someone who could archive the Module may restore it

```
Scenario: A member without write access is offered no restore
  Given I can read a Project but not write to it
  When I opt into archived rows and view an archived Module
  Then no restore action is offered to me
  And a restore attempt is refused
```

```
Scenario: Read access is enough to see the archive, and not enough to undo it
  Given I can read a Project but not write to it
  When I opt into including archived rows
  Then I can see which Modules, User Stories and Acceptance Criteria are archived
  And I can see when each was archived
```

## AC-07 — Restore is recorded in the workspace Activity Stream

```
Scenario: Archive and restore each leave their own entry
  Given I archive a Module and later restore it
  When I open the workspace Activity Stream
  Then I see one entry recording the archive, naming the Module and me
  And I see a separate later entry recording the restore, naming the Module and me
  And the restore entry records how many descendant Modules, User Stories, Acceptance Criteria and ATCs came back
```

```
Scenario: The archived view tells me who archived it and when
  Given a Module was archived by a teammate
  When I opt into including archived rows
  Then the archived Module shows when it was archived
  And it shows who archived it
```

## AC-08 — Repeating either action is harmless

```
Scenario: Restoring a Module that is not archived changes nothing
  Given a Module is active
  When a restore is attempted on it
  Then the outcome is reported as success
  And nothing about the Module or anything under it changes
  And no Activity Stream entry is written
```

```
Scenario: Restoring the same Module twice changes nothing the second time
  Given I restored an archived Module
  When a restore is attempted on it again
  Then the outcome is reported as success
  And nothing further changes
```

## AC-09 — Restoring never resurrects a state the Project can no longer hold

```
Scenario: A restore that would exceed the maximum nesting depth is refused, not silently truncated
  Given an archived Module was moved deeper in the tree while it was archived
  And restoring it as-is would push part of its subtree past the maximum nesting depth
  When I try to restore it
  Then the restore is refused
  And I am told the nesting limit is what blocked it
  And nothing is restored
```

```
Scenario: A restore that would collide with a Module created in the meantime is refused
  Given a Module named "Checkout" was archived
  And a new active Module named "Checkout" was then created under the same parent
  When I try to restore the archived one
  Then the restore is refused
  And I am told a Module with that name already exists under the same parent
  And nothing is restored
  And I can retry after renaming one of them
```

## AC-10 — Archiving is still exactly what it was

```
Scenario: Nothing in this story changes what archiving a Module does
  Given I archive a Module
  Then the same descendant Modules, User Stories, Acceptance Criteria and ATCs are archived as before this story
  And the confirmation and the report of what was archived read as they did before
```

```
Scenario: No action in this story permanently removes anything
  Given a Module has been archived
  Then the Module and everything its archive took down still exist
  And each is reachable with the archived opt-in on
  And no action offered anywhere in this story permanently deletes any of them
```

---
_Synced from Jira by sync-jira-issues_
