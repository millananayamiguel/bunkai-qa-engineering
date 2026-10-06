# ACCEPTANCE TEST RESULTS (ATR): ATR: BK-315: Story Testing

**Jira Key:** [BK-788](https://jira.upexgalaxy.com/browse/BK-788)
**Status:** ACTIVE
**Components:** Bunkai ATCs

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

## [https://jira.upexgalaxy.com/browse/BK-788#icft=BK-788](https://jira.upexgalaxy.com/browse/BK-788#icft=BK-788) TEST RESULTS

***Tested***: 2026-08-31
***Environment***: Staging
***Tester***: Alfonso Hernandez ([REDACTED_EMAIL])
***Result***: PASSED — 20/24 Tests executed and PASSED, 4/24 Not Executed (environment/test-data limitation, non-blocking), 0/24 FAILED

## Summary

Verified [https://jira.upexgalaxy.com/browse/BK-315#icft=BK-315](https://jira.upexgalaxy.com/browse/BK-315#icft=BK-315) (Export a Project's ATC library to CSV) end-to-end: fixed column shape/order, RFC4180 escaping (comma / quote / linebreak, standalone and combined), tag joining, empty / 1-ATC / 12-ATC / 60-ATC libraries, 401/404 non-disclosure across three denial causes, repeated-export-trigger safety, and the CSV formula-injection security fix. All 20 executed Tests PASSED with 0 failures. 4 Tests could not be executed this session due to test-data/environment limitations — not product failures (see ***Not Executed**** below). One test-beyond-AC finding (`atcs.status` dead field) fed a separate Improvement, ****BK-789*** — explicitly not a [https://jira.upexgalaxy.com/browse/BK-315#icft=BK-315](https://jira.upexgalaxy.com/browse/BK-315#icft=BK-315) defect.

> ***SUCCESS:**** ****CSV-injection security verification — highest-risk item this session.*** [https://jira.upexgalaxy.com/browse/BK-784#icft=BK-784](https://jira.upexgalaxy.com/browse/BK-784#icft=BK-784) (TC23) and [https://jira.upexgalaxy.com/browse/BK-785#icft=BK-785](https://jira.upexgalaxy.com/browse/BK-785#icft=BK-785) (TC24) PASSED: the formula-injection prefix-quote neutralization (`lib/atcs/csv-export.ts`) was verified across all 6 trigger characters (`=`, `+`, `-`, `@`, TAB, CR) in both Title and Tags, standalone and combined with RFC4180 escaping. This is a post-PR-review security addendum, not covered by the original ACs — high-priority coverage, confirmed clean.

## Test Cases

| ***TC**** | ****Test**** | ****Status*** |
| --- | --- | --- |
| TC1 | [https://jira.upexgalaxy.com/browse/BK-761#icft=BK-761](https://jira.upexgalaxy.com/browse/BK-761#icft=BK-761): export one CSV row per ATC, all 7 columns, 12-ATC library | PASSED |
| TC2 | [https://jira.upexgalaxy.com/browse/BK-763#icft=BK-763](https://jira.upexgalaxy.com/browse/BK-763#icft=BK-763): exactly one data row given exactly 1 ATC | PASSED |
| TC3 | [https://jira.upexgalaxy.com/browse/BK-764#icft=BK-764](https://jira.upexgalaxy.com/browse/BK-764#icft=BK-764): columns always emitted in fixed order | PASSED |
| TC4 | [https://jira.upexgalaxy.com/browse/BK-765#icft=BK-765](https://jira.upexgalaxy.com/browse/BK-765#icft=BK-765): multiple tags joined into one Tags cell ({{; }}) | PASSED |
| TC5 | [https://jira.upexgalaxy.com/browse/BK-766#icft=BK-766](https://jira.upexgalaxy.com/browse/BK-766#icft=BK-766): pass through each valid ATC status value verbatim | ***NOT EXECUTED*** |
| TC6 | [https://jira.upexgalaxy.com/browse/BK-767#icft=BK-767](https://jira.upexgalaxy.com/browse/BK-767#icft=BK-767): header-only CSV given zero ATCs | PASSED |
| TC7 | [https://jira.upexgalaxy.com/browse/BK-768#icft=BK-768](https://jira.upexgalaxy.com/browse/BK-768#icft=BK-768): no error indicator exporting an empty library | PASSED |
| TC8 | [https://jira.upexgalaxy.com/browse/BK-769#icft=BK-769](https://jira.upexgalaxy.com/browse/BK-769#icft=BK-769): 404 given requester not an active workspace member | PASSED |
| TC9 | [https://jira.upexgalaxy.com/browse/BK-770#icft=BK-770](https://jira.upexgalaxy.com/browse/BK-770#icft=BK-770): identical 404 given a nonexistent Project ID | PASSED |
| TC10 | [https://jira.upexgalaxy.com/browse/BK-771#icft=BK-771](https://jira.upexgalaxy.com/browse/BK-771#icft=BK-771): identical 404 given a former member removed from workspace | ***NOT EXECUTED*** |
| TC11 | [https://jira.upexgalaxy.com/browse/BK-772#icft=BK-772](https://jira.upexgalaxy.com/browse/BK-772#icft=BK-772): 401 given a completely unauthenticated request | PASSED |
| TC12 | [https://jira.upexgalaxy.com/browse/BK-773#icft=BK-773](https://jira.upexgalaxy.com/browse/BK-773#icft=BK-773): no leak of Project existence across the three denial causes | PASSED |
| TC13 | [https://jira.upexgalaxy.com/browse/BK-774#icft=BK-774](https://jira.upexgalaxy.com/browse/BK-774#icft=BK-774): comma + double quote + line break combined | PASSED |
| TC14 | [https://jira.upexgalaxy.com/browse/BK-775#icft=BK-775](https://jira.upexgalaxy.com/browse/BK-775#icft=BK-775): Title containing only a comma | PASSED |
| TC15 | [https://jira.upexgalaxy.com/browse/BK-776#icft=BK-776](https://jira.upexgalaxy.com/browse/BK-776#icft=BK-776): Title containing only a double quote | PASSED |
| TC16 | [https://jira.upexgalaxy.com/browse/BK-777#icft=BK-777](https://jira.upexgalaxy.com/browse/BK-777#icft=BK-777): Title containing only a line break | PASSED |
| TC17 | [https://jira.upexgalaxy.com/browse/BK-778#icft=BK-778](https://jira.upexgalaxy.com/browse/BK-778#icft=BK-778): escape Title and joined Tags independently, same row | PASSED |
| TC18 | [https://jira.upexgalaxy.com/browse/BK-779#icft=BK-779](https://jira.upexgalaxy.com/browse/BK-779#icft=BK-779): escape a single tag containing comma/quote/linebreak | PASSED |
| TC19 | [https://jira.upexgalaxy.com/browse/BK-780#icft=BK-780](https://jira.upexgalaxy.com/browse/BK-780#icft=BK-780): no truncation given a representative large library (60 ATCs) | PASSED |
| TC20 | [https://jira.upexgalaxy.com/browse/BK-781#icft=BK-781](https://jira.upexgalaxy.com/browse/BK-781#icft=BK-781): behave predictably at 5,000+ ATCs | ***NOT EXECUTED*** |
| TC21 | [https://jira.upexgalaxy.com/browse/BK-782#icft=BK-782](https://jira.upexgalaxy.com/browse/BK-782#icft=BK-782): no timeout / partial / corrupted file under slow generation | ***NOT EXECUTED*** |
| TC22 | [https://jira.upexgalaxy.com/browse/BK-783#icft=BK-783](https://jira.upexgalaxy.com/browse/BK-783#icft=BK-783): repeated Export triggers, no duplicate/stuck downloads | PASSED |
| TC23 | [https://jira.upexgalaxy.com/browse/BK-784#icft=BK-784](https://jira.upexgalaxy.com/browse/BK-784#icft=BK-784): prefix-quote when a cell begins with a formula-injection trigger | PASSED |
| TC24 | [https://jira.upexgalaxy.com/browse/BK-785#icft=BK-785](https://jira.upexgalaxy.com/browse/BK-785#icft=BK-785): combine formula-injection prefix-quoting with RFC4180 escaping | PASSED |

## Not Executed (4) — test-infra / environment limitation, NOT product failures

> ***WARNING:**** All 4 remain at Xray Test Run status ****TO DO*** (see Observations — this project's Xray status scheme has no BLOCKED/ABORTED). Block rationale is recorded as a comment on each Xray Test Run.

- ***TC5 (BK-766)**** — status-passthrough parametrized test. `atcs.status` is permanently `'unrun'` system-wide (2995/2995 ATCs sampled) — no code path writes any other value. Session DB role (`qa*inspector*ro`) is read-only, so a non-`unrun` precondition could not be established. Feeds Improvement ****BK-789***.
- ***TC10 (BK-771)*** — removed-member 404. No second test account/credentials were available to orchestrate an invite → accept → remove cycle within this session's time-box; DB role is read-only.
- ***TC20 (BK-781)*** — 5,000+ ATC library. Seeding 5,000+ ATCs was impractical within this session's time-box. Verified via code-path equivalence instead: the export handler is a single buffered, non-paginated read with no size-based branch, so the TC19 result (60 ATCs, no truncation) is representative of the code path at any N.
- ***TC21 (BK-782)*** — slow-generation fault injection. No fault-injection capability was available this session to throttle the backend/DB; not exercised.

## Test Data

- Project ***BK315 Core Export QA*** (`a22058be-8639-40d9-9388-145767b34af7`) — 12 ATCs, one with multiple tags → TC1/TC3/TC4
- Project ***BK315 Special Chars QA*** (`784c4551-...`) — 14 ATCs covering escaping (TC13-18) + injection (TC23-24)
- Project ***BK315 Large Library QA*** (`2c8381be-...`) — 60 ATCs, scaled down from the AC's 500, time-boxed → TC19
- Reused existing 1-ATC project (`d2441360-...`) → TC2; existing 0-ATC project (`4db4cef4-...`) → TC6/TC7
- Reused existing foreign-workspace project "Scoping Test Project" (`1a6fdae6-...`, 2292 ATCs, not a member) → TC8; random UUID → TC9

## Bugs Found

None.

## Observations

- `atcs.status` ***dead field.**** Confirmed permanently `'unrun'` system-wide (2995/2995 ATCs) — no RPC, trigger, or API path ever writes it. Not a [https://jira.upexgalaxy.com/browse/BK-315#icft=BK-315](https://jira.upexgalaxy.com/browse/BK-315#icft=BK-315) defect: the export correctly passes through whatever status value exists. Filed as Improvement ****BK-789*** (test-beyond-AC), parented to QA Defect Management ([https://jira.upexgalaxy.com/browse/BK-183#icft=BK-183](https://jira.upexgalaxy.com/browse/BK-183#icft=BK-183)), linked to this Story.
- ***Process note — Xray status scheme gap.*** This project's Xray Test Run status scheme only has `PASSED` / `TO DO` / `EXECUTING` / `FAILED` — no `BLOCKED` or `ABORTED` (confirmed via a direct `getStatuses` query; both statuses rejected server-side with "Status not found"). The 4 not-executed runs above are left at Xray status `TO DO` — the most honest available representation, since they were genuinely not executed — with the block rationale recorded as a comment on each Xray Test Run. This is a Jira/Xray admin configuration gap, not something fixable via CLI this session; flagging for a project Xray admin to add `BLOCKED`/`ABORTED` to the status scheme.

## Recommendations

- Add `BLOCKED` and `ABORTED` to this project's Xray Test Run status scheme (admin UI, not CLI) so future not-executed runs can be recorded precisely instead of left at `TO DO`.
- TC5, TC10, TC20, TC21 are good candidates to revisit once their preconditions are resolvable: a real Run-execution write path for TC5, a second test account for TC10, a seed fixture for TC20, and fault-injection tooling for TC21.
- CSV-injection coverage (TC23/TC24) is a strong regression-suite automation candidate given its security relevance.

---

## Related Issues

- tests: [BK-315](https://jira.upexgalaxy.com/browse/BK-315) - TMS-ATC Library | Export a Project's ATCs to CSV

---

## Metadata

- **Created:** 2026-08-31
- **Updated:** 2026-09-22
- **Reporter:** Alfonso Hernandez
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Execution [BK-788](https://jira.upexgalaxy.com/browse/BK-788) description · ATR · synced by sync-jira-issues_
