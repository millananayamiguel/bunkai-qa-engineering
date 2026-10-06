# BK-1 — Module Context (QA)

> Jira source: the `## Module Context (QA)` section of the Epic description · [View in Jira](https://jira.upexgalaxy.com/browse/BK-1)

***Last Updated:*** 2026-08-23
***Stories Tested:*** 2 ([https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497](https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497), [https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) — QA Approved)

### Overview

***Description:*** Foundational multi-tenancy + identity substrate. Owns sign-up/sign-in (magic-link, OAuth), workspace creation, member roles, and Personal Access Tokens (PAT) — the capability-scoped API tokens covered by the PAT sub-thread ([https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497](https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497)/498/499, [https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542](https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542)).

***Business Domain:*** Identity & Access Management (Auth, Workspaces, API Tokens)

***Primary Actors:*** anonymous visitor (sign-up), `owner` / `admin` / `member` / `viewer` (role hierarchy, strictly ordered), automation clients via PAT

### API Endpoints (PAT sub-thread — confirmed by direct code read, [https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497](https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497)/[https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) sessions)

| ***Endpoint**** | ****Method**** | ****Posture**** | ****Purpose*** |
| --- | --- | --- | --- |
| `/api/v1/tokens` | POST | `cookie-only` | Issue a PAT — deliberately blocked for Bearer/PAT callers ("PATs cannot mint PATs") |
| `/api/v1/tokens/{id`} | DELETE | `cookie-only` | Revoke a PAT |
| `/api/v1/tokens` | GET | `authenticated` | List PATs |
| `/api/v1/{acceptance-criteria,environments,milestones,modules,imports,projects,user-stories}/**` | GET / POST / PATCH / DELETE | `required:atc:read` or `required:atc:write` (22 handlers, verb-mapped: GET→{{atc:read}}, write verbs→{{atc:write}}) | Authoring domain — full 87-handler inventory lives in the committed snapshot `lib/api/route-capability-coverage.snapshot.json`, not duplicated here |

Full posture-scan mechanism (the thing [https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542](https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542) fixes): `lib/api/route-posture-scan.ts` — static source-text scan, no HTTP involved.

### Database Tables

| ***Table**** | ****Primary Use**** | ****Key Columns*** |
| --- | --- | --- |
| `auth.users` | Supabase-managed identity | (managed, not app schema) |
| `workspaces` | Tenant boundary | `owner`, RLS-scoped |
| `workspace_members` | RBAC | role enum: `owner`/`admin`/`member`/`viewer` |
| `workspace_invites` | Pending invitations | HMAC-signed token, 24h TTL |
| `access*tokens` | PATs | `id, user*id, workspace*id, name, token*prefix, scopes[], expires*at, revoked*at, last*used*at, created*at` — only `token*prefix` + SHA-256 hash stored, raw secret never persisted (2467 rows as of BK-498's session) |

### Business Rules

| ***Rule**** | ****Description**** | ****Source*** |
| --- | --- | --- |
| Capability gate ordering | `requireCapability(principal, capability)` runs for every entry in `options.requires` BEFORE the handler executes | `lib/api/handler.ts:74-101`, confirmed [https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) |
| PATs cannot mint PATs | `POST /tokens` is `cookie-only` — narrow-scope test tokens always require a cookie session, never a Bearer PAT | `app/api/v1/tokens/route.ts:108` |
| Default PAT scopes | New tokens get `atc:read` + `atc:write` + `run:execute` by default — a default token loses nothing from capability changes; only a **deliberately narrowed** token observes a gate | `lib/api/pat.ts`, confirmed [https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) |
| Role hierarchy | `owner` > `admin` > `member` > `viewer`; only `owner`/`admin` can invite; `viewer` cannot create/edit/delete | `epic.md` AC-6 |

### Key Entities for Testing

| ***Entity Type**** | ****Name**** | ****Notes*** |
| --- | --- | --- |
| PAT scope | `atc:read`, `atc:write`, `run:execute` | Published vocabulary: `app/qa/qa-config.ts:625-626` |
| Test tokens | `.auth/tokens.env` (OWNER/USER/MEMBER/VIEWER/ADMIN/INACTIVE) | All ***default-scoped**** — a **narrow*-scoped PAT for gate-testing must be minted live, not reused from this file |

### Routes (Frontend) / Common Test Scenarios

***Not yet explored*** — no session under this epic has done UI-side exploration yet (both [https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497](https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497) and [https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) were API/DB-only sessions). Leave for the first ticket in this module that has real UI scope; do not invent paths here.

### Stories in This Module (partial — only what's been QA-touched so far)

| ***Story**** | ****Title**** | ****Status**** | ****Link*** |
| --- | --- | --- | --- |
| [https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497](https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497) | PAT — Require every route to declare posture | QA Approved | `./STORY-BK-497-pat-require-every-api-route-to-declare-its-capabil/context.md` |
| [https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) | PAT — Enforce capability scopes on authoring domain | QA Approved | `./STORY-BK-498-pat-enforce-capability-scopes-on-the-authoring-dom/context.md` |
| [https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542](https://jira.upexgalaxy.com/browse/BK-542#icft=BK-542) | Improvement — posture-scan crash on missing auth | In Progress | (this session) |

### Notes

- DB-integration suites for this domain are ***credential-gated*** (`describe.skip` without Supabase env vars) — a CI run without credentials reports green having executed none of it (matches this QA repo's already-logged "no CI in target repo" HIGH risk).
- This section was left as an explicit gap by BOTH prior sessions ([https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497](https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497) and BK-498's own `context.md` files record "module context still missing, carried forward") — this is the third time it surfaced; created now rather than deferred a third time.

---
_Synced from Jira by sync-jira-issues_
