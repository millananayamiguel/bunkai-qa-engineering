# BK-594 — Business Rules

> Jira field: `customfield_10152` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-594)

- A defect carries at most ten evidence items in total; uploaded images and pasted links draw on the same budget and are never counted as two separate allowances
- An attempt to add an eleventh evidence item is refused; the defect keeps the ten it already has, and none of them is dropped, replaced, or reordered by the refusal
- The existing limit of ten is the rule this story obeys — it is neither widened nor bypassed, and the refusal holds even when the attempt arrives from outside the filing screen
- Uploaded evidence is accepted only when the file is an image; acceptance is decided by the file's content, not by the name or extension it arrived with
- An image above the accepted size limit is refused, and nothing is stored
- An image attached to a defect is readable only by members of the Workspace that owns the defect; a member of any other Workspace cannot read it under any circumstance, including when holding a direct reference to the stored object
- No stored image is readable without an authorization check — there is no anonymous read path, and a reference alone is never sufficient
- Evidence is fixed at the moment the defect is filed; a filed defect's evidence cannot be added to, replaced, or removed
- A filing attempt whose upload fails does not produce a defect carrying a broken evidence item — either the defect is filed with that evidence intact, or the filing reports the failure and everything the tester typed is still there to retry with
- Evidence is optional; a defect filed with none is valid and reads as holding none, not as an error
- A defect's evidence is its own, independent of the evidence on the step it was filed from; anything carried across at filing time is a copy, never a live reference
- The pasted evidence link keeps its current behaviour unchanged, including the existing rule that only http and https links render as openable

---
_Synced from Jira by sync-jira-issues_
