# TEST: BK-88: TC08: Validate POST /api/v1/tokens returns 403 when member-role user issues workspace:admin scope

**Jira Key:** [BK-127](https://jira.upexgalaxy.com/browse/BK-127)
**Status:** MANUAL
**Components:** Bunkai API Tokens

---

## Test Description

## TC08 - POST privilege escalation: workspace:admin scope without the required role, 403

***Group***: B-POST

### Precondition

- Authenticated caller with a valid cookie session.
- The caller holds a role BELOW admin in the target workspace (viewer or member), and is an active member of it.

### Steps

1. POST /api/v1/tokens with `{ "name": "...", "scopes": ["workspace:admin"], "workspace_id": "<a workspace where the caller is only a viewer or member>" }`.
2. Inspect the response status code.
3. Inspect the response body for the error message.
4. Cross-check the database: no new row in access_tokens for that call.

### Expected

- HTTP 403 Forbidden.
- The body states that only workspace admins or owners can issue workspace:admin tokens.
- No token row is created.

### History (corrected 2026-09-17)

This TC previously cited "known defect BK-117". ***BK-117 does not exist on this Jira instance.**** The real defect is ****BK-135**** (privilege escalation, severity critica), filed 2026-06-12 off the failure of this very TC and now ****Closed****; the enforcement work is tracked in ****BK-167*** (FIXED). The stale reference is corrected here so a future reader does not chase a phantom key.

The 2026-06-12 note also said this TC needed a second, member-role user. It does not: the staging owner account is an active ***viewer*** of a second workspace, which is equally below the admin threshold and reaches the same guard.

### Relationship to TC07

TC07 (BK-126) sends an invalid enum string such as `admin:all` and expects 422 from schema validation. TC08 sends a ***valid*** scope with an insufficient role and expects 403 from the authorization guard. The enum accepting the value is not a grant; the two tests cover different layers.

***Auth***: cookie session.

---

## Related Issues

- tests: [BK-88](https://jira.upexgalaxy.com/browse/BK-88) - Settings | Manage Personal Access Tokens

---

## Metadata

- **Created:** 2026-06-12
- **Updated:** 2026-09-18
- **Reporter:** Carlos Alberto Chiavassa
- **Assignee:** Carlos Alberto Chiavassa

---

_Synced from Jira by sync-jira-issues_
