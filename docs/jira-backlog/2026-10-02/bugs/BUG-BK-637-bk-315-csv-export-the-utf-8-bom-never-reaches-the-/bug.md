# BUG: BK-315 CSV export: the UTF-8 BOM never reaches the downloaded file, and its test passes anyway

**Jira Key:** [BK-637](https://jira.upexgalaxy.com/browse/BK-637)
**Priority:** Medium
**Status:** Ready For QA
**Components:** None
**Fix Type:** Bugfix

---

## Description

## Summary

Two defects introduced by the [https://jira.upexgalaxy.com/browse/BK-315#icft=BK-315](https://jira.upexgalaxy.com/browse/BK-315#icft=BK-315) conductor-review fix round (PR #207, merged as d3182c0). Both are MINOR and neither reintroduces the row-cap blocker that PR closed. Filed separately so the fix is not buried.

## Defect 1 -- the UTF-8 BOM is stripped before the file is written, and the test gives false confidence

app/api/v1/projects/[id]/atcs/export/route.ts:57 prepends a UTF-8 BOM to the CSV body. app/(app)/projects/[projectSlug]/export-atcs-button.tsx:47-49 reads the response with response.text().

response.text() runs the WHATWG "UTF-8 decode" algorithm, which strips a leading EF BB BF when the body arrives as bytes. Verified empirically in this runtime: a Response built from a byte array returns len 3, first codepoint 0x61 – the BOM is gone. The BOM therefore survives only for direct API consumers (curl, PAT); it never reaches the browser download, which is the path it was added for.

Worse, app/api/v1/projects/[id]/atcs/export/route.test.ts:190 asserts the BOM is present and ***passes***, because Bun's Response-from-string path does not strip it. So the one path that matters is untested and the test actively signals the opposite.

Expected: an auditor clicking "Export as CSV" and opening the file in Windows Excel sees "Validacion de pago" rendered correctly.
Actual: the system ANSI codepage is used and they see mojibake, exactly as if the BOM had never been added.

Suggested fix: prepend the BOM client-side in the blob – new Blob(['\uFEFF' + csv], ...) – or drop the server-side BOM and do it only client-side. Then change the route test so it exercises the byte path, or move the assertion to a test of the button.

## Defect 2 -- the sibling modules read is still unpaged, and now aborts the export

app/api/v1/projects/[id]/atcs/export/route.ts:71 reads modules without .range(), so it is subject to the same PostgREST db-max-rows = 1000 cap the paging fix addressed one line above.

The same fix round also removed the unreachable '?? em-dash' fallback and replaced it with a hard internal_error throw (route.ts:83-90). That was the right call – it is what stops this from being silent data loss – but it converts the truncation into an outage.

Expected: a project with more than 1,000 modules exports successfully.
Actual: modulePathById is missing entries, the first ATC referencing a capped-out module throws, and the export returns 500 for that project permanently.

Suggested fix: reuse the paging helper already added at lib/atcs/export-query.ts:18-38 for the modules read.

## Two design fragilities recorded at the same time (not defects, no action required unless they bite)

- ATCS*EXPORT*PAGE_SIZE = 1000 at lib/atcs/export-query.ts is hardcoded to equal db-max-rows. If PostgREST's cap is ever lowered below 1000, page.length < pageSize fires on the first page and silent truncation returns. A count-based assertion would be robust. The empirical value is documented at export-query.ts:1-8.
- Offset paging with ORDER BY id can skip or duplicate a row if an ATC is inserted mid-export. Negligible for a human-triggered audit pull.

## Note on the formula-injection tradeoff

Not a defect, recorded so nobody re-opens it: the neutralisation prefixes cells starting = + - @ tab CR with an apostrophe. A legitimate value such as "-1 offset bug" is exported as "'-1 offset bug". Spreadsheets hide the apostrophe; a plain CSV re-import into a database would ingest it literally. This is the deliberate tradeoff ratified in master-design-plan.md section 5, D36 post-merge addendum.

## Provenance

Surfaced by the conductor re-review of PR #207's fix round. PR #207 was merged rather than held, because the blocker and both MAJORs were genuinely closed and holding it would have queued the rest of the Ready-For-Dev sweep behind two MINORs.

---

## Metadata

- **Created:** 2026-08-27
- **Updated:** 2026-08-31
- **Reporter:** Ely
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_
