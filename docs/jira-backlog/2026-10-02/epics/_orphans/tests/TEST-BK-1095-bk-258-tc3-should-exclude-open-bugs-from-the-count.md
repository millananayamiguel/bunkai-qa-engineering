# TEST: BK-258: TC3: should exclude open bugs from the count when their module is archived

**Jira Key:** [BK-1095](https://jira.upexgalaxy.com/browse/BK-1095)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

## Related Story

BK-258 — TMS-Home | Show open bug count and severity breakdown (traces to AC1.b (refined archived-module rule))

## Priority / ROI

| Priority | Frequency | Impact | Stability | Effort | Dependencies | ROI | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- |
| High | 4 | 3 | 4 | 2 | 3 | 0.8 | Candidate |

ROI = (Frequency x Impact x Stability) / (Effort x Dependencies) / 10. Why promoted: Prior-bug rule: the archived-module exclusion was a dev fix inside PR #124 (commit c9cd8af9); area proven to regress, promoted despite ROI < 1.0.

Regression flow: ***Home — open bugs overview (UI)*** in RTP BK-831.

## Prior bugs covered

- Dev fix commit c9cd8af9 (PR upex-galaxy/upex-bunkai-tms#124): open bugs in archived modules were being counted

## Test Design

Technique: EP (module: active vs archived) + State-Transition (module archive)

### Preconditions

- Owner `{owner*email}` signed in, `{workspace*id}` active
- Module `{active*module*id}` with 1 open P2 bug
- Module `{archive*module*id}` with 2 open P1 bugs
- Counts before archiving read from Home

### Action

The user archives module `{archive*module*id}` and reloads Home.

### Expected Results

- Total decreases by 2
- P1 Critical chip decreases by 2
- P2 Major chip unchanged
- API agrees with the card

### Gherkin

The executable definition lives in the Xray Cucumber field of this Test (same content).

```gherkin
Feature: Home - Open bugs summary (BK-258)

  @high @regression @automation-candidate @BK-258
  Scenario: should exclude open bugs from the count when their module is archived
    """
    Related Story: BK-258 (AC1.b)
    Bugs covered: dev fix c9cd8af9 (archived-module bugs were counted)
    ROI: 0.8 (Candidate by the prior-bug rule)
    """

    # === PRECONDITIONS ===
    Given the user "{owner*email}" is signed in with "{workspace*id}" as the active workspace
    And the active module "{active*module*id}" has 1 open P2 bug
    And the module "{archive*module*id}" has 2 open P1 bugs
    And the Home "Open bugs" counts are noted

    # === ACTION ===
    When the user archives the module "{archive*module*id}"
    And the user navigates to "/home"

    # === VALIDATIONS ===
    Then "home-open-bugs-count" decreases by 2
    And "home-open-bugs-severity-P1" decreases by 2
    And "home-open-bugs-severity-P2" is unchanged
    And the open-bugs API returns the same open*count and by*severity as the card
```

## Variables

| Variable | How to obtain |
| --- | --- |
| `{owner*email}` / `{owner*password}` | Workspace Owner account of the target env, read from `.env` (`STAGING*USER*EMAIL` / `STAGING*USER*PASSWORD` on staging). Never hardcoded. |
| `{workspace*id}` | Active workspace of the owner: `GET /api/v1/me` -> `active*workspace_id`. |
| `{project*id}` | A QA-owned project in `{workspace*id}`, created by the test setup (`POST /api/v1/projects`) or discovered by name. |
| `{active*module*id}` | A non-archived module of `{project*id}` created by the test setup (`modules.archived*at is null`). |
| `{archive*module*id}` | Second QA-created module of `{project*id}`, archived by the test (`modules.archived*at` set). Never archive a module the test did not create. |

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
- `home-open-bugs-severity-P1`
- `home-open-bugs-severity-P2`

## Refinement Notes

Tightened: account and module ids as variables; prior dev fix c9cd8af9 recorded as the reason for promotion; API parity kept as the oracle.

---

## Metadata

- **Created:** 2026-09-28
- **Updated:** 2026-09-29
- **Reporter:** Benjamin Segovia
- **Assignee:** Benjamin Segovia
- **Labels:** automation-candidate, e2e, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
