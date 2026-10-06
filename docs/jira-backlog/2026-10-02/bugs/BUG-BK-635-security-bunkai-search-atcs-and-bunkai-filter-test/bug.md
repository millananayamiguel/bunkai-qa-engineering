# BUG: SECURITY: bunkai_search_atcs and bunkai_filter_tests_by_tag are granted to authenticated with a caller-supplied actor id, allowing cross-workspace reads

**Jira Key:** [BK-635](https://jira.upexgalaxy.com/browse/BK-635)
**Priority:** Medium
**Status:** Ready For QA
**Components:** None
**Fix Type:** Bugfix

---

## Description

## Summary

Two SECURITY DEFINER search RPCs accept the acting user's id as a caller-supplied parameter, never compare it to auth.uid(), and are granted EXECUTE to the authenticated role. Any signed-in user can call them directly through PostgREST with another user's uuid and read Tests and ATCs from workspaces they are not a member of.

## Affected functions

- public.bunkai*search*atcs(uuid, text, uuid, uuid, text, int) – supabase/migrations/0027*atc*search.sql:145
- public.bunkai*filter*tests*by*tag(uuid, text) – supabase/migrations/0030*test*tags.sql:326

Both are declared security definer set search*path = '' (so search*path hygiene is fine), both scope their result set with "join workspace*members wm on ... where wm.user*id = p*actor*user*id", and both end with "grant execute on function ... to authenticated, service*role;".

## Why the grant is the defect

The p*actor*user*id parameter exists for a legitimate reason – the header comment in 0027 says it plainly: PAT callers carry no auth.uid(), so the actor has to be passed in. That design is fine as long as only trusted server code can call the function. The service*role grant covers that.

The authenticated grant is what breaks it. lib/supabase/client.ts:19 ships a createBrowserClient with the anon key, so every signed-in user holds a role=authenticated JWT and can POST /rest/v1/rpc/<function> directly. Because the function is SECURITY DEFINER it runs as the owner, so RLS on tests and atcs never applies, and the only tenancy boundary left is the p*actor*user_id the attacker chose.

## Steps to reproduce

1. Sign in to the app as any user (user A) and copy the access token from the Supabase session.
2. Obtain any other user's uuid (user B). Workspace member lists and activity feeds surface these.
3. POST to /rest/v1/rpc/bunkai*filter*tests*by*tag with the apikey / Authorization headers of user A and body {"p*actor*user*id": "<user B uuid>", "p*tag": "smoke"}.

## Expected Result

The call is rejected, or it returns only rows user A is entitled to see.

## Actual Result

The response contains Test id, title, tags and step*count for every Test tagged "smoke" in every workspace user B belongs to, including workspaces user A has no membership in. The equivalent call to bunkai*search_atcs returns ATC rows across user B's workspaces.

## Impact

Cross-tenant read of Test and ATC metadata (titles, tags, step counts). No write path is exposed and no credential is disclosed. Severity is bounded by the fact that the attacker must already hold a valid account and must learn a target uuid, but the boundary that is supposed to stop them – workspace membership – is not enforced at all on these two entry points.

## Suggested fix

1. Change both grants to "to service_role;" only. Neither function is called from a session client: both are invoked server-side through createAdminClient().
2. Optionally add a defence-in-depth guard inside each function: "if p*actor*user_id <> auth.uid() and auth.uid() is not null then raise exception using errcode = '42501'; end if;" – this preserves the PAT path (auth.uid() is null) while blocking a session client from impersonating.
3. Add an isolation test per function that calls it through an authenticated (non-service-role) client with a foreign actor id and asserts a permission error.

## How this was found

Surfaced during the conductor review of PR #209 ([https://jira.upexgalaxy.com/browse/BK-203#icft=BK-203](https://jira.upexgalaxy.com/browse/BK-203#icft=BK-203)). That PR's new bunkai*search*tests had copied the same posture from these two functions; it was corrected before merge. These two are the pre-existing originals and are unrelated to BK-203's own changes – filing separately so the fix is not buried in a feature PR.

## Note on [https://jira.upexgalaxy.com/browse/BK-401#icft=BK-401](https://jira.upexgalaxy.com/browse/BK-401#icft=BK-401)

[https://jira.upexgalaxy.com/browse/BK-401#icft=BK-401](https://jira.upexgalaxy.com/browse/BK-401#icft=BK-401) ("bunkai*search*atcs does not return a member's own ATC – 2 isolation assertions fail on staging") already reports different faulty behaviour in bunkai*search*atcs. Whoever picks this up should read both together; the isolation test suite for that function is evidently not exercising the paths it is assumed to.

---

## Metadata

- **Created:** 2026-08-27
- **Updated:** 2026-08-31
- **Reporter:** Ely
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_
