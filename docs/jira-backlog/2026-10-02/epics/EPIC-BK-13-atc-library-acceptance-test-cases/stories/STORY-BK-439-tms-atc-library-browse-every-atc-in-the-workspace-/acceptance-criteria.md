# BK-439 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-439)

## Phase 3 — Refined Acceptance Criteria

### Original AC-01 — Sidebar navigation

#### Scenario 1.1: Should navigate to ATC Library when the sidebar entry is selected (Type: Positive, Priority: High)

- ********Given****: I am signed in and viewing any screen in the app
- ********When****: I click the "ATC Library" sidebar entry
- ********Then****: I land on the ATC Library route; the entry no longer carries `aria-disabled` or a "Coming soon" tooltip
- `collapsed: trivially atomic` — single boolean (live vs. disabled), no ranges/states/interacting inputs.

### Original AC-02 — Full unfiltered list

#### Scenario 2.1: Should list ATCs from every accessible Project when opening ATC Library with no filters (Type: Positive, Priority: Critical)

- ********Given****: my workspace holds ATCs across 3 Projects I can access ("Checkout": 2 ATCs, "Onboarding": 1 ATC, "Billing": 2 ATCs)
- ********When****: I open the ATC Library with no search term or filter active
- ********Then****: I see a single dense list of all 5 ATCs, spanning all 3 Projects, in one view

#### Scenario 2.2: Should surface every ATC in a workspace with hundreds of ATCs without truncation (Type: Boundary, Priority: Critical)

