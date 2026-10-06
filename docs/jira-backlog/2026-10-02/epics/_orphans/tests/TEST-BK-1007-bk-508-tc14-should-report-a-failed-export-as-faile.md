# TEST: BK-508: TC14: should report a failed export as failed with a retry, not stuck preparing

**Jira Key:** [BK-1007](https://jira.upexgalaxy.com/browse/BK-1007)
**Status:** MANUAL
**Components:** Bunkai Workspaces

---

## Test Description

## Related Story

BK-508

## ROI verdict

Manual — the current fault-injection method (a direct DB insert of a synthetic `failed` `workspace_exports` row) is fragile to automate reliably. No product-level failure-injection hook exists yet. Revisit as Candidate once one does.

---

## Metadata

- **Created:** 2026-09-11
- **Updated:** 2026-09-30
- **Reporter:** GENESIS OJOSE
- **Assignee:** GENESIS OJOSE
- **Labels:** manual-only

---

_Synced from Jira by sync-jira-issues_
