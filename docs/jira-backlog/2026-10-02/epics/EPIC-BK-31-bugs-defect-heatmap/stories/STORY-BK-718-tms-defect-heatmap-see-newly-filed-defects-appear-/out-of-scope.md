# BK-718 — Out Of Scope

> Jira field: `customfield_10081` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-718)

- ***Any visual announcement of an arriving defect.*** No toast, no flash, no "new" badge, no count-up animation, no unread marker. No mockup draws such an affordance, and none is to be invented while building this. Figures change in place. If the team later wants an announcement, that is its own story with its own design pass.
- ***The mockup's auto-refresh countdown.*** The Bug Reports mockup renders `as of ... · refresh in 4m` (`bug-reports-index.html:690`). That countdown is not built; a ratified departure is recorded on this ticket. The "as of" stamp itself stays.
- ***Removing or altering the manual refresh control or the "as of" stamp.*** Both are the fallback path and both stay.
- ***The defect List view.*** Only the Heatmap view is wired here. Live updating the list is a separate story.
- ***Any other screen that shows defect information*** — the project dashboard, the activity timeline, the workspace-wide defect index.
- ***The window selector's option set.*** No custom ranges, no new windows.
- ***How defects are filed.*** Filing, triage, editing and assignment are untouched.
- ***Reworking how the heatmap figures are computed.*** This story changes when the reader learns about a change, not what the figures mean.
- ***Any change to BK-42 or BK-366.*** Both are approved and are cited here, not modified.
- ***Revisiting the transport choice.*** ADR-0010 is Accepted and Implemented; it is not reopened.

---
_Synced from Jira by sync-jira-issues_
