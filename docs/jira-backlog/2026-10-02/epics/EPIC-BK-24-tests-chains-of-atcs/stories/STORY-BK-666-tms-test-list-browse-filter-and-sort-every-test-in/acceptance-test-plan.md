# BK-666 — Acceptance Test Plan (QA)

> Jira field: `customfield_10137` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-666)

# Shift-Left Refinement: BK-666 — TMS-Test List | Browse, filter and sort every Test in a Project

***Status***: Refined — Awaiting PO Estimation
***Mode***: Shift-Left (pre-sprint, batch of 1)
***Refined on***: 2026-09-08
***Refined by***: QA — Benjamin Segovia
***Modality***: Xray

---

## Phase 1 — Critical Analysis

### Business context

- ***Primary persona affected***: Elena Vargas, Senior QA Engineer
- ***Secondary personas (if any)***: Viewer-role Workspace members (read-only access, per AC-08)
- ***Business value proposition***: closes the gap named in `user-journeys.md:79` — today there is no way to see a Project's Tests as a filterable, sortable list; QA has to scan the explorer rail one Test at a time before a deploy
- ***KPI(s) influenced***: time-to-find-a-Test before executing a regression run
- ***User journey position***: Journey 2, Step 1 — "Opens the Project, switches to Table View, filters tests tagged 'smoke', clicks TEST-008" (currently unreachable — Table View is ATC-only)

### Technical context

- ***Frontend***: `app/(app)/projects/[projectSlug]/layout.tsx` (server component, resolves the Test set once), `project-explorer.tsx` (renders the explorer's Tests group), `workbench-context.tsx` (shares `filteredTestIds` state), `test-tag-filter.tsx` (tag input, debounced fetch)
- ***Backend***: no new endpoint — reuses the existing Supabase read in `layout.tsx` and the existing `GET /api/v1/tests?tag=` route for tag lookups
- ***External services***: none
- ***Integration points specific to this Story***: Project sub-nav (new section entry, precedent: `[QA] Shift-Left Review`-style entries already exist for ATCs/Runs/Bug Reports), the ATC table's existing client-side sort (cited as precedent in the Story's own Dev comment)

### Story complexity

| Axis | Rating | Why |
| --- | --- | --- |
| Business logic | Low | No new business rule — pure presentation over an already-resolved set |
| Integration | Medium | New sub-nav surface + reused filter/sort plumbing, but no new fetch |
| Data validation | ***High*** | See Phase 2 §Gaps — the "Project's Tests" boundary this Story's title promises does not exist at the data layer today |
| UI | Medium | New table view, 4 discriminable states, sort × filter composition |

***Estimated test effort***: 10 ACs × 1:N (state-discrimination and filter/sort composition each imply 3+ scenarios) → roughly 24-30 outlines before boundary/negative variants. See Phase 4 coverage estimate.

### Epic-level inheritance (if applicable)

- Risks restated at Story level: none — BK-24 (Tests, chains of ATCs) has no other Story yet carrying the workspace-vs-project scoping question forward.
- Integration points inherited: the explorer's Tests group (BK-27) and its tag filter (BK-33) are both inherited as-is, bugs included — see Phase 2.
- PO/Dev answers already given at epic level: none applicable.
- Test strategy inherited: none — this is the first Story to expose Tests as a standalone list surface.

---

## Phase 2 — Story Quality Analysis

### Ambiguities

| # | Location in Story | Question for PO/Dev | Impact on testing | Suggested clarification |
| --- | --- | --- | --- | --- |
| 1 | AC-02 "the same Tests, in the same scope, as the Project explorer's Tests group" | Does "the Project's Tests" mean **tests scoped to this project** or **tests visible in this project's explorer, whatever that currently resolves to**? | Determines whether QA tests for project-scoping (which would fail) or for workspace-parity (which would pass but contradicts the Story title) | Confirm explicitly which of the two readings PO wants asserted — see Critical Question #1 below |

### Gaps (missing info)

