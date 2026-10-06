# TEST: BK-258: TC2: should count open and in-progress bugs and exclude resolved and closed ones

**Jira Key:** [BK-1094](https://jira.upexgalaxy.com/browse/BK-1094)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

## Related Story

BK-258 — TMS-Home | Show open bug count and severity breakdown (traces to AC1.a (refined status rule))

## Priority / ROI

| Priority | Frequency | Impact | Stability | Effort | Dependencies | ROI | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Critical | 4 | 4 | 4 | 2 | 2 | 1.6 | Candidate |

ROI = (Frequency x Impact x Stability) / (Effort x Dependencies) / 10. Why promoted: Core business rule (definition of "open"); a wrong rule is a silent data-integrity error.

Regression flow: ***Home — open bugs overview (UI)*** in RTP BK-831.

## Prior bugs covered

- (none)

## Test Design

Technique: EP (status: counted vs excluded partitions)

### Preconditions

- Owner `{owner*email}` signed in, `{workspace*id}` active
- Baseline counts `{baseline}` read from the API
- One P3 bug in active module `{active*module*id}` moved forward to the status of the Examples row

### Action

The user opens the Home screen.

### Expected Results

- open / in_progress: total and P3 chip +1 each
- resolved / closed: total and P3 chip unchanged
- API `open*statuses` = ["open","in*progress"]
- Card equals API

### Gherkin

The executable definition lives in the Xray Cucumber field of this Test (same content).

```gherkin
Feature: Home - Open bugs summary (BK-258)

  @critical @regression @automation-candidate @BK-258
  Scenario Outline: should count open and in-progress bugs and exclude resolved and closed ones
    """
    Related Story: BK-258 (AC1.a)
    Bugs covered: none
    ROI: 1.6 (Candidate)
    """

    # === PRECONDITIONS ===
    Given the user "{owner*email}" is signed in with "{workspace*id}" as the active workspace
    And the baseline open-bugs counts of "{workspace_id}" are read from the open-bugs API
    And a P3 bug "{bug*id}" in the active module "{active*module_id}" is moved forward to status "<status>"

    # === ACTION ===
    When the user navigates to "/home"

    # === VALIDATIONS ===
    Then "home-open-bugs-count" shows the baseline total <delta>
    And "home-open-bugs-severity-P3" shows the baseline P3 count <delta>
    And the open-bugs API field open*statuses equals ["open","in*progress"]
    And the open-bugs API open_count equals the card total

    # === EQUIVALENT PARTITIONS ===
    Examples: Counted statuses
      | status      | delta |
      | open        | +1    |
      | in_progress | +1    |
    Examples: Excluded statuses
      | status   | delta |
      | resolved | +0    |
      | closed   | +0    |
```

## Variables

| Variable | How to obtain |
| --- | --- |
| `{owner*email}` / `{owner*password}` | Workspace Owner account of the target env, read from `.env` (`STAGING*USER*EMAIL` / `STAGING*USER*PASSWORD` on staging). Never hardcoded. |
| `{workspace*id}` | Active workspace of the owner: `GET /api/v1/me` -> `active*workspace_id`. |
| `{active*module*id}` | A non-archived module of `{project*id}` created by the test setup (`modules.archived*at is null`). |
| `{baseline}` | open*count + by*severity read from `GET /api/v1/workspaces/{workspace_id}/open-bugs` BEFORE seeding; every assertion is a delta against it (shared staging workspace, never assume empty). |
| `{bug*id}` | Id returned by `POST /api/v1/bugs` in setup; status moved with `POST /api/v1/bugs/{bug*id}/status` (forward-only). |

## Implementation Code (filled by test-automation)

| Layer | File |
| --- | --- |
| API component | (pending) |
| UI component | (pending) |
| Test file | (pending) |

## Architecture

E2E (UI + API oracle) — KATA: Home page component + open-bugs Api component, hybrid fixture `{ test }`.

## Available Test IDs (UI)

- `home-open-bugs-count`
- `home-open-bugs-severity-P3`

## Refinement Notes

Tightened: account variable instead of "staging-userbunk"; status reached through the forward-only status API (backward transitions return 422, verified in Stage 2); card-vs-API parity added to every row.

---

## Metadata

- **Created:** 2026-09-28
- **Updated:** 2026-09-29
- **Reporter:** Benjamin Segovia
- **Assignee:** Benjamin Segovia
- **Labels:** automation-candidate, e2e, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
