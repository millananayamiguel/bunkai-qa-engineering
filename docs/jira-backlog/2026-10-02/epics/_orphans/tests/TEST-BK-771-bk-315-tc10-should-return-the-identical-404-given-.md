# TEST: BK-315: TC10: should return the identical 404 given a former member removed from the workspace

**Jira Key:** [BK-771](https://jira.upexgalaxy.com/browse/BK-771)
**Status:** Candidate
**Components:** Bunkai ATCs

---

## Test Description

## Test Case: BK-315: TC10

| Field | Value |
| --- | --- |
| Related Story | BK-315 |
| Acceptance scenarios | 3.3 |
| Priority | critical |
| ROI | 3.75 (F3 I5 S4 / E4 D4) |
| Verdict | Candidate |
| Test level | Integration (API) |
| Prior bugs | None |
| Absorbs | None |

### Precondition

Second test account invited, accepted, then self-left the workspace

### Action

GET the ATC export as the former member

### Expected Results

Same 404 envelope as TC8

### Variables

| Variable | How to obtain |
| --- | --- |
| `{member*pat}` | Bearer PAT from `bun run api:login` (STAGING*USER*EMAIL / STAGING*USER_PASSWORD) |
| `{former*member*pat}` | PAT of a second staging test user (new .env pair needed) |
| `{project_id}` | Project the requester is an active member of, seeded per test (POST /api/v1/projects) |

### Test Design

Gherkin lives in the Xray Cucumber definition of this Test (source of truth).

### Architecture

Route `app/api/v1/projects/[id]/atcs/export/route.ts` · renderer `lib/atcs/csv-export.ts` (`renderAtcsCsv`, `withUtf8Bom`). API-only, no browser needed (`{ api }` fixture).

> ***WARNING:**** ****Refinement notes******:*** Not executed in the sprint (no second account). Needs a second staging test user; removal is self-leave only (no admin remove-member route). Blocker for automation until that fixture exists.

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
