# TEST: BK-258: TC9: should reject the open-bugs API with 401 or 403 when the caller is unauthenticated or lacks atc:read

**Jira Key:** [BK-1101](https://jira.upexgalaxy.com/browse/BK-1101)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

## Related Story

BK-258 — TMS-Home | Show open bug count and severity breakdown (traces to Risk beyond AC (authorization))

## Priority / ROI

| Priority | Frequency | Impact | Stability | Effort | Dependencies | ROI | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- |
| High | 5 | 5 | 5 | 1 | 2 | 6.3 | Candidate |

ROI = (Frequency x Impact x Stability) / (Effort x Dependencies) / 10. Why promoted: Auth enforcement on a workspace aggregate; highest ROI of the Story.

Regression flow: ***Open-bugs API (API)*** in RTP BK-831.

## Prior bugs covered

- (none)

## Test Design

Technique: Decision Table (credential present x atc:read held)

### Preconditions

- `{workspace*id}` belongs to `{owner*email}`
- PATs `{pat*atc*read}` and `{pat*no*atc_read}` minted in setup

### Action

The caller sends `GET /api/v1/workspaces/{workspace_id}/open-bugs` with the credential of the Examples row.

### Expected Results

- No credential / invalid bearer -> 401 unauthorized
- PAT without atc:read -> 403 "Missing required capability: atc:read"
- PAT with atc:read / session cookie -> 200

### Gherkin

The executable definition lives in the Xray Cucumber field of this Test (same content).

```gherkin
Feature: Home - Open bugs summary (BK-258)

  @high @regression @automation-candidate @BK-258
  Scenario Outline: should reject the open-bugs API with 401 or 403 when the caller is unauthenticated or lacks atc:read
    """
    Related Story: BK-258 (risk beyond AC: authorization)
    Bugs covered: none
    ROI: 6.3 (Candidate)
    """

    # === PRECONDITIONS ===
    Given "{workspace*id}" is a workspace of the user "{owner*email}"
    And the PATs "{pat*atc*read}" and "{pat*no*atc_read}" exist for that user

    # === ACTION ===
    When the caller sends GET /api/v1/workspaces/{workspace_id}/open-bugs with <credential>

    # === VALIDATIONS ===
    Then the response status is <status>
    And the response error is <error>

    # === EQUIVALENT PARTITIONS ===
    Examples: Denied
      | credential                               | status | error                                   |
      | no cookie and no Authorization header    | 401    | unauthorized                            |
      | the bearer token "{invalid_token}"       | 401    | unauthorized                            |
      | the PAT "{pat*no*atc_read}"              | 403    | "Missing required capability: atc:read" |
    Examples: Allowed
      | credential                               | status | error  |
      | the PAT "{pat*atc*read}"                 | 200    | (none) |
      | the browser session cookie               | 200    | (none) |
```

## Variables

| Variable | How to obtain |
| --- | --- |
| `{owner*email}` / `{owner*password}` | Workspace Owner account of the target env, read from `.env` (`STAGING*USER*EMAIL` / `STAGING*USER*PASSWORD` on staging). Never hardcoded. |
| `{workspace*id}` | Active workspace of the owner: `GET /api/v1/me` -> `active*workspace_id`. |
| `{pat*atc*read}` | PAT minted with `atc:read`, revoked in teardown. |
| `{pat*no*atc_read}` | PAT minted with a capability other than `atc:read` (e.g. `run:execute`), revoked in teardown. |
| `{invalid_token}` | Any random string that is not a valid token. |

## Implementation Code (filled by test-automation)

| Layer | File |
| --- | --- |
| API component | (pending) |
| UI component | (pending) |
| Test file | (pending) |

## Architecture

Integration (API only) — KATA: open-bugs Api component, fixture `{ api }`.

## Available Test IDs (UI)

- `n/a (API only)`

## Refinement Notes

Tightened: 403 error code aligned with the observed API message ("Missing required capability: atc:read"); decision-table rows split into Deny / Allow Examples.

---

## Metadata

- **Created:** 2026-09-28
- **Updated:** 2026-09-29
- **Reporter:** Benjamin Segovia
- **Assignee:** Benjamin Segovia
- **Labels:** automation-candidate, integration, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
