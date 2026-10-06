# BK-601 — Out Of Scope

> Jira field: `customfield_10081` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-601)

- ***The opt-in on any listing BK-039 does not name.**** BK-039's applies-to list is **"Modules, US, AC, ATC, Tests"*, read literally. Bug lists, Run lists and history, coverage and recovery-cycle reports, the Defect Heatmap, Milestones, Test Plans, Environments, the Projects index and the workspace listings are all out. That narrowing is deliberate and its reasoning is recorded in this Story's description and in the attributed AI Tech Lead ruling on this issue.
- ***The archived views for ATCs and for Tests.**** [https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571](https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571) owns the opt-in archived view for ATCs and [https://jira.upexgalaxy.com/browse/BK-596#icft=BK-596](https://jira.upexgalaxy.com/browse/BK-596#icft=BK-596) owns it for Tests. This Story does not re-decide either. It ****does**** restore the ATC rows the Module cascade archived, because a restore that skips them is not the inverse of the archive — but the archived-ATC **browsing surface* stays BK-571's.
- ***Archiving a Module.*** The cascade already ships and this Story changes nothing about what it archives, what it reports, or how it is confirmed. Only the storage needed to identify one archive batch is added to it.
- ***Restoring a User Story, an Acceptance Criterion or an ATC on its own.*** This Story restores by Module. A row archived individually is restored by whatever story owns that entity's own archive; for ATCs that is [https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571](https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571).
- ***Permanent deletion.*** BK-039 reserves hard-delete for a separate administrative path with its own confirmation header. Nothing here builds it, and no action in this Story destroys a row.
- ***Bulk restore across a selection of Modules.*** One Module at a time here. Bulk archive and bulk restore are named as separate work by [https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571](https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571) and stay that way.
- ***Automatic un-archiving.*** No age rule, no scheduled sweep, no "restore everything". Restoring is always an explicit human action on a named Module.
- ***Retention, purge windows, or an "empty the archive" action.***
- ***A workspace-wide archive index.*** The opt-in rides the listings that already exist inside a Project. A cross-Project archive screen is separate work.
- ***Changing the traceability, coverage or heatmap treatment of archived rows.*** Those are evidence surfaces; per the rules already ratified on [https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571](https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571) and [https://jira.upexgalaxy.com/browse/BK-596#icft=BK-596](https://jira.upexgalaxy.com/browse/BK-596#icft=BK-596) they must keep resolving archived rows, and this Story does not touch them.
- ***Backfilling an archive identity onto rows archived before this Story ships.*** Those rows are handled by the documented fallback, not by a data migration.
- ***Any change to how Modules, User Stories, Acceptance Criteria or ATCs are created, renamed, moved or edited while active.*** Those stay with their existing stories.
- ***Exporting or reporting on archived rows.***

---
_Synced from Jira by sync-jira-issues_
