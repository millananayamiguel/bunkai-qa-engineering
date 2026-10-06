# TEST: BK-337: TC10: should offer no editable field and no lifecycle control at every role that can read the record

**Jira Key:** [BK-528](https://jira.upexgalaxy.com/browse/BK-528)
**Status:** Candidate
**Components:** Bunkai Bugs

---

## Test Description

> ***INFO:**** Promoted to the regression repository by `/test-documentation` Stage 4 on 2026-09-01. Verdict ****Candidate**** at ROI ****5.3***. Executed and PASSED in sprint on Test Execution BK-518.

## Traceability

| Axis | Value |
| --- | --- |
| Source Story | BK-337 TMS-Defect Detail | Open a defect and read its full record |
| Acceptance Criteria covered | AC 4.1, E-4 |
| Acceptance Test Set | BK-541 |
| Acceptance Test Plan | BK-516 |
| Regression Test Plan | BK-831 |
| Feature Test Set | BK-402 |
| Supersedes | BK-535 |

## ROI

| Factor | Score | Reading |
| --- | --- | --- |
| Frequency | 4 | every release, it is an authorization surface |
| Impact | 4 | an edit control on a read-only record is a privilege bug |
| Stability | 4 | the read-only rule is an explicit Business Rule |
| Effort (divisor) | 3 | three page loads across three workspaces |
| Dependencies (divisor) | 4 | needs per-workspace role fixtures and a workspace switch |

`ROI = (4 x 4 x 4) / (3 x 4) = 5.3`

## Why the role is parameterized rather than split

BK-535 covered the viewer leg as its own Test. Same action, same assertion, one variable: the role. That is textbook Equivalence Partitioning, so it becomes one Test with a row per partition.

The admin row is the one that matters. Run only at plain member level, this assertion passes vacuously: a member would never be offered controls anyway. Admin is the highest role that could plausibly be granted them, so it is the row that can actually fail.

## Variables

| Variable | How to obtain |
| --- | --- |
| admin fixture | bug `...044` in project `bk337-admin-project-qa` |
| viewer fixture | bug `...054` in project `bk337-viewer-project-qa` |
| owner fixture | bug `...011` in project `new-project-example-qa2` |
| role | `workspace_members.role`; role is workspace-scoped, so one account covers all three |

## Known gotcha

One Supabase Auth account serves every role, because role is per-workspace rather than per-account. This avoids the email rate limit that blocks new account creation. The cost is that the browser must be switched to the right workspace before navigating: `/projects/[slug]/...` resolves against the session's active workspace, not across every membership.

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
