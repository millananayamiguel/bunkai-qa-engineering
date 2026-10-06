# BK-718 — Business Rules

> Jira field: `customfield_10152` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-718)

## Visibility and tenancy

| ***#**** | ****Rule**** | ****Why it holds*** |
| --- | --- | --- |
| BR-1 | A reader may only be told about a defect they are already entitled to read. Membership of the workspace that owns the defect is the sole gate, and it is the same gate that governs reading a defect normally. | The defect record's read policy is `bugs*select*workspace*member` (`supabase/migrations/0046*bugs.sql:133-136`), which gates on active workspace membership. The live-update mechanism enforces the reader's own read policy on the events it delivers — the reasoning is already written out in `supabase/migrations/0043*run*realtime*replication.sql:24-33` and applied a second time in `0053*notifications.sql:149-154`. This story is the third application of the same argument, not a new one. |
| BR-2 | Being reachable by the live-update mechanism is a database-wide property, not a per-project or per-workspace one. Turning it on for defect records turns it on for every reader at once; row-level policy is the only thing that scopes who is told what. | Recorded and accepted on this ticket as an `AI Tech Lead` decision, following the two precedents in BR-1. |

## What may appear

| ***#**** | ****Rule**** | ****Why it holds*** |
| --- | --- | --- |
| BR-3 | Only defects attributed to an ***active*** module may move a figure on this screen. A defect attributed to an archived module changes nothing. | Every defect-listing surface in the product already inner-joins on the module being active: `0046*bugs.sql:346`, `0051*bugs*list.sql:191`, `0052*defect*heatmap*report.sql:141`. The live path must agree with the loaded path, or the heatmap and the defect list disagree on the same project and the reader cannot tell which is lying. |
| BR-4 | A cell's heat tag is derived from its count and must be recomputed whenever the count moves. It never lags the number it is derived from. | The heat buckets are a function of the count in the window — Clean (0), Low (≤2), Elevated (≤4), Hotspot (>4) — per `.context/business/domain-glossary.md` §3, **Defect Heatmap**. A tag that disagrees with the number beside it is a defect. |
| BR-5 | The week-over-week trend is part of the update, not an extra. A count that moves while its trend stays frozen is wrong. | The trend and the count are two readings of the same event; [https://jira.upexgalaxy.com/browse/BK-42#icft=BK-42](https://jira.upexgalaxy.com/browse/BK-42#icft=BK-42) ships them as one cell and this story keeps them consistent. |

## Timing and degradation

| ***#**** | ****Rule**** | ****Why it holds*** |
| --- | --- | --- |
| BR-6 | Five seconds from the defect being recorded to it being on screen is the acceptance bound. | `.context/PRD/mvp-scope.md:122`, and BK-42's own AC-10 ("within 5 seconds"). |
| BR-7 | Losing the live connection is not an error state. The last-loaded figures stay, the "as of" stamp keeps saying what it said, and the manual refresh stays available. The reader is never shown an error for a background connection they never asked about. | The stamp and the manual control are BK-42's shipped fallback (`components/bugs/BugsHeatmapView.tsx:170`, `:183`). Their job is exactly this. |
| BR-8 | Events that occur while disconnected are lost, so recovery is a full re-read of current figures, never a partial catch-up. | The mechanism has no replay buffer; ADR-0010's "Negative / trade-offs" section requires this explicitly, and `lib/runs/realtime-run-channel.ts:161-181` already encodes the reconnect predicate the two existing consumers share. |
| BR-9 | A burst of defects filed in quick succession settles into one refresh, not one per defect. | The trailing-edge coalescer in `lib/runs/realtime-run-channel.ts:127-151` exists for this and is already shared by the second consumer. |

---
_Synced from Jira by sync-jira-issues_
