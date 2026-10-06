# TMS-Defect Filing | Attach screenshots as evidence when filing a defect

**Jira Key:** [BK-594](https://jira.upexgalaxy.com/browse/BK-594)
**Epic:** [BK-31](https://jira.upexgalaxy.com/browse/BK-31) (Bugs & Defect Heatmap)
**Type:** Story
**Status:** Backlog
**Priority:** Medium
**Story Points:** -

---

## Overview

***Source spec:*** BK-025 — File Bug (`.context/SRS/functional-specs.md`)

## User story

***As a*** Senior QA Engineer
***I want to*** attach screenshots from my own machine when I file a defect from a failing step
***So that*** whoever picks the defect up sees what I saw, without chasing a link into a tool they may not have access to

## Definition of done

- [ ] Feature works end-to-end against staging
- [ ] Covered by an ATC chain anchored to a User Story + Acceptance Criterion
- [ ] Acceptance Criteria verified by QA
- [ ] Demoed to the team

## Why this story exists

A defect record in Bunkai already has an Evidence panel. The frozen mockup draws it, heads it "Evidence", and states "Up to 10 attachments per defect" with an `N / 10` counter beside it. The database backs the cap. What neither backs is the word **attachment**: every one of those ten items is a string somebody pasted. Bunkai stores no files, so a defect's evidence is a list of pointers to places Bunkai does not control.

The result is a defect record that reads as though it holds proof and holds addresses instead. Six weeks later, during a release review, half of them do not resolve.

## Current state (verified at `origin/staging`)

| ***Fact**** | ****Evidence*** |
| --- | --- |
| A defect holds at most ten evidence strings | `supabase/migrations/0046*bugs.sql:111-112` — `evidence*urls text[]` with `check (coalesce(array*length(evidence*urls, 1), 0) <= 10)` |
| The cap is enforced a second time in the filing path | `supabase/migrations/0046*bugs.sql:394-395` — raises `bug*evidence*limit*exceeded` with errcode `45303` inside `public.bunkai*create*bug` |
| No element of that array is validated as a URL | the same function coalesces the input array and checks only its length |
| No storage bucket, no upload route, no object-storage client exists | zero hits for storage policies across all 74 migrations; nothing under `app/` matches upload or attachment; no S3 or blob SDK in `package.json` |
| The mockup already promises attachments | `.context/designs/bunkai-test-management-tool/bk-31-bug-reports/bug-detail.html:590-596` — the evidence panel, its `N / 10` count, and the note "Up to 10 attachments per defect" |
| Filing happens in the runner, not on this screen | design plan §4.6 build-order note: "BK-40 (file from failing step) continues to render into the Test Runner's Report-bug drawer, not this screen" |

## The budget of ten is shared, not doubled

This is the point most likely to be got wrong in implementation, so it is an acceptance criterion rather than a footnote. There is ***one*** budget of ten evidence items per defect, and uploaded images and pasted links both draw on it. Ten is not ten links plus ten files. Both the CHECK constraint and the filing-path backstop count the same collection, and this story must not weaken, widen, or route around either.

The eleventh item is refused. The ten already there survive that refusal intact — the failure mode to avoid is a filing attempt that silently drops the newest, or the oldest, or all of them.

## Dependency

This story depends on the storage foundation built by the Run-execution evidence story in [https://jira.upexgalaxy.com/browse/BK-30#icft=BK-30](https://jira.upexgalaxy.com/browse/BK-30#icft=BK-30), and does not build a second one. The bucket, the Workspace-scoped access rules, and the authorized read path all come from there. Filing a defect with an uploaded image is not buildable before that story ships.

The `AI Tech Lead` decision comment on this ticket carries the same storage ruling published on the prerequisite, so a reader who lands here first sees why the backend was chosen without having to open the other ticket. ***ADR-0014 is owed by whoever implements the prerequisite***, not by this story.

## Constraints inherited from what already shipped

- Filing renders into the Test Runner's Report-bug drawer, per design plan §4.6's own build-order note. This story does not move filing onto the defect screen.
- The defect record itself is read-only by design — §4.6 states it carries "No edit/status-transition controls". Evidence is therefore fixed at filing time, and editing it afterwards is out of scope rather than an oversight.
- [https://jira.upexgalaxy.com/browse/BK-500#icft=BK-500](https://jira.upexgalaxy.com/browse/BK-500#icft=BK-500) (Ready For QA) fixed the Report-bug drawer seeding the failing step's evidence value unfiltered, so a legacy non-http value failed validation on a field the tester never touched. [https://jira.upexgalaxy.com/browse/BK-466#icft=BK-466](https://jira.upexgalaxy.com/browse/BK-466#icft=BK-466) (Ready For QA) fixed the runner rendering unscoped evidence URLs. Whatever this story adds to the drawer must not reopen either.

## Open questions for the implementing run

- Whether uploaded images and pasted links share one ordered collection or two, and how the `N / 10` counter reads across them. The shape is settled by the prerequisite story; this story consumes it.
- What the drawer shows while an image is still uploading and the tester submits the defect — filing must not complete against evidence that has not landed, and must not lose the tester's typed content if it fails.
- Whether an image already attached to the failing step result is offered for reuse when filing from that step, or must be attached again. Reuse is attractive and is a live modelling question, not an assumed yes.

## Three amigos — edge cases raised

| ***#**** | ****Edge case**** | ****Disposition*** |
| --- | --- | --- |
| 1 | The eleventh evidence item is added | Promoted to AC — refused, and the existing ten are untouched |
| 2 | Nine pasted links plus two uploaded images | Promoted to AC — one shared budget, so the eleventh is refused whichever kind it is |
| 3 | A file that is not an image | Promoted to AC — refused, naming what is accepted |
| 4 | A file above the size limit | Promoted to AC — refused, naming the limit |
| 5 | A member of another Workspace holds a direct reference to a stored image | Promoted to AC — the load-bearing security criterion |
| 6 | An upload fails while the defect is being filed | Promoted to AC — no half-filed defect, and the tester's typed content survives |
| 7 | The tester pastes links only, as today | Promoted to AC — the existing path is unchanged |
| 8 | A defect filed with no evidence at all | Promoted to AC — valid; the record reads 0 of 10, not an error |
| 9 | Someone tries to add evidence to a defect already filed | Business rule — evidence is fixed at filing; the record is read-only by design |
| 10 | The same image attached twice to one defect | Test-only. Two items of the ten, not an error |
| 11 | A defect filed from a step that already carries evidence | Open question above — reuse versus re-attach is not assumed |
| 12 | A defect filed standalone, with no failing step behind it | Test-only. Evidence attachment must not depend on a Run being present |
| 13 | Evidence on a defect that is later sent to an external tracker | Out of scope here — defect sync owns what crosses the boundary ([https://jira.upexgalaxy.com/browse/BK-372#icft=BK-372](https://jira.upexgalaxy.com/browse/BK-372#icft=BK-372)) |

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Workflow](./workflow.md)
- [Mockup](./mockup.md)

---

## Traceability

### Story (1)

- [BK-593](https://jira.upexgalaxy.com/browse/BK-593): TMS-Run Execution | Attach a screenshot as evidence on a step result _(Ready For Dev)_

---

## Metadata

- **Created:** 2026-08-22
- **Updated:** 2026-09-16
- **Reporter:** Ely
- **Assignee:** Unassigned
- **Labels:** defect-filing, discovery-2026-08-21, evidence-upload

---

_Synced from Jira by sync-jira-issues_
