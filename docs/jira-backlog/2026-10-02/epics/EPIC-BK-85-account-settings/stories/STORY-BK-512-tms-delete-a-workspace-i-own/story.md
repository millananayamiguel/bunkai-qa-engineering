# TMS-| Delete a workspace I own

**Jira Key:** [BK-512](https://jira.upexgalaxy.com/browse/BK-512)
**Epic:** [BK-85](https://jira.upexgalaxy.com/browse/BK-85) (Account & Settings)
**Type:** Story
**Status:** BLOCKED
**Priority:** Medium
**Story Points:** 8

---

## Overview

## User story

***As a*** QA Lead / Quality Engineering Manager who owns a workspace
***I want to*** delete a workspace I own from Settings, after confirming its exact name
***So that*** I can honour an erasure request, or retire a workspace we no longer use, without asking anyone at Bunkai to do it for me

## Definition of done

- [ ] A Delete workspace action exists on the Settings workspaces screen, on rows the caller owns and nowhere else
- [ ] Deleting is gated by typing the workspace's exact name, the same idiom Leave already uses
- [ ] Confirming removes the workspace and everything inside it, immediately and irreversibly, and the confirmation said so before it happened
- [ ] The flow offers a data export first, so the Owner is never forced to choose between keeping the data and erasing it
- [ ] Every other member loses access at once, and anyone pointed at the deleted workspace is re-pointed at one they still belong to
- [ ] An Owner who deletes their only workspace lands somewhere coherent rather than on a broken shell
- [ ] Deleting a workspace never touches any other workspace
- [ ] Deleting is visibly a different act from leaving, and leaving still works exactly as it did

## Context

`.context/SRS/non-functional-specs.md` §9 (Compliance) commits to it in one sentence: "GDPR: Workspace owners can request data export + deletion via Settings." The export half is ticketed as [https://jira.upexgalaxy.com/browse/BK-508#icft=BK-508](https://jira.upexgalaxy.com/browse/BK-508#icft=BK-508). ***The deletion half has never been ticketed at all*** — this story is it.

Verified absent at `origin/staging`: `app/api/v1/workspaces/[id]/route.ts` exports `GET` and `PATCH` only, with no `DELETE`; a search for workspace-deletion or erasure code across `app`, `lib` and `components` returns nothing; the single occurrence of "danger zone" anywhere in the product is a code comment in `components/settings/IdentityCard.tsx`.

***This is not BK-90, and the two must never be read as duplicates.**** [https://jira.upexgalaxy.com/browse/BK-90#icft=BK-90](https://jira.upexgalaxy.com/browse/BK-90#icft=BK-90) ships **leaving* a workspace: the caller removes their own membership row and the workspace carries on without them, with a deliberate sole-owner block that refuses the leave precisely so a workspace is never orphaned. This story is the opposite act — the Owner removes the workspace itself, for everyone. Leave is a membership operation on one person; delete is a lifecycle operation on the tenant. Both live on the same screen and both must stay separately reachable and separately labelled.

The screen that hosts it already exists (`/settings/workspaces`, rendering `WorkspacesList`), and so does the confirmation idiom: `LeaveWorkspaceModal` already ships a type-the-exact-name gate over an `alertdialog`. Reusing it is the Critical Rule #14 live-UI-first path, not a new invention.

## Design note — for the implementing run

No mockup draws workspace deletion. The `bk-85-account-settings` suite draws two adjacent destructive idioms this story derives from: ***delete account**** (`settings-account.html`, Danger zone, `alertdialog` + typed-email confirm) and ****leave workspace**** (`settings-workspaces.html`, `alertdialog` + typed-name confirm, sole-owner row locked with a visible reason). Deriving from those two is a ****spec-only departure*** under Critical Rule #15 and must be ratified as a §5 row in `.context/design/master-design-plan.md` before implementation, together with the story's §8 US-to-Screen row. Do not invent a new destructive pattern; do not re-pick tokens.

## Provenance

Authored 2026-08-18 by the AI Product Owner profile, from `.context/SRS/non-functional-specs.md` §9 (Compliance) and the exclusion [https://jira.upexgalaxy.com/browse/BK-508#icft=BK-508](https://jira.upexgalaxy.com/browse/BK-508#icft=BK-508) recorded in its own Out Of Scope field, which named this story's three open questions and deferred them here.

---

## QA Refinements (Shift-Left Analysis) — Added 2026-08-22

> Refined Acceptance Criteria (6 new scenarios) live in the Acceptance Criteria (Gherkin) field. Full analysis lives in the Acceptance Test Plan (ATP) field and in the comment below.

### Edge Cases Identified

| ***Case**** | ****In original story?**** | ****Criticality**** | ****Action*** |
| --- | --- | --- | --- |
| Two tabs confirm delete simultaneously (double-submit race) | No | Low | Test only — existing idempotent-DELETE precedent likely covers it; N5 added to confirm |
| Concurrent write (ATC create / Bug file / invite accept) racing the deletion transaction | No | Medium | New scenario N1; needs Dev confirmation |
| Realtime Run-viewer subscribed mid-deletion | No | Medium | New scenario N3; needs Dev confirmation |
| Activity Stream entry vs. its own cascade-delete | Partially | High | New scenario N4; technical question for Dev |
| Notification fan-out trigger firing against a row about to cascade-vanish | No | Medium | Folded into N4 |
| Re-pointing target determinism | Partially | High | New scenario N2; precedent already exists in code (`resolveActiveWorkspaceId`, BR-1) |
| PAT/invite non-disclosure byte-for-byte parity | Yes (AC-13/AC-14) | High (testability) | Needs a dedicated fixture in-sprint |
| Sole-owner-count reaching zero transiently | No | Low | No action — unreachable today |
| Scripted repeated single-workspace delete calls | No | Low | No action — second call should 404 cleanly |
| Typed-name state across the export-offer round-trip | No | Low | New scenario N6 |

### Clarified Business Rules

- The re-pointing target for other affected members already has a shipped, deterministic resolver (`lib/workspaces/active.ts` `resolveActiveWorkspaceId`, BR-1 "oldest active membership first") reused from BK-90's Leave flow — the story does not currently cite it, and PO should confirm this story must reuse it rather than invent a new rule.
- PAT/invite refusal after workspace deletion must be byte-for-byte identical to the refusal for a token/invite that never existed (AC-13/AC-14) — existing uniform-refusal conventions (`requireBearerToken`, invite-accept route) strongly suggest this holds by construction, but it needs an explicit fixture, not a generic status-code assertion.

### Critical Questions for PO

1. Should the deletion's re-pointing of **other** affected members (AC-09/AC-11) explicitly reuse the existing "oldest active membership" resolver already shipped for [https://jira.upexgalaxy.com/browse/BK-90#icft=BK-90](https://jira.upexgalaxy.com/browse/BK-90#icft=BK-90), or is a different tie-break intended for this story?
2. Does the typed workspace-name confirmation need to persist across the export-offer round-trip (AC-06), or does it reset the way the plain dismiss-and-reopen path does in AC-05?

### Technical Questions for Dev

1. What is the intended outcome of a concurrent write (ATC creation, Bug filing, invite acceptance) against the workspace racing the DELETE transaction?
2. How is AC-17 ("recorded in the Activity Stream as it happens") verifiable given the Activity Stream itself is cascade-deleted by the same act?
3. What should a subscribed Realtime Run-viewer observe when its workspace is deleted mid-run?
4. Should the new `DELETE /api/v1/workspaces/[id]` route follow the existing idempotent-DELETE convention already used by `DELETE /api/v1/tokens/[id]`?

> Full refinement (Phases 1-5, outline DRAFT, risk + data feasibility) lives in the ATP DRAFT custom field and the canonical comment below.

### Definition of Done — Addendum (2026-08-23, AI Tech Lead)

- [ ] `RunnerView`'s Realtime effect distinguishes a transient refetch failure from a 404 caused by the run's workspace having been deleted: on that specific 404, show a toast ("This run's workspace was deleted") and redirect away, instead of the current silent no-op. Gap found during [https://jira.upexgalaxy.com/browse/BK-512#icft=BK-512](https://jira.upexgalaxy.com/browse/BK-512#icft=BK-512) shift-left refinement (Technical Question Q3) — required for this Story's own AC-08/AC-09 parity, not optional polish.

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

### Test Execution (1)

- [BK-987](https://jira.upexgalaxy.com/browse/BK-987): ATR: BK-512: Story Testing _(ACTIVE)_

### Defects (4)

- [BK-988](https://jira.upexgalaxy.com/browse/BK-988): Invite-accept non-disclosure parity broken for deleted-workspace tokens (AC-14) _(In Review)_
- [BK-988](https://jira.upexgalaxy.com/browse/BK-988): Invite-accept non-disclosure parity broken for deleted-workspace tokens (AC-14) _(In Review)_
- [BK-991](https://jira.upexgalaxy.com/browse/BK-991): Soft-deleted workspace: ATCs, Tests, Runs and Environments remain fully readable/actionable during the 30-day grace period (AC-07) _(In Review)_
- [BK-991](https://jira.upexgalaxy.com/browse/BK-991): Soft-deleted workspace: ATCs, Tests, Runs and Environments remain fully readable/actionable during the 30-day grace period (AC-07) _(In Review)_

### Storys (2)

- [BK-90](https://jira.upexgalaxy.com/browse/BK-90): TMS-Workspace | Leave a workspace _(Ready For QA)_
- [BK-508](https://jira.upexgalaxy.com/browse/BK-508): Settings | Request an export of my workspace data _(QA Approved)_

### Tech Story (1)

- [BK-993](https://jira.upexgalaxy.com/browse/BK-993): RunnerView: distinguish workspace-deleted 404 from transient network blip _(To Do)_

### Test Plan (1)

- [BK-986](https://jira.upexgalaxy.com/browse/BK-986): ATP: BK-512: TMS-Workspace | Delete a workspace I own _(Planning)_

### Test Set (1)

- [BK-985](https://jira.upexgalaxy.com/browse/BK-985): ATS: BK-512: TMS-Workspace | Delete a workspace I own _(Designing)_

---

## Metadata

- **Created:** 2026-08-19
- **Updated:** 2026-09-11
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** shift-left-2026-08-22, shift-left-reviewed

---

_Synced from Jira by sync-jira-issues_
