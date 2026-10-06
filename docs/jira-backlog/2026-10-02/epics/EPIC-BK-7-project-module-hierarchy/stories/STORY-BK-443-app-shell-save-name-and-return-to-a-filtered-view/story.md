# App Shell | Save, name, and return to a filtered view

**Jira Key:** [BK-443](https://jira.upexgalaxy.com/browse/BK-443)
**Epic:** [BK-7](https://jira.upexgalaxy.com/browse/BK-7) (Project & Module Hierarchy)
**Type:** Story
**Status:** Ready For Dev
**Priority:** Medium
**Story Points:** 8

---

## Overview

## User story

******As a**** **Senior QA Engineer*
**********I want to****** ****save a filtered view under a name and return to it later***
**So that**** the way I narrowed a list survives navigating away, and the views I work from every day are one click apart instead of rebuilt by hand each time

## Definition of done

- [ ] Feature works end-to-end against staging
- [ ] Covered by an ATC chain anchored to a User Story + Acceptance Criterion
- [ ] Acceptance Criteria verified by QA
- [ ] Demoed to the team

## Why this story exists

Narrowing a list is cheap; getting back to the narrowing is not. A QA Engineer sets a module, a severity and a date range, follows a link out to an ATC, comes back, and the list is wide open again. Nothing in the product lets her name that combination, keep it, or return to it tomorrow.

## Current state (verified at `origin/staging`)

Four filtered surfaces, three different conventions, no persistence layer in use:

| ***Surface**** | ****Filter state today*** |
| --- | --- |
| Traceability chain ([https://jira.upexgalaxy.com/browse/BK-48#icft=BK-48](https://jira.upexgalaxy.com/browse/BK-48#icft=BK-48)) | Synced to the URL via `history.replaceState` (`components/traceability/TraceabilityChainView.tsx`) |
| Run history ([https://jira.upexgalaxy.com/browse/BK-37#icft=BK-37](https://jira.upexgalaxy.com/browse/BK-37#icft=BK-37)) | Synced to the URL via `router.replace` (`components/runs/RunHistoryView.tsx`) |
| Bugs list | React state only — the file comments say the URL was deliberately skipped for want of a deep-link requirement (`components/bugs/BugsListView.tsx`) |
| Project workbench ATC search + tag filter | React state only (`app/(app)/projects/[projectSlug]/atc-search-filter.tsx`, `test-tag-filter.tsx`, `workbench-context.tsx`) |

Two related points, so neither is mistaken for a gap this story invents:

- ***BK-48's filter-state question is already settled and shipped.**** Its 2026-08-11 decision comment chose URL query params over local state, and the code implements it. That ruling covers **in-session and shareable-by-link* filter state on the chain view; it explicitly set saved views aside ("this is exploration, not a dashboard"). This story is the layer above it: naming and keeping a view, not encoding one in a link. It should adopt the URL convention rather than compete with it, and bring the two local-state surfaces onto the same convention.
- ***BK-147 persists which tabs are open, not what is filtered inside them.*** Its open-tab set is in-memory and resets on project switch by construction. Unrelated surface.

[https://jira.upexgalaxy.com/browse/BK-218#icft=BK-218](https://jira.upexgalaxy.com/browse/BK-218#icft=BK-218) was reviewed and is unrelated — it renders a single entity as a rich chat link, not a filtered view. Do not fold the two together.

## Starting position in the data model

`user*view*state` already exists with full row-level security and has ***zero application consumers*** — table plus generated type only, unused since it was created:

- `supabase/migrations/0009*cross*cutting.sql` — columns `user*id`, `project*id`, `view*kind text`, `state jsonb not null default '{}'`, `updated*at`, primary key `(user*id, project*id, view*kind)`. Owner-only `select` / `insert` / `update` / `delete` policies, each gated on `user*id = auth.uid()`.
- `lib/types/supabase.ts` — the generated row types, and nothing else in `app/`, `components/` or `lib/` references it.

Build on this table rather than proposing a new one. Note the one shape mismatch the implementing run has to resolve deliberately: ***as built, the primary key allows exactly one row per**** `(user, project, view_kind)` ****and there is no name column***, so the table as it stands models "the last state of this view" and not "several named views of it". Supporting more than one named view per kind requires extending that shape; keeping a single unnamed remembered state per kind does not. That trade-off is a schema decision for the implementing run, not a new table decision.

---

## QA Refinements (Shift-Left Analysis) — Added 2026-09-23

> Refined Acceptance Criteria live in the Acceptance Criteria field.

### Edge Cases Identified

| # | Edge case | In original story? | How serious | What to do about it |
| --- | --- | --- | --- | --- |
| 1 | Member removed from project keeps a leftover, still-readable-by-them saved-view row | No | High | Add as a formal rule (PO confirm) |
| 2 | A whole filter option disappears from the product (not just one archived item) | No | Medium | Test only — likely handled by the same fix as AC-12 |
| 3 | Double-click / rapid re-submit of save | No | Medium | Add as a formal rule (PO confirm) |
| 4 | Concurrent update of the same saved view from two tabs | No | Medium | Add as a formal rule (PO confirm) — ties to the open database-shape question |
| 5 | Very large filter data stored in one saved view | No | Low | Test only |

### Clarified Business Rules

- Name-matching for uniqueness (AC-08) is not spelled out — case sensitivity and whitespace trimming both need a stated rule before exact assertions can be written.
- Business rule 8 already covers both archived AND fully-removed targets the same way ("no longer exists or was archived") — AC-12's own wording only names "archived," which reads narrower than the business rule until cross-checked.
- The saved-view table's access rule is ownership-only and does not re-check current project membership. A separate business rule expects visibility to follow project access — for this table specifically, that expectation is not enforced today.
- "Member," used throughout the Story and its business rules, is not defined against the product's five roles (owner, admin, member, viewer, automation/PAT account) — unclear whether it means any workspace person or the specific member role.
- Business rule 2 (one view belongs to one project and one surface) has no matching test today, unlike the surface-isolation and member-isolation rules, which do.

### Critical Questions for PO

1. ***Can one person have more than one saved view per surface, given the database table's current unique key is ****`(user*id, project*id, view_kind)`**** with no name column?*** AC-01/AC-04/AC-08 all assume multiple named views per person per surface; the table as built today allows only one row per person/project/surface. This is the single highest-impact open item — Dev cannot start building until it's answered.

### Technical Questions for Dev

1. What does the save/list/rename/update/delete API look like (routes, request/response shape)? Nothing describes this today.
2. Is the case-sensitivity / extra-spaces rule for matching names intentional, or was it never decided?
3. Does bringing Bugs list and the Workbench filters up to page-address syncing belong inside this Story, or is it separate prerequisite work? Only 2 of 4 target surfaces have any page-address syncing today.
4. Is there meant to be a project-membership check on the saved-view table beyond the current owner-only rule? Confirmed by reading the migration directly: no such check exists today.
5. Does "no longer exists" in business rule 8 specifically mean the module was hard-deleted (not just archived)? A quick confirmation, not a blocker — closes the loop so AC-12's wording can be updated to match.

> Full refinement (Phases 1-5, coverage outlines, risk + data feasibility) lives in the ATP — the Acceptance Test Plan (ATP) field. `/sprint-testing` Stage 1 later materializes it as the Test Plan issue.

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Workflow](./workflow.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)

---

## Metadata

- **Created:** 2026-08-13
- **Updated:** 2026-10-01
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** discovery-2026-08-13, filter-persistence, saved-views, shift-left-2026-09-23, shift-left-reviewed

---

_Synced from Jira by sync-jira-issues_
