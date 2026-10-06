# TEST: BK-337: TC17: should let a viewer-role member read the record with no controls

**Jira Key:** [BK-535](https://jira.upexgalaxy.com/browse/BK-535)
**Status:** DEPRECATED
**Components:** Bunkai Bugs

---

## Test Description

> ***WARNING:**** ****DEPRECATED by ****`/test-documentation`**** Stage 4 on 2026-09-01.**** Superseded by ****BK-528***. Do not execute this Test and do not automate it.

## Why it was deprecated

It held the viewer-role leg of the read-only assertion. Equivalence Partitioning over the reader's role produces one Test with a row per role, not one Test per role.

A Test is identified by its precondition and its action. This Test shared both with BK-528, so keeping them apart would store one behaviour as several regression artifacts, each needing its own fixture setup and its own maintenance for no additional coverage.

## What was preserved

Nothing was lost. Every assertion this Test carried now lives inside BK-528, which was rewritten to hold them as a grouped assertion block.

This issue is deprecated rather than deleted so the sprint execution history on Test Execution ***BK-518*** stays intact and auditable: it really did run, and it really did pass, on 2026-08-19.

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
- **Labels:** deprecated, superseded

---

_Synced from Jira by sync-jira-issues_
