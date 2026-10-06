# TEST: BK-315: TC13: should quote and escape a Title containing a comma, a double quote, or a line break

**Jira Key:** [BK-774](https://jira.upexgalaxy.com/browse/BK-774)
**Status:** Candidate
**Components:** Bunkai ATCs

---

## Test Description

## Test Case: BK-315: TC13

| Field | Value |
| --- | --- |
| Related Story | BK-315 |
| Acceptance scenarios | 4.0, 4.1, 4.2, 4.3 |
| Priority | critical |
| ROI | 15 (F3 I4 S5 / E2 D2) |
| Verdict | Candidate |
| Test level | Integration (API) |
| Prior bugs | None |
| Absorbs | BK-775 (comma only); BK-776 (double quote only); BK-777 (line break only) |

### Precondition

ATC whose Title holds each special-character class (isolated and combined)

### Action

GET the ATC export and parse it with an RFC4180 parser

### Expected Results

Title cell quoted, embedded `"` doubled, comma and line break kept inside the cell; parsed row has 7 columns and the parsed Title equals the stored Title

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
- **Labels:** automation-candidate, critical, integration, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
