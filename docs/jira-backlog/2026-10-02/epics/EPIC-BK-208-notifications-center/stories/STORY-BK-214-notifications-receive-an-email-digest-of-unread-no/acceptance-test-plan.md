# BK-214 — Acceptance Test Plan (QA)

> Jira field: `customfield_10137` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-214)

# BK-214 — Acceptance Test Plan (FINAL)

> Author: QA (Stage 1 Planning) · Modality: jira-native (no Xray)
Source of truth: 5 ACs (Gherkin) + verified implementation (PR #223, merged 29/8, deployed to staging)
Reconciles the 2026-08-18 Shift-Left DRAFT against post-impl decisions (ADR-0017, comments 27/8)

## Scope

Email digest of unread notifications, grouped by project, sent daily at 08:00 UTC via Vercel Cron → `POST /api/v1/admin/send-digest` (CRON_SECRET bearer) → Resend. One email per user per day, only when ≥1 eligible unread notification exists at send time.

## Verified implementation facts (binding for test design)

| Fact | Value |
| --- | --- |
| Trigger | `POST /api/v1/admin/send-digest`, `auth:'public'` + manual `Authorization: Bearer <CRON_SECRET>` (ADR-0017) |
| Schedule | Vercel Cron `0 8 ** ** *` (08:00 UTC, fixed, no per-user timezone) |
| Mail | `lib/mail/resend-client.ts` → `sendDigestEmail(input, {apiKey: RESEND*API*KEY, fromEmail: RESEND*DIGEST*FROM_EMAIL})` |
| Idempotency | `notification*digest*log`, `unique(user*id, digest*date)`, status `pending/sent/failed`; CLAIM-BEFORE-SEND (INSERT pending before send; overlap fails on conflict) |
| Retry | NONE in-process. One attempt/user/day. Failure → notification stays unread → reconsidered tomorrow |
| Candidate RPC | `bunkai*notification*digest*candidates()` — `service*role` only |
| Eligibility | `read*at IS NULL` + `created*at >= now()-90d` + `event*type IN (run.finished, run.aborted, bug.assigned, bug.reassigned, bug.status*changed)` + `workspace_members.status='active'` + `u.email IS NOT NULL` + `NOT EXISTS` pref `enabled=false` |
| Event types | `run.finished`, `run.aborted`, `bug.assigned`, `bug.reassigned`, `bug.status_changed` (NO `bug.commented`) |
| Preference bridge | `run.% → run*lifecycle`, `bug.% → bug*lifecycle`; absent row = enabled |
| Cap | 5 items per project section + "and N more" (muted italic, not clickable) |
| Grouping | Per user, across ALL workspaces where member (not per-workspace) |
| Deep-link | `${APP_URL}/home?openNotifications=1` → `AppSidebar.tsx` opens `notifOpen` panel; `middleware.ts` redirects unauth → `/login?next=...` |

## Coverage Estimate

| Type | Count | Notes |
| --- | --- | --- |
| Positive | 6 | Happy-path digest scenarios (AC1-AC5) |
| Negative | 3 | Suppression (no unread, all read, all prefs off) |
| Boundary | 5 | Cap overflow, at-cap, below-cap, many projects, mixed types |
| Integration | 4 | Deep-link auth (session/unauth/expired), Resend delivery |
| Security-RBAC | 2 | Membership revoked, cross-workspace visibility |
| State-Transition | 2 | Read-state invariant, concurrent read+send |
| Non-Functional | 4 | Performance, accessibility, idempotency, failure handling |
| ***Total**** | ****26*** |  |

## Test Outlines

### Positive

| # | Outline | Preconditions | Expected Result |
| --- | --- | --- | --- |
| P1 | Multi-project digest groups correctly | Mateo has 5 unread in "Bunkai Web" + 2 in "Mobile App", all email prefs ON | One email, 7 items, grouped under two project headings with per-project counts |
| P2 | Single-project digest | Mateo has 3 unread in one project, email prefs ON | One email, single project section, no overflow |
| P3 | Digest respects channel preferences | Email OFF for run events; 3 run + 1 bug unread | Email contains only bug notification; run items stay unread |
| P4 | One-click deep-link to inbox | Mateo received digest email, has active session | Click lands in notification inbox (panel open); items still unread |
| P5 | Partial read reduces digest | 5 unread, read 3 before digest | Email contains only 2 remaining unread |
| P6 | Read-all suppresses email | 6 unread, mark all read before digest | No email sent |

### Negative

| # | Outline | Preconditions | Expected Result |
| --- | --- | --- | --- |
| N1 | Zero unread suppresses email | 0 unread at digest time | No email sent; no `digest_log` row (or no `sent`) |
| N2 | All prefs OFF suppresses email | All email channels OFF, 5 unread | No email sent; notifications stay unread |
| N3 | All notifications read before digest | 4 unread, all read before send time | No email sent |

### Boundary

| # | Outline | Preconditions | Expected Result |
| --- | --- | --- | --- |
| B1 | Per-project item cap overflow | 8 unread in one project (cap = 5) | Email shows 5 items + "and 3 more" line |
| B2 | Exactly at item cap | 5 unread in one project (cap = 5) | Email shows 5 items, no overflow line |
| B3 | One below item cap | 4 unread in one project (cap = 5) | Email shows 4 items, no overflow line |
| B4 | 10+ projects with notifications | Unread across 12 projects | All 12 project sections present; email within size limit |
| B5 | Mixed event types across projects | Bug + run types across 3 projects | Correct grouping; event-type filtering applied per-project |

### Integration

| # | Outline | Preconditions | Expected Result |
| --- | --- | --- | --- |
| I1 | Deep-link with active session | Mateo has valid session, clicks open-inbox | Lands in `/home` with notification panel open; items visible |
| I2 | Deep-link without session | Mateo not signed in, clicks open-inbox | Redirected to `/login?next=%2Fhome%3FopenNotifications%3D1` |
| I3 | Deep-link with expired session | Session expired, clicks open-inbox | Redirected to login; after auth, lands in inbox |
| I4 | Email delivery via Resend | All conditions met, Resend API available | Email received in Mateo's mailbox within 1 minute |

### Security-RBAC

| # | Outline | Preconditions | Expected Result |
| --- | --- | --- | --- |
| S1 | Membership revoked excludes notifications | Mateo removed from "Mobile App" before digest | "Mobile App" notifications excluded from digest |
| S2 | Cross-workspace visibility enforced | Mateo member of 2 workspaces; private project notifications in workspace A | Digest excludes private project notifications |

### State-Transition

| # | Outline | Preconditions | Expected Result |
| --- | --- | --- | --- |
| ST1 | Read state never changes by digest | Mateo has 3 unread; digest sent + opened | All 3 remain unread in app; `read_at` is NULL |
| ST2 | Concurrent read and digest send | 1 unread notification; read at exact send moment | Either included or excluded; no partial state or duplicate |

### Non-Functional

| # | Outline | Preconditions | Expected Result |
| --- | --- | --- | --- |
| NFR1 | Performance: 500 concurrent users | 500 users with eligible notifications at same time | All 500 emails sent within 10 minutes; no duplicates |
| NFR2 | Accessibility: email template screen reader | Digest email opened in screen reader | Semantic headings, ARIA labels, descriptive button text |
| NFR3 | Idempotency: no duplicate digest | Digest sent; cron runs again same day | No second email for same user same day (`unique(user*id, digest*date)`) |
| NFR4 | Failure handling (no retry) | Resend returns error on send attempt | One attempt only; `digest_log` row `status='failed'`; notification stays unread; reconsidered tomorrow |

## Traceability Map

| AC | Outlines |
| --- | --- |
| AC1: Daily digest grouped by project | P1, P2, B1, B2, B3, B4, B5 |
| AC2: No email when nothing unread | N1, N3 |
| AC3: Respects channel preferences | P3, N2 |
| AC4: One-click into inbox | P4, I1, I2, I3 |
| AC5: Items read before digest excluded | P5, P6, N3 |
| Edge: Membership revoked | S1 |
| Edge: Concurrent read | ST2 |
| Edge: 10+ projects | B4 |
| Edge: Email failure | NFR4 |
| Edge: No email address | (covered by N2 scope) |
| Edge: Single-member workspace | P2 (equivalent) |
| NFR: Performance | NFR1 |
| NFR: Accessibility | NFR2 |
| NFR: Idempotency | NFR3 |
| NFR: Cross-workspace security | S2 |

## Risk-Based Prioritization

| Priority | Outlines | Rationale |
| --- | --- | --- |
| P0 — Must Have | P1, P3, N1, P4, P5, S2, NFR3 | Core business logic: grouping, preference filtering, suppression, deep-link, read-state invariant, idempotency |
| P1 — Should Have | P2, N2, N3, B1, B2, I1, I2, I4, S1, ST1, NFR4 | Important paths: single-project, all-off, read-all, overflow, auth flows, membership revocation, failure handling |
| P2 — Nice to Have | B3, B4, B5, I3, ST2, NFR1, NFR2 | Edge cases: near-boundary, many projects, expired session, performance, accessibility |

## Entry Criteria

- [x] BK-209 (Inbox) merged and deployed to staging
- [x] BK-213 (Preferences) merged and deployed to staging
- [x] PR #223 (digest) merged and deployed to staging (29/8)
- [x] `RESEND*API*KEY` + `RESEND*DIGEST*FROM_EMAIL` set in staging env
- [ ] `CRON_SECRET` available for on-demand trigger (or wait for 08:00 UTC cron)
- [x] DBHub RW access (`qa*inspector*rw`) for seeding/verification

## Exit Criteria

- [ ] All 26 outlines executed
- [ ] P1-P6 pass (positive)
- [ ] N1-N3 pass (negative suppression)
- [ ] B1-B5 pass (boundary)
- [ ] I1-I4 pass (integration)
- [ ] S1-S2 pass (security)
- [ ] ST1-ST2 pass (state transitions)
- [ ] NFR1-NFR4 pass (performance, accessibility, idempotency, failure handling)
- [ ] No P0/P1 bugs open
- [ ] Email rendering validated across top 3 email clients (Gmail, Outlook, Apple Mail)

## Test Data Requirements

- 1 auth user (Mateo = `[REDACTED_EMAIL]`) with email address
- 2+ projects with modules
- 10+ notifications across projects (mix of `run.finished`, `run.aborted`, `bug.assigned`, `bug.reassigned`, `bug.status_changed`)
- Notification preferences with email channel ON and OFF for different event types
- Membership in 2+ workspaces (for cross-workspace test)

## Test Environment Requirements

- Staging environment with Resend integration live
- Access to `notification_preferences` table to toggle email channels (DBHub RW)
- Ability to trigger digest manually (`POST /api/v1/admin/send-digest` with CRON_SECRET) or wait for cron
- Email inbox access to verify delivery (Resend inbox / `resend emails receiving list`)

## Risks & Mitigation

| # | Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- | --- |
| 1 | CRON_SECRET unavailable → cannot trigger on-demand | High | High | Wait for 08:00 UTC cron; or obtain secret from Vercel |
| 2 | Candidate RPC is `service*role` only → cannot seed/verify via DBHub RW | Medium | Medium | Verify via `digest*log` + email; seed `notifications` via DBHub RW |
| 3 | Resend delivery not observable end-to-end | Medium | High | Verify via Resend inbox + `digest_log.status='sent'` |
| 4 | Duplicate digest on cron overlap | Medium | High | NFR3 — `unique(user*id, digest*date)` claim-before-send |
| 5 | Email exceeds provider size limit with many notifications | Medium | Medium | B4, NFR1 — cap 5/section + "and N more" |
| 6 | Deep-link auth flow fails for unauthenticated users | Medium | Medium | I2, I3 — session redirect + return URL |

---
_Synced from Jira by sync-jira-issues_
