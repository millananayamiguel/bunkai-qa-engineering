# TEST: BK-258: TC8: should return open_count and by_severity matching the Home card when a workspace member calls the open-bugs API

**Jira Key:** [BK-1100](https://jira.upexgalaxy.com/browse/BK-1100)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

## Related Story

BK-258 — TMS-Home | Show open bug count and severity breakdown (traces to AC1 (API contract))

## Priority / ROI

| Priority | Frequency | Impact | Stability | Effort | Dependencies | ROI | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- |
| High | 5 | 3 | 4 | 1 | 2 | 3.0 | Candidate |

ROI = (Frequency x Impact x Stability) / (Effort x Dependencies) / 10. Why promoted: Cheap API contract check; it is also the oracle the UI flow relies on.

Regression flow: ***Open-bugs API (API)*** in RTP BK-831.

## Prior bugs covered

- (none)

## Test Design

Technique: EP (auth mode: bearer / PAT / cookie) + contract check

### Preconditions

- Owner `{owner_email}` authenticated with the credential of the Examples row
- `{workspace_id}` is a workspace the caller belongs to

### Action

The caller sends `GET /api/v1/workspaces/{workspace_id}/open-bugs`.

### Expected Results

- 200
- Body has integer open*count, object by*severity with keys P1-P4, array open_statuses
- open*count = sum of by*severity
- Values identical across credential types
- Values equal a DB count of bugs with status open/in_progress in non-archived modules (when DB access exists)

### Gherkin

The executable definition lives in the Xray Cucumber field of this Test (same content).

```gherkin
Feature: Home - Open bugs summary (BK-258)

  @high @regression @automation-candidate @BK-258
  Scenario Outline: should return open*count and by*severity matching the Home card when a workspace member calls the open-bugs API
    """
    Related Story: BK-258 (AC1, API contract)
    Bugs covered: none
    ROI: 3.0 (Candidate)
    """

    # === PRECONDITIONS ===
    Given the user "{owner*email}" is a member of "{workspace*id}"
    And the caller is authenticated with <credential>

    # === ACTION ===
    When the caller sends GET /api/v1/workspaces/{workspace_id}/open-bugs

    # === VALIDATIONS ===
    Then the response status is 200
    And the body has integer "open*count", object "by*severity" with keys P1, P2, P3, P4 and array "open_statuses"
    And "open*count" equals the sum of the four "by*severity" values
    And "open*statuses" equals ["open","in*progress"]
    And the values equal the Home "Open bugs" card of "{workspace_id}"

    # === EQUIVALENT PARTITIONS ===
    Examples: Accepted credentials
      | credential                        |
      | the bearer token "{bearer_token}" |
      | the PAT "{pat*atc*read}"          |
      | the browser session cookie        |
```

## Variables

| Variable | How to obtain |
| --- | --- |
| `{owner*email}` / `{owner*password}` | Workspace Owner account of the target env, read from `.env` (`STAGING*USER*EMAIL` / `STAGING*USER*PASSWORD` on staging). Never hardcoded. |
| `{workspace*id}` | Active workspace of the owner: `GET /api/v1/me` -> `active*workspace_id`. |
| `{bearer_token}` | Login response token (`bun run api:login` -> `.auth/tokens.env`). |
| `{pat*atc*read}` | PAT minted in setup with the `atc:read` capability, revoked in teardown. |

## Implementation Code (filled by test-automation)

| Layer | File |
| --- | --- |
| API component | (pending) |
| UI component | (pending) |
| Test file | (pending) |

## Architecture

Integration (API only) — KATA: open-bugs Api component, fixture `{ api }`.

## Available Test IDs (UI)

- `home-open-bugs-count (parity read, optional)`

## Refinement Notes

Tightened: three credential types as Examples rows (all returned identical payloads in Stage 2); DB parity kept as optional oracle (no DB access in Stage 2, the project bug-list aggregate was used instead).

---

## Metadata

- **Created:** 2026-09-28
- **Updated:** 2026-09-29
- **Reporter:** Benjamin Segovia
- **Assignee:** Benjamin Segovia
- **Labels:** automation-candidate, integration, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
