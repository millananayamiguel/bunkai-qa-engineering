# BK-742 — Workflow

> Jira field: `customfield_10082` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-742)

***The consumer walking a large tag match***

1. Karim asks Bunkai for the Tests carrying the reserved suite tag `smoke`, naming no page size.
2. Bunkai answers with the first page of matching Tests and a cursor.
3. Karim reads the page, then asks again for the same tag, handing the cursor back unchanged.
4. Bunkai answers with the next page, continuing exactly where the previous page stopped — no Test repeated, none skipped.
5. Karim repeats until a page comes back with no cursor. That empty cursor is how Karim knows the match is exhausted, and it is the only signal needed.

***The consumer who does not page at all***

1. A consumer integrated before this change asks for the Tests carrying `smoke` and reads only the Tests in the answer.
2. Bunkai answers with a bounded page, and includes a cursor because more Tests match.
3. The consumer receives a truthful prefix of the match rather than the whole of it. The cursor sitting in the same answer is the evidence that the set was not exhausted, so the shortfall is discoverable rather than invisible.
4. The published contract describes exactly this, so the consumer can find out what changed without having to infer it from a wrong result.

***The consumer who asks for too much***

1. A consumer asks for a page far larger than the ceiling, hoping to sidestep paging.
2. Bunkai refuses the request and names the page size as the reason.
3. The consumer is not handed a smaller page dressed up as the size they asked for, so they cannot mistake a ceiling for a complete answer.

***Elena filtering the explorer by tag***

1. Elena types `smoke` into the Project toolbar's Test tag filter.
2. The filter asks Bunkai for the Tests carrying that tag and follows the cursors until the match is exhausted.
3. The explorer's Tests group is scoped to every Test carrying `smoke`, exactly as it was before this change.
4. Elena sees no paging control and no behaviour change. The correctness she already relied on is what the extra work buys.

***The consumer with a stale cursor***

1. A consumer presents a cursor that Bunkai did not issue, or one that has been altered in transit.
2. Bunkai refuses it as a bad request naming the cursor.
3. The consumer is not handed the first page again, so a cursor bug surfaces as an error at the point it happens instead of as a silent re-read of Tests already processed.

---
_Synced from Jira by sync-jira-issues_
