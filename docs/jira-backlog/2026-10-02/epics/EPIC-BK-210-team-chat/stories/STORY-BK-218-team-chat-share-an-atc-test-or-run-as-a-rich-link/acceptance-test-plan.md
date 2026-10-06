# BK-218 — Acceptance Test Plan (QA)

> Jira field: `customfield_10137` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-218)

# Shift-Left Refinement: BK-218 — Team Chat | Share an ATC, Test, or Run as a Rich Link

***Status***: Refined — Awaiting PO Estimation  
***Mode***: Shift-Left (pre-sprint)  
***Refined on***: 2026-09-28  
***Modality***: jira-xray (no Xray item is created pre-sprint)

## Phase 1 — Critical Analysis

### Business context

- ***Primary persona***: Elena Vargas, Senior QA Engineer; she shares test evidence in the chat panel.
- ***Secondary personas***: Sara Iglesias consumes references; Mateo Silva needs accurate, permission-safe quality context.
- ***Value***: Keep QA discussion connected to ATCs, Tests, and Runs without manual ID or screenshot handoffs.
- ***KPI***: No direct quantitative KPI is defined for BK-218.
- ***Journey***: Compose a channel message, then render and follow an entity reference.

### Technical context

- Team Chat panel, message persistence, composer picker, and rich-link resolver are not implemented in the target code reviewed.
- ATC execution is projected from authorized `run_atcs` positions per Jira decision 12976; never use stale `atcs.status`.
- Run cards use persisted `runs.status` only (`running|passed|failed|aborted`); `blocked` is position-level (decisions 12977–12978).
- Tests need a persisted and authorized Automation Status source; none was found. No Run fallback is allowed (decision 12975).
- All entity resolution must enforce channel membership and Project access before exposing details.

### Story complexity

| Axis | Rating | Why |
| --- | --- | --- |
| Business logic | High | Three separate entity state models and visibility outcomes. |
| Integration | High | Hard dependency on BK-215 plus ATC/Test/Run entity readers. |
| Data validation | High | Supported, unsupported, malformed, unavailable, and inaccessible references differ. |
| UI | Medium | Cards, picker, keyboard selection, navigation, and stable placeholders; design exists. |

***Estimated test effort***: High; coverage outline count is not a delivery estimate.

### Epic-level inheritance

- BK-215 is the hard channel/message prerequisite. BK-13, BK-24, and BK-30 are supporting entity dependencies.
- Target master design §4.14 records Team Chat as not built; mockups are design evidence only.
- Product/technical state rules are captured in AI-attributed Jira comments 12975–12979, not human sign-off.

## Phase 2 — Story Quality Analysis

### Clarifications applied

- ATC = Execution Status; Test = Automation Status; Run = persisted Run-level status.
- Run labels: Running, Passed, Failed, Aborted. A blocked child position is never promoted to a Run verdict.
- ATC source: newest authorized Run by `started*at DESC, id DESC`; repeated ATC position by `position DESC, run*atcs.id DESC`; a running parent Run maps to `running`, otherwise map its selected position; no row maps to `unrun`.
- Malformed reference syntax remains plain text without resolver lookup. A valid supported reference whose entity is missing/archived displays an inert unavailable placeholder (decision 12979).
- State is current at render time; no live update to an already-mounted card is required.

### Gaps and implementation prerequisites

| # | Gap | Required pre-work | Risk |
| --- | --- | --- | --- |
| 1 | No persisted Test Automation Status source was found. | Implement an authorized field/read source for `manual-only`, `candidate`, `automated`; never substitute latest Run. | Test cards cannot meet the approved contract. |
| 2 | BK-215 channel/message foundation is absent from target code. | Ship channel and durable message support before BK-218 integration. | No supported chat surface for references. |
| 3 | Rich-link resolver and picker read path are absent. | Enforce channel membership and Project access before returning titles/status; filter picker results. | Entity metadata disclosure. |

### Testability validation

***Verdict***: Partial. Run/ATC sources and deterministic rules are available; Test Automation Status and chat resolver remain implementation prerequisites. The exact refined Given/When/Then criteria are stored in the Story's dedicated Acceptance Criteria field; the ATP lists their coverage outlines below.

## Phase 3 — Refined Acceptance Criteria

The Gherkin criteria were published separately in the Acceptance Criteria field. They cover:

