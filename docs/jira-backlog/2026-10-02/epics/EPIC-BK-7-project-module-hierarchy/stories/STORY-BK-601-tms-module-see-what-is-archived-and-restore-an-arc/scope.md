# BK-601 — Scope

> Jira field: `customfield_10129` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-601)

- An explicit opt-in on the Module, User Story and Acceptance Criterion listings that includes archived rows alongside active ones, off by default on every listing
- An archived marker on every archived row wherever the opt-in surfaces it, so an archived row is never mixed in as though it were active
- Show, for each archived row, when it was archived and who archived it
- Restore a single archived Module from the surface that offers the archive today, bringing back ***exactly*** the rows that this Module's own archive took down: its descendant Modules, their User Stories, those Stories' Acceptance Criteria, and the ATCs anchored to any of them
- Leave archived any row that was already archived on its own ***before*** the Module was archived — a restore undoes one archive, not every archive that ever touched the subtree
- Whatever storage change is needed to tell those two sets apart with certainty rather than by inference
- Refuse to restore a Module whose own parent Module is still archived, naming the archived ancestor, so the tree never holds an active Module hanging under an archived one
- Refuse a restore that the Project can no longer hold — one that would exceed the maximum nesting depth, or collide with an active Module of the same name under the same parent — and say which rule blocked it
- Make the restore all-or-nothing: the whole set comes back or nothing does, and a failure leaves everything archived
- Restrict restore to members who can already archive the Module; reading the archive needs only read access
- One workspace Activity Stream entry per restore, separate from the archive entry, recording how many rows of each kind came back
- Make restore idempotent — restoring an active Module is reported as success, changes nothing, and writes no audit entry
- Loading, empty and named-error-with-retry states for the opt-in listing and for the restore action

---
_Synced from Jira by sync-jira-issues_
