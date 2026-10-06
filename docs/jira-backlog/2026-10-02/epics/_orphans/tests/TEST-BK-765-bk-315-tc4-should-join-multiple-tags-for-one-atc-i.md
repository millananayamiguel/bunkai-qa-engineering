# TEST: BK-315: TC4: should join multiple tags for one ATC into a single Tags cell delimited by semicolon-space

**Jira Key:** [BK-765](https://jira.upexgalaxy.com/browse/BK-765)
**Status:** Candidate
**Components:** Bunkai ATCs

---

## Test Description

## Test Case: BK-315: TC4

| Field | Value |
| --- | --- |
| Related Story | BK-315 |
| Acceptance scenarios | 1.4 |
| Priority | medium |
| ROI | 9 (F3 I3 S4 / E2 D2) |
| Verdict | Candidate |
| Test level | Integration (API) |
| Prior bugs | None |
| Absorbs | None |

### Precondition

ATC tagged `smoke`, `regression`, `critical-path`

### Action

GET the ATC export

### Expected Results

Tags cell reads `smoke; regression; critical-path` (semicolon-space, PO Q1), unquoted

### Variables

| Variable | How to obtain |
| --- | --- |
| `{project_id}` | Project the requester is an active member of, seeded per test (POST /api/v1/projects) |
| `{member*pat}` | Bearer PAT from `bun run api:login` (STAGING*USER*EMAIL / STAGING*USER_PASSWORD) |

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
- **Labels:** automation-candidate, integration, medium, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
