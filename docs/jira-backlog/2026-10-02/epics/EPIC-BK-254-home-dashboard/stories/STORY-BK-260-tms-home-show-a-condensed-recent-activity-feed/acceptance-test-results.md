# ACCEPTANCE TEST RESULTS (ATR): ATR: BK-260: Story Testing

**Jira Key:** [BK-634](https://jira.upexgalaxy.com/browse/BK-634)
**Status:** Close
**Components:** None

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

Fallback note: Xray credentials unavailable this session — this is a plain Jira "Test Execution" issue (Jira-layer only). Register Run statuses in Xray once XRAY*CLIENT*ID/SECRET are set:

bun xray exec set-environment --execution [https://jira.upexgalaxy.com/browse/BK-634#icft=BK-634](https://jira.upexgalaxy.com/browse/BK-634#icft=BK-634) --environment staging
bun xray exec add-set [https://jira.upexgalaxy.com/browse/BK-634#icft=BK-634](https://jira.upexgalaxy.com/browse/BK-634#icft=BK-634) --set [https://jira.upexgalaxy.com/browse/BK-632#icft=BK-632](https://jira.upexgalaxy.com/browse/BK-632#icft=BK-632)
bun xray run status --id <runId> --status <PASSED|FAILED|TODO>   (per Test below)

1. 

****Test Environment: staging**** — [https://staging-upexbunkai.vercel.app](https://staging-upexbunkai.vercel.app/)
****Executed:**** 2026-08-27 (2nd pass same day, second test workspace added)
****Overall verdict: PASSED**** (no defects found; 2 boundary cases still code-verified only, see notes — low risk)

1. 

1. 

1. 

| Test  | Result  | Notes  |
| --- | --- | --- |
| --- | --- | --- |
| [https://jira.upexgalaxy.com/browse/BK-624#icft=BK-624](https://jira.upexgalaxy.com/browse/BK-624#icft=BK-624) (TC1)  | PASSED (partial live + code)  | Live: 6 real activity rows, actor/action/target/time/verdict-chip render correctly (e.g. "bunkai-staging-user@... finished a run — Passed — 26m ago"). Only `run` entity type occurred naturally in the window; `module`/`test`/`bug` glyph variants and the `just now` time bucket confirmed by code (`GLYPH*BY*ENTITY_TYPE`, `formatRelativeTime`), not re-observed live — no seedable fixture for those event types this session.  |
| [https://jira.upexgalaxy.com/browse/BK-625#icft=BK-625](https://jira.upexgalaxy.com/browse/BK-625#icft=BK-625) (TC2)  | PASSED (live)  | Header "View all" navigates Home -> /activity. Evidence: bk260-tc2-view-all-navigates-to-activity.png  |
| [https://jira.upexgalaxy.com/browse/BK-626#icft=BK-626](https://jira.upexgalaxy.com/browse/BK-626#icft=BK-626) (TC3)  | PASSED (live, 2nd pass)  | Logged in as [REDACTED_EMAIL] (workspace "Test Mania", empty). Clicked "Browse the full activity feed" inside the empty state -> navigated to /activity. Evidence: bk260-tc3-empty-state-view-all-navigates-to-activity.png  |
| [https://jira.upexgalaxy.com/browse/BK-627#icft=BK-627](https://jira.upexgalaxy.com/browse/BK-627#icft=BK-627) (TC4)  | PASSED (live, 2nd pass)  | Same session. Home showed exactly: "No tracked events in the last 24 hours" + "This feed tracks new modules, ATCs and tests, finished runs and defect triage. Creating one will show it here." + the browse-all link. Matches AC3 and the code's copy verbatim. Evidence: bk260-tc4-empty-state.png  |
| [https://jira.upexgalaxy.com/browse/BK-628#icft=BK-628](https://jira.upexgalaxy.com/browse/BK-628#icft=BK-628) (TC5)  | NOT EXECUTED LIVE (code-verified)  | Forcing a live Supabase read failure was judged out of scope/risk for a shared staging env. `RecentActivityError` is a distinct component/testid from the empty state, confirmed by code review.  |
| [https://jira.upexgalaxy.com/browse/BK-629#icft=BK-629](https://jira.upexgalaxy.com/browse/BK-629#icft=BK-629) (TC6)  | NOT EXECUTED LIVE (code-verified)  | Window-boundary requires controlling event timestamps; no DB writes made against shared staging data. `selectRecentActivity`'s floor comparison (`at >= floor`) reasoned correct in Stage 1 review.  |
| [https://jira.upexgalaxy.com/browse/BK-630#icft=BK-630](https://jira.upexgalaxy.com/browse/BK-630#icft=BK-630) (TC7)  | NOT EXECUTED LIVE (code-verified)  | Same constraint — current live data (6 rows) did not exceed `HOME*ACTIVITY*FEED_LIMIT`, so the cap could not be observed triggering. `.slice(0, params.limit)` after the window filter reasoned correct.  |
| [https://jira.upexgalaxy.com/browse/BK-631#icft=BK-631](https://jira.upexgalaxy.com/browse/BK-631#icft=BK-631) (TC8)  | PASSED (live, 2nd pass)  | Workspace "Sir Tests A Lot" (1st pass) has ongoing real activity (6 events in-window). Workspace "Test Mania" (2nd pass, different user, different workspace) showed the EMPTY state instead — zero leakage of the first workspace's events into the second. Direct live confirmation of RLS scoping (`activity*log*select*workspace*member`), not just a code read.  |

1. 

- Condensed feed appears on Home and reflects real workspace activity: CONFIRMED (live).
- No regression to Home navigation or other screens: CONFIRMED (live) — Open bugs/Coverage/Active runs/Recent projects all rendered normally alongside the new card, 0 console errors, sidebar nav unaffected.

1. 

---

## Related Issues

- is tested by: [BK-260](https://jira.upexgalaxy.com/browse/BK-260) - TMS-Home | Show a condensed recent activity feed
- executes: [BK-630](https://jira.upexgalaxy.com/browse/BK-630) - BK-260: TC7: should cap feed at configured row limit given more tracked events than the limit
- executes: [BK-626](https://jira.upexgalaxy.com/browse/BK-626) - BK-260: TC3: should navigate to /activity when link is selected from empty state
- executes: [BK-631](https://jira.upexgalaxy.com/browse/BK-631) - BK-260: TC8: should not show activity from a different workspace given RLS scoping
- executes: [BK-624](https://jira.upexgalaxy.com/browse/BK-624) - BK-260: TC1: should show actor, action, target, relative time, glyph and verdict for each event type given workspace has recent tracked activity
- executes: [BK-625](https://jira.upexgalaxy.com/browse/BK-625) - BK-260: TC2: should navigate to /activity when "View all" header link is selected
- executes: [BK-627](https://jira.upexgalaxy.com/browse/BK-627) - BK-260: TC4: should show empty state given workspace has no tracked activity in last 24h
- executes: [BK-628](https://jira.upexgalaxy.com/browse/BK-628) - BK-260: TC5: should show error state, not empty state, given activity read fails
- executes: [BK-629](https://jira.upexgalaxy.com/browse/BK-629) - BK-260: TC6: should exclude or include an event at the 24h window boundary

---

## Metadata

- **Created:** 2026-08-27
- **Updated:** 2026-08-27
- **Reporter:** Carlos C
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Execution [BK-634](https://jira.upexgalaxy.com/browse/BK-634) description · ATR · synced by sync-jira-issues_
