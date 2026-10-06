# BK-596 — Scope

> Jira field: `customfield_10129` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-596)

- Rename a Test in place from its own detail surface, under the same name rules the product already enforces when a Test is created
- Archive a single Test from that same surface, behind a confirmation that names the Test, states that archiving is reversible, and states how many Runs have been recorded against it
- Give a Test an archived state at all — it has none today, so this Story introduces the storage for it as well as the actions that set and clear it
- Remove an archived Test from every surface that offers a Test for use: workspace search, the command palette, tag filtering, the ATC "used in N Tests" report, and any count shown alongside them
- Refuse starting a new Run from an archived Test, and remove the affordance that offers it
- Keep every surface that reports what already happened resolving an archived Test in full: each recorded Run with its steps, content and results, the Test's own Run history, the Traceability chain, every report and metric over past periods, and any Defect anchored to one of those Runs
- Freeze an archived Test until restored — not renameable, not reorderable, not retaggable, not extendable with another ATC — while keeping it fully readable and clearly marked as archived
- Restore a single Test from its own detail surface, returning it to full use with its chain, tags and Run history untouched
- Restrict rename, archive and restore to members who can already change the Test
- One workspace Activity Stream entry per rename, per archive and per restore, the rename entry carrying the name before and after
- Loading, empty and named-error-with-retry states for each of the three actions

---
_Synced from Jira by sync-jira-issues_
