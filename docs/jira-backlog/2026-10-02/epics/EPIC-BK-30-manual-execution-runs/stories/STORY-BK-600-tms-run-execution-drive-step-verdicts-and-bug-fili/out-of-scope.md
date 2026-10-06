# BK-600 — Out Of Scope

> Jira field: `customfield_10081` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-600)

> ***NOTE:*** Two exclusions are load-bearing and were ratified before this ticket existed. Reopening either is a defect, not an improvement.

## Ratified elsewhere — do not reopen

| ***Excluded**** | ****Why*** |
| --- | --- |
| Rebuilding the runner as the mockup's single-active-step wizard | `BK-35`'s divergence `D-UI-1` ratified the flat checklist as the live pattern, under Critical Rule #14. This story adds a cursor ***over*** that checklist. It does not replace it, does not hide unfocused steps, and does not introduce a left Test Outline rail |
| Changing what a verdict means, or how one is recorded | Pass, Fail and Block keep their current meaning, their current effect on the parent Acceptance Test Case, and their current server contract. The keys are a second way to reach the controls that already exist |

## Not in this story

- ***A verdict committed by a single keypress.*** Every verdict still passes through the form and its confirm action. See the decision comment on this ticket for the alternatives weighed
- ***An un-mark or undo path.*** A recorded verdict still cannot be returned to Unrun. That gap is real and predates this story; it is not created or closed here
- ***Making the step note or evidence field mandatory.*** Both stay optional
- ***A shortcut help overlay***, a cheat-sheet modal, or a `?` binding. None is drawn in the mockup
- ***User-remappable keys***, a shortcut settings screen, or per-workspace key preferences. None is drawn, and none is implied by any spec
- ***Shortcuts anywhere outside the Run screen*** — not the Run history, not the project run report, not the bug list, not the workbench
- ***Changing the global command palette*** or any binding it already owns
- ***A jump-to-step-N binding.*** Step numbering is per-Acceptance-Test-Case today, so no unambiguous global step number exists to type. Inventing one is a numbering change with its own consequences
- ***Vim-style**** `J` ****/**** `K` ****movement aliases.*** Not drawn; adding vocabulary the legend does not show makes the legend a lie
- ***Escape closing the runner's overlays.*** A genuine gap, and a genuine follow-up, but it is a modal-behaviour fix that touches surfaces this story does not otherwise open
- ***Focus trapping inside the three overlays.*** Same reasoning as above
- ***Any backend, schema, permission or API change.*** This story is presentation only. If an implementer finds themselves writing a migration, the plan has gone wrong
- ***Touch or mobile equivalents*** of these affordances

---
_Synced from Jira by sync-jira-issues_
