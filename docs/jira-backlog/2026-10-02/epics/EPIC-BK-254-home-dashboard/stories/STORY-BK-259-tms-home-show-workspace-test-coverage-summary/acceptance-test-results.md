# ACCEPTANCE TEST RESULTS (ATR): ATR: BK-259: Story Testing

**Jira Key:** [BK-878](https://jira.upexgalaxy.com/browse/BK-878)
**Status:** Close
**Components:** None

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

BK-259 TEST RESULTS
Tested: 2026-09-05
Environment: Staging
Tester: Luis Eduardo Flores Villarroel
Result: FAILED (11/14, 2 FAILED, 1 not executed)

SUMMARY
Manual QA on the Home coverage summary card (AC1: headline percentage + executed/awaiting/uncovered breakdown; AC2: verified against the ratified D24 departure — no invented trend). 14 Tests executed against seeded live staging data across the full AC lifecycle (unbound, bound-not-run, run+pass, reverted-to-awaiting), plus cross-workspace isolation, PAT scope gating, and cache/invalidation behavior. Mid-session exploration (BVA at scale) surfaced a real rounding defect against AC1, filed as BK-881.

TEST CASES
  TC1 (BK-864): mixed executed/awaiting/uncovered ACs ... PASSED
  TC2 (BK-865): em dash on zero-AC workspace ... PASSED
  TC3 (BK-866): rounding parity with Metrics screen ... PASSED
  TC4 (BK-867): 0% given nothing bound ... PASSED
  TC5 (BK-868): 100% given everything bound+executed ... PASSED
  TC6 (BK-869): 100% bound, 0% executed ... PASSED
  TC7 (BK-870): AC reverts to awaiting on new run (point-in-time) ... PASSED
  TC8 (BK-871): dedicated error state on RPC read failure ... TODO (not live-reproducible without fault-injecting shared staging; verified by code review only — summarizeWorkspaceCoverage ok:false path + CoverageSummaryError component)
  TC9 (BK-872): no disclosure on forged foreign-workspace id ... PASSED
  TC10 (BK-873): PAT scope gate (atc:read 200 / atc:write 403) ... PASSED
  TC11: 60-project ceiling ... N/A (unreachable manually across 71 real staging workspaces; no Test created)
  TC12 (BK-874): cache memoization (60s) + invalidation on project-set change ... PASSED
  TC13 (BK-875): no invented delta/trend (AC2 vs D24) ... PASSED
  TC14 (BK-879): should never read 100% unless every AC is literally bound ... FAILED
  TC15 (BK-880): should never read 0% given at least one AC is bound ... FAILED

TEST DATA
  Project: BK-259 Boundary Seed (workspace: Bunkai QA, a808499e-f437-43b8-9fdb-8cee7dcceb3e)
  Workspace: BK-264 QA Sandbox (pre-existing, used for cross-workspace checks)

BUGS FOUND
  BK-881 - Moderada (Medium priority) - Coverage percentage rounds to a false 100%/0% extreme at scale (coveragePercent() at lib/home/coverage.ts). PO-ratified fix: clamp rounded value to [1,99] whenever 0 < ac*bound < ac*total.

OBSERVATIONS
  - BK-259's `blocked` label and technical-notes reference to BK-44 look stale — the real issue-link dependency is BK-46, already Ready For QA. Non-blocking; flagged for PO/Dev to clean up (not fixed by this session — unrelated to the workflow `blocked` status BK-259 now carries due to BK-881).
  - The design doc (master-design-plan.md §5 D24) states "AC2 is reported unsatisfied on the ticket," but the live Jira ticket carries no such annotation in its ACs or comments. Recommend PO/Dev update BK-259's own AC2 text to reference D24 directly. Not a new quality issue — D24 already governs the shipped (no-trend) behavior, and TC13 confirms it.
  - TC8 could not be live-reproduced without fault-injecting shared staging data; verified by code review only. Left TODO, not FAILED — this is an execution gap, not a defect.

RECOMMENDATIONS
  - Once BK-881 is fixed, re-run TC14/TC15 in a retest Execution before unblocking BK-259 (fix_defect transition).
  - TC1-TC7, TC9, TC10, TC13, TC14, TC15 are automation candidates for Stage 4 (deterministic, UI+API observable). TC8 stays Manual/code-review-only pending a safe fault-injection story. TC12's cache-window assertion needs a controlled clock for automation.


---

## Related Issues

- created: [BK-881](https://jira.upexgalaxy.com/browse/BK-881) - BK-254: Bunkai Coverage: Coverage percentage rounds to a false 100%/0% extreme at scale
- is tested by: [BK-259](https://jira.upexgalaxy.com/browse/BK-259) - TMS-Home | Show workspace test coverage summary

---

## Metadata

- **Created:** 2026-09-05
- **Updated:** 2026-09-05
- **Reporter:** Luis Eduardo Flores Villarroel
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Execution [BK-878](https://jira.upexgalaxy.com/browse/BK-878) description · ATR · synced by sync-jira-issues_
