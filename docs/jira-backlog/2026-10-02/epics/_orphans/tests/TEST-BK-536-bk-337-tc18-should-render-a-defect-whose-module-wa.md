# TEST: BK-337: TC18: should render a defect whose module was archived after filing

**Jira Key:** [BK-536](https://jira.upexgalaxy.com/browse/BK-536)
**Status:** Draft
**Components:** Bunkai Bugs

---

## Test Description

> ***INFO:**** ****DEFERRED by ****`/test-documentation`**** Stage 4 on 2026-09-01.**** ROI ****2.0***, inside the 1.5-3.0 case-by-case band with no prior bug and no critical-path claim, so the rubric defers it. Not promoted to the regression repository. Left in Draft, not deprecated.

## ROI

| Factor | Score | Reading |
| --- | --- | --- |
| Frequency | 3 | every release |
| Impact | 2 | a defect in an archived module becomes unreachable; rare, and recoverable by unarchiving |
| Stability | 4 | the rule is written into the acceptance criteria |
| Effort (divisor) | 3 | needs the module archived after the defect was filed, in that order |
| Dependencies (divisor) | 4 | a dedicated fixture whose module state differs from every other fixture |

`ROI = (3 x 2 x 4) / (3 x 4) = 2.0`

## Recorded dissent

The rubric defers this one, and the rubric is being followed. It is worth writing down why a reviewer might disagree.

This is the single case in the Story where two query paths must ***deliberately diverge***: `bunkai*list*bugs` applies the archived-module exclusion and the single-defect read must NOT. That divergence is invisible in the code and looks like an inconsistency to anyone tidying up. If somebody later unifies the two composers, the record silently becomes unreachable and no other Test in this suite notices.

## What would change the verdict

Promote this immediately if the bug composers are refactored, unified, or moved behind a shared query builder. At that point the divergence stops being documented behaviour and becomes an accident waiting to be optimized away.

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
