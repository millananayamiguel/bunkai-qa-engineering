# TEST: BK-337: TC14: should answer the not-found convention for every identifier the reader may not resolve

**Jira Key:** [BK-532](https://jira.upexgalaxy.com/browse/BK-532)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

> ***INFO:**** Promoted to the regression repository by `/test-documentation` Stage 4 on 2026-09-01. Verdict ****Candidate**** at ROI ****62.5***. Executed and PASSED in sprint on Test Execution BK-518.

## Traceability

| Axis | Value |
| --- | --- |
| Source Story | BK-337 TMS-Defect Detail | Open a defect and read its full record |
| Acceptance Criteria covered | AC E-1, E-2, plus the API authentication guard |
| Acceptance Test Set | BK-541 |
| Acceptance Test Plan | BK-516 |
| Regression Test Plan | BK-831 |
| Feature Test Set | BK-402 |
| Supersedes | BK-533, BK-539 |

## ROI

| Factor | Score | Reading |
| --- | --- | --- |
| Frequency | 5 | every pull request; cheapest guard on the tenant perimeter |
| Impact | 5 | a 403 here leaks cross-tenant existence |
| Stability | 5 | the not-found convention is a shipped invariant with in-repo precedent |
| Effort (divisor) | 1 | pure API calls, no browser, no page state |
| Dependencies (divisor) | 2 | one foreign-tenant fixture, the rest need no data |

`ROI = (5 x 5 x 5) / (1 x 2) = 62.5`

> ***WARNING:*** Cross-tenant isolation guard. The invariant: a defect the caller may not see must be indistinguishable from a defect that does not exist. A `403` confirms the identifier resolves to a real row and leaks the existence of another workspace's data.

## Decision table

Two conditions interact, so the partitions are enumerated rather than guessed: credential state (absent, valid) against identifier shape (readable, malformed, unknown, foreign). Five surviving rules, one Test.

BK-533 held the unknown-and-malformed rules and BK-539 the unauthenticated rule. Same endpoint, same action, same perimeter, so they collapse into this matrix.

## Variables

| Variable | How to obtain |
| --- | --- |
| valid session | `bun run api:login staging` writes a one-hour PAT to `.auth/tokens.env` |
| foreign identifier | `10000000-0000-4000-8000-000000000034` in `bk337-foreign-project-qa`, where the caller holds no membership row |
| unknown identifier | any well-formed uuid v4 matching no row; no fixture needed |
| malformed identifier | the literal string `abc`; no fixture needed |

## Expected results

`401` without credentials. `400` on a uuid-shape rejection, which touches no data and discloses nothing. `404` for both unknown and foreign identifiers, with byte-identical bodies. `200` for a readable defect.

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
- **Labels:** api, automation-candidate, critical, regression, security, smoke

---

_Synced from Jira by sync-jira-issues_
