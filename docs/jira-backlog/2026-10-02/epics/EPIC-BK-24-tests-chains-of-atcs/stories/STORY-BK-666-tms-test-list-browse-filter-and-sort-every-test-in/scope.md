# BK-666 — Scope

> Jira field: `customfield_10129` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-666)

- A Tests list surface of its own for a Project, reachable as a section of that Project alongside the sections that already exist
- One row per Test the Project holds, showing the Test's name, its chain length (how many ATCs the chain holds), its tags, and when it was created
- A visible count of how many Tests the list is currently showing, reflecting the active filter
- Tag filtering driven by the Project's existing tag control — the same control, now scoping this list as well as the explorer's Tests group
- Column sorting over the whole filtered set, composable with the tag filter
- Opening a row navigates to that Test's own detail view, where its chain of ATCs already renders
- Four distinct states: the populated list, a Project with no Tests yet, a tag that matches nothing, and a named failure with a retry path — plus a loading state while the Tests arrive
- Read access for every active member of the Workspace, viewers included

---
_Synced from Jira by sync-jira-issues_
