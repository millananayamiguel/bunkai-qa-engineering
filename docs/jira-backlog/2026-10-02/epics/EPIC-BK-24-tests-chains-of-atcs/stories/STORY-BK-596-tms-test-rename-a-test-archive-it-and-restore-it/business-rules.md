# BK-596 — Business Rules

> Jira field: `customfield_10152` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-596)

- ***Archive is a use-visibility operation, not a record operation.*** It controls whether a Test is offered going forward. It never rewrites, hides or invalidates anything the Test has already produced.
- ***The archive filter must not be applied uniformly.*** Surfaces that offer a Test for use — search, the command palette, tag filtering, the ATC usage report, starting a Run — hide an archived Test. Surfaces that report what already happened — a recorded Run and its steps and results, the Test's Run history, the Traceability chain, every report and metric over a past period, a Defect's anchor — must keep resolving an archived Test in full. A blanket "hide everything archived" rule silently blanks Run evidence the first time anyone archives a Test that has been run, and is a defect, not a simplification.
- ***Having been run never blocks archiving.*** It triggers a warning that states how many Runs exist and that they are kept, and it requires an explicit confirmation. There is no "used, therefore locked" rule anywhere in this product, and this Story does not introduce one.
- ***Being archived does block changing.**** Rename, chain reorder, chain membership and tags are all frozen until restore. These are two different questions: **has been used** constrains nothing, **archived* freezes everything until restore.
- ***A new Run cannot start from an archived Test.*** Starting a Run is a use surface, not a history surface. This is the boundary that makes the previous two rules coherent: past Runs are untouchable, future ones are not offered.
- ***No number that describes the past may move because of an archive.*** Counts, pass rates, coverage figures and period reports read exactly the same before and after. A figure that changes retroactively when somebody tidies the Test set is a data-integrity defect, not a filter.
- ***Archiving a Test that a Test Plan holds is allowed after a warning, and never edits the plan.*** The Test stays in the plan, rendered as archived. This mirrors the rule that archiving an ATC never edits the Tests that chain it. Membership does not exist yet, so nothing here builds it — the rule is recorded now so the membership story inherits it instead of inventing a second answer. Whether an archived member counts toward a plan's own progress figure belongs to that story, under the "no number that describes the past may move" rule above.
- ***An Acceptance Criterion whose only Test is archived is not "uncovered".*** Uncovered names an authoring gap — nothing bound at all. A bound-but-archived Test is a different state and must render as archived evidence, not as an absence.
- ***Rename is bound by the rules that already govern a Test's name.*** The same limits the product enforces when a Test is created apply at rename; a rename never invents a second, looser standard.
- ***Archive and restore are reversible and idempotent.*** Repeating either is reported as success and changes nothing further. Neither ever destroys a Test or a Run.
- ***Rename, archive and restore require the access that already permits changing the Test.*** A member who cannot change it is offered none of the three.
- ***An archived Test stays fully readable*** to anyone who can read its Project. Archiving hides it from use surfaces; it is not a permission change.
- ***Every rename, archive and restore is auditable*** — one workspace Activity Stream entry each, naming the Test and the actor, with the rename carrying the name before and after.
- ***This Story reuses the ATC archive vocabulary rather than authoring a second one.*** The archived treatment, the restore action, the reversible-confirmation copy and the in-use warning are the same words, in the same shapes, as [https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571](https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571) specifies for ATCs. Only the host surface differs, because Tests have different surfaces.

---
_Synced from Jira by sync-jira-issues_
