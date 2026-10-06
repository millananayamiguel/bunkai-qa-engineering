# BK-512 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-512)

## AC-01 — An Owner finds Delete workspace on the rows they own

```
Scenario: The Delete workspace action appears only on owned rows
  Given I am signed in and I own one of the workspaces I belong to
  And I am only a Member of another workspace in the same list
  When I open Settings and go to Workspaces
  Then the row for the workspace I own offers a "Delete workspace" action
  And the row where I am only a Member offers no "Delete workspace" action
  And the "Leave" action is still present and unchanged on the rows that already offered it
```

## AC-02 — Admin, Member and Viewer never reach workspace deletion

```
Scenario: A non-Owner cannot see or reach the deletion
  Given I am signed in with the Admin, Member or Viewer role in a workspace
  When I open Settings and go to Workspaces
  Then no "Delete workspace" action is offered for that workspace
  And I cannot reach a workspace deletion for it by any route in Settings
```

## AC-03 — The confirmation names the workspace and states the consequence before anything happens

```
Scenario: The Owner is told what deletion means before committing
  Given I am the Owner of a workspace
  When I choose "Delete workspace" on its row
  Then a confirmation opens naming that exact workspace and no other
  And it states that the workspace and everything inside it will be removed
  And it states that access ends immediately for everyone, and that the removal
    becomes permanent 30 days later
  And it states that the workspace can be restored, with everything it held,
    at any time before that 30-day deadline passes
  And nothing has been deleted yet
```

## AC-04 — Typing the exact workspace name gates the destructive action

```
Scenario: The destructive action stays out of reach until the name matches exactly
  Given the delete confirmation for my workspace is open
  When I have typed nothing
  Then the confirming action is unavailable
  When I type a name that differs from the workspace's name in any way
  Then the confirming action is still unavailable
  When I type the workspace's exact name
  Then the confirming action becomes available
```

## AC-05 — Backing out of the confirmation changes nothing

```
Scenario: Dismissing the confirmation leaves the workspace untouched
  Given the delete confirmation for my workspace is open and I have typed its exact name
  When I dismiss the confirmation instead of confirming
  Then the workspace still exists with all of its contents
  And I am back on the Workspaces list with that workspace still listed
  And reopening the confirmation starts with an empty name field
```

## AC-06 — An export is offered before the deletion, not after

```
Scenario: The Owner is offered their data before it is erased
  Given the delete confirmation for my workspace is open
  Then it offers me a way to export this workspace's data first
  And it explains that the data cannot be exported once the workspace is deleted
  When I take that offer
  Then I am taken to the workspace data export without the deletion having happened
  And I can return to the delete confirmation afterwards
```

## AC-07 — Confirming puts the workspace and everything inside it out of reach, and schedules its permanent erasure

```
Scenario: The whole workspace goes out of reach at once, and is erased 30 days later
  Given I am the Owner of a workspace holding Projects, Modules, User Stories,
    Acceptance Criteria, ATCs, Tests, Runs, Bugs, Milestones and Project environments
  When I confirm the deletion with the exact name typed
  Then the workspace is no longer listed anywhere for me
  And none of its Projects, Modules, User Stories, Acceptance Criteria, ATCs,
    Tests, Runs, Bugs, Milestones or Project environments can be reached any more
  And its memberships, pending invites, Personal Access Tokens and Notifications
    stop working at that same instant
  And nothing has been physically removed yet — the workspace and everything inside it
    is permanently erased 30 days after I confirmed
  And until that deadline passes I can restore the workspace with everything it held
```

## AC-08 — Other members lose access immediately

```
Scenario: A member of the deleted workspace can no longer reach it
  Given a teammate is an active Member of the workspace I am about to delete
  When I confirm the deletion
  And my teammate next loads the app
  Then the deleted workspace is absent from their list of workspaces
  And they cannot reach any screen belonging to it
  And every other workspace they belong to is unaffected
```

## AC-09 — A member whose active workspace was deleted is re-pointed, not stranded

```
Scenario: The deleted workspace was someone's active workspace
  Given a teammate has the workspace I am about to delete set as their active workspace
  And they also belong to at least one other workspace
  When I confirm the deletion
  And my teammate next loads the app
  Then they are placed in one of the workspaces they still belong to
  And the app tells them which workspace they are now in
  And they are not signed out and are not shown a broken shell
```

## AC-10 — Deleting my only workspace lands me on onboarding

```
Scenario: The Owner deletes the last workspace they belong to
  Given the workspace I am deleting is the only workspace I belong to
  When I confirm the deletion
  Then I am taken to onboarding
  And I am offered the ways to create or join a workspace
  And I am still signed in
```