1. Each persisted Run state and Run-level/position-level separation.
2. ATC state from the latest authorized `run_atcs` position, with deterministic tie-breaks and `unrun` when absent.
3. Test Automation Status, blocked until a persisted source is implemented.
4. Authorized navigation and non-disclosing restricted placeholders, including picker search.
5. Deleted/archived unavailable placeholders preserving message text.
6. Picker insertion, multiple references, unsupported links, malformed syntax, missing entities, and render-time freshness.

## Phase 4 — Test Outlines (outline names only)

### Coverage estimate

| Type | Count | Notes |
| --- | --- | --- |
| Positive | 9 | Four Run states, ATC projection, three Test statuses, multiple references. Test status cases are data-blocked. |
| Negative | 7 | Restricted, picker filtering, unsupported, malformed, missing, inert reference behavior. |
| Boundary | 9 | ATC position mappings, no row, ordering, deletion/archive. These are state partitions, not numeric BVA. |
| Integration | 5 | Message persistence, picker, authorization, freshness, navigation. |
| API | 0 | No resolver API contract exists in source yet. |
| ***Total**** | ****30*** | 9 + 7 + 9 + 5 + 0; estimates only, not executed tests. |

### Positive

- ***Should render a running Run card for an authorized Project member*** — Pre: authorized reader; `runs.status=running`. Expected: Test title, environment, “Running”.
- ***Should render a passed Run card for an authorized Project member*** — Pre: `runs.status=passed`. Expected: Test title, environment, “Passed”.
- ***Should render a failed Run card for an authorized Project member*** — Pre: `runs.status=failed`. Expected: “Failed” from Run header.
- ***Should render an aborted Run card for an authorized Project member*** — Pre: `runs.status=aborted`; child states may remain. Expected: “Aborted”, not “Blocked”.
- ***Should render pass from the selected latest ATC position*** — Pre: latest Run is failed; duplicate position winner is passed. Expected: ATC status `pass`.
- ***Should render a Test card with manual-only Automation Status*** — Pre: authorized Test source returns `manual-only`. Expected: title and `manual-only`; blocked until source exists.
- ***Should render a Test card with candidate Automation Status*** — Pre: authorized Test source returns `candidate`. Expected: title and `candidate`; blocked until source exists.
- ***Should render a Test card with automated Automation Status*** — Pre: authorized Test source returns `automated`. Expected: title and `automated`; blocked until source exists.
- ***Should render one card per supported reference in a message*** — Pre: text plus ATC, Test, and Run refs. Expected: separate cards and intact text.

### Negative

- ***Should show a restricted placeholder to a reader without Project access*** — Pre: visible channel, inaccessible Project. Expected: neutral placeholder with no entity metadata.
- ***Should omit inaccessible entities from picker results*** — Pre: mixed accessible/inaccessible matches. Expected: only accessible details appear.
- ***Should keep an unsupported external URL as a plain link*** — Pre: arbitrary external URL. Expected: no preview.
- ***Should keep an unsupported Bunkai entity reference as plain text or link*** — Pre: User Story, AC, Module, or Bug reference. Expected: no rich card.
- ***Should leave malformed reference syntax as ordinary text*** — Pre: malformed identifier syntax. Expected: resolver is not invoked; nearby content remains.
- ***Should show a valid missing entity as unavailable*** — Pre: valid supported ID no longer resolves. Expected: inert “No longer available” placeholder.
- ***Should keep a restricted placeholder inert*** — Pre: reader lacks Project access. Expected: click/keyboard reveals no route or details.

### Boundary and state partitions

- ***Should show ATC running when its selected latest Run is running*** — Pre: selected Run running, position pending. Expected: ATC status `running`.
- ***Should map pending position to unrun when selected Run is not running*** — Pre: selected position pending. Expected: `unrun`.
- ***Should map passed position to pass*** — Pre: selected position passed and parent Run not running. Expected: `pass`.
- ***Should map failed position to fail*** — Pre: selected position failed and parent Run not running. Expected: `fail`.
- ***Should map blocked position to blocked without changing Run verdict*** — Pre: selected position blocked. Expected: ATC status blocked; Run card uses Run header only.
- ***Should map skipped position to skipped*** — Pre: selected position skipped and parent Run not running. Expected: `skipped`.
- ***Should show unrun when no applicable position exists*** — Pre: no `run_atcs` row. Expected: `unrun`; stale `atcs.status` ignored.
- ***Should select the newest Run and duplicate position deterministically*** — Pre: repeated ATC across Runs and positions. Expected: documented timestamp/id then position/id ordering.
- ***Should render deleted or archived ATC/Test references as unavailable*** — Pre: entity deleted/archived. Expected: inert placeholder and intact surrounding text.

