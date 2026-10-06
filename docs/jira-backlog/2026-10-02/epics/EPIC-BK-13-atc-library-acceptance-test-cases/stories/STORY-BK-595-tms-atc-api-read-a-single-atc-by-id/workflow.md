# BK-595 — Workflow

> Jira field: `customfield_10082` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-595)

Karim is an autonomous test agent holding a Personal Access Token scoped to one workspace. It has just been handed the id of an Acceptance Test Case by a Test it is preparing to execute, and it needs the case itself: the ordered steps, what each step asserts, and the Acceptance Criteria the case is anchored to.

Today that is impossible. The agent can create an ATC and it can edit one, but there is no way to read one back. Its only recourse is to fetch a whole listing and filter it locally for an id it already holds, which is slower, noisier, and wrong in principle.

With this story, the agent asks for the ATC by its id and gets it. Asking for nothing extra returns the header alone, which is all a routing decision needs. Asking for steps and assertions together returns the whole case in one round-trip, each in the order it was recorded, which is what an executor needs before it starts. Asking for the anchored Acceptance Criteria tells the agent what the case is evidence for. Asking for the Tests that chain it tells the agent what an edit would ripple into.

The refusals are as important as the reads. A token minted for writes alone is turned away. An id belonging to a workspace the token cannot reach answers exactly like an id that was never real, so probing ids reveals nothing. A malformed id is rejected before anything is looked up. An expansion the API does not recognise is refused outright rather than quietly dropped, so the agent never proceeds on a payload it wrongly believes is complete.

Nothing changes for the humans using the product: no screen, no navigation, no new affordance. What changes is that the ATC entity finally reads the way every sibling entity already reads, the published contract stops describing an operation the product does not have, and the one endpoint the performance specification names by path becomes something that can actually be measured.

---
_Synced from Jira by sync-jira-issues_
