# BK-742 — Out Of Scope

> Jira field: `customfield_10081` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-742)

- ***Removing the requirement to name a tag.*** The lookup requires a tag today and still requires one after this story. Paging bounds an answer; it does not turn this into a way to list every Test in a Workspace. The list-all capability a Test list surface would need is a separate gap and is not opened here
- ***Backward paging.*** A caller walks forward through cursors. Asking for the page before the current one is a second slice with its own cursor design, and nothing in the backlog needs it yet
- ***Random access to a page by number.*** Offset-style paging is deliberately not offered — it is the shape this story rejects, because it drifts under concurrent creation
- ***A total count of matching Tests.*** Telling a caller "you are on page 2 of 9" needs a counting query with its own cost and its own consistency question. The cursor answers "is there more", which is what this story owes
- ***Sorting or ordering controls.*** The order is fixed and server-owned because paging depends on it being stable. Letting a caller choose the order is a separate story, and it is the one that has to answer what a cursor means when the order changes underneath it
- ***Paging the other unbounded list surfaces.*** Several other list endpoints return their whole set. Each is its own scale decision with its own consumers; this story takes exactly one of them
- ***Filtering by more than one tag, or by anything other than a tag.*** The lookup's matching rule is untouched
- ***Changing what a Test row reports.*** The fields a matching Test carries back are exactly the ones it carries today
- ***Introducing paging into the Test list surface's own visual design.*** Whether that screen shows a "load more" control, an infinite scroll, or neither is a design decision belonging to the story that builds the screen
- ***Consolidating the existing keyset-paging implementations.*** A follow-up tech story already owns that cleanup; this story consumes the shared codec rather than refactoring its other callers

---
_Synced from Jira by sync-jira-issues_
