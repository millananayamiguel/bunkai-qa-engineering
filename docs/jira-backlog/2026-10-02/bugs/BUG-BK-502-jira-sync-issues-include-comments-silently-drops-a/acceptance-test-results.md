# ACCEPTANCE TEST RESULTS (ATR): ReTest: BK-502: jira:sync-issues --include-comments silently drops all comments for Bug and Improvement types, blinding every routine that reads the PBI cache

**Jira Key:** [BK-888](https://jira.upexgalaxy.com/browse/BK-888)
**Status:** Close
**Components:** None

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

## BK-502 TEST RESULTS

***Tested***: 2026-09-06
***Environment***: staging (tooling-internal ticket — system under test is a local script)
***Result***: FAILED — Issue persists

### Summary

Retested whether `scripts/sync-jira-issues.ts` now syncs the FULL content (not just comments) of Bug/Error and Improvement-type Jira tickets. It does not — the bug reproduces identically to the 2026-08-26 and 2026-09-03 retests.

### Reproduction

1. `bun run jira:sync-issues get BK-502 --include-comments` → `issue type 'Error' is not declared under work_types` warning, 0/0/0 synced, 0 files created
2. `git log --oneline -- scripts/sync-jira-issues.ts` confirms no commit has touched the file since `e2a0aab` (2026-08-16, the commit that regressed the original `711d95a` alias fix) — the fix was never actually merged

### New evidence this pass

Independently reproduced the same failure class on a live Improvement/"Mejora"-type ticket (`BK-830`): `issue type 'Mejora' is not declared under work_types`. `jira-required.yaml`'s `improvement:` entry carries no alias at all for the live Spanish name — confirms the "and Improvement types" half of the original report, previously only a static-analysis claim.

### Test data

- BK-502 itself (Bug/Error type)
- BK-830 (Improvement/"Mejora" type, live reproduction)

### Bugs found

None new — this IS the bug under retest, confirmed unresolved.

### Observations

Root cause unchanged since the last retest: `e2a0aab` deleted the `jira*issue*type_aliases` matching added by `711d95a`; `jira-required.yaml` still declares the alias for `bug:` but nothing reads it. No automated test guards this path, so it can regress silently again once fixed.

### Recommendations

Returning to dev for review. Suggested fix: restore alias-aware matching in `loadRegistry()`'s `byJiraType` map, and add a `sync:` key default to the `bug`/`improvement`/`defect`/`tech*story`/`tech*debt` work_types in `jira-required.yaml` (independent gap, not yet live-verified — both BK-502 and BK-830 fail at the name-mismatch layer before reaching it).

---

## Related Issues

- tests: [BK-502](https://jira.upexgalaxy.com/browse/BK-502) - jira:sync-issues --include-comments silently drops all comments for Bug and Improvement types, blinding every routine that reads the PBI cache

---

## Metadata

- **Created:** 2026-09-06
- **Updated:** 2026-09-06
- **Reporter:** Benjamin Segovia
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Execution [BK-888](https://jira.upexgalaxy.com/browse/BK-888) description · ATR · synced by sync-jira-issues_
