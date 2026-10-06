# TEST: BK-372-TDS10: Deleting synced defect does not remove external item

**Jira Key:** [BK-243](https://jira.upexgalaxy.com/browse/BK-243)
**Status:** In Automation
**Components:** None

---

## Test Description

***Related Story:**** [BK-43](https://jira.upexgalaxy.com/browse/BK-43) | ****Epic:*** [BK-31](https://jira.upexgalaxy.com/browse/BK-31)

***Scenario:*** Given a synced defect is deleted in Bunkai, then the external item is NOT deleted and remains accessible.

KATA ATC: `DefectsApi.deleteDoesNotRemoveExternal()` → assert external item persists

---

## Metadata

- **Created:** 2026-07-22
- **Updated:** 2026-08-31
- **Reporter:** Nahuel Gomez
- **Assignee:** Unassigned
- **Labels:** api, automation-candidate, defect-sync

---

_Synced from Jira by sync-jira-issues_
