# ACCEPTANCE TEST PLAN (ATP): ATP: BK-260: TMS-Home | Show a condensed recent activity feed

**Jira Key:** [BK-633](https://jira.upexgalaxy.com/browse/BK-633)
**Status:** READY
**Components:** None

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

Fallback note: Xray credentials unavailable this session — this is a plain Jira "Test Plan" issue (Jira-layer only). Once XRAY*CLIENT*ID/SECRET are set, derive membership from the ATS instead of this static list:

bun xray plan add-set BK-<this-key> --set [https://jira.upexgalaxy.com/browse/BK-632#icft=BK-632](https://jira.upexgalaxy.com/browse/BK-632#icft=BK-632)

1. 

1. 

1. 

| Test  | Covers  | Technique  |
| --- | --- | --- |
| --- | --- | --- |
| [https://jira.upexgalaxy.com/browse/BK-624#icft=BK-624](https://jira.upexgalaxy.com/browse/BK-624#icft=BK-624) (TC1)  | Item rendering: actor, action, target, relative time, glyph, run-verdict chip  | EP + BVA (time buckets)  |
| [https://jira.upexgalaxy.com/browse/BK-625#icft=BK-625](https://jira.upexgalaxy.com/browse/BK-625#icft=BK-625) (TC2)  | "View all" header link navigates to /activity  | EP (AC2)  |
| [https://jira.upexgalaxy.com/browse/BK-626#icft=BK-626](https://jira.upexgalaxy.com/browse/BK-626#icft=BK-626) (TC3)  | "View all" link inside empty state navigates to /activity  | EP (AC2)  |
| [https://jira.upexgalaxy.com/browse/BK-627#icft=BK-627](https://jira.upexgalaxy.com/browse/BK-627#icft=BK-627) (TC4)  | Empty state when no tracked activity in 24h  | EP (AC3)  |
| [https://jira.upexgalaxy.com/browse/BK-628#icft=BK-628](https://jira.upexgalaxy.com/browse/BK-628#icft=BK-628) (TC5)  | Error state distinct from empty state on failed read  | Error-guessing  |
| [https://jira.upexgalaxy.com/browse/BK-629#icft=BK-629](https://jira.upexgalaxy.com/browse/BK-629#icft=BK-629) (TC6)  | 24h window boundary (item just inside vs just outside)  | BVA  |
| [https://jira.upexgalaxy.com/browse/BK-630#icft=BK-630](https://jira.upexgalaxy.com/browse/BK-630#icft=BK-630) (TC7)  | Row cap respected when more events exist than the limit  | BVA  |
| [https://jira.upexgalaxy.com/browse/BK-631#icft=BK-631](https://jira.upexgalaxy.com/browse/BK-631#icft=BK-631) (TC8)  | Cross-workspace activity never leaks (RLS)  | Decision table / security  |

1. 

1. 

1. 

---

## Related Issues

- is tested by: [BK-260](https://jira.upexgalaxy.com/browse/BK-260) - TMS-Home | Show a condensed recent activity feed

---

## Metadata

- **Created:** 2026-08-27
- **Updated:** 2026-08-27
- **Reporter:** Carlos C
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Plan [BK-633](https://jira.upexgalaxy.com/browse/BK-633) description · ATP · synced by sync-jira-issues_
