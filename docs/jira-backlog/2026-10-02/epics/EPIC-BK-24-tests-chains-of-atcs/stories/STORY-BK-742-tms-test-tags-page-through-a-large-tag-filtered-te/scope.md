# BK-742 — Scope

> Jira field: `customfield_10129` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-742)

- A bounded answer for the Test tag lookup: a caller receives at most one page of Tests instead of the entire matching set
- An optional page-size control, with a default applied when the caller names none and a fixed ceiling above which the request is refused
- An opaque cursor returned alongside every non-final page, and absent from the final one, so a caller can always tell whether more Tests remain
- Forward paging that reaches every matching Test exactly once — no Test seen twice, none skipped, including while Tests are being created during the walk
- A stable, total ordering across pages, so that "the next page" is a meaningful idea rather than an approximation
- Refusal, never silent shrinking, when a caller asks for a page larger than the ceiling or smaller than one
- Refusal, never a silent restart at the first page, when a caller presents a cursor the lookup did not issue
- The existing Workspace isolation rule carried through paging unchanged: no page, and no cursor, ever reaches a Test outside the caller's Workspace membership
- The one in-product surface that reads this lookup — the Project toolbar's Test tag filter — updated in the same change to consume the full matching set through the cursor, so it keeps scoping the explorer to every matching Test
- The published API contract updated to describe the default page size, the ceiling, the cursor round trip, and both refusal cases
- The paging vocabulary this contract depends on added to the domain glossary, so the story's own criteria are checkable against a definition
- The recorded API contract for this lookup corrected where it currently contradicts what ships: the tag recorded as required, and the parameter the lookup does not accept removed

---
_Synced from Jira by sync-jira-issues_
