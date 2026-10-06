# BK-214 — Acceptance Test Results (QA)

> Jira field: `customfield_10165` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-214)

BK-214 TEST RESULTS (PARTIAL)

***Tested******:*** 2026-09-03
***Environment******:*** Staging
***Tester******:*** pinto.lucas.nahuel
***Result******:*** CONDITIONAL GO — final GO pending the 2026-09-04 08:00 UTC cron email delivery

---

## VERIFIED (without trigger)

- Endpoint `POST /api/v1/admin/send-digest` without auth -> HTTP 401
- `notification*digest*log` schema: UNIQUE(user*id, digest*date); CHECK status IN (pending,sent,failed); CHECK notification_count >= 0; FK auth.users; RLS enabled
- Deep-link I2 (no session): `/home?openNotifications=1` -> 302 `/login?next=%2Fhome%3FopenNotifications%3D1` (exact)
- Deep-link I1 (session, direct nav): panel opens with 3 unread, param consumed
- Seed: 3 eligible unread notifications (bug.assigned + 2x run.finished) resolving entity->project in candidate RPC; email prefs ON (default); digest_log empty -> tomorrow claim (2026-09-04) no collision
- NFR2 email template structural: role=presentation, lang=en, descriptive links (minor gap: no semantic h1/h2)

## DEFECTS FOUND

- BK-857: Deep-link login redirect does not auto-open notifications panel (severity menor / Low)

> If a field falls back to a comment, note the label used

## OBSERVATIONS

- Implementation differs from ATP DRAFT: no in-process retry (single attempt/day); real event types run.finished/run.aborted/bug.assigned/bug.reassigned/bug.status_changed; ADR-0017; endpoint admin/send-digest. ATP field reconciled to these.
- digest*log uses CLAIM-BEFORE-SEND; digest run never mutates notifications.read*at (ST1 invariant holds by design).

## PENDING (final GO condition)

- Verify Resend inbox receives the digest after 2026-09-04 08:00 UTC cron; confirm P1 grouping, cap=5 overflow, single-email delivery; then complete ATR + qa*sign*off.

## RECOMMENDATIONS

- Persist a regression TC for the deep-link auto-open flow; automation candidate for digest grouping logic.

---
_Synced from Jira by sync-jira-issues_
