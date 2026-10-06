# TMS-Defect Heatmap | See newly filed defects appear without refreshing

**Jira Key:** [BK-718](https://jira.upexgalaxy.com/browse/BK-718)
**Epic:** [BK-31](https://jira.upexgalaxy.com/browse/BK-31) (Bugs & Defect Heatmap)
**Type:** Story
**Status:** Backlog
**Priority:** Medium
**Story Points:** 1

---

## Overview

***Source spec:*** FR-040

## User story

******As a**** **QA Lead*
**********I want to****** ****see the defect heatmap take on newly filed defects by itself, while I am looking at it***
**So that**** I can watch hotspots emerge during a regression pass instead of deciding from a board that quietly went stale

## Why this is a story and not new scope

The requirement already exists and is already approved. [https://jira.upexgalaxy.com/browse/BK-42#icft=BK-42](https://jira.upexgalaxy.com/browse/BK-42#icft=BK-42) ("TMS-Defect Heatmap | View count and week-over-week trend per module", QA Approved) carries the Definition-of-Done item **"A freshly filed defect appears in the heatmap promptly"**, its canonical AC-10 reads **"When Mateo refreshes** *****or**** **the heatmap polling reads updated stats within 5 seconds"**, and its own shift-left package names the split trigger: **"Split API/stats foundation from UI only if ... scope expands to custom ranges/realtime."* [https://jira.upexgalaxy.com/browse/BK-42#icft=BK-42](https://jira.upexgalaxy.com/browse/BK-42#icft=BK-42) shipped the left half of that "or" — the reader refreshes. It shipped no timer and no subscription, so today the only way the number changes is a human action. Its test candidate [https://jira.upexgalaxy.com/browse/BK-366#icft=BK-366](https://jira.upexgalaxy.com/browse/BK-366#icft=BK-366) ("BK-42: TC16: New defect updates heatmap count") exists and describes exactly this behaviour.

[https://jira.upexgalaxy.com/browse/BK-42#icft=BK-42](https://jira.upexgalaxy.com/browse/BK-42#icft=BK-42) and [https://jira.upexgalaxy.com/browse/BK-366#icft=BK-366](https://jira.upexgalaxy.com/browse/BK-366#icft=BK-366) are approved artifacts and are ***not*** touched by this story. This story is the deferred half, taken on its own terms and estimated on its own terms.

The same requirement is stated three more times outside [https://jira.upexgalaxy.com/browse/BK-42#icft=BK-42](https://jira.upexgalaxy.com/browse/BK-42#icft=BK-42):

| ***Source**** | ****What it says*** |
| --- | --- |
| `.context/PRD/mvp-scope.md:122` | Shippability checkbox, still unchecked: **"The defect heatmap renders correctly with seeded data and updates within 5s of a new Bug."** |
| `.context/SRS/functional-specs.md:301-303` | FR-040 "Realtime row subscriptions" — **"Applies to:** `runs`**,** `run*atcs`**,** `run*steps`**,** `bugs`**"**. Three of the four are live; the fourth is not. |
| `.context/business/business-api-map.md:762` | The §7.8 Realtime table row for defect records: subscribers **"Defect heatmap, activity timeline"**, use **"New bug rolls up immediately into module heatmap"**. |

## Where it lands today

The heatmap view has a single data effect keyed on the window and the project, and the file's own comment says that narrow dependency list is deliberate (`components/bugs/BugsHeatmapView.tsx:116-124`, at `origin/staging@8d0bc66`). There is no timer and no channel anywhere in the component. The freshness stamp (`:64`, `:170`) and the manual retry control (`:183`) are the only recovery paths that exist, and this story keeps both.

## Precedent to follow — do not invent a third shape

This is the ***third*** consumer of a pattern the codebase already owns twice, and it should look like the first two rather than like something new:

- `lib/runs/realtime-run-channel.ts` — [https://jira.upexgalaxy.com/browse/BK-35#icft=BK-35](https://jira.upexgalaxy.com/browse/BK-35#icft=BK-35), the pattern's origin. Owns the channel/binding shape, a trailing-edge refetch coalescer, and the reconnect-reconciliation predicate, all as pure data-in/data-out with zero client import.
- `lib/notifications/realtime-notifications-channel.ts` — [https://jira.upexgalaxy.com/browse/BK-209#icft=BK-209](https://jira.upexgalaxy.com/browse/BK-209#icft=BK-209), the second consumer. Owns ***only*** its own binding shape and imports the coalescer and the reconnect predicate from the first file rather than re-deriving them, with the reason written into its header comment.

Both have co-located unit tests. The third consumer follows the second one's example: a new binding-shape module, everything generic reused.

Transport is settled by ***ADR-0010*** (Accepted, Implemented) and is not reopened here.

## Two scoping calls already made

Both are answered on this ticket as `## AI Tech Lead — Decision:` comments, with alternatives scored. They are settled inputs, not open questions for the implementer:

1. Whether database-global publication membership, scoped by row-level security alone, is acceptable for defect records.
2. Whether this ships as a push or as the timed poll the mockup's countdown implies.

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Workflow](./workflow.md)
- [Mockup](./mockup.md)

---

## Metadata

- **Created:** 2026-08-30
- **Updated:** 2026-08-31
- **Reporter:** Ely
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_
