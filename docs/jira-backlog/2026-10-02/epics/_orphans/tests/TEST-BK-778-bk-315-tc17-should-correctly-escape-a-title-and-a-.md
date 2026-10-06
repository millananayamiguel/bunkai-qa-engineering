# TEST: BK-315: TC17: should correctly escape a Title and a joined Tags cell independently in the same row when both contain special characters

**Jira Key:** [BK-778](https://jira.upexgalaxy.com/browse/BK-778)
**Status:** Candidate
**Components:** Bunkai ATCs

---

## Test Description

## Test Case: BK-315: TC17

| Field | Value |
| --- | --- |
| Related Story | BK-315 |
| Acceptance scenarios | 4.4, 4.5 |
| Priority | high |
| ROI | 15 (F3 I4 S5 / E2 D2) |
| Verdict | Candidate |
| Test level | Integration (API) |
| Prior bugs | None |
| Absorbs | BK-779 (a tag's own text needs escaping, decision-table row 3) |

### Precondition

ATCs covering the Title x Tags decision table (rows 3 and 4)

### Action

GET the ATC export and parse it with an RFC4180 parser

### Expected Results

Each cell escaped independently; parsed row always has 7 columns; parsed Tags equals the stored tags joined by `; `

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
- **Labels:** automation-candidate, high, integration, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
