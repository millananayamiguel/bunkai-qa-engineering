# Team Chat | Share an ATC, test, or run as a rich link

**Jira Key:** [BK-218](https://jira.upexgalaxy.com/browse/BK-218)
**Epic:** [BK-210](https://jira.upexgalaxy.com/browse/BK-210) (Team Chat)
**Type:** Story
**Status:** Ready For Dev
**Priority:** Medium
**Story Points:** 8

---

## Overview

## User story

As Elena Vargas, a Senior QA Engineer, I want to share an ATC, a Test, or a Run in chat as a rich link, so that teammates see what I am talking about — title and current state — without me copy-pasting screenshots or IDs.

## Context

Chat about QA work constantly references the work itself: "this ATC is flaky", "look at this Run". A bare URL forces every reader to click through; a rich link answers the question in place. This story makes a pasted or inserted reference to an ATC, Test, or Run render as a rich card showing the entity's title and its status or verdict, linking to the entity. Cards respect the viewer's permissions and degrade gracefully when the entity is gone. It builds on the entity models shipped in the ATC Library (epic [BK-13](https://jira.upexgalaxy.com/browse/BK-13)), Tests (epic [BK-24](https://jira.upexgalaxy.com/browse/BK-24)), and Manual Execution & Runs (epic [BK-30](https://jira.upexgalaxy.com/browse/BK-30)), and activates once the workspace channel story is live.

---

## QA Refinements (Shift-Left Analysis) — Added 2026-09-28

> Refined Acceptance Criteria are in Jira's Acceptance Criteria field. The full ATP is in the Acceptance Test Plan field.

### Edge Cases Identified

- One message contains multiple ATC, Test, and Run references; each supported reference renders independently and surrounding text remains intact.
- Unsupported external URLs and unsupported Bunkai entities remain plain links/text without previews.
- Malformed reference syntax remains plain text; a valid supported reference to a missing or archived entity displays an inert unavailable placeholder.
- A reader without Project access sees no entity title, identifier, Project, environment, status, or result count through either card rendering or picker search.
- ATC execution status is derived from the latest authorized Run position using the ordering and mapping recorded in Jira comments 12976; stale `atcs.status` is not used.
- Run cards use the persisted Run status only; a `blocked` child position is not promoted to a Run verdict.
- Entity state is refreshed when a message is rendered again; live updates while the message remains mounted are out of scope.
- Deleted/archived ATCs and Tests show inert unavailable placeholders while preserving message text.

### Clarified Business Rules

- ATC cards show Execution Status; Test cards show Automation Status; Run cards show Run-level status. Do not conflate these entity-specific states.
- Run-level status values are `running`, `passed`, `failed`, and `aborted`. Position-level `blocked` remains separate.
- Test Automation Status has no persisted source/read path identified and requires Dev pre-work; do not substitute latest Run status.
- BK-215 is the hard implementation dependency for channel/message persistence. BK-13, BK-24, and BK-30 provide supporting entity data.

### Critical Questions for PO

None identified. AI-authored decisions 12975–12979 resolve the current product semantics; these are not human PO sign-off.

### Technical Questions for Dev

1. Implement a persisted, authorized Test Automation Status read source for Test cards; no latest-Run fallback is permitted.
2. Implement the permission-checked rich-link resolver and picker read path, enforcing channel membership and Project access before entity details are disclosed.
3. Implement persistent entity references that resolve deleted/archived ATCs and Tests to unavailable placeholders without losing surrounding message text.

> Full refinement, coverage outlines, data feasibility, and the test-design checklist are in the Acceptance Test Plan field.

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

- [BK-215](https://jira.upexgalaxy.com/browse/BK-215): Team Chat | Chat with workspace members in a real-time channel _(Ready For Dev)_

### Epics (3)

- [BK-13](https://jira.upexgalaxy.com/browse/BK-13): ATC Library (Acceptance Test Cases) _(Planning)_
- [BK-24](https://jira.upexgalaxy.com/browse/BK-24): Tests (chains of ATCs) _(Planning)_
- [BK-30](https://jira.upexgalaxy.com/browse/BK-30): Manual Execution & Runs _(Planning)_

---

## Metadata

- **Created:** 2026-07-11
- **Updated:** 2026-10-01
- **Reporter:** Ely
- **Assignee:** Miguel Millan
- **Labels:** shift-left-2026-09-28, shift-left-reviewed

---

_Synced from Jira by sync-jira-issues_
