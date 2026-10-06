# TEST: BK-315: TC8: should return the same 404 Project not found given the Project is foreign or does not exist

**Jira Key:** [BK-769](https://jira.upexgalaxy.com/browse/BK-769)
**Status:** Candidate
**Components:** Bunkai ATCs

---

## Test Description

## Test Case: BK-315: TC8

| Field | Value |
| --- | --- |
| Related Story | BK-315 |
| Acceptance scenarios | 3.1, 3.2, 3.5 (body/header part) |
| Priority | critical |
| ROI | 18.75 (F3 I5 S5 / E2 D2) |
| Verdict | Candidate |
| Test level | Integration (API) |
| Prior bugs | None |
| Absorbs | BK-770 (nonexistent Project ID); body/header identity from BK-773 (timing part stays Deferred) |

### Precondition

Authenticated requester; target Project is in a foreign workspace, or the ID does not exist

### Action

GET the ATC export for that Project ID

### Expected Results

404 with the `not_found` / "Project not found." envelope; body identical across both partitions; no CSV produced

### Variables

| Variable | How to obtain |
| --- | --- |
| `{member*pat}` | Bearer PAT from `bun run api:login` (STAGING*USER*EMAIL / STAGING*USER_PASSWORD) |
| `{foreign*project*id}` | Project in a workspace the requester is not a member of (seeded by a second account, or looked up read-only via DBHub) |
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
