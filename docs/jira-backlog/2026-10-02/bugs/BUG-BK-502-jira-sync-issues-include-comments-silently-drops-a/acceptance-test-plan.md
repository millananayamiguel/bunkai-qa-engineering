# ACCEPTANCE TEST PLAN (ATP): ATP: BK-502: jira:sync-issues --include-comments silently drops all comments for Bug and Improvement types, blinding every routine that reads the PBI cache

**Jira Key:** [BK-887](https://jira.upexgalaxy.com/browse/BK-887)
**Status:** Planning
**Components:** None

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

## Bug Analysis — BK-502

***Date***: 2026-09-06

### Bug summary

Was: `jira:sync-issues --include-comments` silently drops ALL content (not just comments) for any Bug/Error-type ticket — worse than the ticket title states. Root cause: `e2a0aab` (2026-08-16) deleted the Error-alias fix added in `711d95a` (2026-08-04); `jira-required.yaml` still declares `jira*issue*type*aliases: [Error]` on `bug:` but nothing reads it anymore. Second, independent, not-yet-live-verified layer: `bug`/`improvement`/`defect`/`tech*story`/`tech_debt` all lack a `sync:` key entirely, so even an exact issue-type-name match would still skip (defaults to `'never'`).

Fix: restore alias-aware matching in `loadRegistry()`'s `byJiraType` map (register each `jira*issue*type*aliases` entry) AND add a `sync:` default (or equivalent) to the 5 affected work*types in `jira-required.yaml`, so a Bug/Error ticket (and Improvement/Defect/TechStory/TechDebt tickets) sync fully, comments included.

Module: `scripts/sync-jira-issues.ts` (this repo's own tooling), `.agents/jira-required.yaml`

### Test data

| Field | Value |
| --- | --- |
| Environment | staging (`active_env`) — nominal; the system under test is a local script, not a deployed env |
| Entity | BK-502 itself (Bug/Error type) — the only ticket confirmed to reproduce live this session |
| Related data | BK-176 (previously cited, 2026-08-26 retest, same symptom); an Improvement-type ticket key is still needed to independently verify the `sync:` gap |
| User | whichever Jira credentials `bun run jira:sync-issues` runs under (`.env`) — no product role applies |
| URL | N/A — local shell command, not a web page |

### Verification strategy

1. Run: `bun run jira:sync-issues get BK-502 --include-comments`
2. Setup: none beyond the fix being merged (`loadRegistry()` alias restore + `sync:` key added)
3. Reproduce: confirm the CURRENT symptom first — 0 files, 0/0/0 synced, `issue type 'Error' is not declared` warning
4. Verify fix: re-run the same command — expect `bugs/BUG-BK-502-.../bug.md` AND `comments.md` created, populated, zero warnings
5. Regression: repeat against an Improvement-type ticket to confirm the title's other half ("and Improvement types") and the independent `sync:` key gap are both closed

### Risk assessment

Priority: Medium (from ticket).

If regresses: every Bug/Error ticket in the workspace silently loses ALL local PBI cache content again — masks defects, corrupts `qa_assignee` read-before-write, breaks traceability reads, and nothing currently guards this in an automated test, so a future unrelated refactor could regress it again undetected (as already happened once, `e2a0aab`).

### Retest plan (Stage 2)

(a) ***Primary claim*** — does a fix restore FULL sync (not just comments) for Bug/Error tickets: `bug.md` + `comments.md` populated, zero warnings, on BK-502 itself.
(b) ***Untested half*** — does the same fix (or absence of regression) hold for Improvement-type tickets: needs a live Improvement-type ticket key, not yet identified.
(c) ***Secondary gap*** — is the missing `sync:` key on `bug`/`improvement`/`defect`/`tech*story`/`tech*debt` real and independently blocking: verify once the alias fix is confirmed live, against a ticket whose issue-type name matches exactly (no alias needed).

The repro `Test` (Modality jira-xray) is created at fix-verification time, linked Bug↔Test via the `test` slug — not created here in Stage 1.

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
_Source: Xray Test Plan [BK-887](https://jira.upexgalaxy.com/browse/BK-887) description · ATP · synced by sync-jira-issues_
