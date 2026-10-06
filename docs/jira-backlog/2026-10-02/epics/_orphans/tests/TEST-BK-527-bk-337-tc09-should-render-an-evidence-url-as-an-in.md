# TEST: BK-337: TC09: should render an evidence URL as an inert label when its scheme is neither http nor https

**Jira Key:** [BK-527](https://jira.upexgalaxy.com/browse/BK-527)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

> ***INFO:**** Promoted to the regression repository by `/test-documentation` Stage 4 on 2026-09-01. Verdict ****Candidate**** at ROI ****25.0***. Executed and PASSED in sprint on Test Execution BK-518.

## Traceability

| Axis | Value |
| --- | --- |
| Source Story | BK-337 TMS-Defect Detail | Open a defect and read its full record |
| Acceptance Criteria covered | AC 3.4 |
| Acceptance Test Set | BK-541 |
| Acceptance Test Plan | BK-516 |
| Regression Test Plan | BK-831 |
| Feature Test Set | BK-402 |
| Supersedes | none |

## ROI

| Factor | Score | Reading |
| --- | --- | --- |
| Frequency | 5 | every pull request, it is a security guard |
| Impact | 5 | an anchor on a javascript: URL is script execution under the reader's session |
| Stability | 4 | the allowlist is a stated Business Rule |
| Effort (divisor) | 2 | one page load per scheme |
| Dependencies (divisor) | 2 | one fixture carrying a rejected entry |

`ROI = (5 x 5 x 4) / (2 x 2) = 25.0`

> ***WARNING:*** Security regression guard. An evidence URL is attacker-influenced text that the record renders back to every workspace member. If a `javascript:` or `data:` entry is ever promoted to an anchor, clicking it executes script in the reader's authenticated session.

## Related open bug

***BK-466**** reports the same class of unscoped anchor on ****RunnerView***, and is still `Ready For QA`. This Test guards the defect-detail render path only, so it does NOT cover BK-466. RunnerView needs its own guard, filed against whichever retest closes BK-466. Recorded here as an explicit handoff rather than a silent gap.

## Variables

| Variable | How to obtain |
| --- | --- |
| `bug_id` | `10000000-0000-4000-8000-000000000013`, seeded with ten entries including one `javascript:` |
| `scheme` | the scheme component of each entry in `evidence_urls` |

## Expected results

`http` and `https` render as anchors, open in a new tab, and carry `rel="noopener noreferrer"`. Every other scheme renders as plain text with no href. The same allowlist runs at filing time, so the render path is never the only defence.

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
- **Labels:** automation-candidate, critical, e2e, regression, security

---

_Synced from Jira by sync-jira-issues_