| # | Type | Why critical | What to add | Risk if omitted |
| --- | --- | --- | --- | --- |
| 1 | Data model | `tests` has no `project*id` column (confirmed: `layout.tsx:92-95` filters `.eq('workspace*id', activeWorkspaceId)` only; `GET /api/v1/tests?tag=` is documented in its own code comment as "workspace-scoped"). A "Project's Tests list" is not a query that exists yet — it is, byte for byte, "the Workspace's Tests list" | State plainly in the Story (not just in a linked Defect) that AC-02/AC-04/AC-07 currently resolve to workspace scope, and that this is a deliberate, temporary acceptance — not an implementation detail left to the plan | Dev builds exactly to spec and ships a "Project Tests" page that, on every Project in a workspace, lists every Test in that workspace. QA cannot fail this against AC-02/AC-04/AC-07 as worded even though it contradicts the Story's own summary line |

### Edge cases not in Story

None beyond what Ely's authoring-time pass already enumerated (see the Story's own comment, 20 edge cases, E1-E20). This refinement does not duplicate that table — it escalates one entry already in it.

***Escalation of E15**** ("A Test currently exposed to the wrong Project (the open attribution defect)"): E15 frames this as an occasional, defect-shaped case ("a Test currently exposed to the wrong Project"). The code read in this refinement shows it is not occasional — it is the unconditional behavior of the only query the Story reuses. Recommend re-labeling E15's disposition from "the list shows what the Project already exposes" to explicitly acknowledging: **every** Test in the workspace is "exposed" to **every* Project today, not a subset with occasional leaks.

### Contradictions

The Story's own summary line — "Browse... every Test ***in a Project****" — is not satisfiable by the query it is scoped to reuse, which returns every Test in the ****Workspace***. AC-02 and AC-07 do not contradict each other (both correctly describe reusing the explorer's existing scope), but the Story's title/business framing contradicts what AC-02/AC-07 actually assert once the underlying query is read. This is not visible from the Jira text alone — it only surfaces by reading `layout.tsx` and the tag-filter route, which is exactly the light feasibility check this phase exists to do.

### Testability validation

***Verdict***: Partial

- AC-02, AC-04, AC-07 are internally testable (QA can assert "shows the same set as the explorer, tag-filter included") but that assertion is not testable **against the Story's own summary line** — a strict reading of "browse every Test in a Project" has no passing implementation possible today, so a naive tester could fail a technically-compliant build.
- All other ACs (AC-01, AC-03, AC-05, AC-06, AC-08, AC-09, AC-10) are clearly testable as written.

---

## Phase 3 — Refined Acceptance Criteria

### Original AC-02 — The list renders every Test in the Project

#### Scenario 2.1: Should list every Test the explorer's Tests group currently exposes, workspace-wide (Type: Positive, Priority: High)

- ***Given***: a Workspace with 3 Projects, where Project A has 2 Tests, Project B has 1 Test, and Project C has 0
- ***When***: I open Project A's Tests list
- ***Then***: the list shows all 3 Tests (A's 2 + B's 1), matching exactly what Project A's explorer Tests group already shows

#### Scenario 2.2: Should show the exact same set on every Project in the Workspace (Type: Positive, Priority: High — cross-check of 2.1)

- ***Given***: the same Workspace as 2.1
- ***When***: I open Project B's Tests list and then Project C's Tests list
- ***Then***: both show the identical 3-Test set and identical count as Project A's list

#### Scenario 2.3: Should state the count truthfully relative to the (workspace-wide) set (Type: Positive, Priority: Medium)

- ***Given***: a Workspace holding twelve Tests total, however distributed across its Projects
- ***When***: I open any one Project's Tests list with no filter active
- ***Then***: the list says "showing twelve Tests" — not "twelve Tests in this Project"

### New scenarios surfaced from Phase 2 — NEEDS PO/DEV CONFIRMATION

#### Scenario E1: Should scope the list to the current Project only, once BK-620 lands (Type: Edge, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: this is the reading the Story's summary line implies, and it is explicitly the one this Story's AC-07 defers to a future fix rather than asserting now
- ***Given***: BK-620 is fixed and `tests` carries a resolvable `project_id`
- ***When***: I open a Project's Tests list
- ***Then***: only that Project's own Tests appear — confirms AC-07's "corrects with it" promise actually holds once the upstream fix ships (worth a placeholder outline now so Stage 4/5 can pick it up post-fix without re-deriving it)

---

## Phase 4 — Test Outlines (outline names only)

### Coverage estimate

