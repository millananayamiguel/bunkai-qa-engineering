# TEST PLAN: RTP: BK Regression Suite

**Jira Key:** [BK-831](https://jira.upexgalaxy.com/browse/BK-831)
**Status:** READY
**Components:** Bunkai Bugs

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

## Purpose

The living regression repository for project BK. Unlike an `STP:` sprint test plan, this plan is permanent: Tests enter it when `/test-documentation` promotes them, and they leave it only when the surface they guard is retired.

## Entry rule

A Test is added here only after it clears the Stage 4 ROI gate with a ***Candidate**** or ****Manual*** verdict. Every member carries the `regression-candidate` label, a product component, and a parent of `QA Test Repository`.

Scenarios that were derived and executed but scored below the gate stay as sprint artifacts on their own Test Execution. They are not members here.

## What lives here

| Source Story | Tests promoted | Documented |
| --- | --- | --- |
| BK-337 TMS-Defect Detail | 10 | 2026-09-01 |

## Regression flows

Each flow is one end-to-end journey a spec file runs end to end. Members are listed by Test key.

### BK-258 TMS-Home | Show open bug count and severity breakdown

| Flow | Type | Members |
| --- | --- | --- |
| Home — open bugs overview | UI (e2e) | BK-1093 (TC1), BK-1094 (TC2), BK-1095 (TC3), BK-1096 (TC4), BK-1099 (TC7) |
| Open-bugs API | API (integration) | BK-1100 (TC8), BK-1101 (TC9) |

Shared component: the open-bugs API read (TC8) is the oracle every UI member asserts parity against.

---

## Metadata

- **Created:** 2026-09-02
- **Updated:** 2026-09-29
- **Reporter:** Ely
- **Assignee:** Benjamin Segovia

---

_Synced from Jira by sync-jira-issues_
