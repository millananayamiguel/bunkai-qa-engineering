# BK-439 — Acceptance Test Plan (QA)

> Jira field: `customfield_10137` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-439)

# Acceptance Test Plan — BK-439: TMS-ATC Library | Browse every ATC in the workspace from one index

***Status***: Refined — Awaiting PO Estimation
***Refined on***: 2026-09-19
***Modality***: Xray (`tms_cli: bun xray`)

> This is the TRIMMED, action-oriented ATP (Critical Rule: Jira's `acceptance*test*plan` field has a hard ~32,767-character content ceiling on this instance). Full unabridged analysis: see the linked [QA] Shift-Left Review subtask comments.

---

## Phase 3 — Refined Acceptance Criteria

### Original AC-01 — Sidebar navigation

#### Scenario 1.1: Should navigate to ATC Library when the sidebar entry is selected (Type: Positive, Priority: High)

- ***Given***: I am signed in and viewing any screen in the app
- ***When***: I click the "ATC Library" sidebar entry
- ***Then***: I land on the ATC Library route; the entry no longer carries `aria-disabled` or a "Coming soon" tooltip
- `collapsed: trivially atomic` — single boolean (live vs. disabled), no ranges/states/interacting inputs.

### Original AC-02 — Full unfiltered list

#### Scenario 2.1: Should list ATCs from every accessible Project when opening ATC Library with no filters (Type: Positive, Priority: Critical)

- ***Given***: my workspace holds ATCs across 3 Projects I can access ("Checkout": 2 ATCs, "Onboarding": 1 ATC, "Billing": 2 ATCs)
- ***When***: I open the ATC Library with no search term or filter active
- ***Then***: I see a single dense list of all 5 ATCs, spanning all 3 Projects, in one view

#### Scenario 2.2: Should surface every ATC in a workspace with hundreds of ATCs without truncation (Type: Boundary, Priority: Critical)

- ***Given***: my workspace holds 200+ ATCs across 5+ Projects I can access
- ***When***: I open the ATC Library with no search term or filter active
- ***Then****: every one of those ATCs is reachable from the list (via whatever mechanism ships — ****NEEDS PO/DEV CONFIRMATION*** on the exact mechanism) and no artificial cap silently hides any of them

### Original AC-08 — Empty workspace state

#### Scenario 8.1: Should render an explicit non-error empty state when the workspace has zero ATCs (Type: Positive/Edge, Priority: High)

- ***Given***: my workspace has not created any ATC yet
- ***When***: I open the ATC Library
- ***Then***: I see the "nothing found" empty state, textually distinct from an error

#### Scenario 8.2: Should visually and textually differ the empty state from the error state (Type: Negative-differentiation, Priority: Medium)

- ***Given***: I can trigger both a zero-ATC workspace and a failed ATC query
- ***When***: I compare the two rendered states
- ***Then***: they use different copy and different visual treatment — neither reads as the other

### Original AC-09 — Error + loading states

#### Scenario 9.1: Should show a named error with a retry action when the ATC index fails to load (Type: Negative, Priority: Critical)

- ***Given***: the ATC index query is forced to fail
- ***When***: I open or refresh the ATC Library
- ***Then****: I see an explicit error state naming what failed (exact copy — ****NEEDS PO/DEV CONFIRMATION***), with a retry control

#### Scenario 9.2: Should recover to the list when retry succeeds (Type: Positive, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: inferred — the AC states retry is possible but not that it must recover the list on success
- ***Given***: the error state is showing and the underlying query now succeeds
- ***When***: I click retry
- ***Then***: the list renders and the error clears

#### Scenario 9.3: Should show a loading state while ATCs are still being fetched (Type: Positive, Priority: High)

- ***Given***: I just opened the ATC Library
- ***When***: the ATCs have not finished loading yet
- ***Then***: I see a loading state in place of the list, and no partial or stale row data is shown as final

### Original AC-10 — Row content

#### Scenario 10.1: Should display full row detail for an ATC with all fields populated (Type: Positive, Priority: High)

- ***Given***: an ATC exists with id "ATC-042", name "Login happy path", owning Project "Checkout", Module "Auth", layer "UI", anchored to Story "BK-100" / AC "AC-3", used in 4 Tests
- ***When***: I see its row in the list
- ***Then***: all 7 fields are visible and correctly attributed on that row

#### Scenario 10.2: Should render each layer value paired with its text label, never color alone (Type: Boundary/EP-on-enum, Priority: High)

- ***Given***: three ATCs exist, one per layer value (UI, API, Unit)
- ***When***: I view their rows
- ***Then***: each row shows the layer's color paired with its text label — color is never the sole signal

#### Scenario 10.3: Should display "used in 0 tests" for an ATC referenced by no Test (Type: Boundary, Priority: Medium)

- ***Given***: an ATC exists that no Test currently references
- ***When***: I see its row
- ***Then***: the usage column reads "used in 0 tests" — not blank, not an error

### Original AC-11 — Navigation to owning project

#### Scenario 11.1: Should navigate into the owning Project and show a confirmation toast when a row is opened (Type: Positive, Priority: Critical)

- ***Given***: the list shows an ATC named "Login with expired token" that belongs to Project "Checkout"
- ***When***: I open that ATC's row
- ***Then****: I land inside the "Checkout" Project's context, and a toast confirms I was taken to "Checkout" (exact copy — ****NEEDS PO/DEV CONFIRMATION***)

#### Scenario 11.2: Should NOT open an in-place editor on the ATC Library screen when a row is opened (Type: Negative, Priority: High)

- ***Given***: any ATC row in the list
- ***When***: I open that row
- ***Then***: no inline edit surface renders on the ATC Library screen itself — the only effect on this screen is navigation away from it

### Original AC-12 — Access control

#### Scenario 12.1: Should exclude an ATC in a Workspace the caller is not a member of from both the list and the count badge (Type: Negative/Security, Priority: Critical)

- ***NEEDS PO/DEV CONFIRMATION***: this scenario tests the enforcement boundary that actually exists today (Workspace membership via `workspace_members`) — confirm this satisfies AC-12's literal "Project I am not a member of" wording
- ***Given***: an ATC exists in a Project belonging to a Workspace I am not a member of
- ***When***: I open the ATC Library
- ***Then***: that ATC never appears in the list or in the count badge

#### Scenario 12.2: Should include every ATC across every Project in a Workspace the caller belongs to (Type: Positive, Priority: High)

- ***Given***: I am an active member of a Workspace holding 3 Projects, each with ATCs
- ***When***: I open the ATC Library
- ***Then***: ATCs from all 3 Projects are counted in the badge and shown in the list — access is not over-restricted to a subset of "my own" Projects within the Workspace

### Original AC-13 — Single-project workspace

> ***This AC cannot be finalized into one determinate scenario set — see Critical Question #1.*** Both interpretations are recorded below; only one should survive PO's ruling.

#### Scenario 13.1 (Interpretation A — DoD/out-of-scope wins): Should render the same dense list layout for a single-Project workspace, with no Project filter control present (Type: Positive, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: assumes the DoD/out-of-scope text overrides AC-13's literal "Project filter" clause
- ***Given***: my workspace has exactly one Project
- ***When***: I open the ATC Library
- ***Then***: the list renders identically to the multi-Project case, and no filter control of any kind is shown

#### Scenario 13.2 (Interpretation B — AC-13 wins): Should render a Project filter control with one selectable option for a single-Project workspace (Type: Positive, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: this scenario directly contradicts this Story's own out-of-scope.md and DoD line 10 — carried here only because AC-13 literally asks for it
- ***Given***: my workspace has exactly one Project
- ***When***: I open the ATC Library
- ***Then***: a Project filter control is present, offering the one Project as its only option

### Original AC-14 — Other sidebar items unaffected

#### Scenario 14.1: Should leave "Test Runs", "Bug Reports", and "Metrics" disabled and unchanged after ATC Library goes live (Type: Regression/Positive, Priority: Medium)

- ***Given***: I am viewing the sidebar after this Story ships
- ***When***: I look at "Test Runs", "Bug Reports", and "Metrics"
- ***Then***: all three remain disabled "Coming soon" items, unchanged
- `collapsed: trivially atomic` — same static disabled-check repeated across 3 items with identical expected behavior; parametrized within one artifact rather than split three ways.

---

## Phase 4 — Test Outlines

### Coverage estimate

| Type | Count | Notes |
| --- | --- | --- |
| Positive | 11 | Happy-path + regression-guard variants across all 9 ACs |
| Negative | 5 | Error state, non-editor guard, access exclusion, empty-vs-error differentiation, retry-persists-on-repeat-failure |
| Boundary | 3 | Scale (hundreds of ATCs), zero-usage-count, single-Project-workspace filter presence (Interpretation B) |
| Integration | 2 | Cross-project RLS read, bulk usage-count resolution |
| API | 0 | No new REST endpoint identified as strictly required |
| ***Total**** | ****21*** | Drives PO estimation |

### Outline list (NAMES ONLY)

#### Positive

- Should navigate to ATC Library when the sidebar entry is selected
- Should list ATCs from every accessible Project when opening ATC Library with no filters
- Should render an explicit non-error empty state when the workspace has zero ATCs
- Should show a loading state while ATCs are still being fetched
- Should recover to the list when retry succeeds — NEEDS PO/DEV CONFIRMATION
- Should display full row detail for an ATC with all fields populated
- Should render each layer value paired with its text label
- Should navigate into the owning Project and show a confirmation toast when a row is opened
- Should include every ATC across every Project in a Workspace the caller belongs to
- Should render the same dense list layout for a single-Project workspace, with no filter control present — NEEDS PO/DEV CONFIRMATION (Interpretation A)
- Should leave "Test Runs", "Bug Reports", and "Metrics" disabled and unchanged after ATC Library goes live

#### Negative

- Should show a named error with a retry action when the ATC index fails to load
- Should visually and textually differ the empty state from the error state
- Should NOT open an in-place editor on the ATC Library screen when a row is opened
- Should exclude an ATC in a Workspace the caller is not a member of from both the list and the count badge — NEEDS PO/DEV CONFIRMATION on interpretation
- Should remain on the error state when retry also fails — NEEDS PO/DEV CONFIRMATION

#### Boundary

- Should surface every ATC in a workspace with hundreds of ATCs without truncation
- Should display "used in 0 tests" for an ATC referenced by no Test
- Should render a Project filter control with one selectable option for a single-Project workspace — NEEDS PO/DEV CONFIRMATION (Interpretation B, mutually exclusive with its Positive counterpart)

#### Integration

- Should read ATCs cross-project via the workspace-scoped RLS policy without a per-Project filter
- Should resolve "used in N tests" per row without one HTTP round-trip per ATC — NEEDS PO/DEV CONFIRMATION, bulk strategy not yet defined

> Parametrization tables, per-outline test-data JSON, numbered test steps, Faker generation strategies deferred to `/sprint-testing` Stage 1.

---

## Phase 5 — Edge Cases

| # | Edge case | In original Story? | Criticality | Action |
| --- | --- | --- | --- | --- |
| 1 | Pagination/"no artificial cap" mechanism left unspecified | No | Critical | Add to AC (PO/Dev confirm mechanism before Dev estimates) |
| 2 | "Used in N tests" per-row aggregate risking an N+1 fetch storm at scale | No | Critical | Ask Dev (blocks estimation, ties to Integration outline #2) |
| 3 | AC-13 vs. DoD/out-of-scope self-contradiction (Project filter) | Yes (it's in the Story, but self-contradictory) | Critical | Ask PO — blocking |
| 4 | "Project I cannot access" has no independent enforcement from "Workspace I am not a member of" in the current schema | No | Critical | Ask PO/Dev — ties to AC-12 |
| 5 | Retry re-triggering an indefinitely-failing query (no backoff/circuit-breaker mentioned) | No | Medium | Test only |
| 6 | Exact error copy (AC-09) / exact toast copy (AC-11) not specified | No | Low | Ask PO for literal strings |
| 7 | Badge count freshness — fetched once per navigation vs. live | No | Medium | Ask PO/Dev |
| 8 | Default sort order of the dense list unstated | No | Medium | Ask PO |
| 9 | An ATC whose owning Project has itself been archived/soft-deleted | No | Medium | Ask PO — no precedent found in module-context.md |

---

## Story Quality Assessment

***Verdict***: Needs Improvement

***Key findings***:

- Eight of the nine ACs are concretely Gherkin'd, internally consistent, and map cleanly to Given/When/Then scenarios with no invented behavior beyond minor, low-risk inferences (retry-recovers-list, exact copy strings).
- AC-13 is genuinely self-contradictory against this Story's own DoD and out-of-scope sections — not resolvable by QA judgment call, requires a PO ruling before sprint planning closes.
- Two concrete, code-evidenced technical risks (cross-project access-boundary semantics, per-row usage-count aggregation at scale) were surfaced by light code reads, not invented — both materially affect the 5 SP estimate if resolved toward the more expensive interpretation.

---

## Critical Questions for PO

> These BLOCK sprint planning until answered.

1. ***Does AC-13's "Project filter" clause belong in this slice, or is it a leftover from the pre-split BK-267 superset Story that should be struck (deferring entirely to BK-441)?***

1. ***Does "an ATC in a Project I am not a member of" (AC-12 / Business Rules) mean "a Workspace I am not a member of" — the only access boundary the current schema actually enforces — or is a new per-Project sub-scoping expected within a single Workspace?***

---

## Technical Questions for Dev

> These do not block PO but block implementation.

1. ***What is the bulk/aggregate strategy for "used in N tests" at list scale?*** — Today's only usage-count read is the per-ATC `GET /api/v1/atcs/{id}/usage` (BK-22, confirmed in `AtcPreview.tsx`). Calling it once per row across "hundreds of ATCs" (AC-02) is an N+1 risk. Testing impact: Integration outline #2 cannot be executed meaningfully until this is decided.
2. ***What pagination/infinite-scroll mechanism, and what page size, ships for the dense list?*** — AC-02 leaves this open ("scrolling further or paging further"). Testing impact: the Boundary outline for "hundreds of ATCs" needs a concrete mechanism to write deterministic test steps against.
3. ***What is the default sort order for the cross-project list?*** — Unstated in any Story field. Testing impact: row-order assertions in later automated regression are meaningless without a stated, deterministic order.
4. ***Is the sidebar badge count fetched once per navigation, or does it update live (subscription/polling) while the app is open?*** — Testing impact: determines whether a "stale badge after another user creates an ATC" observation is a bug report or expected behavior.
5. ***What is the exact literal copy for the AC-09 error message and the AC-11 toast text?*** — No design/Figma link is attached to this Story. Testing impact: without literal strings, QA assertions are limited to "an error/toast is shown," not the specific message.

---

## Data feasibility flags

`data*feasibility*risk: true` — driven by data-SHAPE and fixture-availability gaps, not by any structurally-missing entity (ATCs, Projects, Modules, and Workspaces all already exist and are seedable via the existing `bunkai*save*atc` RPC and standard Project/Module creation flows).

- ***At-scale dataset***: AC-02 scenario 2 requires "hundreds of ATCs across multiple Projects" to genuinely exercise the no-artificial-cap claim. No such dataset is confirmed to exist in staging today — likely needs a seeding script before Stage 2 execution.
- ***Cross-workspace fixture for AC-12's negative case***: requires two distinct Workspaces, a caller who is a member of one and not the other, and an ATC in the excluded Workspace's Project. Buildable but not yet confirmed among current staging test accounts.
- ***Zero-usage boundary case (Scenario 10.3)***: straightforward — a freshly-created, unreferenced ATC satisfies it.
- ***API contract gap***: no bulk usage-count endpoint exists yet (see Technical Question #1) — required pre-work before Stage 2 can execute the full outline set against a real "hundreds of ATCs" dataset.

---
_Synced from Jira by sync-jira-issues_
