# TEST: BK-258: TC1: should show the open bug total with a P1-P4 breakdown that sums to it given open bugs at several severities

**Jira Key:** [BK-1093](https://jira.upexgalaxy.com/browse/BK-1093)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

## Related Story

BK-258 — TMS-Home | Show open bug count and severity breakdown (traces to AC1)

## Priority / ROI

| Priority | Frequency | Impact | Stability | Effort | Dependencies | ROI | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Critical | 4 | 4 | 4 | 2 | 2 | 1.6 | Candidate |

ROI = (Frequency x Impact x Stability) / (Effort x Dependencies) / 10. Why promoted: Critical happy path of AC1: the number every workspace member reads on Home.

Regression flow: ***Home — open bugs overview (UI)*** in RTP BK-831.

## Prior bugs covered

- (none)

## Test Design

Technique: EP (valid partition: several severities, several counted statuses)

### Preconditions

- Owner `{owner*email}` signed in, `{workspace*id}` active
- Baseline counts `{baseline}` read from the API
- Five bugs seeded in active module `{active*module*id}`: P1 open, P2 open, P2 in*progress, P3 open, P4 in*progress

### Action

The user opens the Home screen (`/home`).

### Expected Results

- Total = baseline total + 5
- Chips read P1 Critical +1, P2 Major +2, P3 Minor +1, P4 Trivial +1 against the baseline
- Total equals the sum of the four chips
- API `open*count` / `by*severity` equal the card

### Gherkin

The executable definition lives in the Xray Cucumber field of this Test (same content).

```gherkin
Feature: Home - Open bugs summary (BK-258)

  @critical @regression @automation-candidate @BK-258
  Scenario: should show the open bug total with a P1-P4 breakdown that sums to it given open bugs at several severities
    """
    Related Story: BK-258 (AC1)
    Bugs covered: none
    ROI: 1.6 (Candidate)
    """

    # === PRECONDITIONS ===
    Given the user "{owner*email}" is signed in with "{workspace*id}" as the active workspace
    And the baseline open-bugs counts of "{workspace_id}" are read from the open-bugs API
    And these bugs exist in the active module "{active*module*id}" of project "{project_id}":
      | severity | status      |
      | P1       | open        |
      | P2       | open        |
      | P2       | in_progress |
      | P3       | open        |
      | P4       | in_progress |

    # === ACTION ===
    When the user navigates to "/home"
    And the "home-open-bugs-skeleton" placeholder is gone

    # === VALIDATIONS ===
    Then "home-open-bugs-count" shows the baseline total plus 5
    And the severity chips change against the baseline as follows:
      | chip                         | text        | delta |
      | home-open-bugs-severity-P1   | P1 Critical | +1    |
      | home-open-bugs-severity-P2   | P2 Major    | +2    |
      | home-open-bugs-severity-P3   | P3 Minor    | +1    |
      | home-open-bugs-severity-P4   | P4 Trivial  | +1    |
    And the total equals the sum of the four severity chips
    And GET /api/v1/workspaces/{workspace*id}/open-bugs returns the same open*count and by_severity as the card
```

## Variables

| Variable | How to obtain |
| --- | --- |
| `{owner*email}` / `{owner*password}` | Workspace Owner account of the target env, read from `.env` (`STAGING*USER*EMAIL` / `STAGING*USER*PASSWORD` on staging). Never hardcoded. |
| `{workspace*id}` | Active workspace of the owner: `GET /api/v1/me` -> `active*workspace_id`. |
| `{project*id}` | A QA-owned project in `{workspace*id}`, created by the test setup (`POST /api/v1/projects`) or discovered by name. |
| `{active*module*id}` | A non-archived module of `{project*id}` created by the test setup (`modules.archived*at is null`). |
| `{baseline}` | open*count + by*severity read from `GET /api/v1/workspaces/{workspace_id}/open-bugs` BEFORE seeding; every assertion is a delta against it (shared staging workspace, never assume empty). |

## Implementation Code (filled by test-automation)

| Layer | File |
| --- | --- |
| API component | (pending) |
| UI component | (pending) |
| Test file | (pending) |

## Architecture

E2E (UI + API oracle) — KATA: Home page component + open-bugs Api component, hybrid fixture `{ test }`.

## Available Test IDs (UI)

- `home-open-bugs`
- `home-open-bugs-count`
- `home-open-bugs-severities`
- `home-open-bugs-severity-{P1..P4}`
- `home-open-bugs-skeleton`

## Refinement Notes

Tightened: hardcoded account "staging-userbunk" replaced by `{owner_email}` from .env (Stage 2 actually ran as the .env Owner); absolute "total of 5" replaced by baseline-relative deltas (staging workspace is shared, baseline was 4); test ids pinned from components/home/OpenBugs.tsx; automation note: wait for `home-open-bugs-skeleton` to detach before reading the count (RSC streaming can briefly render the count twice).

---

## Metadata

- **Created:** 2026-09-28
- **Updated:** 2026-09-29
- **Reporter:** Benjamin Segovia
- **Assignee:** Benjamin Segovia
- **Labels:** automation-candidate, e2e, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
