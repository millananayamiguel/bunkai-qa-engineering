# BK-595 — Business Rules

> Jira field: `customfield_10152` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-595)

- ***The read is a routing addition, not a new capability.*** The composed ATC payload already exists and is already produced by the same backing read the edit path calls on its no-op branch. Re-deriving the payload in the route, rather than routing through that existing read, is a defect: it would create a second definition of what an ATC is and a second place for the authorization gate to drift.
- ***Authorization is enforced by the backing read, not re-implemented in the route.*** The existing read already resolves the caller's reach server-side. The route supplies the caller and the id; it never widens the scope, and it never decides visibility for itself.
- ***Absence and inaccessibility must be indistinguishable.*** An ATC in a workspace the caller cannot reach answers exactly as an id that has never existed. Any difference in status, message, or timing is an enumeration channel that lets a stranger confirm which ids are real.
- ***The default read is lean; detail is opt-in.*** Expansions are requested, never volunteered. A caller that asks for nothing gets the header only, which is what keeps the published single-entity read target reachable.
- ***An unrecognised expansion is refused, not ignored.*** Silently dropping an unknown value hands the caller a payload that is missing data it believes it asked for, which is worse than a refusal.
- ***An expansion with no data returns empty, not an error.*** An ATC that no Test chains is a normal ATC, not a failure.
- ***An archived ATC is not offered by this read.*** Archive is a circulation state; a by-id read is a circulation surface, and it follows the product's existing by-id reads rather than inventing a second answer.
- ***A read never mutates.*** No version bump, no timestamp change, no Activity Stream entry. Any of those appearing on a read is a defect.
- ***The route's capability posture is inherited, not invented.*** It matches what the product's other single-entity reads declare, so the enforcement decision made across [https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497](https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497) / [https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) / [https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499](https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499) covers it without a second ruling.

---
_Synced from Jira by sync-jira-issues_
