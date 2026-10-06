# TEST PLAN: STP: Sprint#3: Regression

**Jira Key:** [BK-599](https://jira.upexgalaxy.com/browse/BK-599)
**Status:** Planning
**Components:** None

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

## Scope

Sprint Test Plan for ***Bunkai (70) Sprint 3*** (board sprint id 8). Living planner — every ticket tested via `/sprint-testing` this sprint is tracked here, across epics. Retro-filled on creation since sprint testing activity started before this artifact existed; corrected once (an initial pass missed the two Story-field-fallback entries below — audited again against a full status query, not partial recall).

| ***Ticket**** | ****Type**** | ****Epic**** | ****ATP/ATR**** | ****Status*** |
| --- | --- | --- | --- | --- |
| [https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497](https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497) | Story | [https://jira.upexgalaxy.com/browse/BK-1#icft=BK-1](https://jira.upexgalaxy.com/browse/BK-1#icft=BK-1) Tenancy & Identity | Story field (customfield_10124) | QA Approved — PASSED WITH ISSUES (15/17 TCs) |
| [https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) | Story | [https://jira.upexgalaxy.com/browse/BK-1#icft=BK-1](https://jira.upexgalaxy.com/browse/BK-1#icft=BK-1) Tenancy & Identity | Story field (customfield_10124) | QA Approved — PASSED (15/15 TCs) |
| [https://jira.upexgalaxy.com/browse/BK-202#icft=BK-202](https://jira.upexgalaxy.com/browse/BK-202#icft=BK-202) | Story | - | [https://jira.upexgalaxy.com/browse/BK-573#icft=BK-573](https://jira.upexgalaxy.com/browse/BK-573#icft=BK-573) / [https://jira.upexgalaxy.com/browse/BK-590#icft=BK-590](https://jira.upexgalaxy.com/browse/BK-590#icft=BK-590) | Closed |
| [https://jira.upexgalaxy.com/browse/BK-591#icft=BK-591](https://jira.upexgalaxy.com/browse/BK-591#icft=BK-591) | Defect | - | ReTest [https://jira.upexgalaxy.com/browse/BK-597#icft=BK-597](https://jira.upexgalaxy.com/browse/BK-597#icft=BK-597) | Closed |
| [https://jira.upexgalaxy.com/browse/BK-592#icft=BK-592](https://jira.upexgalaxy.com/browse/BK-592#icft=BK-592) | Defect | - | ReTest [https://jira.upexgalaxy.com/browse/BK-598#icft=BK-598](https://jira.upexgalaxy.com/browse/BK-598#icft=BK-598) | Closed |
| [https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542](https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542) | Improvement | [https://jira.upexgalaxy.com/browse/BK-1#icft=BK-1](https://jira.upexgalaxy.com/browse/BK-1#icft=BK-1) (via [https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497](https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497)) | - | In Progress |

## Progress

Created retroactively during BK-542's session (this Session Start §0.7 rule postdates several already-tested sprint tickets). Corrected once after an incomplete first pass: audited `sprint = 8 AND issuetype in (Story,Bug,Defect,Improvement)` against status, not just what was already surfaced by unrelated investigation, and found [https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497](https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497)/[https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) (QA Approved) missing. [https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542](https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542) itself originated from BK-497's ATR (TC-08 finding).

## Update — [https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542](https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542) closed

[https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542](https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542) (Improvement, Code-Review-only triage — risk score 2/16 LOW) closed via `ReTest Passed` transition. Independent retest reproduced the original crash-repro scenario (scratch route, omitted `auth`) and confirmed the fix reports a NAMED per-handler failure instead of crashing the file. No ATP/ATR items created (below the Full-ATP threshold). QA comment posted on [https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542](https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542) directly.

---

## Metadata

- **Created:** 2026-08-23
- **Updated:** 2026-08-31
- **Reporter:** Luis Eduardo Flores Villarroel
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_
