# TEST: BK-258: TC4: should show 0 and the Nothing outstanding message without severity chips given no open bug in the workspace

**Jira Key:** [BK-1096](https://jira.upexgalaxy.com/browse/BK-1096)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

## Related Story

BK-258 — TMS-Home | Show open bug count and severity breakdown (traces to AC2)

## Priority / ROI

| Priority | Frequency | Impact | Stability | Effort | Dependencies | ROI | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Critical | 4 | 3 | 4 | 2 | 2 | 1.2 | Candidate |

ROI = (Frequency x Impact x Stability) / (Effort x Dependencies) / 10. Why promoted: AC2 zero state; a wrong zero state is a false all-clear. Fixture workspace now exists, so the precondition is reproducible.

Regression flow: ***Home — open bugs overview (UI)*** in RTP BK-831.

## Prior bugs covered

- (none)

## Test Design

Technique: BVA (count = 0) + EP (why nothing is open: no bugs / only resolved-closed / only archived-module)

### Preconditions

- Owner `{owner*email}` signed in with the dedicated fixture workspace `{fixture*workspace_id}` active
- Every bug of the fixture workspace in the state of the Examples row

### Action

The user opens the Home screen.

### Expected Results

- Total shows 0
- Message "Nothing outstanding right now." is shown
- No P1-P4 chips rendered
- API returns open_count 0 and all four severities 0

### Gherkin

The executable definition lives in the Xray Cucumber field of this Test (same content).

```gherkin
Feature: Home - Open bugs summary (BK-258)

  @critical @regression @automation-candidate @BK-258
  Scenario Outline: should show 0 and the Nothing outstanding message without severity chips given no open bug in the workspace
    """
    Related Story: BK-258 (AC2)
    Bugs covered: none
    ROI: 1.2 (Candidate)
    """

    # === PRECONDITIONS ===
    Given the user "{owner*email}" is signed in with "{fixture*workspace_id}" as the active workspace
    And every bug of "{fixture*workspace*id}" is <bug_state>

    # === ACTION ===
    When the user navigates to "/home"

    # === VALIDATIONS ===
    Then "home-open-bugs-count" shows 0
    And "home-open-bugs-empty" shows "Nothing outstanding right now."
    And "home-open-bugs-severities" is not rendered
    And the open-bugs API returns open*count 0 and by*severity {"P1":0,"P2":0,"P3":0,"P4":0}

    # === EQUIVALENT PARTITIONS ===
    Examples: Reasons nothing is open
      | bug_state                                 |
      | absent (the workspace has no bugs)        |
      | in status resolved or closed              |
      | open but inside an archived module        |
```

## Variables

| Variable | How to obtain |
| --- | --- |
| `{owner*email}` / `{owner*password}` | Workspace Owner account of the target env, read from `.env` (`STAGING*USER*EMAIL` / `STAGING*USER*PASSWORD` on staging). Never hardcoded. |
| `{fixture*workspace*id}` | Dedicated QA fixture workspace owned by `{owner*email}` (staging: the "BK-258 QA Fixture" workspace), selected via the workspace switcher / `bk*active_ws` cookie. Must hold no open bug in an active module. |

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
- `home-open-bugs-empty`
- `home-open-bugs-severities (must be absent)`

## Refinement Notes

Tightened: fixture workspace as a variable; the shared staging workspace is never used for the zero state; empty-state test id pinned (home-open-bugs-empty).

---

## Metadata

- **Created:** 2026-09-28
- **Updated:** 2026-09-29
- **Reporter:** Benjamin Segovia
- **Assignee:** Benjamin Segovia
- **Labels:** automation-candidate, e2e, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
