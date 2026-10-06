# BK-268 — Acceptance Test Plan (QA)

> Jira field: `customfield_10137` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-268)

# Acceptance Test Plan (ATP) — BK-268: TMS-Activity | Surface ATC edits with the Tests they affect

***Status***: Refined — Awaiting PO Estimation
***Mode***: Shift-Left (pre-sprint, batch grooming)
***Refined on***: 2026-09-19
***Modality***: Jira-native

> Full unabridged analysis: see the linked [QA] Shift-Left Review subtask comments.

---

## Phase 3 — Refined Acceptance Criteria

### Original AC1 — An ATC edited through the app's own editor appears in the activity feed

#### Scenario 1.1: Should surface an in-app ATC edit as an activity feed entry regardless of which fields changed (Type: Positive, Priority: Critical)

- ***Given***: An ATC "Login with valid credentials" exists in a project I can write to.
- ***When***: I edit it via `AtcEditor.tsx` (or `NewAtcEditor.tsx`), changing any combination of title / layer / tags / steps / assertions / AC bindings, and save.
- ***Then***: The workspace activity feed shows a new entry for this edit; the same behavior holds regardless of which specific fields changed — `bunkai*update*atc` unconditionally full-replaces children and emits `atc.updated` (collapsed into one parameterized case per test-design-doctrine.md Part 2.5: same behavior across this partition, only the changed-field data varies).

#### Scenario 1.2: Should surface a feed entry when the in-app editor is saved with byte-identical content — NEEDS PO/DEV CONFIRMATION (Type: Boundary, Priority: Medium)

- ***NEEDS PO/DEV CONFIRMATION***: current code has no diff-check; confirm this is desired, not accidental noise.
- ***Given***: An ATC's current content is unchanged from its last save.
- ***When***: The in-app editor is saved again with identical data.
- ***Then***: (current behavior) version bumps and an `atc.updated` entry appears anyway — confirm or correct before sprint planning.

### Original AC2 — An ATC edited through the API appears in the activity feed

#### Scenario 2.1: Should surface an API-driven ATC edit as an activity feed entry (Type: Positive, Priority: Critical)

- ***Given***: An ATC exists; a teammate or integration is authenticated via Bearer token or cookie.
- ***When***: `PATCH /api/v1/atcs/{id}` is called with a non-empty body.
- ***Then***: The feed shows an entry with the same shape as an in-app edit (unified write path — see Contradictions).

#### Scenario 2.2: Should NOT emit a feed entry when the API PATCH is called with an empty body (Type: Negative, Priority: Medium — regression-lock on existing behavior)

