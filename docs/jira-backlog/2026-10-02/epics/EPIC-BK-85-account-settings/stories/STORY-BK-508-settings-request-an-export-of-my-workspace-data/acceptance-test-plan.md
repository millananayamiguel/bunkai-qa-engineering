# ACCEPTANCE TEST PLAN (ATP): ATP: BK-508: Settings | Request an export of my workspace data

**Jira Key:** [BK-1023](https://jira.upexgalaxy.com/browse/BK-1023)
**Status:** Completed
**Components:** Bunkai Workspaces

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

# BK-508 — Acceptance Test Plan (QA)

> Jira field: `customfield_10137` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-508)

# Shift-Left Refinement: [https://jira.upexgalaxy.com/browse/BK-508#icft=BK-508](https://jira.upexgalaxy.com/browse/BK-508#icft=BK-508) — Settings | Request an export of my workspace data

********Status*****:*** Refined — Awaiting PO Estimation
********Mode*********:***** Shift-Left (pre-sprint, batch grooming)
****Refined on********: 2026-08-24
********Refined by*****:*** QA — Shift-Left batch session
********Modality****: Jira-native

---

## Phase 1 — Critical Analysis

### Business context

- ********Primary persona affected****: Owner (QA Lead / Quality Engineering Manager persona, `.context/PRD/user-personas.md`)
- ********Secondary personas (if any)****: None — Admin/Member/Viewer are explicitly denied the section (AC-02)
- ********Business value proposition****: Closes the GDPR data-portability commitment already made in `.context/SRS/non-functional-specs.md` §9 with no shipped feature behind it
- ********KPI(s) influenced****: Compliance-request turnaround time; audit-trail completeness
- ********User journey position****: Settings hub, new top-level section alongside `account`, `billing`, `notifications`, `tokens`, `workspaces`

### Technical context

