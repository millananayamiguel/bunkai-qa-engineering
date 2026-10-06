# ACCEPTANCE TEST PLAN (ATP): ATP: BK-399: TMS-ATC Classification | Classify by test-design technique and priority

**Jira Key:** [BK-914](https://jira.upexgalaxy.com/browse/BK-914)
**Status:** Completed
**Components:** None

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

_No description provided_

---

## Related Issues

- designs: [BK-891](https://jira.upexgalaxy.com/browse/BK-891) - Should set technique to Boundary Value Analysis and show it after save
- designs: [BK-892](https://jira.upexgalaxy.com/browse/BK-892) - Should set priority to High and show it after save
- designs: [BK-893](https://jira.upexgalaxy.com/browse/BK-893) - Should save with neither technique nor priority set showing not specified
- designs: [BK-894](https://jira.upexgalaxy.com/browse/BK-894) - Should filter list by Pairwise returning only Pairwise ATCs
- designs: [BK-895](https://jira.upexgalaxy.com/browse/BK-895) - Should filter list by Critical returning only Critical ATCs
- designs: [BK-896](https://jira.upexgalaxy.com/browse/BK-896) - Should persist Decision Table and Medium across reload
- designs: [BK-897](https://jira.upexgalaxy.com/browse/BK-897) - Should show not specified for both fields on a legacy ATC
- designs: [BK-898](https://jira.upexgalaxy.com/browse/BK-898) - Should combine technique filter with active layer filter via AND
- designs: [BK-899](https://jira.upexgalaxy.com/browse/BK-899) - Should duplicate ATC carrying technique and priority to the copy
- designs: [BK-900](https://jira.upexgalaxy.com/browse/BK-900) - Should combine technique, priority and layer filters via triple AND
- designs: [BK-901](https://jira.upexgalaxy.com/browse/BK-901) - Should reject unrecognized technique via API with invalid-technique error
- designs: [BK-902](https://jira.upexgalaxy.com/browse/BK-902) - Should reject unrecognized priority via API with invalid-priority error
- designs: [BK-903](https://jira.upexgalaxy.com/browse/BK-903) - Should reject case-mismatched technique value via API
- designs: [BK-904](https://jira.upexgalaxy.com/browse/BK-904) - Should reject whitespace-padded priority via API when strict
- designs: [BK-905](https://jira.upexgalaxy.com/browse/BK-905) - Should reject invalid technique on ATC creation via API
- designs: [BK-906](https://jira.upexgalaxy.com/browse/BK-906) - Should show explicit filtered-empty when technique matches nothing
- designs: [BK-907](https://jira.upexgalaxy.com/browse/BK-907) - Should handle all-unspecified boundary when every ATC has no technique
- designs: [BK-908](https://jira.upexgalaxy.com/browse/BK-908) - Should clear a previously-set technique back to not specified
- designs: [BK-909](https://jira.upexgalaxy.com/browse/BK-909) - Should persist technique and priority via DB not localStorage across reload
- designs: [BK-910](https://jira.upexgalaxy.com/browse/BK-910) - Should increment version and update updated_at on technique/priority edit
- designs: [BK-911](https://jira.upexgalaxy.com/browse/BK-911) - Should keep ATC list, detail and search consistent after technique edit
- designs: [BK-912](https://jira.upexgalaxy.com/browse/BK-912) - Should preserve technique/priority lineage through duplicate and report correct usage
- tests: [BK-399](https://jira.upexgalaxy.com/browse/BK-399) - TMS-ATC Classification | Classify by test-design technique and priority

---

## Metadata

- **Created:** 2026-09-08
- **Updated:** 2026-09-12
- **Reporter:** Gianluca Módena
- **Assignee:** Gianluca Módena

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Plan [BK-914](https://jira.upexgalaxy.com/browse/BK-914) description · ATP · synced by sync-jira-issues_