- ***Given***: An ATC exists.
- ***When***: `PATCH /api/v1/atcs/{id}` is called with `""` or `"{}"` (the route's documented no-op branch).
- ***Then***: 200 response, no version bump, no `activity_log` row — existing `route.ts` behavior, worth locking in as a regression case since it interacts with this Story's "no spurious entries" spirit.

### Original AC3 — The activity entry names the actor who made the edit

#### Scenario 3.1: Should identify the in-app editing teammate as the entry's actor (Type: Positive, Priority: High)

- ***Given***: Teammate "[REDACTED_EMAIL]" edits an ATC via the in-app editor.
- ***When***: The feed is opened.
- ***Then***: The entry's `actor.email` resolves to "[REDACTED_EMAIL]".

#### Scenario 3.2: Should identify the API caller as the entry's actor for a Bearer/PAT-driven edit — NEEDS PO/DEV CONFIRMATION (Type: Positive, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: BK-182 (open bug — Bearer active-workspace resolution) may affect this path; confirm actor resolution is unaffected.
- ***Given***: A PAT-authenticated caller edits an ATC via the API.
- ***When***: The feed is opened.
- ***Then***: The entry's actor resolves to the PAT owner's email, consistently with the cookie-session case.

#### Scenario 3.3: Should render a safe, non-crashing fallback when the editing actor cannot be resolved (Type: Integration, Priority: High)

- ***Given***: The `actor*user*id` on an `atc.updated` row belongs to a departed/deleted user.
- ***When***: The feed renders the entry.
- ***Then***: A safe fallback text renders (mirrors BK-49's existing "a workspace member" pattern, `lib/activity/labels.ts`) — no raw UUID, no crash.

### Original AC4 — The activity entry names the ATC that was edited

#### Scenario 4.1: Should display the edited ATC's title as the entry's item label (Type: Positive, Priority: Critical)

- ***Given***: An ATC titled "Login with valid credentials" is edited.
- ***When***: The feed renders the entry.
- ***Then***: `item.label` = "Login with valid credentials" (the payload already carries `title` since migration `0035` — no new resolution needed for this part).

#### Scenario 4.2: Should render without breaking layout when the edited ATC's title is near the maximum length (Type: Boundary, Priority: Low)

- ***Given***: An ATC titled with 200 characters (the existing title cap — `AtcEditor` title-length guard, BK-145 finding).
- ***When***: The feed renders the entry.
- ***Then***: The row truncates/wraps per `DESIGN.md` tokens, mirroring BK-49's existing long-label boundary outline — no layout break.

#### Scenario 4.3: Should display the ATC's post-edit (not pre-edit) title when the edit itself renamed the ATC — NEEDS PO/DEV CONFIRMATION (Type: Positive, Priority: Medium)

- ***NEEDS PO/DEV CONFIRMATION***: behavior is defined by current code (payload stores the new title), not by an explicit product decision.
- ***Given***: An ATC named "Old name" is renamed to "New name" in the same save.
- ***When***: The feed renders the entry.
- ***Then***: `item.label` = "New name" — confirm this is the desired UX before locking the assertion.

### Original AC5 — The activity entry conveys which Tests the edit affects

#### Scenario 5.1: Should list the single affected Test's title when the ATC chains into one Test (Type: Positive, Priority: Critical)

- ***Given***: ATC "Login with valid credentials" is chained only into Test "Regression Suite".
- ***When***: The ATC is edited and the feed is opened.
- ***Then***: The entry conveys "Regression Suite" by name.

#### Scenario 5.2: Should list all affected Tests' titles when the ATC chains into multiple Tests (Type: Positive, Priority: Critical)

- ***Given***: The ATC is chained into "Smoke Suite" and "Regression Suite" (the Story's own example).
- ***When***: The ATC is edited and the feed is opened.
- ***Then***: Both titles are conveyed on the one entry.

#### Scenario 5.3: Should render sensibly when the affected-Tests count is large (e.g. dozens) — NEEDS PO/DEV CONFIRMATION (Type: Boundary, Priority: High — carried from the Story's own open question)

- ***Given***: The ATC is chained into 40+ Tests.
- ***When***: The ATC is edited and the feed is opened.
- ***Then***: A defined truncation/expand treatment applies (exact treatment: open PO question, `out-of-scope.md` explicitly defers "exact visual treatment for a very large number" as a PO decision).

#### Scenario 5.4: Should render a safe fallback for an affected Test that can no longer be resolved to a title (Type: Integration, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: no existing precedent for a Test-fallback string (ADR-0011's actor fallback covers users only).
- ***Given***: A Test in `affected*test*ids` is archived or deleted after the edit that referenced it.
- ***When***: The feed renders the entry.
- ***Then***: A safe fallback renders — exact copy undefined, must not be a raw UUID or a broken row.

#### Scenario 5.5: Should batch-resolve `affected*test*ids` to Test titles server-side, workspace-scoped (Type: Integration, Priority: Critical — this is the Story's real new-build surface)

- ***Given***: An `atc.updated` row carries one or more `affected*test*ids` (already emitted since migration `0035`).
- ***When***: The activity route builds the response.
- ***Then***: A new resolution mechanism (mirroring `bunkai*resolve*activity*actors`, ADR-0011's pattern, or a payload-time JOIN in `bunkai*update_atc` itself) returns Test titles without leaking cross-workspace Test data. See Technical Questions T1 — the mechanism itself is undecided.

### Original AC6 — An ATC edit that affects no Tests still appears in the feed

#### Scenario 6.1: Should render an entry sensibly with zero affected Tests, distinct from a broken/blank row (Type: Boundary, Priority: High)

- ***Given***: An ATC chained into no Test is edited.
- ***When***: The feed renders the entry.
- ***Then***: The entry appears with an explicit "no Tests affected" state — exact copy undefined (Gap 2). This is the zero-boundary counterpart to Scenarios 5.1-5.3's affected-count domain (BVA cluster: 0 · 1 · 2 (multi) · large-N).

### Original AC7 — Creating an ATC still produces exactly one creation entry, never duplicated by an edit entry

#### Scenario 7.1: Should produce exactly one atc.created entry with no accompanying atc.updated entry when a new ATC is created (Type: Positive, Priority: Critical)

- ***Given***: A new ATC is created (not edited).
- ***When***: The feed is opened immediately after.
- ***Then***: Exactly one `atc.created` entry appears; `atc.created` and `atc.updated` are emitted by distinct code paths (`bunkai*create*atc`/`0021` vs. `bunkai*update*atc`/`0035`) — true by construction today, worth a regression case rather than a new build.

#### Scenario 7.2: Should NOT emit a spurious atc.updated entry from an autosave during ATC creation — NEEDS PO/DEV CONFIRMATION (Type: Negative, Priority: Medium)

- ***NEEDS PO/DEV CONFIRMATION***: unverified whether `NewAtcEditor.tsx`'s create flow autosaves drafts through `bunkai*update*atc` before the ATC is confirmed created.
- ***Given***: A user is drafting a new ATC in `NewAtcEditor.tsx`.
- ***When***: Any autosave occurs before the "create" action is confirmed.
- ***Then***: No `atc.updated` row should appear before the ATC's own `atc.created` row (Error Guessing charter — risk-beyond-AC probe per test-design-doctrine.md).

### Original AC8 — An edit in one workspace never appears in another workspace's feed

#### Scenario 8.1: Should NOT show a Workspace B ATC-edit entry in Workspace A's feed (Type: Negative, Priority: Critical — inherited security invariant, regression-confirmation only)

- ***Given***: I am a member of Workspace A only; an ATC in Workspace B is edited.
- ***When***: I open Workspace A's feed.
- ***Then***: Zero rows reference the Workspace B edit. This is not new infrastructure — `activity*log*select*workspace*member` (RLS) plus `bunkai*list*activity`'s `SECURITY INVOKER` posture (already live per BK-49) apply to any action type, including a newly-allowlisted `atc.updated`, with no extra work. Still Critical priority per doctrine (security-adjacent risk is always tested even when inherited).

### Original AC9 — A caller-specified event filter that excludes ATC edits keeps them out of the returned feed

#### Scenario 9.1: Should exclude atc.updated entries when a caller's explicit filter omits it, while still returning requested types (Type: Positive, Priority: High)

- ***Given***: A recent ATC edit and a `run.finished` event both exist in the workspace.
- ***When***: A caller requests the feed with `actions=[run.finished]` explicitly.
- ***Then***: Only the `run.finished` entry returns — regression-confirmation that adding `atc.updated` to the allowlist domain doesn't disturb the existing explicit-filter override path (`bunkai*list*activity`, migration `0045`).

#### Scenario 9.2: Should return atc.updated entries when a caller's explicit filter requests ONLY that action (Type: Positive, Priority: Medium)

- ***Given***: Same data as 9.1.
- ***When***: A caller requests `actions=[atc.updated]` explicitly.
- ***Then***: Only the ATC-edit entry returns — proves `atc.updated` is independently selectable, not just always-bundled with `atc.created`.

### Original AC10 — Repeated edits to the same ATC each produce their own feed entry

#### Scenario 10.1: Should produce two independent feed entries, each with its own actor and timestamp, for two consecutive edits via different surfaces (Type: Positive, Priority: High)

- ***Given***: The same ATC is edited via the in-app editor, then via the API, in quick succession (the Story's own `workflow.md` illustration).
- ***When***: The feed is opened.
- ***Then***: Two distinct rows appear, correctly ordered, each with its own actor and timestamp.

#### Scenario 10.2: Should preserve correct entry order when two edits to the same ATC share the same created_at timestamp (Type: Boundary, Priority: Low — inherited tie-break, regression-confirmation only)

- ***Given***: Two edits to the same ATC land with an identical `created_at`.
- ***When***: The feed loads.
- ***Then***: The existing `(created_at, id)` tie-break (BK-49, migration `0045`) orders them deterministically — no new tie-break logic is required for this Story.

---

## Phase 4 — Test Outlines (coverage + names)

### Coverage estimate

| Type | Count | Notes |
| --- | --- | --- |
| Positive | 12 | Core behavior across both surfaces (AC1/AC2), actor/item identification (AC3/AC4), affected-Tests naming (AC5), create-vs-edit separation (AC7), explicit filter (AC9), repeated edits (AC10) |
| Negative | 3 | Empty-body no-op (AC2), autosave-before-creation guard (AC7), cross-workspace isolation (AC8) |
| Boundary | 5 | No-op resave, title-length, large-affected-count, zero-affected-count, same-timestamp tie-break |
| Integration | 3 | Actor fallback, affected-Test fallback, the new Test-title resolver itself |
| ***Total**** | ****23*** | Drives PO estimation |

### Outline list (NAMES ONLY)

#### Positive

- Should surface an in-app ATC edit as an activity feed entry regardless of which fields changed
- Should surface an API-driven ATC edit as an activity feed entry
- Should identify the in-app editing teammate as the entry's actor
- Should identify the API caller as the entry's actor for a Bearer/PAT-driven edit
- Should display the edited ATC's title as the entry's item label
- Should display the ATC's post-edit title when the edit itself renamed the ATC — NEEDS PO/DEV CONFIRMATION
- Should list the single affected Test's title when the ATC chains into one Test
- Should list all affected Tests' titles when the ATC chains into multiple Tests
- Should produce exactly one atc.created entry with no accompanying atc.updated entry when a new ATC is created
- Should exclude atc.updated entries when a caller's explicit filter omits it, while still returning requested types
- Should return atc.updated entries when a caller's explicit filter requests ONLY that action
- Should produce two independent feed entries, each with its own actor and timestamp, for two consecutive edits via different surfaces

#### Negative

- Should NOT emit a feed entry when the API PATCH is called with an empty body
- Should NOT emit a spurious atc.updated entry from an autosave during ATC creation — NEEDS PO/DEV CONFIRMATION
- Should NOT show a Workspace B ATC-edit entry in Workspace A's feed

#### Boundary

- Should still surface a feed entry when the in-app editor is saved with byte-identical content — NEEDS PO/DEV CONFIRMATION
- Should render without breaking layout when the edited ATC's title is near the maximum length
- Should render sensibly when the affected-Tests count is large (e.g. dozens) — NEEDS PO/DEV CONFIRMATION
- Should render an entry sensibly with zero affected Tests, distinct from a broken/blank row
- Should preserve correct entry order when two edits to the same ATC share the same created_at timestamp

#### Integration

- Should render a safe, non-crashing fallback when the editing actor cannot be resolved
- Should render a safe fallback for an affected Test that can no longer be resolved to a title — NEEDS PO/DEV CONFIRMATION
- Should batch-resolve affected*test*ids to Test titles server-side, workspace-scoped

> Parametrization tables, per-outline test-data JSON, numbered test steps, and Faker generation strategies are deferred to in-sprint planning by `/sprint-testing` Stage 1.

---

## Phase 5 — Edge Cases

| # | Edge case | In original Story? | Criticality | Action |
| --- | --- | --- | --- | --- |
| 1 | No-op resave with identical content still versions + emits an event | No | Medium | NEEDS PO/DEV CONFIRMATION — define whether desired |
| 2 | Autosave-before-creation could emit a false pre-creation atc.updated | No | Medium | NEEDS PO/DEV CONFIRMATION — verify `NewAtcEditor.tsx` behavior |
| 3 | PAT/Bearer actor resolution may inherit BK-182's known gap | No | Medium | Technical question for Dev (T4) |
| 4 | Entry shows post-edit (not pre-edit) title when the edit itself renamed the ATC | No | Low | NEEDS PO/DEV CONFIRMATION — confirm desired |
| 5 | Affected Test archived/deleted after the edit has no defined fallback label | No | High | NEEDS PO/DEV CONFIRMATION — define fallback copy |
| 6 | Large affected-Tests count (dozens) has no defined rendering treatment | Partially (Story's own open question) | High | Carried from Story — blocks Estimation |
| 7 | Zero-affected-Tests state copy undefined | Partially (AC6 requires "sensible" but no literal copy) | Medium | NEEDS PO/DEV CONFIRMATION — define copy |
| 8 | Long ATC title (near 200-char cap) could break entry layout | No | Low | Test only — mirrors BK-49's existing CSS handling |
| 9 | Two same-ATC edits sharing created_at need stable order | No | Low | Inherited from BK-49's existing tie-break — test only, no new AC needed |

---

## Story Quality Assessment

***Verdict***: Needs Improvement

***Key findings***:

- The Story's own "Dependency note" misstates ADR-0009's status (claims Proposed; the ADR is Accepted — Implemented) and the dual-write-path unification it worries about has already shipped on `staging` (PR #58). This is a stale-premise correction, not a new blocker.
- Ten well-formed Gherkin ACs, exploded to 23 justified outlines — most of the real gaps are in undefined copy/fallback strings (3 open questions, 2 already flagged by the Story itself) rather than missing behavior.
- One genuine new-build surface exists: resolving `affected*test*ids` (already on the event, since migration `0035`) to Test titles server-side has no existing precedent to copy.

---

## Critical Questions for PO

> These BLOCK sprint planning until answered.

1. ***The Story's "Dependency note" is stale — should it (and the Story's framing) be corrected before Estimation?***

1. ***Should an ATC edit also generate a notification to watchers of affected Tests, or is a feed entry sufficient?**** **(carried from the Story's own open questions — unchanged)*

1. ***How should the entry render when the affected-Tests count is large (dozens) or zero?**** **(carried from the Story's own open questions — unchanged)*

1. ***What exact label/copy should the atc.updated entry use, and how should the affected-Tests list visually appear within the existing card (inline text, chips, expandable)?***

1. ***Is a resave with byte-identical content expected to still show as an "edit" in the feed?***

---

## Technical Questions for Dev

> These do not block PO but block implementation.

1. ***Resolver mechanism for affected-Test titles******:****** a new ****`SECURITY DEFINER`**** batch resolver (mirroring ****`bunkai*resolve*activity*actors`****, ADR-0011's pattern) vs. embedding the title directly in the ****`atc.updated`**** payload via a JOIN inside ****`bunkai*update_atc`**** at write time?*** — Context: the payload-embedding approach is more consistent with BK-49's own "positive projection, never raw/derived-at-read-time" convention, and avoids a second resolver's RLS/co-membership surface entirely. Testing impact: determines whether the OpenAPI response shape changes at the RPC layer or the API-route layer, and whether a NEW peer-visibility posture change needs its own ADR two-gate test (à la ADR-0011, since Test titles — like emails — become visible to all workspace members, not just the actor).
2. ***What fallback copy/behavior applies when an affected Test can no longer be resolved (archived/deleted after the edit)?*** — Context: no existing Test-fallback precedent exists (only the actor-fallback does). Testing impact: outline 5.4 cannot be finalized.
3. ***Does ****`NewAtcEditor.tsx`****'s create-flow autosave (if any) call ****`bunkai*update*atc`**** before the ATC is confirmed created, risking a spurious pre-creation ****`atc.updated`**** entry?*** — Context: unverified in this light code pass — needs a targeted check by Dev, who knows the create-flow's actual autosave cadence. Testing impact: outline 7.2 cannot be executed without knowing whether this risk is real.
4. ***Does an API-originated (PAT/Bearer) ****`atc.updated`**** entry's actor resolve correctly, given BK-182's known Bearer active-workspace-resolution gap on the sibling ****`GET /api/v1/activity`**** route?*** — Context: BK-49's own implementation plan explicitly flagged this dependency for the read side; unclear whether it also touches the ATC-edit write side's actor capture. Testing impact: outline 3.2 needs this answered to know if it's testable as written or blocked on BK-182.

---

## Data feasibility flags

***Corrected from the initial framing.*** The activity-feed entity, its `atc.updated` write-site, and the read-side feed itself all already exist and are already live on `staging` — this is not a from-scratch build. Concretely, verified via light code read of `upex-bunkai-tms` (`origin/staging`):

- ***Entity***: `activity*log` (migration `0009*cross_cutting.sql`) — exists, no gap.
- ***Write path — already unified, already emitting the needed event***: `bunkai*update*atc` (migration `0035*atc*update*propagation.sql`) is called by BOTH the in-app editor (`saveAtcAction` → `updateAtc`) and the public `PATCH /api/v1/atcs/{id}` route. It already writes an `atc.updated` row on every invocation, with `affected*test_ids` (the DISTINCT Tests chaining the ATC, computed in-transaction) already in the payload. No new write-site is needed.
- ***Read path — already exists, one config gap***: `GET /api/v1/activity` (BK-49, merged, PR #83) already serves a paginated, workspace-isolated, filterable feed. The ONLY read-side gap: `atc.updated` is absent from `ACTIVITY*ALLOWED*ACTIONS` (`lib/activity/constants.ts`) — confirmed still absent even after two later slices added other actions (BK-264 bug-triage, BK-508 export). Adding it is a small, bounded change following the repo's own established per-action-addition pattern (allowlist + `ACTION_LABELS` + `deriveItemLabel` switch + the existing full-coverage test assertions in `labels.test.ts`).
- ***Real remaining gap — the one genuine new-build item***: the event payload carries `affected*test*ids` as UUIDs only, never titles. No existing resolver maps Test ids → titles the way `bunkai*resolve*activity_actors` (ADR-0011) maps user ids → emails. This is the single piece of net-new server-side work this Story requires (see Technical Question T1 for the two candidate approaches).
- ***Test data for QA****: `atc.updated` rows already exist in staging's `activity_log` table today (both surfaces have been emitting it since well before this Story was drafted) — a ****Discover**** data pattern is viable for most outlines; only the large-affected-count boundary (5.3) and the archived-Test fallback (5.4) may need ****Generate***-pattern seeding.

***Net assessment***: the Story's implied HIGH risk score (11, per the task's prior framing) appears to have been computed against the "build from scratch" premise. Against the corrected picture, the realistic remaining scope is narrower — one allowlist/label change (low effort) plus one new, small, well-precedented resolver (the actual unknown) plus several copy/fallback decisions that are cheap to make once PO answers Critical Questions 2-5. Whether 1 SP still holds is a PO/Dev call (Critical Question 1) — this refinement does not resolve it, only supplies the corrected inputs.

---
_Synced from Jira by sync-jira-issues_
