# TMS-ATC Library | Browse every ATC in the workspace from one index

**Jira Key:** [BK-439](https://jira.upexgalaxy.com/browse/BK-439)
**Epic:** [BK-13](https://jira.upexgalaxy.com/browse/BK-13) (ATC Library (Acceptance Test Cases))
**Type:** Story
**Status:** Ready For Dev
**Priority:** Medium
**Story Points:** 5

---

## Overview

## User story

***As a*** Senior QA Engineer
***I want to*** browse every ATC in the workspace from a single cross-project index, and open any row into its owning Project
***So that*** I can confirm whether a reusable ATC already exists before writing a duplicate

## Definition of done

- [ ] The sidebar's "ATC Library" entry is live and reachable, no longer a disabled "Coming soon" placeholder
- [ ] The entry carries an unfiltered count badge of every ATC the caller can read in the active Workspace
- [ ] Opening the ATC Library shows a single dense list combining ATCs from every Project the caller can access, with no artificial cap
- [ ] Each row shows ATC id, name, owning Project, Module, layer (text label + color), anchored User Story / Acceptance Criterion, and "used in N tests"
- [ ] Opening a row navigates into the ATC's owning Project, with a toast naming the destination; no in-place editor opens
- [ ] The screen has default, loading, empty (including empty-workspace), and named-error-with-retry states
- [ ] An ATC in a Project the caller cannot access never appears in the list or in the badge count
- [ ] A workspace with a single Project renders the list correctly
- [ ] "Test Runs", "Bug Reports", and "Metrics" remain disabled "Coming soon" items, unaffected
- [ ] No search field and no filter controls ship in this slice

## Context

First of the three slices [https://jira.upexgalaxy.com/browse/BK-267#icft=BK-267](https://jira.upexgalaxy.com/browse/BK-267#icft=BK-267) was split into by the AI Product Owner ruling (comment 12315) and partitioned architecturally by the AI Tech Lead ruling (comment 12316) on [https://jira.upexgalaxy.com/browse/BK-267#icft=BK-267](https://jira.upexgalaxy.com/browse/BK-267#icft=BK-267). Covers BK-267's AC-01, AC-02, AC-08 (empty-workspace scenario only), AC-09, AC-10, AC-11, AC-12, AC-13, AC-14. Delivers the structural cost of the whole feature: the `/atcs` route, the sidebar entry going live with its count badge, the cross-project read, and the dense row — nothing else. It is the independently shippable slice: a complete, dense, cross-project index a user can scan and launch from answers "does this ATC already exist" on day one.

## Provenance

Materialized from [https://jira.upexgalaxy.com/browse/BK-267#icft=BK-267](https://jira.upexgalaxy.com/browse/BK-267#icft=BK-267) (AI Product Owner ruling, comment 12315; AI Tech Lead ruling, comment 12316), 2026-08-13. [https://jira.upexgalaxy.com/browse/BK-267#icft=BK-267](https://jira.upexgalaxy.com/browse/BK-267#icft=BK-267) was found not implementable at its recorded 1 SP against 14 AC blocks / 19 scenarios, and was split three ways. This slice carries the largest share of the estimate because it pays the entire structural cost (route, cross-project read, endpoint, sidebar, badge) that the two following slices build on top of.

---

## QA Refinements (Shift-Left Analysis) — Added 2026-09-19

> Refined Acceptance Criteria live in the `acceptance_criteria` field (Step 1a).

### Edge Cases Identified

| # | Edge case | In original Story? | Criticality | Action |
| --- | --- | --- | --- | --- |
| 1 | Pagination/"no artificial cap" mechanism left unspecified | No | Critical | Add to AC (PO/Dev confirm mechanism before Dev estimates) |
| 2 | "Used in N tests" per-row aggregate risking an N+1 fetch storm at scale | No | Critical | Ask Dev (blocks estimation, ties to Integration outline #2) |
| 3 | AC-13 vs. DoD/out-of-scope self-contradiction (Project filter) | Yes (it's in the Story, but self-contradictory) | Critical | Ask PO — blocking |
| 4 | "Project I cannot access" has no independent enforcement from "Workspace I am not a member of" in the current schema | No | Critical | Ask PO/Dev — ties to AC-12 |
| 5 | Retry re-triggering an indefinitely-failing query (no backoff/circuit-breaker mentioned) | No | Medium | Test only |
| 6 | Exact error copy (AC-09) / exact toast copy (AC-11) not specified | No | Low | Ask PO for literal strings (Suggested Story Improvement) |
| 7 | Badge count freshness — fetched once per navigation vs. live | No | Medium | Ask PO/Dev |
| 8 | Default sort order of the dense list unstated | No | Medium | Ask PO |
| 9 | An ATC whose owning Project has itself been archived/soft-deleted | No | Medium | Ask PO — no precedent found in module-context.md |

### Clarified Business Rules

- No `project*members` (or equivalent) table exists in the current schema — access to `atcs` and `projects` is enforced entirely via `workspace*members` (confirmed by reading `supabase/migrations/0004*atcs.sql` and `0002*projects_modules.sql`). There is no way today to be "a member of the Workspace but not of one of its Projects," which directly bears on AC-12's literal "Project I cannot access" wording.
- The only usage-count read that exists today is the per-ATC `GET /api/v1/atcs/{id}/usage` (BK-22, confirmed in `AtcPreview.tsx`); no bulk/aggregate usage-count endpoint exists yet.
- BK-267 (the original, larger Story) was split three ways by an AI Product Owner + AI Tech Lead ruling on 2026-08-13; BK-439 inherited AC-01, AC-02, AC-08 (empty-workspace only), AC-09..AC-14 from that superset — directly relevant to the AC-13 contradiction below.

### Critical Questions for PO

1. ***Does AC-13's "Project filter" clause belong in this slice, or is it a leftover from the pre-split BK-267 superset Story that should be struck (deferring entirely to BK-441)?***

1. ***Does "an ATC in a Project I am not a member of" (AC-12 / Business Rules) mean "a Workspace I am not a member of" — the only access boundary the current schema actually enforces — or is a new per-Project sub-scoping expected within a single Workspace?***

### Technical Questions for Dev

1. ***What is the bulk/aggregate strategy for "used in N tests" at list scale?*** — Today's only usage-count read is the per-ATC `GET /api/v1/atcs/{id}/usage` (BK-22, confirmed in `AtcPreview.tsx`). Calling it once per row across "hundreds of ATCs" (AC-02) is an N+1 risk. Testing impact: Integration outline #2 cannot be executed meaningfully until this is decided.
2. ***What pagination/infinite-scroll mechanism, and what page size, ships for the dense list?*** — AC-02 leaves this open ("scrolling further or paging further"). Testing impact: the Boundary outline for "hundreds of ATCs" needs a concrete mechanism to write deterministic test steps against.
3. ***What is the default sort order for the cross-project list?*** — Unstated in any Story field. Testing impact: row-order assertions in later automated regression are meaningless without a stated, deterministic order.
4. ***Is the sidebar badge count fetched once per navigation, or does it update live (subscription/polling) while the app is open?*** — Testing impact: determines whether a "stale badge after another user creates an ATC" observation is a bug report or expected behavior.
5. ***What is the exact literal copy for the AC-09 error message and the AC-11 toast text?*** — No design/Figma link is attached to this Story. Testing impact: without literal strings, QA assertions are limited to "an error/toast is shown," not the specific message.

> Full refinement (Phases 1-5, coverage outlines, risk + data feasibility) lives in the ATP — the `acceptance*test*plan` field (Step 2; `/sprint-testing` Stage 1 later materializes it as the Test Plan issue).

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

## Traceability

### Storys (2)

- [BK-267](https://jira.upexgalaxy.com/browse/BK-267): TMS-ATC Library | Browse, search, and filter ATCs across every project _(ABORTED)_
- [BK-440](https://jira.upexgalaxy.com/browse/BK-440): TMS-ATC Library | Find an ATC by name as you type _(Backlog)_

---

## Metadata

- **Created:** 2026-08-13
- **Updated:** 2026-09-23
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** shift-left-2026-09-19, shift-left-reviewed

---

_Synced from Jira by sync-jira-issues_