### Integration

- ***Should resolve a pasted supported reference from a persisted channel message*** — Pre: BK-215 message foundation exists and reader is authorized. Expected: current authorized card on render.
- ***Should insert a picker result at the composer caret by keyboard*** — Pre: accessible match selected. Expected: arrow/Enter insertion; Escape dismissal.
- ***Should enforce channel and Project access before returning entity details*** — Pre: reader can see channel but not entity Project. Expected: restricted placeholder only.
- ***Should show current state on a new render without live mounted updates*** — Pre: entity changed after posting. Expected: next render shows latest state.
- ***Should navigate from an authorized resolved card*** — Pre: available entity and Project access. Expected: correct entity opens; placeholders have no destination.

## Phase 5 — Edge Cases

| # | Edge case | Criticality | Outcome |
| --- | --- | --- | --- |
| 1 | Multiple supported refs | High | One card per ref; preserve surrounding text. |
| 2 | Unsupported external/Bunkai entity | Medium | Plain link/text; no preview. |
| 3 | Malformed syntax vs valid missing entity | Medium | Plain text vs unavailable placeholder (decision 12979). |
| 4 | Unauthorized reader | Critical | Restricted, inert, non-disclosing card and picker. |
| 5 | Deleted or archived ATC/Test | High | Unavailable placeholder; preserve message text. |
| 6 | No ATC execution position | High | `unrun`; never read stale `atcs.status`. |
| 7 | Duplicate ATC position / tied Runs | High | Deterministic latest Run/position order. |
| 8 | Running Run / blocked child result | Critical | Keep Run and position state grains separate. |
| 9 | Test Automation Status source missing | Critical | Data-feasibility blocker; no Run fallback. |
| 10 | State changes after message post | High | Fresh on next render; no mounted live updates. |

## Story Quality Assessment

***Verdict***: Needs Improvement. Product status semantics are resolved, but the Test Automation Status source, BK-215 foundation, and entity resolver remain pre-implementation requirements.

## Critical Questions for PO

None identified. Product behavior decisions are AI-authored Jira comments, not human sign-off.

## Technical Questions for Dev

1. Add a persisted and authorized Test Automation Status source; no latest-Run fallback.
2. Implement a server-side entity resolver/picker that checks channel and Project access before returning details.
3. Preserve entity type/identifier so deleted/archived ATCs/Tests can resolve to placeholders without losing message text.

## Data feasibility flags

***DATA-FEASIBILITY-RISK******:****** true.*** BK-215 is the hard channel/message dependency; Test Automation Status has no persisted/read source; BK-218 resolver/picker is not implemented. The ATC and Run data sources exist, but no chat integration does.

## Recommended testing strategy

- ***Pre-implementation***: implement Test Automation Status source; ship BK-215; define server-side access checks.
- ***During implementation***: cover Run/ATC state mapping, picker access filtering, multiple refs, unsupported/malformed input, and stable unavailable placeholders.
- ***Post-implementation***: test authorized/restricted users, navigation, render freshness, and full channel integration after BK-215 ships.

## Risks & mitigation

| Risk | Likelihood | Impact | Coverage |
| --- | --- | --- | --- |
| Entity title/state leaks through card or picker | Medium | Critical | Negative access cases; Integration authorization case. |
| Position `blocked` becomes Run verdict | Medium | Critical | Run/ATC status-grain cases. |
| Stale/wrong ATC execution result | High | High | Latest-run, duplicate-position, no-row cases. |
| Test card uses missing or substituted Automation Status | High | High | Three Test-status outlines; data-feasibility gate. |
| BK-218 starts before BK-215 | High | High | Integration outlines and hard dependency. |

## Next steps

- Dev resolves the Test Automation Status source and permission-checked resolver/picker.
- BK-215 ships channel/message foundation before BK-218 integration.
- In-sprint `/sprint-testing` expands these outlines after dependencies are available.

---
_Synced from Jira by sync-jira-issues_
