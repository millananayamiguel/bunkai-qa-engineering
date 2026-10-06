# ACCEPTANCE TEST PLAN (ATP): ATP: BK-512: TMS-Workspace | Delete a workspace I own

**Jira Key:** [BK-986](https://jira.upexgalaxy.com/browse/BK-986)
**Status:** Planning
**Components:** None

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

# BK-512 — Acceptance Test Plan (QA)

# Shift-Left Refinement — TMS-Workspace | Delete a workspace I own

***Status***: Refined — Awaiting PO Estimation
***Mode***: Shift-Left (pre-sprint, single-Story session)
***Refined on***: 2026-08-22
***Refined by***: QA — Shift-Left session
***Modality***: Xray

---

## Phase 1 — Critical Analysis

### Business context

- ***Primary persona****: the workspace ****Owner*** (QA Lead / Quality Engineering Manager, per the story's own user-story framing) — the only role that can reach this action at all (business-rules.md).
- ***Secondary personas****: every other ****Member/Admin/Viewer**** of the workspace, who lose access the moment it is deleted (AC-08/AC-09); an ****invited-but-not-yet-accepted**** person whose invite dies with the workspace (AC-14); a ****CI job or AI agent*** holding a Personal Access Token scoped to the workspace (AC-13).
- ***Business value***: closes the deletion half of the GDPR commitment in `.context/SRS/non-functional-specs.md` §9 ("Workspace owners can request data export + deletion via Settings") — the export half already exists as BK-508. This is the only route that lets an Owner honour an erasure request or retire a workspace without asking anyone at Bunkai to do it manually.

### Technical context

- ***Frontend***: `app/(app)/settings/workspaces/page.tsx` (the existing Settings > Workspaces screen). The confirmation is a net-new modal deriving from `components/settings/LeaveWorkspaceModal.tsx`.
- ***Backend***: `app/api/v1/workspaces/[id]/route.ts` currently exports only `GET` and `PATCH` — this story adds the first `DELETE`. The sibling route `app/api/v1/workspaces/[id]/membership/route.ts` (BK-90, Leave) is the closest architectural precedent: a thin route handler delegating to a `SECURITY DEFINER` RPC, with a dependency-free `response.ts` sibling file carrying the re-pointing logic.
- ***Re-pointing mechanism already exists in code***: `lib/workspaces/active.ts` (`resolveActiveWorkspaceId`) is the single source of truth for "which workspace is active," and it already implements a documented tie-break — the caller's oldest membership wins.
- ***External***: none beyond Supabase itself — every workspace-owned table declares `ON DELETE CASCADE` back to `workspaces`.

### Story complexity

| Axis | Rating | Why |
| --- | --- | --- |
| Business logic | Medium | The delete-semantics decision is closed by ADR-0015 (soft-delete, 30-day grace, no member veto). What's genuinely new is re-pointing every other affected member, not just the acting caller the way BK-90's Leave does. |
| Integration | High | Cascade fan-out touches ~15 tables in one statement; PAT/invite non-disclosure and the Activity-Stream-vs-cascade tombstone are both genuine cross-cutting integration concerns. |
| Data validation | Low | The exact-name-match gate is a ported, already-solved UI idiom (`isLeaveConfirmEnabled`). |
| UI | Low–Medium | Reuses `LeaveWorkspaceModal`'s structural convention wholesale; the export offer step (AC-06) and the keyboard-focus contract (AC-20) are narrow and precedented. |

***Estimated test effort***: Medium-High. The ATC/UI surface is small, but the negative/cascade/non-disclosure verification surface is large — most effort sits in Integration and API-level assertions.

---

## Phase 2 — Story Quality Analysis

### Ambiguities (resolved)

1. ***Re-pointing tie-break*** — resolved: reuse `resolveActiveWorkspaceId` / BR-1 verbatim (AI PO ruling, 2026-08-23). No new tie-break rule.
2. ***Eager vs. lazy re-pointing timing*** — resolved by ADR-0015: access ends at `deleted_at`, for everyone including the owner, and the read filter does the eviction; re-pointing is observed lazily the next time any existing call site of `resolveActiveWorkspaceId` runs naturally.

### Gaps (resolved via ADR-0015 and the 2026-08-29 ruling)

1. Resolver citation gap — closed (AC-09/AC-11 cite the resolver via Ratified Clarifications).
2. Concurrent write racing the deletion (N1) — resolved: no lock, no wait, the losing write gets the existing not-found refusal (2026-08-29 ruling, option C).
3. Open Realtime subscription (N3) — resolved: guarantee at the next server round-trip, not-found, re-point via the AC-09 resolver (2026-08-29 ruling, option C). RunnerView 404 client-side polish deferred to a follow-up tech story (not yet filed).
4. Typed-name persistence across the export round-trip (N6) — resolved: resets, same as AC-05 (AI PO ruling, 2026-08-23).

### Contradictions

The BK-512 ACs and ADR-0013 originally ruled opposite ways on delete semantics and the member-veto question. This is now settled: ***ADR-0015*** (Accepted, supersedes ADR-0013 and the interim ADR-0014 numbering collision) is the governing decision — soft-delete with a 30-day grace period, access revoked immediately for everyone, no member veto. AC-03, AC-07 and AC-17 have been rewritten to match ADR-0015 (2026-08-29 AC-alignment edit). No open contradiction remains in the AC field.

### Testability validation

All 20 ACs are Given/When/Then, independently automatable. Two ACs need special test-design attention:

- ***AC-13/AC-14*** ("without revealing the workspace ever existed") require a byte-for-byte fixture comparison against a truly-never-existed PAT/invite id and a freshly-deleted-workspace PAT/invite id.
- ***AC-07*** is best tested as a matrix (one row per listed entity type) rather than one assertion, since it lists ten distinct entity categories.

---

## Phase 3 — Refined Acceptance Criteria

All six shift-left scenarios (N1–N6) are RESOLVED. See `acceptance-criteria.md` for the full, current Given/When/Then bodies — they are the source of truth and are reused verbatim in the Xray Test Gherkin authored for this Story. N1, N3, N4 and N5 were re-ruled on 2026-08-29 to reflect ADR-0015 (soft-delete moves the physical cascade from confirm time to purge time, which supersedes the earlier hard-delete-premised answers to N1 and N4). N2 and N6 were ratified 2026-08-23 and are unchanged by ADR-0015.

---

## Phase 4 — Test Outlines

### Coverage estimate (as executed in this Stage 1 pass)

| Type | Count |
| --- | --- |
| AC-driven outlines (AC-01..AC-20, 1:N exploded per test-design doctrine) | 55 |
| Gap-driven outlines (N1 split ×2, N2 ×1, N3 split ×2, N4 replaced ×2, N5 split ×2, N6 ×1) | 10 |
| Restore-within-grace-period (new, no prior AC) | 3 |
| RLS regression (new, extends `lib/api/rls-parity.test.ts`) | 1 |
| ***Total Tests created**** | ****69*** |

AC-07 is authored as a Scenario Outline + Examples (one row per listed entity type) rather than ten separate Tests, per the cascade-matrix test-design guidance. Two Tests are intentionally BLOCKED at creation time and are expected to sit at a failing/blocked execution status until their respective follow-up items land:

- The RunnerView `refetchRun` 404-vs-network-blip client fix (N3 DoD gap, deferred to an unfiled follow-up tech story per the 2026-08-30 mockup-gate-clearing comment).
- The Owner-restore UI entry point (ADR-0015 point 5 cuts the Owner's own access at confirm time; no AC or comment yet states how the Owner reaches the restore action).

Full per-outline breakdown: see `comments.md` "Phase 3 Addendum — New Outlines from Comment Review (2026-09-08)" and the Phase 4 outline list above it in this same field.

---

## Story Quality Assessment

***Good.*** One of the most thoroughly specified stories this discovery has seen: 20 independently testable Given/When/Then ACs, explicit Business Rules, explicit Scope/Out-of-Scope, and a governing ADR (ADR-0015) closing the delete-semantics question with a scored, evidence-based ruling. The story's mockup gate has since cleared (2026-08-30) and this Stage 1 QA pass (2026-09-08) has now created full Xray traceability: 69 Tests, the ATS (Set-first coverage backbone), this ATP, and the ATR shell.

## Data feasibility flags

This is the only flow in the product that performs a scheduled, purge-bound erasure of an entire tenant, on a single Supabase project shared across local/staging/production. Automated regression coverage for this story must create fully synthetic, uniquely-named workspaces per test run.

## Recommended testing strategy

Execute the full ATP against a freshly created, single-purpose workspace per test run — covering all 20 original ACs plus every confirmed gap scenario, the restore-within-grace-period path, and the RLS regression case. Verify AC-07's cascade as a matrix (one check per listed entity type) via direct API/DB assertion, not merely UI absence, and verify AC-13/AC-14's non-disclosure claim via the exact byte-for-byte fixture, not a generic status-code assertion.

---

**Seeded from the synced **`acceptance-test-plan.md`** field content by /sprint-testing Stage 1 (2026-09-08). Test list derives from ATS BK-985 membership — not maintained here.**

---

## Related Issues

- is tested by: [BK-512](https://jira.upexgalaxy.com/browse/BK-512) - TMS-| Delete a workspace I own

---

## Metadata

- **Created:** 2026-09-09
- **Updated:** 2026-09-09
- **Reporter:** GENESIS OJOSE
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Plan [BK-986](https://jira.upexgalaxy.com/browse/BK-986) description · ATP · synced by sync-jira-issues_
