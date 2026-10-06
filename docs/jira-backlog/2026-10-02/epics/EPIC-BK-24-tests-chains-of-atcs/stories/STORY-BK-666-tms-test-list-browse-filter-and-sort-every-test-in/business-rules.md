# BK-666 — Business Rules

> Jira field: `customfield_10152` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-666)

- ***One scoping rule, not two.*** The list shows exactly the Test set the Project already exposes through its explorer. It must not introduce a second, independent rule for deciding which Tests belong to a Project — so that when that attribution is corrected, this surface corrects with it and does not have to be found and fixed separately.
- ***A defect must not be widened by a new surface.**** A Test that the Project should not be exposing today must not become **more* discoverable because this list exists. The list inherits the current scope; it does not broaden it.
- ***Workspace isolation is absolute.*** A Test belonging to a Workspace the caller is not an active member of never appears in the list, in its count, or in any filtered result — and its absence is never signalled as an error or a "not found", only as absence.
- ***Read is open to every active role; write is offered nowhere here.*** Every active member, viewers included, can read the list and open a Test from it. No create, edit, archive or delete affordance for a Test is offered on this screen for any role.
- ***Reserved suite tags are case-insensitive on lookup; custom tags keep their casing on display.*** Filtering by "Smoke" matches a Test carrying "smoke". A custom tag renders as the author typed it.
- ***The two absences are distinct.*** "This Project has no Tests yet" and "no Test carries this tag" are different facts about different situations, and are never collapsed into one message. Neither is an error.
- ***A failed filter never masquerades as a matched one.*** If the tag lookup fails, the list says so; it never falls back to showing the unfiltered set as though the filter had matched everything.
- ***Chain length is stated, never inferred as a proxy for health.*** The number shown is how many positions the Test's chain holds. A chain of zero is a legitimate value that is displayed as zero, not hidden and not flagged.
- ***The count follows the filter.*** The number of Tests the list reports is the number it is currently showing, not the Project's unfiltered total.

---
_Synced from Jira by sync-jira-issues_
