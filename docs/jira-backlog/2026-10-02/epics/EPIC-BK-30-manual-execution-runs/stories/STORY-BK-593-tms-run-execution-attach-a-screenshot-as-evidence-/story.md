# TMS-Run Execution | Attach a screenshot as evidence on a step result

**Jira Key:** [BK-593](https://jira.upexgalaxy.com/browse/BK-593)
**Epic:** [BK-30](https://jira.upexgalaxy.com/browse/BK-30) (Manual Execution & Runs)
**Type:** Story
**Status:** Ready For Dev
**Priority:** Medium
**Story Points:** 8

---

## Overview

***Source spec:*** BK-020 — Report step result (`.context/SRS/functional-specs.md`)

## User story

***As a*** Senior QA Engineer
***I want to*** attach a screenshot from my own machine to a step result while I am executing a Run
***So that*** the proof of what I saw lives inside the Run record, instead of behind a link to somewhere that may be gone by the time anyone reads it

## Definition of done

- [ ] Feature works end-to-end against staging
- [ ] Covered by an ATC chain anchored to a User Story + Acceptance Criterion
- [ ] Acceptance Criteria verified by QA
- [ ] Demoed to the team

## Why this story exists

Bunkai cannot store an image. Not on a step result, not on a defect, not anywhere in the product. What Bunkai calls evidence today is a string a tester typed or pasted, and the frozen mockup for the Test Runner says so out loud: its notes field is placeholdered "paste screenshot URL". The screenshot itself lives in Slack, in a chat thread, on somebody's desktop, or behind a link that expires. The Run record points at the proof. It does not hold it.

That is not what the written record promised, and it is not what a QA engineer means by evidence. A Run that says "step 4 failed" and links to a dead URL is a Run nobody can audit six weeks later.

## What the written record already committed to

| ***Source**** | ****Commitment*** |
| --- | --- |
| `.context/PRD/mvp-scope.md:53` (US 6.2) | evidence is "(URL ***or pasted screenshot***)" — stated as MVP scope, verbatim |
| `.context/PRD/user-personas.md:125` | the executor persona "attach[es] evidence (screenshots, logs, network traces) to the run" |
| `.context/SRS/architecture-specs.md:170` | object storage was chosen specifically for "screenshot/video evidence at scale" |
| `.context/master-implementation-plan.md:378-383` | the signed-URL flow was scheduled for Sprint 4, and the plain-string column was named an explicit "stand-in during Sprints 1-3" |

Sprint 4 came and went. The stand-in is still the entire feature, and no ticket ever carried its replacement. This story is that ticket.

## Current state (verified at `origin/staging`)

| ***Fact**** | ****Evidence*** |
| --- | --- |
| A step result holds exactly one free-text evidence string | `supabase/migrations/0031*runs.sql:176` — `evidence*url text`, nullable, no array, no format or length constraint |
| A defect holds up to ten evidence strings | `supabase/migrations/0046*bugs.sql:111-112` — `evidence*urls text[]` with a CHECK capping the array at 10 |
| No storage bucket exists | zero hits for `storage.buckets` / `storage.objects` / `storage.foldername` across all 74 migrations; there is no `supabase/config.toml` |
| No upload route exists | nothing under `app/` matches upload, attach, evidence or storage |
| No object-storage client is installed | `@aws-sdk/client-s3`, `@vercel/blob`, `aws4fetch`, `minio` — none present in `package.json` |
| The mockup's Attach control was designed and never wired | `.context/designs/bunkai-test-management-tool/project/screens/run.jsx:227` renders a `📎 Attach` button with no handler; only the adjacent URL path does anything |

The two evidence shapes are also asymmetric: a defect already has a list capped at ten, a step result has a single scalar. Reconciling that asymmetry is part of this story, and the shape chosen here is the one the defect-filing counterpart inherits.

## This story carries the storage foundation

This is the first surface in Bunkai that needs to store a file at all, so the foundation lands here: the bucket, the access rules that make an object readable only inside its own Workspace, the authorized read path, and the migration that records an attachment against a step result.

State it plainly so nobody builds a second one: ***every later surface that stores a file in Bunkai reuses what this story builds.*** The defect-filing counterpart is a separate story and declares a hard dependency on this one.

An `AI Tech Lead` decision comment on this ticket rules on which storage backend serves evidence uploads, with the alternatives scored. Read it before planning.

## Architectural consequence — ADR-0014 is owed

That ruling departs from the storage product named in `.context/SRS/architecture-specs.md:170`, which makes it architectural rather than local. ***ADR-0014 must be authored by whoever implements this story.*** `ADR-0001` through `ADR-0013` exist at `origin/staging`, so `0014` is the next free number. The discovery run that filed this ticket deliberately did not author it — discovery writes tracker content, not repository decisions.

The ruling's authorization argument leans on `ADR-0012` (RPC authorization invariant: actor bind and result scoping on every DEFINER function) and on the four Workspace helpers in `supabase/migrations/0005*rls*helpers.sql`. Object authorization is expected to travel that same path rather than invent a parallel one.

## Open questions for the implementing run

- A step result carries one evidence string, not a list. Holding more than one attachment needs a shape that holds several, and that shape is inherited by the defect story — choose it once, deliberately.
- A pasted link and an uploaded image are two different things currently sharing one field name. Whether they live in one collection or two is a modelling call this story settles.
- Two shipped defects already constrain the read path and must not be reopened: [https://jira.upexgalaxy.com/browse/BK-466#icft=BK-466](https://jira.upexgalaxy.com/browse/BK-466#icft=BK-466) (the runner's evidence anchor renders unscoped URLs, accepting `javascript:` and `data:` schemes) and [https://jira.upexgalaxy.com/browse/BK-500#icft=BK-500](https://jira.upexgalaxy.com/browse/BK-500#icft=BK-500) (the Report-bug dialog seeds the step evidence value unfiltered, so a legacy non-http value fails validation on a field the tester never touched).

## Three amigos — edge cases raised

| ***#**** | ****Edge case**** | ****Disposition*** |
| --- | --- | --- |
| 1 | A tester attaches a file that is not an image (PDF, log, archive) | Promoted to AC — rejection must name what is accepted |
| 2 | A tester attaches an image larger than the accepted limit | Promoted to AC — rejection must name the limit |
| 3 | A member of another Workspace obtains a direct reference to a stored object | Promoted to AC — this is the load-bearing security criterion |
| 4 | The upload fails part-way (connection drops, storage rejects) | Promoted to AC — the step result and its existing evidence must survive untouched |
| 5 | The tester still pastes a link instead of uploading | Promoted to AC — the existing path must keep working, unchanged |
| 6 | A file with an image extension whose content is not an image | Business rule — acceptance is decided by content, not by the name the file arrived with |
| 7 | The same image attached twice to one step | Test-only. Not an error; two attachments is a tester's choice, not a defect |
| 8 | A zero-byte file | Test-only. Falls out of the content check in rule 6 |
| 9 | The Run finishes while an upload is still in flight | Business rule — a finished Run's evidence is fixed; an upload that has not landed does not land afterwards |
| 10 | Evidence attached to a step of an aborted Run | Business rule — `aborted` is a Run-grain outcome and never a step outcome; evidence already recorded is kept |
| 11 | A very long filename, or one with characters that do not survive a path | Test-only. Display concern, no behavioural rule |
| 12 | Two testers on the same Run attach to the same step at once | Test-only for this story. A Run has one executor by design; revisit if agent executors change that |

---

## QA Refinements (Shift-Left Analysis) — Added 2026-09-17

> Refined Acceptance Criteria live in the acceptance_criteria field.

### Edge Cases Identified

| # | Edge case | Criticality | Action |
| --- | --- | --- | --- |
| 1 | Zero-byte file | High | Confirm rejection and error contract. ***NEEDS PO/DEV CONFIRMATION*** |
| 2 | Extension/MIME mismatch or invalid bytes | High | Define content validation. ***NEEDS PO/DEV CONFIRMATION*** |
| 3 | Exact max and max+1 size | High | Define numeric limit and inclusive rule. ***NEEDS PO/DEV CONFIRMATION*** |
| 4 | Duplicate attachment | High | Define idempotency/deduplication. ***NEEDS PO/DEV CONFIRMATION*** |
| 5 | Pasted external link | Medium | Define legacy URL compatibility. ***NEEDS PO/DEV CONFIRMATION*** |
| 6 | Partial upload / orphan object | Critical | Define transaction and cleanup ownership. ***NEEDS PO/DEV CONFIRMATION*** |
| 7 | Upload during finish or abort | Critical | Define state serialization. ***NEEDS PO/DEV CONFIRMATION*** |
| 8 | Cross-Workspace content request | Critical | Add explicit non-disclosure assertion. ***NEEDS PO/DEV CONFIRMATION*** |
| 9 | Concurrent uploads | High | Define ordering/conflict/idempotency rule. ***NEEDS PO/DEV CONFIRMATION*** |
| 10 | Expired session or storage timeout | High | Define retryability and user-visible state. ***NEEDS PO/DEV CONFIRMATION*** |

### Clarified Business Rules

- Evidence must remain associated with the selected Run Step and must not cross Workspace boundaries.
- Terminal Run states must not gain inconsistent evidence; finish and abort races require one atomic serialization rule.
- Existing free-text evidence URL behavior must be explicitly preserved, migrated, or replaced.
- The storage provider, object metadata, retention, and cleanup ownership must be defined before implementation.

### Critical Questions for PO

1. What is the accepted screenshot cardinality and the compatibility rule for existing evidence URLs?
2. What exact media types, byte limits, zero-byte behavior, and error contract apply?
3. What behavior is required when upload overlaps Run finish or abort?

### Technical Questions for Dev

1. Which storage provider, bucket, object-key format, and metadata schema will be implemented?
2. Will upload and Run Step metadata commit be atomic, compensating, or asynchronous?
3. Where are authorization checks enforced for attach, read, download, and remove?
4. How will direct object URLs preserve tenant isolation?
5. What is the authoritative API contract for step-result evidence?

> Full refinement (Phases 1-5, coverage outlines, risk + data feasibility) lives in the Acceptance Test Plan (ATP) field.

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Workflow](./workflow.md)
- [Mockup](./mockup.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)

---

## Traceability

### Story (1)

- [BK-594](https://jira.upexgalaxy.com/browse/BK-594): TMS-Defect Filing | Attach screenshots as evidence when filing a defect _(Backlog)_

---

## Metadata

- **Created:** 2026-08-22
- **Updated:** 2026-09-17
- **Reporter:** Ely
- **Assignee:** Carmen Guerrero Salazar
- **Labels:** discovery-2026-08-21, evidence-upload, shift-left-2026-09-17, shift-left-reviewed, storage-foundation

---

_Synced from Jira by sync-jira-issues_
