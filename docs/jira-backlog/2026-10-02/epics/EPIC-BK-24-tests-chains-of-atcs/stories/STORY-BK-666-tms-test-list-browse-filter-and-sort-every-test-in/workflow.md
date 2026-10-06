# BK-666 — Workflow

> Jira field: `customfield_10082` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-666)

Elena opens the Project half an hour before a deploy window. She needs the smoke regression, and she knows roughly what it is called but not exactly which Test it is.

She selects "Tests" in the Project's section navigation and lands on a dense list of every Test the Project holds — one row each, carrying the Test's name, how many ATCs its chain holds, its tags and when it was created. The list tells her how many Tests she is looking at.

She types "smoke" into the Project's tag control, the same control she already uses to narrow the explorer's Tests group. The list narrows to the smoke suite and the count follows it. She sorts by chain length to put the longest chains first, because the regression she wants is the big one, and the sort orders the whole filtered set rather than only the rows she can currently see.

She finds "Checkout happy path", opens its row, and lands on that Test's detail view with its chain of seven ATCs and the control to start a run — the same destination she would have reached from the explorer, arrived at in one pass instead of by scrolling a rail. When she navigates back, the smoke filter is still applied.

If the Project had held no Tests at all, she would have seen a plain statement that none exist yet, with a pointer to how one gets created. If "smoke" had matched nothing, she would have seen a different statement saying so — a filter outcome, not an empty Project. If the tag lookup had failed outright, she would have seen what failed and a way to try again, and the list would not have quietly shown her everything as though the filter had matched.

---
_Synced from Jira by sync-jira-issues_
