# BK-268 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-268)

## Original AC1 — An ATC edited through the app's own editor appears in the activity feed

### Scenario 1.1: Should surface an in-app ATC edit as an activity feed entry regardless of which fields changed (Type: Positive, Priority: Critical)

- ********Resolved 2026-09-20****: exact action label is "edited an ATC" — matches the existing `ACTION_LABELS` convention (`lib/activity/labels.ts`: "created an ATC", "created a Test", "finished a run"), same past-tense-verb + article pattern.
- ********Given****: An ATC "Login with valid credentials" exists in a project I can write to.
- ********When****: I edit it via `AtcEditor.tsx` (or `NewAtcEditor.tsx`), changing any combination of title / layer / tags / steps / assertions / AC bindings, and save.
- ********Then****: The workspace activity feed shows a new entry reading "edited an ATC" for this edit; the same behavior holds regardless of which specific fields changed — `bunkai*update*atc` unconditionally full-replaces children and emits `atc.updated` (collapsed into one parameterized case per test-design-doctrine.md Part 2.5: same behavior across this partition, only the changed-field data varies).

### Scenario 1.2: Should surface a feed entry when the in-app editor is saved with byte-identical content — NEEDS PO/DEV CONFIRMATION (Type: Boundary, Priority: Medium)

- ********NEEDS PO/DEV CONFIRMATION****: current code has no diff-check; confirm this is desired, not accidental noise.
- ********Given****: An ATC's current content is unchanged from its last save.
- ********When****: The in-app editor is saved again with identical data.
- ********Then****: (current behavior) version bumps and an `atc.updated` entry appears anyway — confirm or correct before sprint planning.

## Original AC2 — An ATC edited through the API appears in the activity feed

### Scenario 2.1: Should surface an API-driven ATC edit as an activity feed entry (Type: Positive, Priority: Critical)

- ********Given****: An ATC exists; a teammate or integration is authenticated via Bearer token or cookie.
- ********When****: `PATCH /api/v1/atcs/{id}` is called with a non-empty body.
- ********Then****: The feed shows an entry with the same shape as an in-app edit (unified write path — see Contradictions).

### Scenario 2.2: Should NOT emit a feed entry when the API PATCH is called with an empty body (Type: Negative, Priority: Medium — regression-lock on existing behavior)