- ********Given****: my workspace holds 200+ ATCs across 5+ Projects I can access
- ********When****: I open the ATC Library with no search term or filter active
- ********Then*****:**** every one of those ATCs is reachable from the list (via whatever mechanism ships — ******NEEDS PO/DEV CONFIRMATION*** on the exact mechanism, see Ambiguity #2) and no artificial cap silently hides any of them

### Original AC-08 — Empty workspace state

#### Scenario 8.1: Should render an explicit non-error empty state when the workspace has zero ATCs (Type: Positive/Edge, Priority: High)

- ********Given****: my workspace has not created any ATC yet
- ********When****: I open the ATC Library
- ********Then****: I see the "nothing found" empty state, textually distinct from an error

#### Scenario 8.2: Should visually and textually differ the empty state from the error state (Type: Negative-differentiation, Priority: Medium)

- ********Given****: I can trigger both a zero-ATC workspace and a failed ATC query
- ********When****: I compare the two rendered states
- ********Then****: they use different copy and different visual treatment — neither reads as the other

### Original AC-09 — Error + loading states

#### Scenario 9.1: Should show a named error with a retry action when the ATC index fails to load (Type: Negative, Priority: Critical)

- ********Resolved 2026-09-20****: exact copy is "Couldn't load ATCs." with a "Retry" action.
- ********Given****: the ATC index query is forced to fail
- ********When****: I open or refresh the ATC Library
- ********Then****: I see the error state reading "Couldn't load ATCs." with a "Retry" control

#### Scenario 9.2: Should recover to the list when retry succeeds (Type: Positive, Priority: High)

- ********NEEDS PO/DEV CONFIRMATION****: inferred — the AC states retry is possible but not that it must recover the list on success
- ********Given****: the error state is showing and the underlying query now succeeds
- ********When****: I click retry
- ********Then****: the list renders and the error clears

#### Scenario 9.3: Should show a loading state while ATCs are still being fetched (Type: Positive, Priority: High)

- ********Given****: I just opened the ATC Library
- ********When****: the ATCs have not finished loading yet
- ********Then****: I see a loading state in place of the list, and no partial or stale row data is shown as final

### Original AC-10 — Row content

#### Scenario 10.1: Should display full row detail for an ATC with all fields populated (Type: Positive, Priority: High)

- ********Given****: an ATC exists with id "ATC-042", name "Login happy path", owning Project "Checkout", Module "Auth", layer "UI", anchored to Story "BK-100" / AC "AC-3", used in 4 Tests
- ********When****: I see its row in the list
- ********Then****: all 7 fields are visible and correctly attributed on that row

#### Scenario 10.2: Should render each layer value paired with its text label, never color alone (Type: Boundary/EP-on-enum, Priority: High)

- ********Given****: three ATCs exist, one per layer value (UI, API, Unit)
- ********When****: I view their rows
- ********Then****: each row shows the layer's color paired with its text label — color is never the sole signal

#### Scenario 10.3: Should display "used in 0 tests" for an ATC referenced by no Test (Type: Boundary, Priority: Medium)

- ********Given****: an ATC exists that no Test currently references
- ********When****: I see its row
- ********Then****: the usage column reads "used in 0 tests" — not blank, not an error

### Original AC-11 — Navigation to owning project

#### Scenario 11.1: Should navigate into the owning Project and show a confirmation toast when a row is opened (Type: Positive, Priority: Critical)

- ********Resolved 2026-09-20****: exact toast copy is "Opened in {Project name}".
- ********Given****: the list shows an ATC named "Login with expired token" that belongs to Project "Checkout"
- ********When****: I open that ATC's row
- ********Then****: I land inside the "Checkout" Project's context, and a toast reads "Opened in Checkout"

#### Scenario 11.2: Should NOT open an in-place editor on the ATC Library screen when a row is opened (Type: Negative, Priority: High)

- ********Given****: any ATC row in the list
- ********When****: I open that row
- ********Then****: no inline edit surface renders on the ATC Library screen itself — the only effect on this screen is navigation away from it

### Original AC-12 — Access control

#### Scenario 12.1: Should exclude an ATC in a Workspace the caller is not a member of from both the list and the count badge (Type: Negative/Security, Priority: Critical)

- ********Resolved 2026-09-20****: AC-12's original wording said "a Project I am not a member of," but the schema enforces access only at `workspace*members` — no `project*members` table exists (confirmed in `supabase/migrations/0004*atcs.sql`, `0002*projects_modules.sql`). Ruling: Workspace-level enforcement satisfies this AC's intent, matching the accepted BK-666/BK-620 precedent on the Tests list. AC-12 is reworded to say "Workspace" in place of "Project" throughout.
- ********Given****: an ATC exists in a Project belonging to a Workspace I am not a member of
- ********When****: I open the ATC Library
- ********Then****: that ATC never appears in the list or in the count badge

#### Scenario 12.2: Should include every ATC across every Project in a Workspace the caller belongs to (Type: Positive, Priority: High)

- ********Given****: I am an active member of a Workspace holding 3 Projects, each with ATCs
- ********When****: I open the ATC Library
- ********Then****: ATCs from all 3 Projects are counted in the badge and shown in the list — access is not over-restricted to a subset of "my own" Projects within the Workspace

### Original AC-13 — Single-project workspace

#### Scenario 13.1: Should render the same dense list layout for a single-Project workspace, with no Project filter control present (Type: Positive, Priority: High)

- ********Given****: my workspace has exactly one Project
- ********When****: I open the ATC Library
- ********Then****: the list renders identically to the multi-Project case, and no filter control of any kind is shown
- ********Resolved 2026-09-20****: AC-13's original wording referenced a "Project filter" that contradicted this Story's own Out-of-Scope and DoD (no filter controls ship in this slice). Ruling: the filter clause was a leftover from the pre-split BK-267 superset Story and has been struck. This scenario is now the sole, determinate AC-13 outline — the previously-carried alternate interpretation (a filter control present) is dropped.

### Original AC-14 — Other sidebar items unaffected

#### Scenario 14.1: Should leave "Test Runs", "Bug Reports", and "Metrics" disabled and unchanged after ATC Library goes live (Type: Regression/Positive, Priority: Medium)

- ********Given****: I am viewing the sidebar after this Story ships
- ********When****: I look at "Test Runs", "Bug Reports", and "Metrics"
- ********Then****: all three remain disabled "Coming soon" items, unchanged
- `collapsed: trivially atomic` — same static disabled-check repeated across 3 items with identical expected behavior; parametrized within one artifact rather than split three ways.

---
_Synced from Jira by sync-jira-issues_
