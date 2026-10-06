# BK-666 — Out Of Scope

> Jira field: `customfield_10081` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-666)

- Making the workbench Tree / Table / Mind map toggle entity-aware. Table View is an ATC surface by design — the mockup's own table flattens ATCs out of the tree and labels its count in ATCs — and this story adds a separate surface rather than overloading that one. An implementer must not "fix" the toggle as part of this work
- A Workspace-wide Tests index spanning every Project. This story gives one Project its list; the cross-project equivalent is a separate surface with its own scoping question
- Bulk edit of any kind — selecting rows and changing tags, or any other field, from the list. This is a lookup surface, not a management surface
- Creating, renaming, archiving or deleting a Test from this list. Creation already lives on its own route; rename and archive belong to the story that introduces archive vocabulary for Tests
- A Runs list surface and a Defects list surface. Both already ship as their own Project sections and are unaffected by this story
- Free-text search over Test names, and filtering by anything other than a tag. Tag filtering is what the Project already has; anything more is a separate slice
- Persisting the filter or sort across sessions or devices. The filter surviving navigation within the Project is in scope; remembering it tomorrow is not
- Fixing how a Test is attributed to a Project. That correction is tracked as its own defect, and this story is deliberately built to inherit the fix rather than duplicate the rule
- Pagination controls. The list shows the Project's Tests; introducing paging is a scale decision this story does not take

---
_Synced from Jira by sync-jira-issues_