- ********Frontend****: New Settings section (`app/(app)/settings/...`) following the existing per-section-page pattern already used by `settings/tokens`, `settings/workspaces`
- ********Backend****: No export endpoint exists yet. Nearest precedent is the Import Job async pattern (`lib/jira/import-runner.ts`, `import_jobs` table: `queued → running → completed | failed`) — the Tech Lead decision comment on [https://jira.upexgalaxy.com/browse/BK-508#icft=BK-508](https://jira.upexgalaxy.com/browse/BK-508#icft=BK-508) explicitly names this as the model to mirror
- ********External services****: None identified (archive storage mechanism not yet decided — deferred to implementation plan per Tech Lead comment)
- ********Integration points specific to this Story****:

### Story complexity

| ********Axis****** | Rating | Why**** |
| --- | --- | --- |
| Business logic | High | Compliance-critical (GDPR), Owner-only, single-in-flight, expiring-download, credential-scrubbing rules all interact |
| Integration | High | New async job type + new Activity Stream event types + reads across essentially the whole schema |
| Data validation | Medium | Cross-workspace isolation (AC-09) and credential exclusion (AC-10) are the two hard invariants to verify |
| UI | Medium | Five distinct section states (never-requested / preparing / ready / expired / failed) plus loading/error |

********Estimated test effort****: High — comparable to or above [https://jira.upexgalaxy.com/browse/BK-512#icft=BK-512](https://jira.upexgalaxy.com/browse/BK-512#icft=BK-512) (workspace delete), given the async job lifecycle adds a dimension [https://jira.upexgalaxy.com/browse/BK-512#icft=BK-512](https://jira.upexgalaxy.com/browse/BK-512#icft=BK-512) did not have

### Epic-level inheritance (if applicable)

- ********Risks restated at Story level****: [https://jira.upexgalaxy.com/browse/BK-85#icft=BK-85](https://jira.upexgalaxy.com/browse/BK-85#icft=BK-85) (Account & Settings) has no separately captured module-level QA context on file; [https://jira.upexgalaxy.com/browse/BK-512#icft=BK-512](https://jira.upexgalaxy.com/browse/BK-512#icft=BK-512) (sibling Story, also [https://jira.upexgalaxy.com/browse/BK-85#icft=BK-85](https://jira.upexgalaxy.com/browse/BK-85#icft=BK-85), "TMS-| Delete a workspace I own") establishes the Owner-only Settings-section precedent this Story reuses
- ********Integration points inherited****: Settings hub navigation/layout (`settings/layout.tsx`)
- ********PO/Dev answers already given at epic level****: None on file
- ********Test strategy inherited****: None on file — this is the first async-job-lifecycle Story tested under [https://jira.upexgalaxy.com/browse/BK-85#icft=BK-85](https://jira.upexgalaxy.com/browse/BK-85#icft=BK-85)

---

## Phase 2 — Story Quality Analysis

### Ambiguities

| ********#****** | Location in Story | Question for PO/Dev | Impact on testing | Suggested clarification**** |
| --- | --- | --- | --- | --- |
| 1 | Scope / BR / AC-06,07 "stated window" | What is the actual download-expiry duration (hours? days?) | Cannot write BVA test data (exact boundary) until a number exists | State the window explicitly, e.g. "72 hours from ready" |
| 2 | AC-11 / Tech Lead comment | Archive format deliberately left to implementation — which structured format (JSON? CSV bundle? both?) | Cannot assert file structure/parseability until format is fixed | Confirm format before Stage-1 ATP execution, not necessarily before estimation |
| 3 | AC-05 | What HTTP status / error shape does the refused second request return | Cannot assert exact negative-path response | Confirm the error contract (status code + message shape) |
| 4 | AC-08 | Does "offered a way to request it again" reuse the same request record or create a fresh one, and does the failed record remain visible after a successful retry | Affects state-transition test design | Confirm whether failed→retry is a new row or a status reset |

### Gaps (missing info)

| ********#****** | Type | Why critical | What to add | Risk if omitted**** |
| --- | --- | --- | --- | --- |
| 1 | AC | No AC covers an export stuck "preparing" past any bound (large workspaces have unbounded Run-snapshot growth per Tech Lead comment) | A max-duration / stall-detection AC, or an explicit statement that none is needed for MVP | A silently stuck job looks identical to a slow-but-fine one; support cannot distinguish |
| 2 | AC | Concurrent export requests for two ***different*** workspaces the same Owner owns is not addressed — AC-05's "one in flight" reads workspace-scoped but is never confirmed | Confirm the in-flight limit is per-workspace, not per-Owner | If it is actually per-Owner, current AC-05 phrasing under-specifies and testing would miss a valid negative case |
| 3 | AC | Activity Stream audit (AC-12) requires new event types (`export.requested`, `export.downloaded` or equivalent) that do not exist in `ACTIVITY**ALLOWED**ACTIONS` (`lib/activity/constants.ts`) today, and that file's own comments warn the allowlist and the RPC-side SQL default must be updated by hand, in sync | Dev task, not an AC gap per se, but worth flagging so it is not missed the way `bug.filed` already was (that file documents a pre-existing gap of the same shape) | Silent drift between the allowlist and the RPC filter has already happened once in this codebase |
| 4 | Scope | The Tech Lead comment enumerates the entities a workspace's data spans (Projects, Modules, User Stories, ACs, ATCs+steps, Tests+chains, Runs+snapshots, Bugs, Activity, memberships) but `scope.md` only says "the workspace's data" in general terms | Pull that concrete entity list into the Story as a completeness checklist | Without it, QA has no fixed list to verify AC-09/AC-13 exhaustively against |

### Edge cases not in Story

| ********#****** | Scenario | Expected behavior (best guess) | Criticality | Action**** |
| --- | --- | --- | --- | --- |
| 1 | Owner requests a new export immediately after downloading a still-valid previous archive | Old archive link presumably remains valid until its own expiry, independent of the new request | Medium | Added to Phase 4 outline list — confirmed AC-14, no longer an open question |
| 2 | Sole Owner is removed from / leaves the workspace while an export is preparing | Job should not crash; downstream access to the finished archive is undefined (Owner-initiated deletion is out of scope, but membership removal is a separate, in-scope flow) | Low | Test only — don't add AC unless Dev confirms it's reachable pre-BK-512 |
| 3 | A workspace has more than one Owner concurrently | Ruled out — `business-api-map.md` confirms Owner is granted exactly once at workspace creation and invites structurally cannot grant it (DB CHECK constraint) | N/A | No test needed; documented here so it isn't independently rediscovered |
| 4 | A PAT with `workspace:admin` scope calls the export request/download endpoints | Confirmed cookie-only (AC-15) — PAT is rejected regardless of scope | High | Added to Phase 4 outline list — confirmed, no longer an open question |
| 5 | The workspace has zero Projects/Modules/etc. (a brand-new, empty workspace) | Export should still succeed, producing a structurally valid but near-empty archive | Medium | Confirmed AC-16, already covered by an existing Phase 4 outline ("Should produce a valid archive for an empty workspace") |

### Contradictions

No contradictions found. Description, ACs, scope, out-of-scope, and the Tech Lead comment agree.

### Testability validation

********Verdict****: Partial

- Two concretes are explicitly deferred to the implementation plan (download-window duration, archive format) — BVA and structural assertions cannot be finalized until Dev commits both numbers/decisions. Everything else (role gate, single-in-flight, credential scrubbing, audit trail, workspace scoping) is testable as written.

---

## Phase 3 — Refined Acceptance Criteria

### Original AC-05 — Second request while one is preparing is refused

#### Scenario 5.1: Should refuse a second export request for the same workspace while one is preparing (Type: Negative, Priority: High)

- ********Given****: an export of workspace W is in status `preparing`
- ********When****: the Owner requests another export of workspace W
- ********Then****: the second request is refused with a stated reason ("an export is already being prepared")

#### Scenario 5.2: Should allow a concurrent export request for a different workspace the same Owner owns (Type: Positive, Priority: Medium — CONFIRMED per Owner decision comment)

- ********Given****: the Owner owns workspace W1 (export `preparing`) and workspace W2 (no export in flight)
- ********When****: the Owner switches active workspace to W2 and requests an export
- ********Then****: the W2 request is accepted and prepares independently of W1's

### Original AC-07 — Expired archive says so

#### Scenario 7.1: Should mark a ready archive expired once the download window lapses (Type: Boundary, Priority: High)

- ********Given******:****** an export finished preparing and its stated download window (168 hours / 7 days, confirmed) has fully elapsed****
- ********When****: the Owner opens the Data export section
- ********Then****: the section reports the archive as expired, offers a fresh export request, and no download link is presented

### Original AC-09 — Archive scoped to one workspace

#### Scenario 9.1: Should include only the active workspace's records in the archive (Type: Negative, Priority: High)

- ********Given****: the Owner owns workspace W1 (active) and workspace W2, both containing Projects/Modules/User Stories/ATCs
- ********When****: the Owner requests and downloads an export of W1
- ********Then****: every record in the archive belongs to W1; zero records reference W2's `workspace_id`

### New scenarios surfaced from Phase 2 edge cases — CONFIRMED (resolved by Tech Lead / Owner decision comments, 18-28/8)

#### Scenario E1: Should keep a previously-downloaded archive valid on its own expiry after a new export is requested (Type: Edge, Priority: Medium)

- ********CONFIRMED**** by the AI Product Owner decision comment (28/8): only the newest archive is ever offered; a prior archive's own expiry is not independently tracked once superseded
- ********Given****: a ready, unexpired archive exists from a prior export, and the Owner requests a fresh export
- ********When****: the fresh export finishes and the Owner returns to the section
- ********Then****: only the newest archive is offered for download; the prior archive's own expiry (if it had not yet lapsed) is superseded, not independently tracked

#### Scenario E2: Should reject the PAT-driven request/download path (Type: Edge, Priority: High)

- ********CONFIRMED**** by the AI-simulated PO answer (24/8, Q3): cookie-session (Owner) only, no PAT access — equivalent in sensitivity to PAT issuance itself
- ********Given****: a PAT scoped `workspace:admin` for workspace W, held by any user
- ********When****: the PAT calls the export request or download endpoint
- ********Then****: the request is rejected — the route is cookie-session-only, not capability-gated

#### Scenario E3: Should produce a structurally valid archive for a workspace with zero content (Type: Boundary, Priority: Medium)

- ********CONFIRMED**** by the AI Product Owner decision comment (28/8, Q3): falls out of the entity-collection approach with no special-casing
- ********Given****: a brand-new workspace with no Projects, Modules, Tests, Runs, or Bugs
- ********When****: the Owner requests and downloads an export
- ********Then****: the archive is produced successfully, structurally valid, and empty of content records

### New scenarios surfaced from the Tech Lead storage/format decision comments (28/8) — CONFIRMED, not previously in this ATP

#### Scenario E4: Should include a manifest.json describing the archive (Type: Integration, Priority: Medium)

- ********Given****: any completed export
- ********When****: the archive is opened
- ********Then****: the root contains a `manifest.json` listing workspace id, generated-at timestamp, and per-entity record counts, and those counts match the actual per-entity content

#### Scenario E5: Should encode unbounded Run snapshots as NDJSON, other entities as plain JSON (Type: Integration, Priority: Medium)

- ********Given****: a workspace with Run history plus other entity content
- ********When****: the archive is opened
- ********Then****: the Runs file is valid NDJSON (one record per line); every other entity file is a valid JSON array

#### Scenario E6: Should refuse direct access to the storage bucket object outside the download route (Type: Integration/Security, Priority: High)

- ********Given****: a completed export whose archive bytes live in the private `workspace-exports` Storage bucket
- ********When****: the bucket object is requested directly, bypassing the download route (unauthenticated or non-service-role)
- ********Then****: access is refused — the only reachable path to the archive bytes is the download route's own re-verification flow; no signed URL is ever handed to the browser

#### Scenario E7: Should reject a download request whose window has elapsed, even hit directly (Type: Boundary/API, Priority: High)

- ********Given****: an archive's `expires_at` has passed
- ********When****: the download route is called directly, bypassing any cached UI state
- ********Then****: the request is rejected (the route re-verifies `status = 'completed' AND expires_at > now()` server-side on every call, per the Tech Lead storage decision — not trusting a prior page load or a Storage-level TTL)

---

## Phase 4 — Test Outlines (outline names only)

### Coverage estimate

| ********Type****** | Count | Notes**** |
| --- | --- | --- |
| Positive | 7 | Section visibility, request ack, ready-state download, audit entries (request + download), empty-workspace export, concurrent export across 2 workspaces (Scenario 5.2, confirmed) |
| Negative | 6 | Non-Owner visibility (3 roles), second-request refusal, expired-download-link access attempt, PAT rejection at the endpoint (Scenario E2, confirmed) |
| Boundary | 6 | Never-requested empty state, download-window edge, archive-size/empty-workspace edge, failed→retry state edge, newest-archive-supersedes-prior (AC-14, confirmed), expired-window rejected at the route directly (Scenario E7, confirmed) |
| Integration | 6 | Activity Stream event emission, PAT-secret exclusion against `lib/api/pat.ts` storage, cross-workspace isolation against a second real workspace, manifest.json structure (E4), NDJSON-vs-JSON encoding (E5), storage bucket direct-access refusal (E6) |
| API | 3 | Request endpoint, status/poll endpoint, download endpoint (exact routes TBD at implementation) |
| UI states (optional) | 2 | Loading state, error state on the status card — lower priority, may be covered by Stage 2 exploration instead of a dedicated Xray Test |
| ********Total****** | 30**** (28 required + 2 optional) | Driven primarily by the 7-state UI lifecycle × 3 non-Owner roles × the async-job dimension × the storage/format decisions confirmed 28/8 |

********Rationale****: the state-machine shape (never-requested/preparing/ready/expired/failed, plus loading/error) forces boundary and negative coverage per transition, and the three-role visibility check (AC-02) alone accounts for 3 of the negative cases. Compliance-critical invariants (AC-09 isolation, AC-10 credential scrubbing) each warrant a dedicated integration case rather than being folded into a positive-path assertion. The 9 items added 2026-09-11 close the gap between the Tech Lead / Product Owner decision comments (18-28/8) and the original 21 outlines, which predated several of those decisions (storage mechanism, archive format, AC-14/AC-15 confirmation).

### Outline list (NAMES ONLY — preconditions in 1 line, expected in 1 line)

#### Positive

- ********Should show the Data export section to the Owner**** — Pre: signed in as Owner. Expected: section listed in Settings nav, explains what export covers.
- ********Should acknowledge an export request immediately**** — Pre: Owner, no export in flight. Expected: request accepted synchronously, section shows `preparing` + requested-at.
- ********Should offer a single-archive download once ready**** — Pre: export finished preparing. Expected: section shows `ready` + stated window + working download link.
- ********Should record an activity entry for the export request**** — Pre: Owner requests export. Expected: Activity Stream shows a request entry.
- ********Should record an activity entry for the archive download**** — Pre: ready archive downloaded. Expected: Activity Stream shows a download entry.
- ********Should produce a valid archive for an empty workspace**** — Pre: workspace has zero content. Expected: export succeeds, archive structurally valid and empty.
- ********Should allow a concurrent export request for a different workspace the same Owner owns**** — Pre: Owner owns W1 (preparing) and W2 (no export in flight), switches active workspace to W2. Expected: W2 request accepted, prepares independently of W1's.

#### Negative

- ********Should not show the section to an Admin**** — Pre: signed in as Admin. Expected: no Data export section, no reachable route.
- ********Should not show the section to a Member**** — Pre: signed in as Member. Expected: same as above.
- ********Should not show the section to a Viewer**** — Pre: signed in as Viewer. Expected: same as above.
- ********Should refuse a second request while one is preparing**** — Pre: export `preparing`. Expected: refusal with stated reason, original request unchanged.
- ********Should not allow download via an expired link**** — Pre: archive expired. Expected: attempting the stored download reference fails / is not offered; expired state is shown instead.
- ********Should reject a PAT calling the export request or download endpoint**** — Pre: PAT scoped `workspace:admin`, cookie-only routes per AC-15 (confirmed). Expected: request rejected (cookie-session-only enforced) — distinct from the archive-content secret-scrubbing outline below, this tests the endpoint's own auth gate.

#### Boundary

- ********Should show the never-requested empty state honestly**** — Pre: no export ever requested. Expected: told none requested yet, told what an export contains and the window.
- ********Should mark the archive expired exactly at the stated window boundary**** — Pre: window duration confirmed (168 hours / 7 days). Expected: expired state shown, no live download.
- ********Should report a failed export as failed with a retry, not stuck preparing**** — Pre: export preparation fails. Expected: `failed` state shown, retry offered, not shown as `preparing`.
- ********Should allow a fresh request immediately after a failed export**** — Pre: export `failed`. Expected: retry request accepted like a first-time request.
- ********Should keep only the newest archive offered after a fresh export completes**** — Pre: a ready, unexpired archive exists; Owner requests a new export that completes. Expected: section offers only the new archive; the prior archive's own expiry is superseded, not independently tracked.
- ********Should reject a download request whose window has elapsed even when the route is hit directly**** — Pre: archive `expires*at` has passed, download route called directly bypassing any cached UI state. Expected: request rejected (404, per the implementation's collapsed never-requested/not-ready/expired status design), because the route re-verifies `status = 'completed' AND expires*at > now()` server-side on every call.

#### Integration

- ********Should exclude every PAT secret from the archive**** — Pre: workspace has issued PATs. Expected: no PAT secret value present anywhere in the archive.
- ********Should exclude every pending invite/magic-link token from the archive**** — Pre: workspace has outstanding invites. Expected: no invite or magic-link token value present in the archive.
- ********Should scope the archive to the active workspace only**** — Pre: Owner owns 2 workspaces with content. Expected: archive contains only the active workspace's records.
- ********Should include a manifest.json with workspace id, generated-at timestamp, and per-entity record counts**** — Pre: any completed export. Expected: archive root contains `manifest.json` matching that schema; counts match the actual per-entity content.
- ********Should encode Run snapshots as NDJSON while other entities remain plain JSON**** — Pre: workspace has Run history plus other entity content. Expected: the Runs file is valid NDJSON (one record per line); other entity files are valid JSON arrays.
- ********Should refuse direct access to the storage bucket object outside the download route**** — Pre: completed export, a known or guessed Storage object path. Expected: unauthenticated / non-service-role access to the bucket object itself is refused; the only reachable path to the archive bytes is the download route's own re-verification flow.

#### API

- ********Should return the correct status shape when requesting an export**** — Pre: TBD route. Expected: 2xx + acknowledgement payload.
- ********Should return the correct status shape when polling export state**** — Pre: TBD route. Expected: current state + timestamps.
- ********Should return the correct response when downloading a ready archive**** — Pre: TBD route. Expected: file/stream response, correct content type.

#### UI states (optional, lower priority)

- ********Should show a loading state while fetching current export status**** — Pre: section mounts, status fetch in flight. Expected: a loading indicator is shown, not misread as the never-requested state.
- ********Should show an error state if fetching export status fails**** — Pre: status fetch fails (network or 5xx). Expected: an error state is shown with a retry affordance, not misread as any of the 5 lifecycle states.

> ********NOT included here**** (deferred to in-sprint planning by `/sprint-testing` Stage 1): parametrization tables, per-outline test-data JSON, numbered test steps, Faker generation strategies.

---

## Phase 5 — Edge Cases (outline)

| ********#****** | Edge case | In original Story? | Criticality | Action**** |
| --- | --- | --- | --- | --- |
| 1 | New export requested after a still-valid prior archive exists | No | Medium | Added to Phase 4 outline list — see Scenario E1, confirmed |
| 2 | PAT-driven request/download | No | High | Added to Phase 4 outline list — see Scenario E2, confirmed |
| 3 | Empty-workspace export | No | Medium | Added to Phase 4 outline list — see Scenario E3, confirmed |
| 4 | Stuck/stalled `preparing` state with no bound | No | Medium | Confirm with Dev whether MVP needs a stall bound; test only unless added to AC |
| 5 | Concurrent exports across two workspaces the same Owner owns | No | Medium | Added to Phase 4 outline list — see Scenario 5.2, confirmed |

---

## Story Quality Assessment

********Verdict****: Good

********Key findings****:

- 13 ACs already in Gherkin form, backed by a documented architecture decision (async request-and-collect, mirroring the existing Import Job precedent) — this Story arrived unusually well-formed for pre-sprint refinement
- The two genuine gaps (download-window duration, archive format) are already flagged by the Tech Lead comment itself as deliberately deferred, not oversights, and both are now resolved (168h window; ZIP + JSON/NDJSON + manifest.json)
- The main value this refinement adds is surfacing the Owner-only enforcement mechanism question (capability posture vs. role posture) before implementation starts, since the codebase's only existing precedent for a workspace-level action (`workspace:admin` capability) does not by itself produce Owner-only behavior

---

## Critical Questions for PO

> These BLOCKED sprint planning until answered — all 3 answered in the 24/8 comment thread.

1. ********What is the exact download-expiry window?**** — Answered: 7 days (168 hours) from ready.

1. ********Is the "one export in flight" rule scoped per workspace or per Owner?**** — Answered: per workspace.

1. ********Can a PAT request or download a workspace export?**** — Answered: no, cookie-session (Owner) only.

---

## Technical Questions for Dev

> These did not block PO but blocked implementation — all 3 answered in the 24/8 and 28/8 comment threads.

1. ********How is Owner-only access enforced?**** — Answered: explicit inline role check (`assertExportAuthorized`), not the `workspace:admin` capability decorator. Confirmed implemented as specified.
2. ********Which Activity Stream event types does this Story add?**** — Answered: `export.requested`, `export.downloaded`. Confirmed wired into the allowlist and the RPC-side SQL default together.
3. ********What determines archive format?**** — Answered: single ZIP, one JSON/NDJSON file per entity type (NDJSON for the unbounded Runs entity), plus `manifest.json`. Storage: private Supabase Storage bucket `workspace-exports`, service-role only, `fflate` for zip authoring.

---

## Suggested Story Improvements

| ********#****** | Current state | Suggested change | Benefit**** |
| --- | --- | --- | --- |
| 1 | `scope.md` says "the workspace's data" generically | Pull the Tech Lead comment's concrete entity enumeration (Projects, Modules, User Stories, ACs, ATCs+steps, Tests+chains, Runs+snapshots, Bugs, Activity, memberships) into `scope.md` or a new AC | Gives QA a fixed completeness checklist for AC-09/AC-13 instead of an open-ended "the data" |
| 2 | No stated download-expiry duration | Add the concrete window to BR or AC-06/07 | Unblocks exact BVA test data — now resolved (168h), still worth formalizing in the AC text itself |

---

## Data feasibility flags

No data feasibility risks identified. Precedent tables (`import_jobs`), Activity Stream, and PAT storage all already exist to model this Story's data shape against; no missing entity or fixture blocks test design once the two Critical Questions above are answered.

---

## Recommended testing strategy

### Pre-implementation

- PO answers the 3 Critical Questions (window duration, in-flight scope, PAT access) before sprint commitment — done
- Dev confirms the role-enforcement mechanism and the new Activity Stream event names — done

### During implementation

- Verify the export job table mirrors `import_jobs`' state machine rather than inventing a new shape
- Verify new Activity Stream event names are added to both `ACTIVITY**ALLOWED**ACTIONS` and the RPC-side SQL default in the same change (the file's own comment flags this as a known drift risk)

### Post-implementation (in-sprint by /sprint-testing)

- Full execution of the 30 outlines above (28 required + 2 optional UI states), expanded with parametrization + test data
- Explicit credential-scrubbing check against every secret-bearing column in `lib/api/pat.ts` and the invite/magic-link tables
- Explicit verification that the private Storage bucket and the download route's re-verification behave as decided (Scenarios E6/E7)

---

## Risks & mitigation

| ********#****** | Risk | Likelihood | Impact | Mitigated by which outlines**** |
| --- | --- | --- | --- | --- |
| 1 | Owner-only gate implemented as a capability check instead of a role check, silently letting Admin through | Medium | High | 3 negative role outlines (Admin/Member/Viewer) |
| 2 | Archive leaks another workspace's data | Low | High | "Should scope the archive to the active workspace only" |
| 3 | Archive leaks a PAT/invite/magic-link secret | Low | High | "Should exclude every PAT secret…" / "…invite/magic-link token…" |
| 4 | Activity Stream allowlist drift (documented precedent: `bug.filed`) leaves export events unaudited despite AC-12 | Medium | Medium | 2 activity-entry outlines, cross-checked at implementation review, not just at test time |
| 5 | The storage bucket is reachable outside the download route's re-verification (signed URL leak, public policy misconfiguration) | Low | High | "Should refuse direct access to the storage bucket object outside the download route" |
| 6 | A stale UI state lets an Owner attempt a download past expiry, and the route trusts it | Low | Medium | "Should reject a download request whose window has elapsed even when the route is hit directly" |

---

## Next steps

- [x] PO answers Critical Questions before sprint planning — done
- [x] Dev answers Technical Questions before estimation — done
- [x] Story enters sprint at status `Ready For Dev` once estimated — done, now `In Test`
- [x] When Story reaches `Ready For QA`, `/sprint-testing` will short-circuit refinement (label `shift-left-reviewed` detected) — done
- [x] 2026-09-11: folded 9 outlines (7 required + 2 optional UI states) into Phase 4 that were opened by the Tech Lead / Product Owner decision comments (18-28/8) but never propagated into the original outline list — storage/format decisions (manifest.json, NDJSON, private bucket), AC-14/AC-15 confirmation, and Scenario 5.2's concurrent-workspace case

---

**Synced from Jira by sync-jira-issues**

---

## Related Issues

- tests: [BK-508](https://jira.upexgalaxy.com/browse/BK-508) - Settings | Request an export of my workspace data

---

## Metadata

- **Created:** 2026-09-11
- **Updated:** 2026-09-30
- **Reporter:** GENESIS OJOSE
- **Assignee:** GENESIS OJOSE

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Plan [BK-1023](https://jira.upexgalaxy.com/browse/BK-1023) description · ATP · synced by sync-jira-issues_
