# ACCEPTANCE TEST RESULTS (ATR): ATR: BK-48: Story Testing

**Jira Key:** [BK-716](https://jira.upexgalaxy.com/browse/BK-716)
**Status:** Close
**Components:** None

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

# Acceptance Test Results — [https://jira.upexgalaxy.com/browse/BK-48#icft=BK-48](https://jira.upexgalaxy.com/browse/BK-48#icft=BK-48)

## Context

- Story: [https://jira.upexgalaxy.com/browse/BK-48#icft=BK-48](https://jira.upexgalaxy.com/browse/BK-48#icft=BK-48) — TMS-Traceability | Filter the chain by verdict, module, and date range
- Environment: staging
- Executor: pinto.lucas.nahuel (QA)
- Date: 2026-08-28
- Modality: jira-xray (28 Manual test cases)

## Result Summary

| ***Verdict**** | ****Count*** |
| --- | --- |
| Passed | 17 |
| Failed | 2 |
| Not executed (TODO) | 9 |

## Failed cases

- TC22 — persist filter state in URL query params → the app-generated URL drops `?story=`.
- TC23 — restore filter state from URL on load → cannot restore from the app-generated URL.

## Defect filed

- [https://jira.upexgalaxy.com/browse/BK-717#icft=BK-717](https://jira.upexgalaxy.com/browse/BK-717#icft=BK-717) (Defect, severity Mayor, priority High) — "Traceability filters drop the ?story param from the URL, breaking filter persistence and sharing (AC5.1/5.2)"

## Not executed this session

TC5, TC12, TC13, TC14, TC15, TC16, TC20, TC24, TC27 — keyboard navigation, focus management, and multi-date range edge cases. Seeded data has a single run date and no module-less ATCs.

## Verdict

FAILED — AC5 (filter-state persistence via URL) does not work end-to-end. The in-page filtering (AC1–AC4) works as specified, including module-id-vs-name behavior (D30). Story blocked pending fix of [https://jira.upexgalaxy.com/browse/BK-717#icft=BK-717](https://jira.upexgalaxy.com/browse/BK-717#icft=BK-717).

---

## Related Issues

- tests: [BK-48](https://jira.upexgalaxy.com/browse/BK-48) - TMS-Traceability | Filter the chain by verdict, module, and date range

---

## Metadata

- **Created:** 2026-08-28
- **Updated:** 2026-09-27
- **Reporter:** pinto.lucas.nahuel
- **Assignee:** pinto.lucas.nahuel

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Execution [BK-716](https://jira.upexgalaxy.com/browse/BK-716) description · ATR · synced by sync-jira-issues_
