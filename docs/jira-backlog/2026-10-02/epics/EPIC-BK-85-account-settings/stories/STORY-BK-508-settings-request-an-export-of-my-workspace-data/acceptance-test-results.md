# ACCEPTANCE TEST RESULTS (ATR): ATR: BK-508: Story Testing

**Jira Key:** [BK-1024](https://jira.upexgalaxy.com/browse/BK-1024)
**Status:** Close
**Components:** Bunkai Workspaces

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

## BK-508 TEST RESULTS

***Tested***: 2026-09-11
***Environment***: Staging
***Tester***: GENESIS OJOSE
***Result***: PASSED WITH ISSUES (26/28)

### Summary

Full lifecycle testing of the workspace data-export feature (Settings > Data export): async request/preparing/ready/expired/failed states, Owner-only visibility, single-in-flight-per-workspace limit, 7-day download window, cross-workspace isolation, credential/token exclusion, manifest.json structure, and PAT rejection. Implementation matches every ratified architecture decision except one archive-encoding deviation (BK-1025).

### Test cases

| TC | Test | Status |
| --- | --- | --- |
| TC01-TC07, TC09-TC10, TC12-TC14, TC17-TC21, TC24-TC26 | Positive/boundary lifecycle, activity audit, manifest, environment | PASSED (21) |
| TC08 | Non-Owner visibility (Admin/Member/Viewer) | PASSED (recalibrated note - see comment) |
| TC11 | PAT rejection (request + download) | PASSED |
| TC15-TC16 | Failed export + retry | PASSED |
| TC22 | Run snapshots NDJSON encoding | ***FAILED - BK-1025*** |
| TC23 | Direct storage-bucket access refusal | BLOCKED - not live-executable: no Supabase anon key available to QA (run left TODO; instance defines no BLOCKED status). Verified by code review only |
| TC27-TC28 | Loading/error UI states (optional) | PASSED |

### Test data

- Workspace: Acme QA (`ebd2427c-07e2-4843-b4ed-f16bede5d111`)
- Workspace: `qa-bk512-restore-1789077301`
- Test PAT: `qa-bk508-export-test` (revoked after use)

### Bugs found

BK-1025 (Minor/Low) - Run snapshots shipped as JSON instead of NDJSON. Non-blocking.

### Observations

- TC23 BLOCKED - direct Supabase Storage bucket access could not be probed live: it requires the project anon key, which QA does not have, and an unauthenticated call fails regardless of bucket policy (inconclusive). Code review: the download route reads the archive only via `createAdminClient()` (service role) and no signed/public URL is issued anywhere. Test moved to MANUAL (2026-09-12); re-run once an anon-key fixture exists.
- Zero staging test data existed for this feature at session start; all fixtures were built fresh from the two workspaces above.
- `bun run api:login` is broken for this project (domain/secret mismatch against the real staging deployment) - worked around via real cookie-session login + a minted PAT. Flagged separately for `/framework-development`, out of scope for this Story.

### Recommendations

- Fix the NDJSON encoding for Run snapshots (BK-1025) in a follow-up.
- Automation candidate: the full lifecycle state machine (never-requested -> preparing -> ready -> expired -> failed -> retry) is a strong Stage 5 candidate given its state-machine shape.

---

## Related Issues

- created: [BK-1025](https://jira.upexgalaxy.com/browse/BK-1025) - BK-508: Export archive encodes Run snapshots as JSON, not NDJSON
- tests: [BK-508](https://jira.upexgalaxy.com/browse/BK-508) - Settings | Request an export of my workspace data

---

## Metadata

- **Created:** 2026-09-11
- **Updated:** 2026-09-30
- **Reporter:** GENESIS OJOSE
- **Assignee:** GENESIS OJOSE

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Execution [BK-1024](https://jira.upexgalaxy.com/browse/BK-1024) description · ATR · synced by sync-jira-issues_
