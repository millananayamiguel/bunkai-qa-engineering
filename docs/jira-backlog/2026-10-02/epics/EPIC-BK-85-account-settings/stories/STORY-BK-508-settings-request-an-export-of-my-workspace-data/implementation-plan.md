# BK-508 — Implementation Plan (Dev)

> Jira field: `customfield_10070` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-508)

# [https://jira.upexgalaxy.com/browse/BK-508#icft=BK-508](https://jira.upexgalaxy.com/browse/BK-508#icft=BK-508) — Implementation Plan

## Summary

A `workspace*exports` job table (mirrors `import*jobs`' `queued → running → completed | failed` lifecycle), a Vercel `after()` background worker that assembles a ZIP archive of the active workspace's data and uploads it to a private Supabase Storage bucket, and a two-region Settings screen (explanatory panel + status/action card) that requests and downloads it. Owner-only, cookie-session-only, one export in flight per workspace, 7-day download window.

## Schema — migration `0083*workspace*data_export.sql`

- `workspace*exports(id, workspace*id, requested*by, status, archive*path, archive*bytes, error*message, started*at, completed*at, expires*at, created*at)`, `status check in ('queued','running','completed','failed')`.
- Partial unique index `(workspace*id) where status in ('queued','running')` — race-proof one-in-flight-per-workspace, mirrors `import*jobs*one*active*per*project` (0020). Enqueue route maps the resulting `23505` to `409`.
- Poll index `(workspace*id, created*at desc)` — the section always reads the single latest row per workspace (this is what makes AC-14 true with no extra bookkeeping: a fresh row simply becomes the one returned, the prior row is never queried again).
- RLS: `enable row level security`. SELECT and INSERT policies both gate on `public.bunkai*is*workspace*owner(workspace*id)` (existing helper, `0005*rls*helpers.sql`); INSERT additionally checks `requested*by = auth.uid()`. No UPDATE/DELETE policy for any client role — only the background worker's service-role admin client mutates status/archive fields, identical to `import*jobs`.
- Storage: `insert into storage.buckets (id, name, public) values ('workspace-exports', 'workspace-exports', false) on conflict (id) do nothing;`. No `storage.objects` policy for `anon`/`authenticated` — the bucket is service-role-only, read and written exclusively by the admin client (background worker writes; download route reads). This is a private bucket with zero client-facing surface, same trust boundary as `import_jobs`' service-role-only UPDATE.
- `bunkai*resolve*workspace*export*download(p*workspace*id uuid) returns jsonb`, `SECURITY DEFINER`, ***no caller-supplied identity parameter*** (derives actor from `auth.uid()` internally, per ADR-0012's preferred shape). Verifies `auth.uid()` is the active Owner of `p*workspace*id`, loads the latest `workspace*exports` row, and requires `status = 'completed' and expires*at > now()`; on success inserts the `export.downloaded` activity row and returns `{export*id, archive*path`} in the same transaction (this IS the audit write — `activity*log` has no client INSERT policy, so a DEFINER function is the only path, same reasoning as every other `activity*log` writer in this codebase). Any failure raises a distinct project-local SQLSTATE the route maps to 403/404/410.
- `bunkai*log*export*requested()` — an `AFTER INSERT` trigger function on `workspace*exports`, `SECURITY DEFINER`, no parameter at all (reads `NEW.workspace*id` / `NEW.requested*by`, both already constrained by the INSERT policy's own `auth.uid()` check). Inserts the `export.requested` activity row. This is the request-side audit write — the enqueue route never touches `activity_log` directly.
- `bunkai*list*activity` (`0045`/`0055`) — `create or replace`, full body copied forward (append-only precedent), `v_actions` default array gains `'export.requested'`, `'export.downloaded'`; `case (k.action)` gains two branches projecting `'{}'::jsonb` (no free-text payload field on either event — nothing to leak, nothing to redact).

## TypeScript

- `lib/activity/constants.ts` — `ACTIVITY*ALLOWED*ACTIONS` gains `'export.requested'`, `'export.downloaded'`.
- `lib/activity/labels.ts` — `ACTION_LABELS` gains `'requested a workspace data export'` / `'downloaded the workspace data export'`.
- `lib/workspace-export/constants.ts` — `EXPORT*DOWNLOAD*WINDOW*HOURS = 168` (confirmed BR), `EXPORT*STORAGE_BUCKET = 'workspace-exports'`.
- `lib/workspace-export/authorize.ts` — `assertExportAuthorized({db, userId, workspaceId})`, mirrors `assertTokenIssuanceAuthorized` (`lib/api/pat.ts:51-87`) shape: reads `workspace_members.role` for the caller in the target workspace, throws 403 unless `role === 'owner'`. Explicit inline check per the Dev answer already on the ticket — not the `workspace:admin` capability decorator, which every role holds for cookie sessions.
- `lib/workspace-export/collect.ts` — one function per entity (`collectProjects`, `collectModules`, … `collectMemberships`), each takes `(admin, workspaceId)` (or a parent id list) and returns a plain array via the admin client (bypasses RLS; the route's own Owner check is the authorization boundary, matching `runImportJob`'s use of the admin client after enqueue-time authorization). Entity list is the one already ratified in the 2026-08-18 Tech Lead comment: Projects, Modules, User Stories, Acceptance Criteria, ATCs + `atc*steps` + `atc*assertions` + `atc*acceptance*criteria`, Tests + `test*steps`, Runs + `run*atcs` + `run*steps`, Bugs, Activity (`activity*log`), memberships (`workspace_members`, id/role/status/timestamps only — no email resolution, to avoid a second admin-API round trip per member for an MVP compliance export; noted as a follow-up, not silently dropped).
- `lib/workspace-export/build-archive.ts` — `buildArchive(entities)`: one JSON file per entity (NDJSON for `run*steps`, the unbounded one) plus `manifest.json` (`workspace*id`, `generated_at`, per-entity record counts), zipped with `fflate` (`zipSync`, in-memory — acceptable at this workspace scale; a genuinely huge workspace is future work, not this story's bound).
- `lib/workspace-export/export-runner.ts` — `runWorkspaceExportJob(jobId)` / `executeExport(admin, jobId)`, byte-for-byte shape of `lib/jira/import-runner.ts`: claim (`update ... where status='queued' returning`), collect + build + upload to Storage under `${workspaceId}/${jobId}.zip`, mark `completed` with `expires*at = now() + 168h`; any throw after claim marks `failed` with a short, non-leaking `error*message` (never the raw driver error — mirrors `import_jobs.errors` intent, simplified to one string since there is no per-item loop here).
- New dependency: `fflate` (package.json + bun install).

## API — `app/api/v1/workspaces/[id]/data-export/`

- `route.ts` — `POST` (enqueue) + `GET` (poll latest). Both {{{ auth: 'cookie-only', why: 'Workspace data export is available to the Owner via a browser session only.' }}} (AC-15's confirmed answer — PAT rejected outright, not capability-gated). `POST`: `assertExportAuthorized`, insert row (RLS enforces Owner + `requested*by`), `23505` → 409 `export*in*progress`, `after(() => runWorkspaceExportJob(id))`, `202`. `GET`: `assertExportAuthorized`, select latest row by `(workspace*id, created*at desc) limit 1`, `null` → `{export: null`} (never-requested state), else the row — client derives `expired` by comparing `expires*at` to now(), so there is no separate persisted `expired` status to drift out of sync with the clock.
- `download/route.ts` — `GET`, {{{ auth: 'cookie-only', why: ... }}}, calls `bunkai*resolve*workspace*export*download` via the RLS-scoped client (audit + authorization + freshness all in one atomic call), then uses the admin client to `storage.from('workspace-exports').download(archive_path)` and streams the blob back with `Content-Type: application/zip` and `Content-Disposition: attachment; filename="workspace-export-<workspaceId>-<date>.zip"`.
- `route.openapi.ts` / `download/route.openapi.ts` — zod-to-openapi pairs mirroring `imports/route.openapi.ts`; every returned status registered, including 409 (in-flight), 403 (not Owner / PAT), 404 (never requested / no export), 410 (expired).
- Side-effect imports added to `scripts/openapi-gen.ts`.

## UI

- `lib/settings/nav-items.ts` — `SETTINGS*NAV*AVAILABLE` gains a `data-export` entry, but conditionally rendered: `SettingsNav` needs the caller's Owner-ness (new prop or a client-side check against `/api/v1/me` role) to satisfy AC-02's "absent, not present-and-refused." Resolved server-side in `layout.tsx` (same place the existing auth redirect lives) by checking `bunkai*is*workspace_owner` for the active workspace, passed down as a boolean prop — mirrors `billing/upgrade/page.tsx`'s existing `isOwner` display-hint RPC call, promoted here to an actual gating decision (not just a hint) since nav visibility is the enforcement surface for AC-02, backed by the route-level `assertExportAuthorized` + RLS as the real authorization boundary.
- `app/(app)/settings/data-export/page.tsx` — thin server page, same cookie/`resolveActiveWorkspaceId` shape as `billing/page.tsx`, passes `workspaceId` to the client view in `Suspense`.
- `components/data-export/DataExportView.tsx` — `'use client'`, two regions: a static "what this covers" panel (entity list + "ready archives stay downloadable for 7 days") and a status card driving `loading | never-requested | preparing | ready | expired | failed | error`, polling `GET .../data-export` while `preparing` (short interval, bounded — stops polling once `ready`/`failed`/`expired`), a Request/Retry button posting to the same endpoint, and a Download link/button hitting `download/route.ts` directly (browser-native download, not a fetch-then-blob dance) once `ready`.

## Design plan

`.context/design/master-design-plan.md`: update the existing 🔒 §8 row ([https://jira.upexgalaxy.com/browse/BK-508#icft=BK-508](https://jira.upexgalaxy.com/browse/BK-508#icft=BK-508), currently unratified) to point at the new screen; add a §4 entry (textual screen spec — reused live components, no separate HTML mockup, per Rule #14 LIVE-UI-FIRST since none existed to begin with); add a §5 ratification row recording the departure, citing Rule #18 (AI Product Owner decision, published to Jira first).

## Testing

- `lib/workspace-export/authorize.test.ts` — role gate (owner passes, admin/member/viewer 403).
- `lib/workspace-export/build-archive.test.ts` — manifest shape, per-entity counts, empty-workspace case (AC-16) produces a structurally valid archive with zero-length entity arrays.
- `lib/workspace-export/export-runner.test.ts` — claim idempotence (second claim on an already-running job is a no-op, mirrors `executeImport`), failure path marks `failed` with a message, never leaves `running`.
- `app/api/v1/workspaces/[id]/data-export/route.test.ts` (or the project's route-test convention) — 202 on first request, 409 on a second while `preparing`, 403 for non-Owner and for a Bearer PAT, `GET` returns `null` for never-requested.
- DB-integration test for `bunkai*resolve*workspace*export*download` (ADR-0012 requirement — new DEFINER function with no caller-supplied identity still needs the result-scoping half of the invariant proven against the real database): a non-Owner cannot resolve another workspace's export; an expired row is refused even though it is the latest row.
- Cross-workspace isolation (AC-09): export two workspaces owned by the same user, assert zero cross-referenced `workspace_id` in either archive.
- Credential exclusion (AC-10): assert no value from `access*token*secrets`, `magic*link*token*secrets`, or `workspace*invite_secrets` appears in a built archive — trivially true here since those tables are never queried by `collect.ts`, but the test exists so a future entity addition cannot regress it silently.

## Known limitations (explicitly not chased)

- Membership rows in the archive carry `user_id` only, not email — resolving email would mean an `admin.auth.admin` call per member; deferred rather than adding that cost to every export for a field not required by any AC.
- `milestones` and `test*plans`/`test*plan_tests` are not in the ratified 2026-08-18 entity list (both postdate that comment) and are out of scope for this pass — noted here rather than silently included or silently forgotten.
- No storage cleanup job for archives past their `expires_at` — the download route already refuses them, and physical purge is a cost/ops concern the story's Out of Scope field does not ask this ticket to solve (mirrors ADR-0013's own "purge is separate infrastructure" framing for a different feature).

---
_Synced from Jira by sync-jira-issues_
