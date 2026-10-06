# DEFECT: Bunkai Notifications: Deep-link login redirect does not auto-open notifications panel

**Jira Key:** [BK-857](https://jira.upexgalaxy.com/browse/BK-857)
**Related Story:** [BK-214](https://jira.upexgalaxy.com/browse/BK-214) - Notifications | Receive an email digest of unread notifications
**Priority:** Medium
**Status:** In Review
**Components:** Bunkai Notifications
**Severity:** Menor
**Error Type:** Functional
**Test Environment:** Staging
**Fix Type:** Bugfix

---

## Description

_No description provided_

---

## 🐞 Actual Result

After login redirect with next=/home?openNotifications=1, user lands on /home but the notifications panel does not auto-open; bell icon not expanded. The openNotifications param is consumed (URL resolves to /home).

---

## ✅ Expected Result

The notifications panel auto-opens after the login redirect, matching direct-navigation behavior, so the digest Open inbox link preserves the auto-open intent.

---

## 🔍 Root Cause

**Category:** Code Error

---

## 🧫 Evidence

login-redirect-panel-not-open



---

## Related Issues

- is caused by: [BK-214](https://jira.upexgalaxy.com/browse/BK-214) - Notifications | Receive an email digest of unread notifications

---

## Metadata

- **Created:** 2026-09-03
- **Updated:** 2026-09-24
- **Reporter:** pinto.lucas.nahuel
- **Assignee:** Ely
- **Labels:** bk-214, defect, f-1

---

_Synced from Jira by sync-jira-issues_
