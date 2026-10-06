# BK-595 — Out Of Scope

> Jira field: `customfield_10081` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-595)

- ***The ATC listing endpoint.**** Searching or listing ATCs by query, Module or layer is `BK-011` and its own story. This story adds the by-id read only, and does ****not*** unblock the `bunkai atc list` CLI command, which calls the listing endpoint.
- ***Deleting or archiving an ATC over the API.*** The archive write half is BK-571; this story adds no writer and changes no archived state.
- Any change to the existing edit operation on this same id — its optimistic locking, its propagation to chaining Tests, its version bump and its event stay exactly as they are.
- Any change to the composed payload the backing read already produces. This story routes an existing read; it does not redesign the ATC shape, add fields, or rename any.
- Any new expansion beyond the four already published. Expansions the contract does not name are out.
- Any database migration, schema change, index or RPC change.
- Caching, conditional requests, or an ETag on the read.
- Bulk or batch reads of several ATCs by id in one call.
- Deciding or changing the product-wide capability posture. This route adopts the posture its sibling reads already carry; the posture itself is settled by [https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497](https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497) / [https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) / [https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499](https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499).
- Any UI. No screen changes, no new surface, no navigation change.
- Meeting the published performance number. This story makes the target measurable; tuning to hit it, if a measurement misses, is separate work.

---
_Synced from Jira by sync-jira-issues_