| Type | Count | Notes |
| --- | --- | --- |
| Positive | 9 | List render, count, sort, tag filter happy paths, navigation |
| Negative | 3 | Tag lookup failure, retry, no silent fallback |
| Boundary | 5 | Zero Tests, zero-chain Test, tag-casing, 200-char title, tie-break sort |
| Integration | 4 | Explorer-parity (2.1/2.2 above), workbench filter-state persistence, cross-Project scope re-resolve |
| ***Total**** | ****21*** | Does not include the E1 placeholder above (post-BK-620, not executable today) |

***Rationale***: 10 ACs, 3 of which (AC-02, AC-04, AC-05) each imply 3+ scenarios by the 1:N default (state discrimination, filter×sort composition, casing/reserved-tag rules). AC-09's four near-identical states are the single highest-value cluster to over-test, since confusing them is the Story's own named top risk.

### Outline list (NAMES ONLY)

#### Positive

- ***Should list a Project's Tests section reachable from the sub-nav*** — Pre: Project exists. Expected: "Tests" entry present, navigates to the list, marked current while inside it (AC-01).
- ***Should show name, chain length, tags and created-at per row*** — Pre: a Test chains 7 ATCs, tagged "smoke". Expected: all four fields readable on its row (AC-03).
- ***Should show chain length zero honestly, not hidden*** — Pre: a Test with an empty chain. Expected: row renders with "0" (AC-03).
- ***Should narrow the list via the Project's existing tag control*** — Pre: mixed tagged/untagged Tests. Expected: only tagged-matching rows shown, one shared control with the explorer (AC-04).
- ***Should match a reserved suite tag regardless of casing*** — Pre: Test tagged "smoke". Expected: filtering by "Smoke" still matches (AC-04).
- ***Should clear the filter back to the full set*** — Pre: filter active. Expected: full list + full count restored (AC-04).
- ***Should sort by a column and reverse on repeat click*** — Pre: several Tests. Expected: ascending then descending order (AC-05).
- ***Should sort the whole filtered set, not just the visible page*** — Pre: more Tests than fit one screen. Expected: first row is the true min across the full set (AC-05).
- ***Should open a Test's own detail view from its row*** — Pre: a named Test. Expected: lands on that Test's chain view (AC-06).

#### Negative

- ***Should show a named failure with retry when the tag lookup fails*** — Pre: lookup endpoint errors. Expected: explicit failure state, retry control, no silent unfiltered fallback (AC-09).
- ***Should not offer create/edit/delete affordances to a viewer*** — Pre: viewer-role member. Expected: read + open only (AC-08).
- ***Should not gain a Tests mode on the workbench Tree/Table/Mind-map toggle*** — Pre: this Story shipped. Expected: Table View still ATC-only (AC-10).

#### Boundary