## AC-11 — Deleting one of several workspaces moves me to another

```
Scenario: The Owner still belongs to other workspaces afterwards
  Given I am the Owner of the workspace I am deleting
  And I belong to at least one other workspace
  When I confirm the deletion
  Then I land in one of the workspaces I still belong to
  And the app tells me which workspace I am now in
  And that workspace's contents are unchanged
```

## AC-12 — Being the only Owner does not block the deletion

```
Scenario: A sole Owner may delete, even though a sole Owner may not leave
  Given I am the only Owner of my workspace and other members belong to it
  When I open the Workspaces list
  Then the "Leave" action for that workspace is still refused with its stated reason
  And the "Delete workspace" action is offered and is not refused
  When I confirm the deletion with the exact name typed
  Then the workspace is deleted
```

## AC-13 — Personal Access Tokens issued against the workspace stop working

```
Scenario: A PAT never outlives the workspace it was issued for
  Given a Personal Access Token has been issued against my workspace and works today
  When I delete that workspace
  And the token is used afterwards
  Then it is refused
  And it is refused without revealing that the workspace ever existed
```

## AC-14 — Pending invites to the workspace stop working

```
Scenario: An outstanding invite dies with its workspace
  Given an invite to my workspace is outstanding and has not been accepted
  When I delete the workspace
  And the invited person opens their invite afterwards
  Then the invite is refused
  And it is refused without revealing that the workspace ever existed
```

## AC-15 — A run in progress does not block the deletion

```
Scenario: An in-flight run is erased with everything else
  Given a Run in my workspace is still running
  When I confirm the deletion of that workspace
  Then the deletion goes through without asking me to wait for the Run
  And the Run and its recorded steps are gone with the workspace
```

## AC-16 — Deleting one workspace never touches another

```
Scenario: Isolation between workspaces holds through a deletion
  Given I own two workspaces, each with its own Projects, Tests, Runs and members
  When I delete the first one
  Then the second workspace is completely unchanged
  And every Project, Test, Run, Bug and member of the second workspace is still there
  And no member of the second workspace loses access to it
```

## AC-17 — The deletion is recorded in the deletion audit record as it happens

```
Scenario: The act is an event, not a silent disappearance
  Given I am the Owner of a workspace
  When I confirm the deletion
  Then the deletion is recorded in the deletion audit record as it happens,
    naming the workspace, its name at the time, me as the actor and the moment it occurred
  And that record lives outside the workspace, so it is still readable after the workspace
    is permanently erased at the end of the 30-day grace period
```

## AC-18 — A failed deletion leaves the workspace whole

```
Scenario: Deletion is all or nothing
  Given I confirmed the deletion of my workspace
  And the deletion could not be completed
  Then I am told the deletion failed
  And the workspace is still listed with every Project, Test, Run and Bug it had
  And no part of it has been removed
  And I can attempt the deletion again
```

## AC-19 — Deleting is visibly not the same act as leaving

```
Scenario: The two actions are never mistaken for each other
  Given I am the Owner of a workspace that other members also belong to
  When I open the Workspaces list
  Then "Leave" and "Delete workspace" are offered as two separate, separately labelled actions
  And each confirmation states what happens to the other members:
    leaving removes only me, deleting removes the workspace for everyone
```

## AC-20 — The delete flow is reachable and operable by keyboard

```
Scenario: A keyboard-only Owner can complete and cancel the deletion
  Given I am the Owner of a workspace and I am navigating by keyboard only
  When I reach the "Delete workspace" action and activate it
  Then focus moves into the confirmation
  And I can reach the name field and the confirming and dismissing actions without a pointer
  And dismissing returns focus to where I started
```

## New Scenarios — Shift-Left Refinement (Added 2026-08-22)

> Surfaced during pre-sprint Shift-Left refinement. Every scenario below has since been resolved: N2 and N6 by the ratified clarifications of 2026-08-23, and N1, N3, N4 and N5 by the joint AI Product Owner + AI Tech Lead ruling of 2026-08-29, which is consistent with ADR-0015 (soft-delete with a 30-day grace period, access revoked immediately, no member veto). Full analysis: ATP DRAFT field / `shift-left-refinement.md`.

***Scenario N1 — Concurrent write racing the deletion***
Type: Edge / Integration · Priority: Medium
RESOLVED — AI Product Owner + AI Tech Lead ruling, 2026-08-29 (consistent with ADR-0015)

