# TMS-Module | See what is archived and restore an archived module

**Jira Key:** [BK-601](https://jira.upexgalaxy.com/browse/BK-601)
**Epic:** [BK-7](https://jira.upexgalaxy.com/browse/BK-7) (Project & Module Hierarchy)
**Type:** Story
**Status:** Backlog
**Priority:** Medium
**Story Points:** -

---

## Overview

***Source spec:*** BK-039 — Soft-delete (`.context/SRS/functional-specs.md`, "Cross-cutting Functional Requirements"). This is an SRS functional-requirement id, not a Jira issue key.

## User story

***As a*** Senior QA Engineer
***I want to*** opt into seeing what has been archived in a Project, and put an archived Module back exactly as it was, together with everything the archive took down with it
***So that*** archiving a Module stops being a one-way door and I can retire part of the tree without gambling the User Stories, Acceptance Criteria and ATCs that hang off it

## Definition of done

- [ ] A Module, User Story or Acceptance Criterion listing can be asked, explicitly, to include archived rows — and still hides them by default
- [ ] Archived rows are visibly marked as archived wherever they appear, never mixed in silently
- [ ] An archived Module can be restored, and the restore brings back exactly the rows that this Module's archive took down — its descendant Modules, their User Stories, those Stories' Acceptance Criteria, and the ATCs anchored to any of them
- [ ] A row that was already archived on its own ***before*** the Module was archived stays archived after the restore
- [ ] Restoring a Module whose own parent Module is still archived is refused, and the refusal names the archived ancestor
- [ ] Restore requires the same access that already permits archiving the Module
- [ ] Restore writes its own workspace Activity Stream entry, separate from the archive entry
- [ ] Restore is idempotent, and restoring never destroys anything
- [ ] The restore is atomic — it either brings back the whole set or leaves everything as it was

## Context

BK-039 commits the product to recoverable deletion and names the entities it applies to: ***"Modules, US, AC, ATC, Tests"***. For Modules, the archive half shipped and the recovery half did not.

The archive is real, and it is wide. `bunkai*archive*module*subtree` (current definition in `supabase/migrations/0023*module*activity*log.sql`, first shipped in `0014*module*soft*delete.sql`) walks the Module's descendants and stamps `archived*at` across ***four tables in one transaction*** — `modules`, then `user*stories`, then `acceptance*criteria`, then `atcs` — every row taking the same instant from a single `v_now`. One click on the danger item in the explorer context menu can take down an entire branch of authored work.

***Nothing anywhere clears the archived stamp.*** No writer sets `archived*at` back to null. A repo-wide sweep for an un-archive writer — `unarchive`, `restore*module`, `bunkai*restore`, `archived*at = null` — returns zero hits across every migration, route and library file. There is no restore function, no restore endpoint, and no restore affordance. The cascade is, today, irreversible in practice.

The second half is just as blank. BK-039 specifies the opt-in `?include*archived=true` on listing endpoints. ***It has zero implementations.**** Four occurrences exist repo-wide and not one is code: three restate the requirement in `.context/SRS/functional-specs.md`, `.context/business/business-api-map.md` and `.context/business/business-feature-map.md`, and the fourth is a comment in `supabase/migrations/0051*bugs_list.sql` recording that the flag stays out of v1. So a user cannot even **see* what the cascade archived, let alone undo it.

The two halves are one story on purpose: a restore action with nothing to list is unreachable, and a list of archived rows with no restore action is a museum.

## What this story does NOT claim about BK-039

Stated plainly so nobody re-derives it wrongly later. ***BK-039 does not commit to a restore.**** Its text covers exactly four things: `DELETE` sets `archived*at = now()`; listing endpoints filter `archived*at IS NULL` by default; `?include_archived=true` opts in; hard-delete is admin-only behind a confirmation header. The word **restore* appears nowhere in it.

- The ***opt-in half of this story cites BK-039 directly*** — the `?include_archived=true` flag is written there, verbatim, and unimplemented.
- The ***restore half rests on sibling precedent, not on a written requirement.*** [https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571](https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571) (ATC) and [https://jira.upexgalaxy.com/browse/BK-596#icft=BK-596](https://jira.upexgalaxy.com/browse/BK-596#icft=BK-596) (Test) each pair archive with restore inside a single story, and each states that restore returns the entity exactly as it was. That precedent is strong and this story follows it — but it is precedent, and it is named as such rather than dressed up as a spec obligation.

## Why this story stops where it stops, and on what authority

This is the story's main design risk, so the narrowing is deliberate and recorded rather than discovered later.

Measured on the current tree: ***25 migrations contain 102 archived-row predicates**** (`archived*at is null`), and ****18 TypeScript files apply the same filter**** via `.is('archived*at', null)` — 14 of them production code, 4 test files. Adding a parameter to a plpgsql function creates a ****new overload*** rather than changing the existing one, so every RPC touched needs drop, re-create and re-grant. Applied to all 102 predicates this story is not buildable.

***The boundary is BK-039's own applies-to list, read literally:**** ****"Modules, US, AC, ATC, Tests."*** That list is the authority. It does not name Bugs, Runs, coverage or heatmap reports, Milestones, Test Plans, Environments, Projects or Workspaces, so none of those get the flag here.

Applying that reading:

| ***Family**** | ****Migrations**** | ****Predicates**** | ****Disposition*** |
| --- | --- | --- | --- |
| Module / User Story / Acceptance Criterion core (`0014`, `0015`, `0016`, `0017`, `0018`, `0023`) | 6 | 50 | ***This story**** — and only the **listing* predicates within them; the write guards ("only act on an active Module") are untouched |
| ATC and Test families (`0021`, `0024`, `0027`, `0028`, `0029`, `0035`, `0065`, `0071`) | 8 | 24 | ***BK-571 / BK-596*** own their own opt-in views. Not re-decided here |
| Traceability reports (`0068`, `0069`) | 2 | 6 | ***Untouched*** — evidence surfaces, which per [https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571](https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571) and [https://jira.upexgalaxy.com/browse/BK-596#icft=BK-596](https://jira.upexgalaxy.com/browse/BK-596#icft=BK-596) must never filter archived rows |
| Bug and report families (`0046`, `0048`, `0049`, `0050`, `0051`, `0052`, `0054`, `0059`, `0070`) | 9 | 22 | ***Out of scope*** — BK-039 does not name them |
|  | ***25**** | ****102*** |  |

On the TypeScript side the same cut leaves ***7 of the 18 files*** in play: the Project explorer layout, the Module detail and Module-User-Story routes, the User Story detail and its Acceptance Criteria route, the Acceptance Criterion detail route, and the Jira import runner's dedupe reads (a write-guard class, expected to stay as-is). The ATC and Test pages belong to [https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571](https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571) and BK-596; the Bug, Run and Home-panel reads are out.

***Note the asymmetry, because it is not a contradiction.**** The `include_archived` half is narrowed to the Modules / User Stories / Acceptance Criteria listings. The ****restore half is not narrowed**** — it must un-archive all four tables the cascade touched, ATCs included, or it is not the inverse of the archive and the story fails its own definition of done. Restoring the ATC **rows** is this story's job; the archived-ATC **view* is BK-571's.

## Design gate

***🔒 mockup-gated, unratified.**** An exhaustive sweep of `.context/designs/bunkai-test-management-tool/` finds ****no archived-row treatment, no restore action and no include-archived toggle anywhere in the set***. The only hits are incidental prose — billing downgrade copy, a notification empty state, an account-settings step named "…return path restores", and one Test Plan seed described as "Archived." None is an affordance. Do not infer one.

What **is** drawn, and what this story reuses rather than replacing: the explorer tree context menu at `project/screens/project.jsx`, with `Rename` (F2) at line 283 and a danger `Delete` (⌫) at line 290. That menu is the archive entry point today and is the natural host for the restore counterpart. This is the identical gap [https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571](https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571) and [https://jira.upexgalaxy.com/browse/BK-596#icft=BK-596](https://jira.upexgalaxy.com/browse/BK-596#icft=BK-596) carry, and this story inherits their 🔒 precedent.

## Sequencing

Sequence this ***after BK-571***. Whichever archive-and-restore story ships first invents the shared vocabulary — the archived-row treatment, the restore action, the reversible-confirmation copy, the opt-in archived view. [https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571](https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571) is already named as the origin of that vocabulary by [https://jira.upexgalaxy.com/browse/BK-596#icft=BK-596](https://jira.upexgalaxy.com/browse/BK-596#icft=BK-596), which reuses it rather than authoring a second dialect. This story does the same, so the product ends up with one archive vocabulary across ATC, Test and Module instead of three. The Jira dependency link on this issue records that constraint.

## Provenance

Authored 2026-08-24 from BK-039 (`.context/SRS/functional-specs.md`), a full read of `supabase/migrations/0014*module*soft*delete.sql` and its superseding definition in `0023*module*activity*log.sql`, the shipped archive route at `app/api/v1/modules/[id]/route.ts`, and a measured sweep of the migration tree and TypeScript surface for `archived*at` predicates and for any `include*archived` implementation. The three open questions this story had to settle — selective restore, the scope of the opt-in flag, and who may restore an orphaned child — were decided by the AI Product Owner and AI Tech Lead profiles per CLAUDE.md Critical Rule #18; all three rulings are posted as attributed comments on this issue, with their alternatives scored.

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Workflow](./workflow.md)

---

## Traceability

### Story (1)

- [BK-571](https://jira.upexgalaxy.com/browse/BK-571): TMS-ATC Library | Archive an ATC and restore it from the archive _(Backlog)_

---

## Metadata

- **Created:** 2026-08-24
- **Updated:** 2026-08-31
- **Reporter:** Ely
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_
