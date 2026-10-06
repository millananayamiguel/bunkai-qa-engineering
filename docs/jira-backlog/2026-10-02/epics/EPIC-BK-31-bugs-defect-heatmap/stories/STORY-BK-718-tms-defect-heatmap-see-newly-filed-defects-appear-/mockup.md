# BK-718 — Mockup

> Jira field: `customfield_10118` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-718)

***Screen:*** Bug Reports — Heatmap view (`/projects/[projectSlug]/bugs`)

***Mockup:*** `.context/designs/bunkai-test-management-tool/bk-31-bug-reports/bug-reports-index.html`
***Design plan:*** `.context/design/master-design-plan.md` §4.6

***Verdict:**** ****extension needed — build to the spec below, not to the mockup pixel.***

The mockup covers the freshness cue and nothing else about liveness. At `bug-reports-index.html:690` the toolbar renders:

> `as of 2026-07-30 14:32 UTC · refresh in 4m`

Two things are drawn there. The ***"as of" stamp is shipped**** (`components/bugs/BugsHeatmapView.tsx:64`, `:170`) and stays. The `refresh in 4m` ****countdown implies a timed poll***; this story ships a push instead, and that departure is recorded as an `AI Tech Lead` decision on this ticket.

***No mockup anywhere draws how a newly arrived defect announces itself**** — there is no toast, no flash, no "new" chip, no unread dot, no count-up animation, in this screen or any sibling. That absence is the specification, not a gap to fill: figures change in place and nothing announces them. ****Do not infer an announce affordance while building this.*** If one is wanted later it gets its own story and its own design pass.

---
_Synced from Jira by sync-jira-issues_
