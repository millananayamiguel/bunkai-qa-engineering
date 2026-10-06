# BK-742 — Business Rules

> Jira field: `customfield_10152` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-742)

- ***An unbounded answer is a friendly failure; a silent cap is a harmful one.*** Returning everything is slow and wasteful, but it is honest — the caller holds the complete set. Returning a truncated set that looks complete is worse than the problem being fixed, because the caller acts on a wrong answer and never learns it was wrong. Every rule below follows from this one.
- ***A bounded answer must always carry the means to reach the rest.*** A page that omits Tests without handing back a cursor is forbidden. "You have them all" and "you have some of them" must be distinguishable from the answer alone, with no second call required to find out.
- ***Absence of a cursor means exhausted, and nothing else.*** It never means "an error occurred", "the ceiling stopped me", or "ask again differently". A caller that stops when the cursor is empty must be correct in stopping.
- ***Out of range is refused, not accommodated.*** A page size above the ceiling or below one is a validation failure. Quietly serving the ceiling instead would hand the caller a truncated answer under a size they did not choose — a silent cap by another name. This is the rule the product already applies on its shipped paged reads, and it is applied here for the same reason.
- ***A cursor the product did not issue is an error, not a fresh start.*** Serving the first page for a malformed cursor re-delivers rows the caller already has and hides a client bug. This mirrors the rule the shipped paged reads already follow.
- ***The cursor is opaque and server-owned.*** A caller hands it back unchanged and is given no way to construct one. Keeping its contents an implementation detail is what allows the paging mechanism to change later without breaking a single consumer.
- ***Paging must be exactly-once over a stable order.*** Every matching Test is delivered on exactly one page of a forward walk — never twice, never skipped — and a Test created mid-walk must not displace one the caller has not reached. This is why the position is anchored to the row itself rather than to a count of rows already returned.
- ***Ordering must be total, not merely mostly-unique.*** Two Tests that tie on the ordering value still need a deterministic order between them, or the boundary between two pages becomes ambiguous and a Test falls through it.
- ***Paging is not an authorisation channel.*** A cursor grants nothing. Every page re-applies the same Workspace membership rule the first page applied, so a cursor cannot be replayed, shared, or altered into a view of a Workspace the holder does not belong to.
- ***A tag is still required.*** Bounding an answer is not permission to widen the question. This story must not become the moment the lookup quietly gains the ability to return every Test in the Workspace.
- ***An empty match stays an empty answer.*** A tag no Test carries returns no Tests and no cursor. It is not a not-found error and never was.
- ***Server and consumer land together.*** Bounding the answer changes what every existing caller receives. The one in-product consumer is corrected in the same change; shipping the bound without it would silently narrow a filter that users read as complete — precisely the harm this story exists to prevent.
- ***The published contract is part of the change, not follow-up work.*** A bounded answer that the contract still describes as complete is indistinguishable from a bug to the consumer who hits it.

---
_Synced from Jira by sync-jira-issues_
