# TEST: BK-258: TC7: should count only the active workspace bugs given the user belongs to two workspaces with open bugs

**Jira Key:** [BK-1099](https://jira.upexgalaxy.com/browse/BK-1099)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

## Related Story

BK-258 — TMS-Home | Show open bug count and severity breakdown (traces to AC1.c (refined workspace scope))

## Priority / ROI

| Priority | Frequency | Impact | Stability | Effort | Dependencies | ROI | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Critical | 4 | 5 | 4 | 3 | 3 | 0.9 | Candidate |

ROI = (Frequency x Impact x Stability) / (Effort x Dependencies) / 10. Why promoted: Tenant isolation, security-critical: another workspace's bugs must never be counted.

Regression flow: ***Home — open bugs overview (UI)*** in RTP BK-831.

## Prior bugs covered

- (none)

## Test Design

Technique: EP (workspace: active vs other member workspace)

### Preconditions

- Owner `{owner*email}` is a member of `{workspace*id}` (A) and `{fixture*workspace*id}` (B)
- A and B each hold open bugs; B holds a P4 open bug that A does not
- Counts of A and B read from the API

### Action

The user opens Home with A active, then switches the active workspace to B and opens Home again.

### Expected Results

- With A active the card equals A's API counts
- With B active the card equals B's API counts
- No bug of the inactive workspace appears in any chip

### Gherkin

The executable definition lives in the Xray Cucumber field of this Test (same content).

```gherkin
Feature: Home - Open bugs summary (BK-258)

  @critical @regression @automation-candidate @BK-258
  Scenario Outline: should count only the active workspace bugs given the user belongs to two workspaces with open bugs
    """
    Related Story: BK-258 (AC1.c)
    Bugs covered: none
    ROI: 0.9 (Candidate: tenant isolation, security-critical)
    """

    # === PRECONDITIONS ===
    Given the user "{owner*email}" belongs to workspaces "{workspace*id}" and "{fixture*workspace*id}"
    And both workspaces hold open bugs and only "{fixture*workspace*id}" holds an open P4 bug
    And the open-bugs API counts of both workspaces are read

    # === ACTION ===
    When the user switches the active workspace to "<active>"
    And the user navigates to "/home"

    # === VALIDATIONS ===
    Then "home-open-bugs-count" equals the API open_count of "<active>"
    And every severity chip equals the API by_severity of "<active>"
    And no bug of "<inactive>" is counted in any chip

    # === EQUIVALENT PARTITIONS ===
    Examples: Active vs inactive workspace
      | active                 | inactive               |
      | {workspace*id}         | {fixture*workspace_id} |
      | {fixture*workspace*id} | {workspace_id}         |
```

## Variables

| Variable | How to obtain |
| --- | --- |
| `{owner*email}` / `{owner*password}` | Workspace Owner account of the target env, read from `.env` (`STAGING*USER*EMAIL` / `STAGING*USER*PASSWORD` on staging). Never hardcoded. |
| `{workspace*id}` | Active workspace of the owner: `GET /api/v1/me` -> `active*workspace_id`. |
| `{fixture*workspace*id}` | Second workspace the owner belongs to (staging: "BK-258 QA Fixture"), with at least one open bug the first workspace does not have. |

## Implementation Code (filled by test-automation)

| Layer | File |
| --- | --- |
| API component | (pending) |
| UI component | (pending) |
| Test file | (pending) |

## Architecture

E2E (UI + API oracle) — KATA: Home page component + workspace switcher, hybrid fixture `{ test }`.

## Available Test IDs (UI)

- `home-open-bugs-count`
- `home-open-bugs-severity-{P1..P4}`
- `workspace switcher`

## Refinement Notes

Tightened: hardcoded "3" / "1" totals replaced by each workspace's own API counts (real workspaces are not empty); workspace switch through the UI switcher as executed in Stage 2.

---

## Metadata

- **Created:** 2026-09-28
- **Updated:** 2026-09-29
- **Reporter:** Benjamin Segovia
- **Assignee:** Benjamin Segovia
- **Labels:** automation-candidate, e2e, regression, regression-candidate

---

_Synced from Jira by sync-jira-issues_
