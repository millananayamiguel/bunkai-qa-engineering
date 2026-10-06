# BK-593 — Business Rules

> Jira field: `customfield_10152` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-593)

- Uploaded evidence is accepted only when the file is an image; acceptance is decided by the file's content, not by the name or extension it arrived with
- An image above the accepted size limit is refused, and nothing is stored
- An image attached to a step result is readable only by members of the Workspace that owns the Run; a member of any other Workspace cannot read it under any circumstance, including when holding a direct reference to the stored object
- No stored image is readable without an authorization check — there is no anonymous read path, and a reference alone is never sufficient
- An upload that fails part-way leaves the step result exactly as it was: its outcome, its note, and its already-attached evidence are all unchanged, and no partial attachment is recorded
- The evidence link a tester pastes keeps its current behaviour unchanged, including the existing rule that only http and https links render as openable
- Evidence belongs to a step result — never to the Run as a whole, never to an ATC, never to a Test
- An attachment may be removed by the person who added it while the Run is still running; once the Run reaches a terminal outcome its evidence is fixed
- A Run that has finished or been aborted keeps every attachment it recorded; reading, comparing, or reporting on a Run never changes its evidence
- An upload still in flight when the Run reaches a terminal outcome does not land afterwards
- `aborted` remains a Run-grain outcome only; it is never a step outcome, and it never changes the evidence a step already holds
- Attaching evidence never changes a step's outcome, and marking a step never discards evidence already attached to it

---
_Synced from Jira by sync-jira-issues_
