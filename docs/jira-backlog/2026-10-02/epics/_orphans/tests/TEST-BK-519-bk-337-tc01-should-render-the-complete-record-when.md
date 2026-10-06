# TEST: BK-337: TC01: should render the complete record when the defect was filed from a failing run step

**Jira Key:** [BK-519](https://jira.upexgalaxy.com/browse/BK-519)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

> ***INFO:**** Promoted to the regression repository by `/test-documentation` Stage 4 on 2026-09-01. Verdict ****Candidate**** at ROI ****13.3***. Executed and PASSED in sprint on Test Execution BK-518.

## Traceability

| Axis | Value |
| --- | --- |
| Source Story | BK-337 TMS-Defect Detail | Open a defect and read its full record |
| Acceptance Criteria covered | AC 1.1, 1.2, 1.3, 1.4, E-6 |
| Acceptance Test Set | BK-541 |
| Acceptance Test Plan | BK-516 |
| Regression Test Plan | BK-831 |
| Feature Test Set | BK-402 |
| Supersedes | BK-520, BK-521, BK-522, BK-537 |

## ROI

| Factor | Score | Reading |
| --- | --- | --- |
| Frequency | 5 | core read path, runs on every pull request |
| Impact | 4 | the feature does not exist without this record |
| Stability | 4 | criteria ratified at Revision 2, spec closed |
| Effort (divisor) | 2 | page assertions only, fixture already seeded |
| Dependencies (divisor) | 3 | needs a defect with an ATC, a run and a run step |

`ROI = (5 x 4 x 4) / (2 x 3) = 13.3`

## Why these four sprint Tests collapsed into one

BK-520, BK-521, BK-522 and BK-537 each asserted a different panel of the SAME page load, from the SAME fixture, after the SAME action. A Test is identified by its precondition and its action, not by how many things it then checks. Four artifacts for one page load is the anti-pattern; one Test with a grouped assertion block is the fix. They are marked DEPRECATED, not deleted, so the sprint execution history on BK-518 stays intact.

## Variables

| Variable | How to obtain |
| --- | --- |
| `bug_id` | seeded run-linked fixture `10000000-0000-4000-8000-000000000011` |
| `project_slug` | `new-project-example-qa2` |
| `step*position` | `run*steps.position` on the referenced step; seeded at `2` |
| `step*position*plus_1` | the displayed ordinal; storage is 0-based, display is 1-based |
| `atc*id` / `run*id` | read from the fixture row's provenance columns |
| `reporter*name` / `filed*at` / `assignee_name` | read from the record, never asserted as a literal |

## Preconditions

Fixture seeded in staging via DBHub, respecting `bunkai*bugs*check_consistency`. A fresh owner PAT is minted with `bun run api:login staging`; the token has a one-hour TTL.

## Known gotchas

- `/projects/[slug]/...` resolves against the browser session's ***active*** workspace, not a global search across memberships. Switch workspace before navigating, or the route 404s on a record the reader is entitled to.
- The ordinals in the steps-to-reproduce list are line numbers of a free-text field. They must never be joined back to `run_steps`.

---

## Related Issues

- is executed by: [BK-518](https://jira.upexgalaxy.com/browse/BK-518) - ATR: BK-337: Story Testing
- is designed by: [BK-516](https://jira.upexgalaxy.com/browse/BK-516) - ATP: BK-337: TMS-Defect Detail | Open a defect and read its full record

---

## Metadata

- **Created:** 2026-08-19
- **Updated:** 2026-09-02
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** automation-candidate, e2e, high, regression

---

_Synced from Jira by sync-jira-issues_