- ********Given****: An ATC exists.
- ********When****: `PATCH /api/v1/atcs/{id}` is called with `""` or `"{}"` (the route's documented no-op branch).
- ********Then****: 200 response, no version bump, no `activity_log` row — existing `route.ts` behavior, worth locking in as a regression case since it interacts with this Story's "no spurious entries" spirit.

## Original AC3 — The activity entry names the actor who made the edit

### Scenario 3.1: Should identify the in-app editing teammate as the entry's actor (Type: Positive, Priority: High)

- ********Given****: Teammate "[REDACTED_EMAIL]" edits an ATC via the in-app editor.
- ********When****: The feed is opened.
- ********Then****: The entry's `actor.email` resolves to "[REDACTED_EMAIL]".

### Scenario 3.2: Should identify the API caller as the entry's actor for a Bearer/PAT-driven edit — NEEDS PO/DEV CONFIRMATION (Type: Positive, Priority: High)

- ********NEEDS PO/DEV CONFIRMATION****: BK-182 (open bug — Bearer active-workspace resolution) may affect this path; confirm actor resolution is unaffected.
- ********Given****: A PAT-authenticated caller edits an ATC via the API.
- ********When****: The feed is opened.
- ********Then****: The entry's actor resolves to the PAT owner's email, consistently with the cookie-session case.

### Scenario 3.3: Should render a safe, non-crashing fallback when the editing actor cannot be resolved (Type: Integration, Priority: High)

- ********Given****: The `actor*user*id` on an `atc.updated` row belongs to a departed/deleted user.
- ********When****: The feed renders the entry.
- ********Then****: A safe fallback text renders (mirrors BK-49's existing "a workspace member" pattern, `lib/activity/labels.ts`) — no raw UUID, no crash.

## Original AC4 — The activity entry names the ATC that was edited

### Scenario 4.1: Should display the edited ATC's title as the entry's item label (Type: Positive, Priority: Critical)

- ********Given****: An ATC titled "Login with valid credentials" is edited.
- ********When****: The feed renders the entry.
- ********Then****: `item.label` = "Login with valid credentials" (the payload already carries `title` since migration `0035` — no new resolution needed for this part).

### Scenario 4.2: Should render without breaking layout when the edited ATC's title is near the maximum length (Type: Boundary, Priority: Low)

- ********Given****: An ATC titled with 200 characters (the existing title cap — `AtcEditor` title-length guard, BK-145 finding).
- ********When****: The feed renders the entry.
- ********Then****: The row truncates/wraps per `DESIGN.md` tokens, mirroring BK-49's existing long-label boundary outline — no layout break.

### Scenario 4.3: Should display the ATC's post-edit (not pre-edit) title when the edit itself renamed the ATC — NEEDS PO/DEV CONFIRMATION (Type: Positive, Priority: Medium)

- ********NEEDS PO/DEV CONFIRMATION****: behavior is defined by current code (payload stores the new title), not by an explicit product decision.
- ********Given****: An ATC named "Old name" is renamed to "New name" in the same save.
- ********When****: The feed renders the entry.
- ********Then****: `item.label` = "New name" — confirm this is the desired UX before locking the assertion.

## Original AC5 — The activity entry conveys which Tests the edit affects

### Scenario 5.1: Should list the single affected Test's title when the ATC chains into one Test (Type: Positive, Priority: Critical)

- ********Given****: ATC "Login with valid credentials" is chained only into Test "Regression Suite".
- ********When****: The ATC is edited and the feed is opened.
- ********Then****: The entry conveys "Regression Suite" by name.

### Scenario 5.2: Should list all affected Tests' titles when the ATC chains into multiple Tests (Type: Positive, Priority: Critical)

- ********Given****: The ATC is chained into "Smoke Suite" and "Regression Suite" (the Story's own example).
- ********When****: The ATC is edited and the feed is opened.
- ********Then****: Both titles are conveyed on the one entry.

### Scenario 5.3: Should truncate to the first 3 affected Test titles plus a count of the remainder when the affected-Tests count is large (Type: Boundary, Priority: High)

- ********Resolved 2026-09-20****: no existing event type in this feed renders a variable-length list of related items (confirmed by reading `ActivityView.tsx` + `labels.ts` — every existing action label is fixed text with at most one placeholder). Ruling: plain-text truncation, no new interactive component (no tooltip — fails on touch/mobile; no modal — inconsistent with every other single-line entry in this feed).
- ********Given****: The ATC is chained into 40+ Tests.
- ********When****: The ATC is edited and the feed is opened.
- ********Then****: The entry shows the first 3 affected Test titles followed by literal text "and N more" (e.g. "Smoke Suite, Regression Suite, Billing E2E, and 37 more") — plain text, no link, no expand control.

### Scenario 5.4: Should render a safe fallback for an affected Test that can no longer be resolved to a title (Type: Integration, Priority: High)

- ********NEEDS PO/DEV CONFIRMATION****: no existing precedent for a Test-fallback string (ADR-0011's actor fallback covers users only).
- ********Given****: A Test in `affected*test*ids` is archived or deleted after the edit that referenced it.
- ********When****: The feed renders the entry.
- ********Then****: A safe fallback renders — exact copy undefined, must not be a raw UUID or a broken row.

### Scenario 5.5: Should batch-resolve `affected*test*ids` to Test titles server-side, workspace-scoped (Type: Integration, Priority: Critical — this is the Story's real new-build surface)

- ********Given****: An `atc.updated` row carries one or more `affected*test*ids` (already emitted since migration `0035`).
- ********When****: The activity route builds the response.
- ********Then****: A new resolution mechanism (mirroring `bunkai*resolve*activity*actors`, ADR-0011's pattern, or a payload-time JOIN in `bunkai*update_atc` itself) returns Test titles without leaking cross-workspace Test data. See Technical Questions T1 — the mechanism itself is undecided.

## Original AC6 — An ATC edit that affects no Tests still appears in the feed

### Scenario 6.1: Should render the literal text "No tests affected" when zero Tests are affected, distinct from a broken/blank row (Type: Boundary, Priority: High)

- ********Resolved 2026-09-20****: exact copy is "No tests affected" — this is the zero-boundary counterpart to Scenarios 5.1-5.3's affected-count domain (BVA cluster: 0 · 1 · 2 (multi) · large-N).
- ********Given****: An ATC chained into no Test is edited.
- ********When****: The feed renders the entry.
- ********Then****: The entry shows the literal text "No tests affected" in place of a Test-name list — never blank, never an error state.

## Original AC7 — Creating an ATC still produces exactly one creation entry, never duplicated by an edit entry

### Scenario 7.1: Should produce exactly one atc.created entry with no accompanying atc.updated entry when a new ATC is created (Type: Positive, Priority: Critical)

- ********Given****: A new ATC is created (not edited).
- ********When****: The feed is opened immediately after.
- ********Then****: Exactly one `atc.created` entry appears; `atc.created` and `atc.updated` are emitted by distinct code paths (`bunkai*create*atc`/`0021` vs. `bunkai*update*atc`/`0035`) — true by construction today, worth a regression case rather than a new build.

### Scenario 7.2: Should NOT emit a spurious atc.updated entry from an autosave during ATC creation — NEEDS PO/DEV CONFIRMATION (Type: Negative, Priority: Medium)

- ********NEEDS PO/DEV CONFIRMATION****: unverified whether `NewAtcEditor.tsx`'s create flow autosaves drafts through `bunkai*update*atc` before the ATC is confirmed created.
- ********Given****: A user is drafting a new ATC in `NewAtcEditor.tsx`.
- ********When****: Any autosave occurs before the "create" action is confirmed.
- ********Then****: No `atc.updated` row should appear before the ATC's own `atc.created` row (Error Guessing charter — risk-beyond-AC probe per test-design-doctrine.md).

## Original AC8 — An edit in one workspace never appears in another workspace's feed

### Scenario 8.1: Should NOT show a Workspace B ATC-edit entry in Workspace A's feed (Type: Negative, Priority: Critical — inherited security invariant, regression-confirmation only)

- ********Given****: I am a member of Workspace A only; an ATC in Workspace B is edited.
- ********When****: I open Workspace A's feed.
- ********Then****: Zero rows reference the Workspace B edit. This is not new infrastructure — `activity*log*select*workspace*member` (RLS) plus `bunkai*list*activity`'s `SECURITY INVOKER` posture (already live per BK-49) apply to any action type, including a newly-allowlisted `atc.updated`, with no extra work. Still Critical priority per doctrine (security-adjacent risk is always tested even when inherited).

## Original AC9 — A caller-specified event filter that excludes ATC edits keeps them out of the returned feed

### Scenario 9.1: Should exclude atc.updated entries when a caller's explicit filter omits it, while still returning requested types (Type: Positive, Priority: High)

- ********Given****: A recent ATC edit and a `run.finished` event both exist in the workspace.
- ********When****: A caller requests the feed with `actions=[run.finished]` explicitly.
- ********Then****: Only the `run.finished` entry returns — regression-confirmation that adding `atc.updated` to the allowlist domain doesn't disturb the existing explicit-filter override path (`bunkai*list*activity`, migration `0045`).

### Scenario 9.2: Should return atc.updated entries when a caller's explicit filter requests ONLY that action (Type: Positive, Priority: Medium)

- ********Given****: Same data as 9.1.
- ********When****: A caller requests `actions=[atc.updated]` explicitly.
- ********Then****: Only the ATC-edit entry returns — proves `atc.updated` is independently selectable, not just always-bundled with `atc.created`.

## Original AC10 — Repeated edits to the same ATC each produce their own feed entry

### Scenario 10.1: Should produce two independent feed entries, each with its own actor and timestamp, for two consecutive edits via different surfaces (Type: Positive, Priority: High)

- ********Given****: The same ATC is edited via the in-app editor, then via the API, in quick succession (the Story's own `workflow.md` illustration).
- ********When****: The feed is opened.
- ********Then****: Two distinct rows appear, correctly ordered, each with its own actor and timestamp.

### Scenario 10.2: Should preserve correct entry order when two edits to the same ATC share the same created_at timestamp (Type: Boundary, Priority: Low — inherited tie-break, regression-confirmation only)

- ********Given****: Two edits to the same ATC land with an identical `created_at`.
- ********When****: The feed loads.
- ********Then****: The existing `(created_at, id)` tie-break (BK-49, migration `0045`) orders them deterministically — no new tie-break logic is required for this Story.

---
_Synced from Jira by sync-jira-issues_
