# DEFECT: BK-508: Export archive encodes Run snapshots as JSON, not NDJSON

**Jira Key:** [BK-1025](https://jira.upexgalaxy.com/browse/BK-1025)
**Related Story:** [BK-508](https://jira.upexgalaxy.com/browse/BK-508) - Settings | Request an export of my workspace data
**Priority:** Low
**Status:** In Review
**Components:** Bunkai Runs, Bunkai Workspaces
**Severity:** Menor
**Fix Type:** Bugfix

---

## Description

## Summary

The workspace data-export archive encodes Run snapshots as a plain JSON array (`runs.json`) instead of NDJSON, contradicting the ratified architecture decision on this Story.

## Reference decision

Ely's Tech Lead comment on BK-508 (2026-08-28, "AI Tech Lead — Decision: archive storage mechanism and download delivery") states explicitly:

> NDJSON specifically for Run snapshots (the one entity the architecture-decision comment flags as unbounded) keeps a single entity type streamable instead of forcing one giant JSON array in memory.

## Steps to reproduce

1. Sign in as the workspace Owner on staging.
2. Go to Settings > Data export, request an export of a workspace containing Run history.
3. Wait for the export to reach `ready`, download the archive.
4. Unzip the archive and inspect `runs.json`.

## Actual result

`runs.json` is a single JSON array (`[ {...}, {...} ]`), the same shape used for every other entity file in the archive.

## Expected result

Run snapshots should be encoded as NDJSON (one JSON object per line, no enclosing array/brackets, no comma separators) per the ratified decision — a distinct encoding from the plain-JSON entity files.

## Impact

The archive is still structurally valid and fully parseable by any JSON-array reader — this is a specification/consistency deviation, not a data-loss or functional break. No Acceptance Criterion names the encoding explicitly. Confirmed by downloading and unzipping two real completed exports on staging (workspace `Acme QA` and a second workspace) during BK-508 Stage 2 execution.

## Suggested fix

Encode the Runs entity file as NDJSON in the archive-assembly step, matching the original architecture decision and the manifest's per-entity file listing.

## Traceability

- Story: BK-508
- Failing Test: BK-1015 (TC22)
- Test Execution: BK-1024 (ATR)

---

## Related Issues

- causes: [BK-508](https://jira.upexgalaxy.com/browse/BK-508) - Settings | Request an export of my workspace data
- tests: [BK-1015](https://jira.upexgalaxy.com/browse/BK-1015) - BK-508: TC22: should encode Run snapshots as NDJSON while other entities remain plain JSON
- created by: [BK-1024](https://jira.upexgalaxy.com/browse/BK-1024) - ATR: BK-508: Story Testing
- created by: [BK-1015](https://jira.upexgalaxy.com/browse/BK-1015) - BK-508: TC22: should encode Run snapshots as NDJSON while other entities remain plain JSON

---

## Metadata

- **Created:** 2026-09-11
- **Updated:** 2026-09-24
- **Reporter:** GENESIS OJOSE
- **Assignee:** GENESIS OJOSE

---

_Synced from Jira by sync-jira-issues_
