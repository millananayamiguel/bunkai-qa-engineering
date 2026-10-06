# ACCEPTANCE TEST RESULTS (ATR): ATR: BK-230: Story Testing

**Jira Key:** [BK-825](https://jira.upexgalaxy.com/browse/BK-825)
**Status:** ACTIVE
**Components:** None

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

**BK-230 TEST RESULTS — ATR****:**** BK-230****:**** Story Testing**

| Field | Value |
| --- | --- |
| Tested | 2026-09-01 |
| Environment | staging (`https://staging-upexbunkai.vercel.app`) |
| Tester | Carlos C ([REDACTED_EMAIL]) |
| Result | ***PASSED WITH ISSUES*** — 12 / 23 PASS, 1 FAIL (non-blocking), 10 not executed |
| Artifacts | ATP BK-824 · ATS BK-823 · STP BK-826 |
| Findings | BK-827, BK-828, BK-829 (Defect) · BK-830 (Improvement) |

> ***WARNING:**** QA cannot fully sign off BK-230. ****AC3 (payment declined) NOT TESTED**** and the ****real-payment path of AC2 NOT TESTED*** — staging has no Stripe config (`STRIPE*SECRET*KEY` / `STRIPE*WEBHOOK*SECRET` / `STRIPE*CLOUD*PRICE_ID` absent; see BK-827). The upgrade mechanism is verified; the Stripe redirect + real card + declined card legs are not.

---

**SUMMARY**

BK-230 adds the paid-plan upgrade surface: 3-tier comparison UI at `/settings/billing/upgrade`, workspace-scoped `POST .../billing/checkout`, a Stripe webhook receiver, the `billing*checkout*sessions` state machine, `bunkai*enforce*project*limit()`, and the `bunkai*apply*billing*checkout*webhook*event()` activation RPC. Plan mapping: `community` = Free, `cloud` = Team, `enterprise` = Enterprise. Testing covered UI, API (cookie + bearer) and DB. Where Stripe blocked an end-to-end path, the mechanism was verified via a bounded, fully-torn-down DB sandbox (Stage 2b) and code-reads of the live Postgres functions. The single FAIL (TC23 / BK-829) is a tenant-existence enumeration oracle — security-hardening, non-blocking, low exploitability.

---

**ENVIRONMENT NOTES**

- Stripe test-mode NOT wired on staging — `POST .../billing/checkout` → HTTP 500. Filed as BK-827 (also covers the 500-vs-503 inconsistency + internal-detail disclosure).
- Seeded sandbox created and fully removed — Stage 2b made one throwaway workspace (`BK-230 ATP sandbox`) by direct DB INSERT, seeded projects/members and hand-replicated the activation RPC's writes, then reversed everything in one transaction. All clean-proof SELECTs return 0; the 2 real workspaces are identical to baseline. Ledger: `.session/sprint-testing/BK-230/teardown-ledger.md`.
- QA cannot drive the webhook RPC on staging — `bunkai*apply*billing*checkout*webhook*event` grants EXECUTE to `service*role` only and the HTTP webhook route is unreachable without `STRIPE*WEBHOOK*SECRET`. TC17(a–e) + TC18 verified by code-read only (F6 below).

---

**TEST CASES** (23 planned)

| Verdict | Count | Test cases |
| --- | --- | --- |
| PASS | 12 | TC1, TC3, TC5\**, TC6\**, TC7, TC8, TC12, TC13, TC14\**, TC18\**\**, TC19, TC22\**\* |
| FAIL (non-blocking) | 1 | TC23 → BK-829 |
| BLOCKED — no principal / no cloud ws | 3 | TC2, TC15, TC16 |
| BLOCKED — RPC EXECUTE denied (code-read only) | 1 | TC17 — signature-presence leg (f) partial-passed |
| NOT TESTED — environment defect (Stripe) | 6 | TC4, TC9, TC10, TC11, TC20, TC21 — all blocked by BK-827 |

TC↔key: TC1 BK-800 · TC2 BK-801 · TC3 BK-802 · TC4 BK-819 · TC5 BK-812 · TC6 BK-803 · TC7 BK-813 · TC8 BK-814 · TC9 BK-820 · TC10 BK-804 · TC11 BK-805 · TC12 BK-806 · TC13 BK-807 · TC14 BK-815 · TC15 BK-808 · TC16 BK-816 · TC17 BK-817 · TC18 BK-821 · TC19 BK-822 · TC20 BK-809 · TC21 BK-810 · TC22 BK-811 · TC23 BK-818.

\** verified via the Stage 2b DB sandbox (seeded + torn down). \**\* verified by code-read of the live Postgres function; RPC dispatch not executable on staging.

> ***INFO:**** This Xray project's run-status set has no `BLOCKED` / `ABORTED` value (only TO DO / EXECUTING / PASSED / FAILED). The 10 non-executed runs stay at ****TO DO*** with an explicit per-run comment stating the block reason — treat this table as authoritative for those.

---

**ACCEPTANCE CRITERIA RESULT**

| AC | Verdict | Basis |
| --- | --- | --- |
| AC1 — compare tiers, current plan marked | ***PASS*** | TC1, TC3. Minor: tier labels Community/Cloud/Enterprise vs ratified Free/Team/Enterprise → BK-830. |
| AC2 — successful Free→Team upgrade unlocks limits; receipt | ***MECHANISM PASS · real-payment path NOT TESTED*** | Project-limit gate verified both directions with the real trigger (TC5); activation writes (plan + `purchased*seats`, session→completed, `activity*log workspace.plan*upgraded`) hand-replicated and post-states asserted (TC4); seat meter reads `purchased*seats` (TC6). Stripe redirect + real card + the RPC's own dispatch/guard branches unexercised; receipt channel not observed. |
| AC3 — declined payment: stays Free, nothing charged, message, retry | ***NOT TESTED*** | TC9/TC10/TC11 need Stripe test-mode (BK-827). No optimistic activation seen on any failed attempt (DB verified), but decline UX / decline_code copy / retry flow unverified. |
| AC4 — Enterprise is a contact path, not checkout | ***PASS*** | TC12 — "Contact sales" → `mailto:[REDACTED_EMAIL]`, zero card fields. |
| AC5 — only owner completes upgrade; admin views only | ***PASS*** | TC14 (definitive): non-owner admin → GET `/billing` 200, POST `/billing/checkout` → 403 `not*workspace*owner`, no row. TC15/TC16 (member/viewer copy) blocked — no non-owner principal at Stage 2; server gate covered by TC14. |
| E1 / Scn 21-22 — one open checkout session under concurrency | ***PASS*** | TC19 — 5 concurrent calls → 1 enforced open row, losers 409 / same URL, 0 stranded locks. |

---

**FINDINGS**

| Key | Type | Sev / Pri | Title |
| --- | --- | --- | --- |
| BK-827 | Defect | Major / High | create-checkout → HTTP 500 + leaks the raw internal reason to the client on an unconfigured processor (webhook route does 503 for the same state). Also the environment blocker for the payment-path TCs. |
| BK-828 | Defect | Major / High | Owner cannot start checkout via API bearer/PAT token — 403 "Missing required capability: workspace:admin", though the same token passes the same-named gate on GET /billing. Blocks API automation of AC2/AC5.1. |
| BK-829 | Defect | Major / High | Tenant-existence enumeration oracle on POST /billing/checkout — 403 for an existing foreign workspace vs 422 for a non-existent one. GET /billing is clean. Mitigations: UUIDv4 ids, no data returned. |
| BK-830 | Improvement | Minor / Low | Tier labels "Community / Cloud / Enterprise"; PO Ratification B1 + ACs + workflow.md specify "Free / Team / Enterprise". |

***Withdrawn*** — the Stage 2 "seat floor is a flat 1" finding was a false positive: with `active*seats = 3` create-checkout rejects `seat*quantity` 1 and 2 (HTTP 422 "between 3 and 25") and accepts 3. The dynamic minimum `= active_seats` IS implemented (only single-member workspaces were tested initially).

***F6 (coverage limitation, not filed)*** — QA has no path to invoke `bunkai*apply*billing*checkout*webhook*event` on staging (least-privilege DB role + missing `STRIPE*WEBHOOK_SECRET`). TC17(a–e) + TC18 stand on a code-read of the live function, which shows the guard/idempotency dispatch is sound and a genuinely paid late webhook after expiry activates (`applied`) rather than being silently dropped. Test-infra limitation, not a product defect.

---

**OBSERVATIONS**

Security-class FAIL recalibration (TC23 / BK-829) — hypothesis: low impact because workspace ids are UUIDv4 and no data is returned on either branch. Verification fact: the sibling `GET .../billing` already returns a uniform 404 for both "foreign" and "non-existent", so a uniform response is achievable and expected here. Decision: real hardening defect, filed BK-829 (Major, non-blocking); per QA + PO decision the Story is ***not*** formally blocked.

Positive: plan never activates optimistically (verified after ~11 failed attempts + a 5-way burst; no `workspace.plan_upgraded` row); failed-checkout self-cleanup is robust (`open → expired`, 0 stranded locks); concurrency lock returns a clean 409; webhook signature-presence check works; the activation RPC's idempotency + late-paid carve-out are sound by code-read; `projects` has no soft-delete column so the project-limit trigger has no quota-leak vector.

---

**RECOMMENDATIONS / NEXT STEPS**

1. Configure the 3 Stripe test-mode env vars on staging + Stripe CLI access, then re-run TC4 / TC9 / TC10 / TC11 / TC17(a–e) / TC18 / TC20 / TC21 — a short pass closes AC2 and AC3.
2. Fix BK-827 and BK-828 so API-level regression automation of the billing flow is possible.
3. Address BK-829 (uniform non-disclosure on POST /billing/checkout) and BK-830 (customer-facing tier labels).
4. Stage 4 (test-documentation): the 12 PASS TCs are ROI-eligible; TC19 (concurrency lock) and TC5/TC6 (limit + meter) are strong automation candidates; TC17/TC18 need a lower env with `service_role` / Stripe test keys.

**Detail beyond this body****:** `.session/sprint-testing/BK-230/test-session-memory.md` and `.../progress.md`.

---

## Related Issues

- is tested by: [BK-230](https://jira.upexgalaxy.com/browse/BK-230) - Billing | Upgrade to a paid plan

---

## Metadata

- **Created:** 2026-09-01
- **Updated:** 2026-09-03
- **Reporter:** Carlos C
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Execution [BK-825](https://jira.upexgalaxy.com/browse/BK-825) description · ATR · synced by sync-jira-issues_
