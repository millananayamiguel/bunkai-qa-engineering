# TEST: BK-315: TC11: should return 401 given a completely unauthenticated request

**Jira Key:** [BK-772](https://jira.upexgalaxy.com/browse/BK-772)
**Status:** Candidate
**Components:** Bunkai ATCs

---

## Test Description

## Test Case: BK-315: TC11

| Field | Value |
| --- | --- |
| Related Story | BK-315 |
| Acceptance scenarios | 3.4 |
| Priority | critical |
| ROI | 60 (F3 I4 S5 / E1 D1) |
| Verdict | Candidate |
| Test level | Integration (API) |
| Prior bugs | None |
| Absorbs | None |

### Precondition

No cookie session, no Bearer PAT

### Action

GET the ATC export for an existing and a nonexistent Project ID

### Expected Results

401 `unauthorized` in both cases (never 404)

### Variables

| Variable | How to obtain |
| --- | --- |
| `{project_id}` | Project the requester is an active member of, seeded per test (POST /api/v1/projects) |
| `{random_uuid}` | crypto.randomUUID() at runtime |

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
- **Labels:** automation-candidate, critical, integration, regression, regression-candidate, security

---

_Synced from Jira by sync-jira-issues_
