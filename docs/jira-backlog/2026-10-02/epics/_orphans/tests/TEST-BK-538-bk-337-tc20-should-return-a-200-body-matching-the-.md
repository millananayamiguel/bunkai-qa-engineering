# TEST: BK-337: TC20: should return a 200 body matching the OpenAPI schema for GET bugs id

**Jira Key:** [BK-538](https://jira.upexgalaxy.com/browse/BK-538)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

> ***INFO:**** Promoted to the regression repository by `/test-documentation` Stage 4 on 2026-09-01. Verdict ****Candidate**** at ROI ****80.0***. Executed and PASSED in sprint on Test Execution BK-518.

## Traceability

| Axis | Value |
| --- | --- |
| Source Story | BK-337 TMS-Defect Detail | Open a defect and read its full record |
| Acceptance Criteria covered | API contract, derived beyond the written ACs |
| Acceptance Test Set | BK-541 |
| Acceptance Test Plan | BK-516 |
| Regression Test Plan | BK-831 |
| Feature Test Set | BK-402 |
| Supersedes | none |

## ROI

| Factor | Score | Reading |
| --- | --- | --- |
| Frequency | 5 | every pull request |
| Impact | 4 | the typed API client the framework generates is built from this schema |
| Stability | 4 | the schema is generated from Zod, so it moves only when the code moves |
| Effort (divisor) | 1 | one request, one schema assertion |
| Dependencies (divisor) | 1 | schema fetched from the published endpoint |

`ROI = (5 x 4 x 4) / (1 x 1) = 80.0`

## Highest ROI in the Story

Cheapest guard in the set and the widest blast radius. The schema is generated from Zod via `@asteasolutions/zod-to-openapi` and published at `/api/openapi`, so this Test fails the moment the composer and the published contract drift apart. It is also the contract the framework's own typed client is generated from with `bun run api:sync`, which means a silent drift here propagates into every other API test in the repository.

Derived beyond the written acceptance criteria: no AC asks for schema conformance. The risk is real regardless of whether anybody wrote it down.

## Variables

| Variable | How to obtain |
| --- | --- |
| `openapi_source` | `https://staging-upexbunkai.vercel.app/api/openapi` |
| run-linked `bug_id` | `10000000-0000-4000-8000-000000000011` |
| standalone `bug_id` | `10000000-0000-4000-8000-000000000012` |

## Expected results

`200` with a body that validates against the published response schema, with no additional and no missing property. Both record shapes validate against the one schema: the provenance fields are present and nullable in both, and null exactly when the defect is standalone. The body extends the `bunkai*bug*json` composer rather than redefining it, per migration `0070*bug*detail_composer.sql`.

---

## Related Issues

- is executed by: [BK-518](https://jira.upexgalaxy.com/browse/BK-518) - ATR: BK-337: Story Testing
- is designed by: [BK-516](https://jira.upexgalaxy.com/browse/BK-516) - ATP: BK-337: TMS-Defect Detail | Open a defect and read its full record

---

## Metadata

- **Created:** 2026-08-19
- **Updated:** 2026-09-02
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** api, automation-candidate, high, regression, smoke

---

_Synced from Jira by sync-jira-issues_
