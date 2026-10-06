# TEST: BK-315: TC19: should include every row without truncation given a library past the 1000-row read cap

**Jira Key:** [BK-780](https://jira.upexgalaxy.com/browse/BK-780)
**Status:** Candidate
**Components:** Bunkai ATCs

---

## Test Description

## Test Case: BK-315: TC19

| Field | Value |
| --- | --- |
| Related Story | BK-315 |
| Acceptance scenarios | 5.1 (+ 5.2 boundary) |
| Priority | critical |
| ROI | 8 (F3 I4 S4 / E3 D2) |
| Verdict | Candidate |
| Test level | Integration (API) |
| Prior bugs | BK-637 (modules read unpaged -> 500 past 1000 modules; fixed, pending QA retest) |
| Absorbs | None |

### Precondition

Project seeded with 1000 and 1001 ATCs

### Action

GET the ATC export

### Expected Results

200; data rows equal the seeded count; every seeded ATC ID present exactly once

### Variables

| Variable | How to obtain |
| --- | --- |
| `{project_id}` | Project the requester is an active member of, seeded per test (POST /api/v1/projects) |
| `{member*pat}` | Bearer PAT from `bun run api:login` (STAGING*USER*EMAIL / STAGING*USER_PASSWORD) |
| `{atc_count}` | Examples column; bulk-seeded in beforeAll, cleaned in afterAll |

### Test Design

Gherkin lives in the Xray Cucumber definition of this Test (source of truth).

### Architecture

Route `app/api/v1/projects/[id]/atcs/export/route.ts` · renderer `lib/atcs/csv-export.ts` (`renderAtcsCsv`, `withUtf8Bom`). API-only, no browser needed (`{ api }` fixture).

> ***WARNING:**** ****Refinement notes******:*** Redesigned by BVA. Sprint run used 60 ATCs and the ATR justified skipping TC20 as a "single non-paginated read". Wrong premise: PostgREST caps every unranged select at 1000 rows (db-max-rows), and both reads now go through fetchAllPages (BK-637). 60 or 500 rows never cross that boundary; 1000/1001 do. 5,000+ (BK-781) stays Deferred: same code path as 1001.

### Traceability

Story: BK-315 · ATS: BK-786 · ATP: BK-787 · ATR: BK-788 · Feature TS: BK-1087

---

## Metadata

- **Created:** 2026-08-31
- **Updated:** 2026-09-22
- **Reporter:** Alfonso Hernandez
- **Assignee:** Alfonso Hernandez
- **Labels:** automation-candidate, critical, integration, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
