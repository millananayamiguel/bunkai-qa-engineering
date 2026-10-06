# TEST: BK-315: TC23: should prefix-quote the exported cell when its content begins with a formula-injection trigger character

**Jira Key:** [BK-784](https://jira.upexgalaxy.com/browse/BK-784)
**Status:** Candidate
**Components:** Bunkai ATCs

---

## Test Description

## Test Case: BK-315: TC23

| Field | Value |
| --- | --- |
| Related Story | BK-315 |
| Acceptance scenarios | Test-beyond-AC (security, PR #207 review) |
| Priority | high |
| ROI | 18.75 (F3 I5 S5 / E2 D2) |
| Verdict | Candidate |
| Test level | Integration (API) |
| Prior bugs | None |
| Absorbs | BK-785 (prefix-quote combined with RFC4180 escaping) |

### Precondition

ATC whose Title or a tag starts with `=`, `+`, `-`, `@`, TAB or CR

### Action

GET the ATC export

### Expected Results

Cell starts with a literal `'` before the trigger; when the cell also has a comma/quote/line break it is additionally RFC4180-quoted; row keeps 7 columns

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
- **Labels:** automation-candidate, high, integration, regression, regression-candidate, security

---

_Synced from Jira by sync-jira-issues_
