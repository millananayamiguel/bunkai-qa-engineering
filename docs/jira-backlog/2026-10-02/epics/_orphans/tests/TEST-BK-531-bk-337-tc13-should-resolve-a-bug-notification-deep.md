# TEST: BK-337: TC13: should resolve a bug notification deep link to the same detail record for both record shapes

**Jira Key:** [BK-531](https://jira.upexgalaxy.com/browse/BK-531)
**Status:** Draft
**Components:** Bunkai Bugs

---

## Test Description

> ***INFO:**** ****DEFERRED by ****`/test-documentation`**** Stage 4 on 2026-09-01.**** ROI ****0.9***, below the 1.5 threshold and with no prior bug in the area to raise it. Not promoted to the regression repository. Left in Draft rather than deprecated, because the scenario is valid and becomes worth promoting the moment its cost drops.

## ROI

| Factor | Score | Reading |
| --- | --- | --- |
| Frequency | 2 | notification routing changes rarely |
| Impact | 3 | a dead deep link strands the reader, but the list route still works |
| Stability | 3 | the notification surface is BK-212's and still moving |
| Effort (divisor) | 4 | no path to produce a real notification in a test |
| Dependencies (divisor) | 5 | notifications are created at the API layer, not by a database trigger |

`ROI = (2 x 3 x 3) / (4 x 5) = 0.9`

## Why it was not promoted

It was never verified against a real notification. Sprint execution confirmed it by reading `entity-routes.ts` and navigating the resolved URL directly, which validates the route resolver but not the notification that is supposed to produce it. Automating what was actually done would assert the URL shape, which BK-529 already covers from the list.

## What would change the verdict

A seeding path for notifications. Once a test can create a real bug notification and follow it, effort and dependencies both drop and this scenario clears the gate comfortably. Revisit when BK-212's surface stabilizes.

---

## Related Issues

- is executed by: [BK-518](https://jira.upexgalaxy.com/browse/BK-518) - ATR: BK-337: Story Testing
- is designed by: [BK-516](https://jira.upexgalaxy.com/browse/BK-516) - ATP: BK-337: TMS-Defect Detail | Open a defect and read its full record

---

## Metadata

- **Created:** 2026-08-19
- **Updated:** 2026-09-02
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** deferred

---

_Synced from Jira by sync-jira-issues_
