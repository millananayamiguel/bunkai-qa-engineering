# TEST: BK-337: TC15: should answer 404 for an unknown identifier and 400 for a malformed one

**Jira Key:** [BK-533](https://jira.upexgalaxy.com/browse/BK-533)
**Status:** DEPRECATED
**Components:** Bunkai Bugs

---

## Test Description

> ***WARNING:**** ****DEPRECATED by ****`/test-documentation`**** Stage 4 on 2026-09-01.**** Superseded by ****BK-532***. Do not execute this Test and do not automate it.

## Why it was deprecated

It held the unknown-identifier and malformed-identifier rules of the API perimeter. Same endpoint, same action, so it became rows in the perimeter decision table.

A Test is identified by its precondition and its action. This Test shared both with BK-532, so keeping them apart would store one behaviour as several regression artifacts, each needing its own fixture setup and its own maintenance for no additional coverage.

## What was preserved

Nothing was lost. Every assertion this Test carried now lives inside BK-532, which was rewritten to hold them as a grouped assertion block.

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
