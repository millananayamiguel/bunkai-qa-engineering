# TMS-Run Execution | Drive step verdicts and bug filing from the keyboard

**Jira Key:** [BK-600](https://jira.upexgalaxy.com/browse/BK-600)
**Epic:** [BK-30](https://jira.upexgalaxy.com/browse/BK-30) (Manual Execution & Runs)
**Type:** Story
**Status:** Backlog
**Priority:** Medium
**Story Points:** -

---

## Overview

## User story

******As a**** **Senior QA Engineer*
**********I want to****** ****set a step verdict, move to the next step, and open the Report-bug dialog without lifting my hands from the keyboard***
**So that**** walking a Run stops costing me a mouse round-trip per step while I am already switching between two browser windows

## Definition of done

- [ ] Feature works end-to-end against staging
- [ ] Covered by an ATC chain anchored to a User Story + Acceptance Criterion
- [ ] Acceptance Criteria verified by QA
- [ ] Demoed to the team

## Why this story exists

Executing a Run is a two-window job. The tester drives the product under test in one window and records what happened in Bunkai in the other. Every verdict today costs a mouse trip: find the step, click Pass, then click "Mark passed" in the form that opens. On a forty-step Run that is eighty deliberate pointer movements interleaved with the actual testing, and each one is a chance to record a verdict against the wrong row.

The written record identified this pain and named the fix years before the runner was built. The runner shipped without it.

## What the written record already committed to

| ***Source**** | ****Commitment*** |
| --- | --- |
| `.context/PRD/user-journeys.md:91` | the pain, verbatim: "Tab-switching is constant. Mitigation: keyboard shortcuts (P/F/B for pass/fail/block + Enter for next step) keep hands on keyboard" |
| `.context/PRD/user-journeys.md:96` | "Severity selection is friction. Mitigation: keyboard shortcuts 1-4 set severity directly" |
| `.context/PRD/user-personas.md:37` | the protagonist persona is a "Power-user of keyboard shortcuts, command palettes" |
| `.context/business/business-data-map.md:351` | the defect-filing flow already documents "User picks severity (P1-P4 keyboard shortcuts)" as a step in the journey |
| `.context/designs/bunkai-test-management-tool/project/screens/run.jsx:212-214` | the three verdict buttons carry a `kbd` prop — `kbd="P"`, `kbd="F"`, `kbd="B"` — so the key badge is drawn onto the control itself |
| `.context/designs/bunkai-test-management-tool/project/screens/run.jsx:248` | the footer legend is drawn in full: P pass · F fail · B block · Cmd+Enter next step · Cmd+B bug |
| `.context/design/master-design-plan.md:200` | the frozen §4.5 Test Runner spec requires both halves: "Pass / Fail / Block verdict buttons (P/F/B kbd)" and "keyboard footer (P/F/B/Cmd+Enter/Cmd+B)" |

Two functional specs are touched and neither is extended: `BK-020 Report step result` and `BK-025 File Bug` keep exactly the contracts they have. This story adds an input modality over both, which is why no single spec is named as the source.

## Why it was never built

`BK-35`'s implementation plan ratified the omission out loud, in divergence `D-UI-1`: **"Mockup's keyboard shortcuts (P/F/B, cmd+enter, cmd+B) have no AC/DoD backing — not planned, fair game as a follow-up."** This ticket is that follow-up, and it exists to supply the AC backing that was missing.

The same divergence ratified a second thing that constrains this story: the live runner **"renders the full checklist flat"** instead of the mockup's single-active-step wizard. That ratification stands. This story does not reopen it.

## Current state (verified at `origin/staging`)

| ***Fact**** | ****Evidence*** |
| --- | --- |
| The runner has zero keyboard handling | `components/runs/RunnerView.tsx` — no `onKeyDown`, no `keydown` listener, no `tabIndex`, no `aria-current` anywhere in 1250 lines |
| There is no focused-step cursor to attach a key to | the component's entire state list holds no cursor; the closest value is `markStepId`, which means "whose form is open", is null the rest of the time, and only ever moves on an explicit click |
| Steps are nested per-ATC, not globally numbered | each ATC renders its own ordered list with per-ATC positions, so "03" appears once per ATC and no global step index exists in the page |
| A verdict already costs two interactions | clicking Pass, Fail or Block only opens an inline form; the commit is a second click on a button labelled "Mark passed" / "Mark failed" / "Mark blocked" |
| Note and evidence on a step result are both optional | the two fields are labelled "Note (optional)" and "Evidence link (optional)" and nothing blocks an empty submit |
| Reporting a bug is already restricted to failed steps | the per-step "Report bug" button renders only when the actor may report and the step's status is `failed` |
| Severity in the Report-bug dialog is a four-button group | `P1 · Critical`, `P2 · Major`, `P3 · Minor`, `P4 · Trivial`, always pre-set, never empty |
| The page is full of places a keypress could land wrongly | three text fields on the runner itself, six more on the Report-bug dialog, and three overlays — abort, finish, report-bug — none of which trap focus or close on Escape |
| A verdict cannot be taken back | the mark endpoint accepts only `passed`, `failed` and `blocked`; there is no return path to `pending` and no un-mark control |

That last row is the reason this story does not make a bare keypress commit a verdict outright — see the decision comment on this ticket.

## Decisions already taken on this ticket

Two questions had to be answered before an implementer could start, and both are answered in `AI Product Owner` decision comments on this ticket, each with the alternatives scored:

1. ***Does the runner gain a focused-step cursor, and does a verdict key commit or open the form?*** Answered: yes to the cursor, and the key opens the existing form pre-set to that verdict rather than committing.
2. ***Which key advances to the next step, and what does "next" mean on a flat checklist?*** Answered: Cmd+Enter (Ctrl+Enter off Mac), advancing in document order.

Read both before planning. Neither is open.

## Three amigos — edge cases raised

| ***#**** | ****Edge case**** | ****Ruling*** |
| --- | --- | --- |
| 1 | The tester types "4 items are broken" into the bug title, which is autofocused when the dialog opens | The digit must land in the title. Severity keys are inert whenever focus sits in any text field — this is the single most likely way to file a bug at the wrong severity |
| 2 | The tester types "Payment fails on submit" into the step note field | `P`, `F` and `B` must land as characters. Verdict keys are inert whenever focus sits in a text field |
| 3 | The abort or finish confirmation is open and the tester presses `P` | Nothing happens. No runner shortcut fires while any overlay is open |
| 4 | The tester presses Cmd+P intending to print | The browser prints. A bare verdict key never fires while a modifier is held |
| 5 | The focused step is not failed and the tester presses Cmd+B | Nothing is filed. The shortcut obeys the same eligibility rule the visible button obeys, and says so briefly rather than failing silently |
| 6 | Cmd+Enter is pressed on the last step of the last ATC | No-op. The cursor does not wrap to the top; wrapping would silently restart a Run the tester believes they finished |
| 7 | The Run is already finished or aborted, or the actor may not mark | Verdict keys are inert, exactly as the buttons are. Cmd+B still works on a failed step, exactly as the button does |
| 8 | A second tester marks a step in another window while this tester's cursor sits on it | The cursor stays where it is. It is a local view concept and never moves because of somebody else's action |
| 9 | The tester is using a screen reader | The focused step is announced as the current step, not signalled by colour alone |
| 10 | A non-QWERTY or non-Latin keyboard layout | The binding is by physical key position, so the P/F/B row works on layouts where those characters sit elsewhere |
| 11 | The tester deep-links to a step from a filed bug, which already draws its own highlight ring | Two different rings can land on the same step. They must remain distinguishable — the cursor is not the linked-bug highlight |

## Mockup coverage

Both halves of this story are drawn, and nothing here is invented:

- per-control key badges — `run.jsx:212-214`
- footer legend — `run.jsx:248`
- the frozen screen spec that requires both — `master-design-plan.md:200`

There is no drawn help overlay, no drawn shortcut-settings surface and no drawn remapping control, so none of those is in scope.

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

## Metadata

- **Created:** 2026-08-24
- **Updated:** 2026-08-31
- **Reporter:** Ely
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_
