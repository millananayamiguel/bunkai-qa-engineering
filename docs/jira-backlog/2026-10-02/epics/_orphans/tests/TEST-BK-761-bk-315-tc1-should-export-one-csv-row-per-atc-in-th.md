# TEST: BK-315: TC1: should export one CSV row per ATC in the fixed column order given a non-empty library

**Jira Key:** [BK-761](https://jira.upexgalaxy.com/browse/BK-761)
**Status:** Candidate
**Components:** Bunkai ATCs

---

## Test Description

## Test Case: BK-315: TC1

| Field | Value |
| --- | --- |
| Related Story | BK-315 |
| Acceptance scenarios | 1.1, 1.2, 1.3 |
| Priority | critical |
| ROI | 12 (F3 I4 S4 / E2 D2) |
| Verdict | Candidate |
| Test level | Integration (API) |
| Prior bugs | None |
| Absorbs | BK-763 (n=1 boundary); BK-764 (fixed column order) |

### Precondition

Member-role requester; Project with N ATCs (N = 1 and N = 12)

### Action

GET the ATC export for the Project

### Expected Results

200, text/csv; header exactly `ATC ID,Slug,Title,Module,Layer,Tags,Status`; N data rows; ATC ID, Slug, Title, Module, Layer, Status non-empty on every row

### Variables

| Variable | How to obtain |
| --- | --- |
| `{project_id}` | Project the requester is an active member of, seeded per test (POST /api/v1/projects) |
| `{member*pat}` | Bearer PAT from `bun run api:login` (STAGING*USER*EMAIL / STAGING*USER_PASSWORD) |
| `{atc_count}` | Examples column; ATCs seeded via POST /api/v1/atcs |

### Test Design

Gherkin lives in the Xray Cucumber definition of this Test (source of truth).

### Architecture

Route `app/api/v1/projects/[id]/atcs/export/route.ts` · renderer `lib/atcs/csv-export.ts` (`renderAtcsCsv`, `withUtf8Bom`). API-only, no browser needed (`{ api }` fixture).

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
