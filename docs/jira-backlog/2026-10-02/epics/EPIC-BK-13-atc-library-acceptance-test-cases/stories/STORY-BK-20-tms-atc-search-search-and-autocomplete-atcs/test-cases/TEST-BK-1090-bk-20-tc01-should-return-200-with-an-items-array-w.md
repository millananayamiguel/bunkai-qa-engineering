# TEST: BK-20: TC01: should return 200 with an items array when GET /atcs/search queries a project's ATCs

**Jira Key:** [BK-1090](https://jira.upexgalaxy.com/browse/BK-1090)
**Status:** Draft
**Components:** None

---

## Test Description

***Related Story******:**** BK-20 (TMS-ATC Search | Search and autocomplete ATCs) | ****Epic******:*** BK-13

***AC covered******:*** search returns matches within the caller's project (API contract of GET /atcs/search)

***Automated by******:*** `AtcApi.searchAtcs` (KATA ATC, `tests/components/api/AtcApi.ts`)

## Steps

1. Sign in with `POST /api/v1/auth/signin` and take the Bearer PAT (scope `atc:read`) from the response.
2. Send `GET /api/v1/atcs/search` with the query parameters `query` (free text) and `project*id` (a project in the caller's active workspace). Optional: `module*id`, `layer`, `limit`.

## Expected result

- The response status is 200.
- The body carries an `items` array (empty when nothing matches, never 404).

---

## Related Issues

- tests: [BK-20](https://jira.upexgalaxy.com/browse/BK-20) - TMS-ATC Search | Search and autocomplete ATCs

---

## Metadata

- **Created:** 2026-09-24
- **Updated:** 2026-09-24
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** api, automation-candidate, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