```
Given a Member is mid-flight submitting a new ATC, filing a Bug, or accepting a pending invite in my workspace
When I confirm the deletion of that workspace at the same moment
Then the deletion goes through without waiting for that write, without locking against it, and without being refused because of it
And if their write lands before the deletion is recorded, it is accepted normally, is unreachable from the moment the deletion is recorded, and is erased with the workspace at the end of the grace period
And if their write is still in flight when the deletion is recorded, it is refused as not found — the same refusal the product already gives for a workspace the caller cannot see
And in neither case are they shown a server error, a half-saved record, or any hint that the workspace is being deleted
```

***Scenario N2 — Re-pointing resolver reuse***
Type: Positive / Integration · Priority: High
RESOLVED — ratified 2026-08-23 (see Ratified Clarifications below)

```
Given a teammate belongs to three workspaces, including the one I am deleting, which was their active workspace
When I confirm the deletion and my teammate next loads the app
Then they land in the workspace chosen by the existing active-workspace resolver and its BR-1 rule, oldest active membership first — the same resolver already shipped for the Leave flow
And the app tells them which workspace they are now in
And no separate tie-break rule is introduced for this story
```

***Scenario N3 — Realtime Run-viewer during deletion***
Type: Edge / Integration · Priority: Medium
RESOLVED — AI Product Owner + AI Tech Lead ruling, 2026-08-29 (consistent with ADR-0015)

```
Given a teammate has the Runner view open, subscribed to the Realtime channel of a Run inside my workspace
When I confirm the deletion of that workspace
Then the next time that view reaches the server for the Run — a refresh, a step action, or any navigation — the Run is refused as not found
And they are told plainly that the workspace was deleted, instead of being left on a silently stale view or shown a network-error message
And they are moved to a workspace they still belong to, or to onboarding if none remains, by the same resolver AC-09 uses
And no step they submit after the deletion is recorded against the Run
```

***Scenario N4 — Activity Stream entry vs. its own cascade***
Type: Edge / Technical · Priority: High
RESOLVED — AI Product Owner + AI Tech Lead ruling, 2026-08-29 (consistent with ADR-0015)

```
Given the deletion must be recorded even though the workspace's own Activity Stream is erased with the workspace when it is finally purged
When the deletion's transaction commits
Then a deletion audit record exists outside the workspace, naming the workspace, its name at the time, me as the actor, and the moment I requested it
And that record can be read by an ordinary query after the transaction commits, with no live subscription required to observe it
And it is still readable after the workspace is permanently erased at the end of the grace period
```

***Scenario N5 — Double-submit / idempotent DELETE***
Type: Boundary / API · Priority: Low
RESOLVED — AI Product Owner + AI Tech Lead ruling, 2026-08-29 (consistent with ADR-0015)

```
Given two browser tabs both have the delete confirmation open for the same workspace with the exact name typed
When both tabs submit the confirming action within the same second
Then exactly one submission is accepted and the workspace is recorded as deleted once
And the other submission is refused as not found, saying the workspace was not found or is already deleted
And neither tab is shown a server error
And exactly one deletion audit record is written, and the members are notified exactly once
```

***Scenario N6 — Typed-name state across the export round-trip***
Type: Boundary · Priority: Low
RESOLVED — ratified 2026-08-23 (see Ratified Clarifications below)

```
Given the delete confirmation is open, I have typed the workspace's exact name, and I take the export offer (AC-06)
When I return to the delete confirmation afterwards
Then the typed name has been reset to empty, exactly as AC-05 specifies for a plain dismiss-and-reopen
And the confirming action is unavailable again until I retype the exact name
And one reset rule applies to the whole confirmation, regardless of the navigation path that reopened it
```

## Ratified Clarifications — 2026-08-23 (AI Product Owner / AI Tech Lead)

> Resolves 3 of the open questions from the 2026-08-23 PO/Dev answers comment, per `CLAUDE.md` Rule #18 (AI-led decision authority, this project's own governance). Read alongside the AC/scenario each one amends — not new scenarios, clarifications of existing ones.

***Amends AC-09 / AC-11 (re-pointing target)***: the workspace a re-pointed member or Owner lands in is determined by the existing `resolveActiveWorkspaceId` resolver (`lib/workspaces/active.ts`) and its BR-1 rule ("oldest active membership first"), the same resolver already shipped for BK-90's Leave flow. No separate tie-break rule for this story.

***Amends AC-06 (typed name across the export round-trip)***: the typed workspace name resets to empty when the Owner returns from the export offer, the same reset behavior AC-05 already specifies for a plain dismiss-and-reopen. One rule for the whole confirmation, regardless of the navigation path that reopened it.

---
_Synced from Jira by sync-jira-issues_
