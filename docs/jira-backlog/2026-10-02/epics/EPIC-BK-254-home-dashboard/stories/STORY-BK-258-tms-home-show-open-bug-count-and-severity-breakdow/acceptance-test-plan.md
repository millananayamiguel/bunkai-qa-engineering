# ACCEPTANCE TEST PLAN (ATP): ATP: BK-258: TMS-Home | Show open bug count and severity breakdown

**Jira Key:** [BK-1107](https://jira.upexgalaxy.com/browse/BK-1107)
**Status:** Completed
**Components:** Bunkai Bugs

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

# Acceptance Test Plan: BK-258

***Story******:**** BK-258 TMS-Home | Show open bug count and severity breakdown | ****Epic******:**** BK-254 Home Dashboard | ****Environment******:**** staging | ****TMS******:*** Xray (Set-first)

| Artifact | Key | Status at end of Planning |
| --- | --- | --- |
| ATS (coverage backbone) | BK-1106 | Designing |
| ATP (Test Plan) | BK-1107 | READY |
| ATR (Story Testing, env staging) | BK-1108 | ACTIVE |
| Tests | BK-1093 to BK-1105 (13, Cucumber) | READY |

## 1. Triage

- ***Veto check******:**** no SKIP veto (dynamic, user-facing, DB-backed). REQUIRE-testing trigger present: ****data integrity + authorization*** on a workspace-wide aggregate (a wrong number is a false all-clear; a leak crosses tenants). Full ATP.
- ***Risk score******:**** new feature +3, dynamic data +3, explicit ACs +2, user-facing +2, multi-component (UI + API + DB index) +1 = ****11 (HIGH)*** -> full ATP + extended edge cases.

### Risk triage (impact x likelihood)

| Risk | Impact | Likelihood | Priority | Tests |
| --- | --- | --- | --- | --- |
| Total or breakdown wrong for a normal workspace | High | Medium | P0 | TC1 |
| Wrong status rule (in_progress missed, resolved counted) | High | Medium | P0 | TC2 |
| False all-clear / wrong zero state | High | Low | P0 | TC4 |
| Other workspace's bugs counted (tenant bleed) | High | Low | P0 | TC7 |
| Archived-module bugs counted (fix c9cd8af9 regresses) | Medium | Medium | P1 | TC3 |
| Off-by-one at count 1, zero chips hidden when total > 0 | Medium | Low | P1 | TC5 |
| Count stale after a bug is filed or transitioned | Medium | Medium | P1 | TC6 |
| API contract drifts from the card | Medium | Low | P1 | TC8 |
| API reachable without auth / without atc:read | High | Low | P1 | TC9 |
| Foreign workspace id leaks counts | High | Low | P1 | TC11 |
| Non-UUID id not rejected | Low | Low | P2 | TC10 |
| Read failure renders a zero instead of an error | Medium | Low | P2 | TC12 |
| Severity readable by colour only / Home layout regression | Low | Low | P2 | TC13 |

***Distribution******:*** P0 = 4 · P1 = 6 · P2 = 3 (13 Tests).

## 2. Critical analysis (Phase 1)

- ***Persona******:*** QA Lead (primary), any workspace member (secondary). Value: answer "what does quality look like right now" from Home in under a minute.
- ***Frontend******:*** `app/(app)/home/page.tsx` renders `OpenBugs` in its own Suspense under the welcome banner, above Coverage (BK-259). `components/home/OpenBugs.tsx`: card, error, skeleton. Active workspace from the `bk*active*ws` cookie, else the first workspace.
- ***Backend******:*** `lib/home/open-bugs.ts` `countOpenBugs`: four exact `head:true` counts (P1..P4) on `bugs` filtered by `workspace*id`, `status in ('open','in*progress')`, inner join `modules.archived*at is null`; total = sum; any error -> error state. `GET /api/v1/workspaces/{id}/open-bugs` returns `{ open*count, by*severity, open*statuses }`, auth cookie or PAT with `atc:read`, non-UUID -> 400, foreign/nonexistent -> 200 zeroes (RLS non-disclosure).
- ***DB******:*** `bugs` (severity CHECK P1..P4, status CHECK open|in*progress|resolved|closed, forward-only transitions), `modules.archived*at`, partial index `0061*home*open*bugs*index.sql`.
- ***Complexity******:*** business logic Medium · integration Medium · data validation Low · UI Low.

## 3. Story quality (Phase 2)

- ***Ambiguities (resolved by the PO-proxy, 2026-09-28)******:*** "open" means status `open` OR `in_progress`; bugs in archived modules are excluded; the zero state shows `0` + "Nothing outstanding right now." and hides the P1-P4 chips.
- ***Gaps******:*** no AC for the failed-read state, workspace scope/isolation, or the API; covered as risk-beyond-AC (TC7-TC12).
- ***Observations, not defects******:*** mockup deviations (full-width card, 4 chips instead of "7 P1 · 12 P2 · 14 P3+", no drill-through, no sprint delta) accepted.
- ***Testability******:*** Partial. AC2 and the isolation cases need a dedicated fixture workspace; the error state (TC12) has no user-reachable trigger on staging.

## 4. Refined acceptance criteria (Phase 3)

***AC1 (Positive, Critical).**** Given the active workspace has open bugs in active modules: P1 open x1, P2 open x1, P2 in*progress x1, P3 open x1, P4 in*progress x1. When the QA Lead opens Home. Then the card shows total ****5***, chips "P1 Critical 1", "P2 Major 2", "P3 Minor 1", "P4 Trivial 1", the total equals the chip sum, and the API returns the same numbers.

***AC1.a Status rule (Edge, Critical).*** Bugs in `open` and `in*progress` are counted; `resolved` and `closed` are not. API `open*statuses` = `["open","in_progress"]`.

***AC1.b Archived modules (Edge, High).*** Open bugs whose module is archived are not counted.

***AC1.c Workspace scope (Negative, Critical).*** Only the active workspace's bugs are counted; a foreign or nonexistent workspace id returns 200 with zeroes and discloses nothing.

***AC2 (Boundary, Critical).**** Given no bug in the workspace is open (no bugs, only resolved/closed, or only in archived modules). When the QA Lead opens Home. Then the card shows ****0*** and "Nothing outstanding right now." with no severity chips, and the API returns all zeroes.

***AC3 Failure (Negative, Medium).*** If the count cannot be read, the card shows "This workspace's open bugs could not be counted just now..." and never a zero.

## 5. Test design (Phase 4)

| Technique | Where it fired |
| --- | --- |
| EP | status (counted vs excluded), module (active vs archived), workspace (active / other / foreign / nonexistent), path id (UUID vs invalid formats) |
| BVA | count 0 (TC4), 1 (TC5), many (TC1); UUID length 35/37 chars (TC10) |
| BVA-D | N/A: no rounding or truncation, raw integer counts |
| State-Transition | bug lifecycle: create, open -> in*progress, in*progress -> resolved, resolved -> closed (TC6); invalid backward transitions are blocked by the DB RPC, out of this story's scope |
| Decision Table | credential present x atc:read held (TC9) |
| Pairwise | N/A: fewer than 3 combinable factors |
| Error Guessing | read failure (TC12), a11y colour-only (TC13) |

***1******:******N******:**** AC1 -> 9 Tests (TC1-3, TC5-9, TC11), AC2 -> 1 Test with 3 data rows (TC4), failure/a11y -> 3. ****Collapse justification******:*** TC13 merges the a11y chip check and the Home layout regression because both are read-only presentation checks on the same render with no data variation (trivially atomic). Same-behaviour data variants live in Scenario Outline `Examples` rows (TC2, TC4, TC6, TC9, TC10, TC11).

| # | Test | Title (short) | Type | Level | Priority | Traces |
| --- | --- | --- | --- | --- | --- | --- |
| TC1 | BK-1093 | total + P1-P4 breakdown sums to it | Positive | UI + API | P0 | AC1 |
| TC2 | BK-1094 | open/in_progress counted, resolved/closed not | Edge | UI + API | P0 | AC1.a |
| TC3 | BK-1095 | archived-module bugs excluded | Edge | UI + API | P1 | AC1.b |
| TC4 | BK-1096 | zero state: 0 + message, no chips | Boundary | UI + API | P0 | AC2 |
| TC5 | BK-1097 | total 1 with zero-count chips | Boundary | UI | P1 | AC1 |
| TC6 | BK-1098 | counts follow create + status transitions | State | UI + API | P1 | AC1 |
| TC7 | BK-1099 | only the active workspace's bugs | Negative | UI | P0 | AC1.c |
| TC8 | BK-1100 | API contract + UI/API/DB parity | API | API + DB | P1 | AC1 |
| TC9 | BK-1101 | 401 no auth, 403 PAT without atc:read | Negative | API | P1 | risk |
| TC10 | BK-1102 | 400 bad_request on non-UUID id | Negative | API | P2 | risk |
| TC11 | BK-1103 | foreign/nonexistent id -> 200 zeroes, no leak | Negative | API + DB | P1 | AC1.c |
| TC12 | BK-1104 | error state instead of zero on failed read | Negative | UI | P2 | AC3 |
| TC13 | BK-1105 | severity not by colour only, Home intact | A11y | UI | P2 | DoD |

***Coverage******:*** Positive 1 · Edge 2 · Boundary 2 · State 1 · Negative 5 · API 1 · A11y 1. AC-conformance (the floor) = AC1 + AC2; risk-beyond-AC = 10 of 13 Tests.

## 6. Test data and feasibility

| AC | Precondition | Pattern | Notes |
| --- | --- | --- | --- |
| AC1 | open bugs at several severities in a QA-owned project | Generate | seed in Stage 2 via the UI as staging-userbunk (Owner) |
| AC1.a / AC1.b | bugs per status + an archivable module | Generate + Modify | transitions forward-only; archive a QA-created module only |
| AC1.c | second workspace + a foreign workspace id | Generate / Discover | second workspace owned by staging-userbunk; foreign id read-only from DB |
| AC2 | workspace with zero open bugs | Generate | dedicated fixture workspace; if it cannot be created -> `BLOCKED - unreachable precondition` |
| AC3 | read failure | none | no user trigger on staging; run only if Dev provides a fault hook, else `BLOCKED - unreachable precondition` + code review of the try/catch path |

***Seeding plan (Stage 2, staging only)******:*** in the QA-owned project create modules `BK258-Active` and `BK258-Archive`; file bugs prefixed `[BK-258 QA]`: P1 open, P2 open, P2 in*progress, P3 open, P4 in*progress (TC1); one P3 per status open / in*progress / resolved / closed (TC2); 2 x P1 open in `BK258-Archive`, then archive it (TC3); a P2 walked through create -> in*progress -> resolved -> closed (TC6). Fixture workspace `BK-258 QA Fixture` owned by staging-userbunk: empty (TC4 row 1), then one resolved bug (row 2), then one P4 open (TC5) and 1 open bug for isolation (TC7). PATs: one with `atc:read`, one without (TC9).

***Cleanup (end of Stage 2)******:*** close every `[BK-258 QA]` bug (forward-only, no delete), keep `BK258-Archive` archived and archive `BK258-Active`, revoke both PATs, delete or leave-empty the fixture workspace per product support. Never touch other teams' data, never use production.

## 7. Open questions

1. TC11: the foreign-workspace 200-with-zeroes response is by design (non-disclosure). Stage 2 confirms it leaks nothing (no difference between foreign-with-bugs and nonexistent).
2. PAT scope: `assertWorkspaceContext` is not applied to this read, so a PAT bound to workspace A can read workspace B when its user belongs to B. Documented as by design for non-admin reads; recorded as an observation in TC9/TC11 execution.
3. TC12 needs a Dev-provided fault injection path to be executable on staging.

---

## Related Issues

- tests: [BK-258](https://jira.upexgalaxy.com/browse/BK-258) - TMS-Home | Show open bug count and severity breakdown

---

## Metadata

- **Created:** 2026-09-28
- **Updated:** 2026-09-29
- **Reporter:** Benjamin Segovia
- **Assignee:** Benjamin Segovia

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Plan [BK-1107](https://jira.upexgalaxy.com/browse/BK-1107) description · ATP · synced by sync-jira-issues_
