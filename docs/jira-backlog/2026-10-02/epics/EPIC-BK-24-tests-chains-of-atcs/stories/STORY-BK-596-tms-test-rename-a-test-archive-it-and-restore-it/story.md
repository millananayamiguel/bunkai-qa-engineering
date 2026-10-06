# TMS-Test | Rename a Test, archive it and restore it

**Jira Key:** [BK-596](https://jira.upexgalaxy.com/browse/BK-596)
**Epic:** [BK-24](https://jira.upexgalaxy.com/browse/BK-24) (Tests (chains of ATCs))
**Type:** Story
**Status:** Backlog
**Priority:** Medium
**Story Points:** -

---

## Overview

***Source spec:*** BK-039 — Soft-delete (`.context/SRS/functional-specs.md`, "Cross-cutting Functional Requirements"). This is an SRS functional-requirement id, not a Jira issue key.

## User story

***As a*** Senior QA Engineer
***I want to*** correct a Test's name, archive a Test that no longer earns its place, and restore it if it turns out to still matter
***So that*** the Test set stays an accurate picture of what we actually run, without ever destroying the Runs that prove what we ran before

## Definition of done

- [ ] A Test can be renamed in place, with the same name rules the product already enforces when a Test is created
- [ ] A Test can be archived from its own detail surface, behind a confirmation that names the Test and states that archiving is reversible
- [ ] The confirmation states how many Runs have been recorded against the Test, and archiving is never refused because of them
- [ ] An archived Test stops being offered wherever Tests are offered for use: search, the command palette, tag filtering, and the ATC "used in N Tests" report
- [ ] A new Run cannot be started from an archived Test
- [ ] Every Run already recorded against an archived Test keeps rendering in full, with every step, its content and its recorded result unchanged
- [ ] A User Story's Traceability chain keeps showing an archived Test as evidence rather than reporting a gap it does not have
- [ ] An archived Test cannot be renamed, reordered, retagged or chained further until it is restored
- [ ] An archived Test can be restored and immediately behaves like any other Test again
- [ ] Archive and restore each write their own workspace Activity Stream entry
- [ ] Archiving is recoverable by design — no action in this story destroys a Test or a Run

## Context

A Test, once created, can never be renamed and can never be removed, by anyone, through any surface. Four independent readings of the live system agree:

- `supabase/migrations/0024_tests.sql` defines the `tests` table with no archive column at all.
- `supabase/migrations/0014*module*soft_delete.sql` added that column to Modules, User Stories, Acceptance Criteria and ATCs, and visibly skipped Tests — its own header says the table "does not exist yet (future epics)" and is "intentionally absent from the cascade", with an instruction to extend the archive routine when it lands. It never was.
- `app/api/v1/tests/[id]/route.ts` exports a read and nothing else.
- `lib/supabase/rpc.ts` carries create, expanded read, chain reorder, tag set, tag filter and run listing for Tests — and no update and no archive.

Two published commitments say otherwise. `BK-039` names ***Tests*** explicitly in the list of entities that soft-delete applies to. `.context/SRS/api-contracts.yaml` publishes both an update and a soft-delete on `/tests/{test_id`}, the latter documented as returning "Archived".

## Sizing — this is materially larger than the ATC archive

[https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571](https://jira.upexgalaxy.com/browse/BK-571#icft=BK-571) can state that it needs no migration, because the ATC archive column and its read-side filtering both already exist and only the writer is missing. ***For Tests, neither exists.**** This Story adds the storage change **and* the read-side sweep, and the sweep is the bulk of it: every path that lists, resolves or counts a Test has to decide, individually, whether it is a surface that offers a Test for use or a surface that reports what already happened.

The paths that read a Test today:

| ***Path**** | ****Where it lives**** | ****Kind*** |
| --- | --- | --- |
| Expanded Test read | `0025*test*read.sql` | resolve |
| Tag filtering across Tests | `0030*test*tags.sql` | offer |
| ATC "used in N Tests" report | `0029*atc*usage.sql` | offer |
| Starting a Run | `0031_runs.sql` | offer |
| Run history for a Test | `0038*run*history.sql` | report |
| User Story traceability | `0068*story*traceability*report.sql`, `0069*story*traceability*module.sql` | report |
| Workspace and command-palette search | `0071*workspace*search.sql` | offer |

Seven paths, and the split between them is the whole design. A blanket filter is the wrong answer and would silently blank Run evidence; that is stated as a business rule, not left to the implementer.

## Live surfaces

The host surface already exists: `components/tests/TestDetailView.tsx` and the route at `app/(app)/projects/[projectSlug]/tests/[testId]/`, whose shared layout already carries the header actions. Rename and archive belong there.

Worth knowing before planning: ***the product has no Tests index.*** `app/(app)/projects/[projectSlug]/tests/` holds only the detail route and the create route — there is no list page. So unlike an ATC, an archived Test has no default list to disappear from, and there is no existing list to hang an opt-in archived view on. This Story therefore restores from the Test's own detail route, which still resolves for an archived Test and shows it as archived. A workspace-wide archived-Tests index is named in Out of Scope and waits for the Tests index itself.

## Sequencing

Sequence this ***after BK-571**** (ATC archive, currently `Backlog`). Whichever archive ships first invents the vocabulary — the archived treatment, the restore action, the reversible-confirmation copy, the in-use warning — that BK-571's definition of done already specifies for ATCs. If this one ships first the product ends up with two archive dialects for the same concept. This Story deliberately ****reuses*** BK-571's vocabulary rather than authoring a second one; where the live Test surfaces differ from the ATC surfaces, the words stay the same and only the host changes.

## Provenance

Authored 2026-08-22 from `BK-039`, the published update and soft-delete operations in `.context/SRS/api-contracts.yaml`, and a read of the live migration tree, API routes and RPC wrappers confirming that neither writer nor storage exists. The two open product questions this Story had to settle — the Test Plan membership behaviour and the Run history behaviour — were decided by the AI Product Owner and AI Tech Lead profiles per CLAUDE.md Critical Rule #18; both rulings are posted as attributed comments on this issue, with their alternatives scored.

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

- **Created:** 2026-08-23
- **Updated:** 2026-08-31
- **Reporter:** Ely
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_
