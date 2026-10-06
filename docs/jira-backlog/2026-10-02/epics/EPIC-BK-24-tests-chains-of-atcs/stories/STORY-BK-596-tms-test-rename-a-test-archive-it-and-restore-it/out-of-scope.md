# BK-596 — Out Of Scope

> Jira field: `customfield_10081` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-596)

- ***A workspace-wide archived-Tests index.*** The product has no Tests list of any kind today, so there is no list to hang an opt-in archived view on. An archived Test is reached through its own address, which keeps resolving. Building the Tests index, and then an archived view inside it, is separate work.
- ***Test Plan membership behaviour.*** A Test cannot belong to a Test Plan yet — the Test Plan container shipped without any membership, and its detail surface is deliberately empty pending its own stories. The rule for what archiving does to a plan member is decided and recorded in this Story's business rules and in the attributed AI Product Owner ruling on this issue, so the membership story inherits it. No plan behaviour is built here.
- ***Archiving anything other than a Test.*** Modules, User Stories and Acceptance Criteria already ship their own archive; the ATC archive is [https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571](https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571). None of them change here.
- ***Permanent deletion of a Test.*** `BK-039` reserves hard-delete for a separate administrative path with its own confirmation, which this Story does not build.
- ***Archiving, hiding or altering a Run.*** A Run is never archived, never cascaded into, and never edited by anything in this Story.
- Bulk archive or bulk restore across a selection of Tests — one Test at a time here.
- Automatic archiving — no age rule, no usage rule, no scheduled sweep. Archiving is always an explicit human action.
- Cascading the archive to anything else — archiving a Test never archives, edits or removes an ATC, a chain position, a Run, an Acceptance Criterion, a Defect or a Milestone.
- Retention, purge windows, or an "empty the archive" action.
- Any change to how a Test is created, chained, reordered or tagged while it is active — those stay with their existing stories.
- Changing what a Test is made of. No new field beyond the archived state itself, no description, no owner, no status.
- Exporting or reporting on archived Tests.

---
_Synced from Jira by sync-jira-issues_