- ***Should show an explicit "no Tests yet" state, not an error, for a Project's Test set of zero*** — note: given the scoping gap in Phase 2, "zero" here means zero at Workspace level, not Project level (AC-09).
- ***Should distinguish "no Test carries this tag" from "no Tests yet"*** — Pre: Tests exist, none match the filtered tag. Expected: visibly distinct copy (AC-04/AC-09).
- ***Should render a Test title at the 200-character storage limit without breaking layout*** — (E9 from Ely's edge-case table).
- ***Should keep sort order stable when many rows tie*** — Pre: identical chain lengths. Expected: no reshuffle on re-render (E10).
- ***Should show a loading state, never partial rows as final*** — Pre: slow Tests fetch (AC-09).

#### Integration

- ***Should show the identical set and count across every Project in the Workspace*** — direct test of Scenario 2.2 above; this is the outline that makes the scoping gap observable and reportable, not just theorized.
- ***Should keep the tag filter applied when navigating back from a Test's detail view*** — (AC-06, E12).
- ***Should re-resolve the list when the active Project is switched*** — Pre: list open, Project switched. Expected: no filter-state leakage across Projects (E16).
- ***Should never show a Test from a Workspace the user is not a member of*** — (AC-08, E14).

> Parametrization tables, per-outline test-data JSON, and numbered steps deferred to `/sprint-testing` Stage 1 per shift-left scope.

---

## Phase 5 — Edge Cases (outline)

| # | Edge case | In original Story? | Criticality | Action |
| --- | --- | --- | --- | --- |
| 1 | List is workspace-scoped, not project-scoped, on every Project (escalation of Ely's E15) | Yes, but framed as an occasional leak rather than the query's default behavior | ***Critical*** | Escalate to PO before sprint planning — see Critical Question #1 |
| 2-20 | Ely's E1-E14, E16-E20 | Yes | As already dispositioned in the Story's comment | No further action — already mapped to ACs or marked test-only |

---

## Story Quality Assessment

***Verdict***: Needs Improvement

***Key findings***:

- The Story is unusually well-authored (Given/When/Then ACs, 20 pre-enumerated edge cases, a documented Three Amigos pass) — most of what a shift-left session normally has to surface by itself was already done at authoring time.
- The one gap that survived authoring is exactly the kind a code read catches and a text-only review does not: the Story's summary promises Project-level scoping, its own AC-07 explicitly defers that to a linked Defect, and reading the actual query shows the deferred behavior is not an edge case but the total, unconditional behavior of the feature as specified.
- Nothing else in the Story needed refinement — ACs 01, 03, 05, 06, 08, 09, 10 are testable as written with no ambiguity.

---

## Critical Questions for PO

> These BLOCK sprint planning until answered.

1. ***Do you want this Story to ship showing every Workspace Test on every Project's list (current reality), or do you want it to wait for BK-620's fix so it can be genuinely Project-scoped?***

---

## Technical Questions for Dev

> These do not block PO but block implementation.

1. ***Should the new list route call the same server-side read ****`layout.tsx`**** already does, or issue its own query?*** — Context: the Story's Dev comment says "nothing new is fetched," implying the layout's existing `tests` array is reused as-is. Confirming this (rather than a parallel query being written) is what keeps AC-07's "one scoping rule" promise mechanically true instead of just a design intent.

---

## Suggested Story Improvements

| # | Current state | Suggested change | Benefit |
| --- | --- | --- | --- |
| 1 | AC-02/AC-07 assert "same set as the explorer" without stating what that set actually is today | Add one line to the Story description: "As of this Story, that set is Workspace-wide (see BK-620); this is deliberate, not an oversight" | Makes the current, real scope traceable directly from the Story instead of requiring a code read to discover it |

---

## Data feasibility flags

- ***Entity / fixture missing***: `tests` has no `project_id` column — confirmed via `layout.tsx:92-95` and the `GET /api/v1/tests?tag=` route's own code comment ("workspace-scoped"). `business-data-map.md` does not document this gap; BK-620's own root-cause section is the only place it is written down.
- ***API contract gap***: none new — this Story adds no endpoint.
- ***Required pre-work***: none required to build the Story as currently AC'd (the workspace-wide behavior is inherited, not blocking); required only if PO answers Critical Question #1 with "wait for BK-620."

---

## Recommended testing strategy

### Pre-implementation

- Get PO's answer to Critical Question #1 in writing on the Story before Dev starts, so the scope decision doesn't get discovered during QA execution instead.

### During implementation

- Confirm with Dev (Technical Question #1) that no second Tests query gets introduced — a second query is the concrete way AC-07's "one scoping rule" promise could silently break.

### Post-implementation (in-sprint by /sprint-testing)

- Prioritize the two Integration outlines (cross-Project set parity, Workspace-membership isolation) first — they are the outlines that make the scoping gap observable, and the ones most likely to surprise a PM/stakeholder demo if skipped.

---

## Risks & mitigation

| # | Risk | Likelihood | Impact | Mitigated by which outlines |
| --- | --- | --- | --- | --- |
| 1 | Feature ships and a stakeholder discovers cross-project Tests in a demo, reading it as a new bug rather than a known, accepted gap | High (it is the default behavior, not a corner case) | Medium (already accepted by design, but only if PO signs off explicitly) | "Should show the identical set and count across every Project in the Workspace" outline — makes the behavior visible and documented in the ATR, not discovered live |
| 2 | AC-09's four similar empty/loading/failure states get conflated during implementation | Medium | Medium | The 5 boundary/negative outlines targeting AC-09 directly |

---

## Next steps

- [x ] PO answered Critical Question #1 (2026-09-09): ship now, Workspace-wide scope accepted as deliberate and temporary until BK-620 lands.
- [x ] Dev confirmed Technical Question #1 (2026-09-09): new route reuses layout.tsx's existing query — no second query introduced.
- [ ] Story enters sprint at status `ready*for*dev` once estimated
- [ ] When Story reaches `ready*for*qa`, `/sprint-testing` will short-circuit refinement (label `shift-left-reviewed` detected)

---
_Synced from Jira by sync-jira-issues_
