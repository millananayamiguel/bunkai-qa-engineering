# ACCEPTANCE TEST RESULTS (ATR): ATR: BK-337: Story Testing

**Jira Key:** [BK-518](https://jira.upexgalaxy.com/browse/BK-518)
**Status:** Close
**Components:** Bunkai Bugs

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

# Acceptance Test Results

Story ***BK-337****. Environment ****staging***, `https://staging-upexbunkai.vercel.app`. Executed 2026-08-19.

## Verdict

> ***SUCCESS:**** ****PASSED. 22 of 22 test runs green, zero defects filed.*** Every scenario in Acceptance Criteria Revision 2 behaves as specified. Story transitioned to QA Approved, then to Ready For Release.

| Metric | Value |
| --- | --- |
| Runs executed | 22 |
| Passed | 22 |
| Failed | 0 |
| Blocked | 0 |
| Defects raised | 0 |
| Levels exercised | UI, API, DB |

## How it was executed

Trifuerza across all three levels. The UI legs ran in a real browser session against staging. The API legs ran as direct authenticated requests with a one-hour owner PAT minted through `bun run api:login staging`. The data legs were seeded and verified through DBHub, since `bunkai*create*bug` and `bunkai*bug*json` are not `EXECUTE`-granted to the `qa*inspector*rw` role.

## Observations recorded, neither of which is a product defect

***Reporter reads "Filed by Unknown" on the two freshly-seeded role workspaces.*** A fixture-seeding artifact: inserting rows through direct SQL bypassed whatever normally populates the reporter resolver's cache. The same field renders correctly on every fixture seeded through the ordinary path.

***Project routes resolve against the session's active workspace.*** `/projects/[slug]/...` does not search across every membership the account holds, so reaching the admin and viewer fixtures required the top-left workspace switcher. Worth remembering for any future multi-workspace fixture session, and it is the single most likely cause of a false 404 when automating BK-528.

## Stage 4 outcome, applied 2026-09-01

The 22 executed Tests were curated into a regression repository. The verdicts are recorded on each issue with its ROI breakdown.

| Outcome | Count | Where they went |
| --- | --- | --- |
| Promoted to regression | 10 | Test Plan ***BK-831****, Test Set ****BK-402***, status Candidate |
| Deprecated as superseded | 10 | absorbed into a promoted Test that shares their precondition and action |
| Deferred | 2 | BK-531 at ROI 0.9, BK-536 at ROI 2.0; left in Draft, revisitable |

Deprecated Tests were not deleted. They remain attached to this Test Execution so the run history above stays intact and auditable.

## Correction logged during execution

The first batch of API-verified runs was written to the wrong Test Run slots because of a hand-counting error against the run-id list. Caught the same session by reading back each affected run before moving on, and repaired by rewriting the comment and evidence onto the correct run ids. The final `run list` pass was clean.

---

## Related Issues

- executes: [BK-524](https://jira.upexgalaxy.com/browse/BK-524) - BK-337: TC06: should report the evidence count against the ten-item cap at every boundary
- executes: [BK-532](https://jira.upexgalaxy.com/browse/BK-532) - BK-337: TC14: should answer the not-found convention for every identifier the reader may not resolve
- executes: [BK-537](https://jira.upexgalaxy.com/browse/BK-537) - BK-337: TC19: should show the assignee read-only on the record
- executes: [BK-538](https://jira.upexgalaxy.com/browse/BK-538) - BK-337: TC20: should return a 200 body matching the OpenAPI schema for GET bugs id
- executes: [BK-539](https://jira.upexgalaxy.com/browse/BK-539) - BK-337: TC21: should return 401 from GET bugs id without credentials
- executes: [BK-521](https://jira.upexgalaxy.com/browse/BK-521) - BK-337: TC03: should state Failed at step N in the Origin panel using stored position plus 1
- executes: [BK-522](https://jira.upexgalaxy.com/browse/BK-522) - BK-337: TC04: should link the Origin panel to both the originating ATC and the run
- executes: [BK-529](https://jira.upexgalaxy.com/browse/BK-529) - BK-337: TC11: should open the defect record from either the Bug cell or the Run cell of the defects list
- executes: [BK-533](https://jira.upexgalaxy.com/browse/BK-533) - BK-337: TC15: should answer 404 for an unknown identifier and 400 for a malformed one
- executes: [BK-540](https://jira.upexgalaxy.com/browse/BK-540) - BK-337: TC22: should label every status and severity chip with text alongside its colour
- tests: [BK-337](https://jira.upexgalaxy.com/browse/BK-337) - TMS-Defect Detail | Open a defect and read its full record
- executes: [BK-519](https://jira.upexgalaxy.com/browse/BK-519) - BK-337: TC01: should render the complete record when the defect was filed from a failing run step
- executes: [BK-520](https://jira.upexgalaxy.com/browse/BK-520) - BK-337: TC02: should render description and steps with no Expected/Actual block
- executes: [BK-523](https://jira.upexgalaxy.com/browse/BK-523) - BK-337: TC05: should show the manual-filing notice and exactly six Details rows when the defect has no run provenance
- executes: [BK-525](https://jira.upexgalaxy.com/browse/BK-525) - BK-337: TC07: should read 0 of 10 with an empty state when no evidence was attached
- executes: [BK-526](https://jira.upexgalaxy.com/browse/BK-526) - BK-337: TC08: should read 10 of 10 at the hard cap with no truncation
- executes: [BK-527](https://jira.upexgalaxy.com/browse/BK-527) - BK-337: TC09: should render an evidence URL as an inert label when its scheme is neither http nor https
- executes: [BK-528](https://jira.upexgalaxy.com/browse/BK-528) - BK-337: TC10: should offer no editable field and no lifecycle control at every role that can read the record
- executes: [BK-530](https://jira.upexgalaxy.com/browse/BK-530) - BK-337: TC12: should navigate from the defects-list Run cell to the same detail record, not the run report
- executes: [BK-531](https://jira.upexgalaxy.com/browse/BK-531) - BK-337: TC13: should resolve a bug notification deep link to the same detail record for both record shapes
- executes: [BK-534](https://jira.upexgalaxy.com/browse/BK-534) - BK-337: TC16: should answer not-found when the identifier is real but the URL names a different project
- executes: [BK-535](https://jira.upexgalaxy.com/browse/BK-535) - BK-337: TC17: should let a viewer-role member read the record with no controls
- executes: [BK-536](https://jira.upexgalaxy.com/browse/BK-536) - BK-337: TC18: should render a defect whose module was archived after filing

---

## Metadata

- **Created:** 2026-08-19
- **Updated:** 2026-09-02
- **Reporter:** Ely
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Execution [BK-518](https://jira.upexgalaxy.com/browse/BK-518) description · ATR · synced by sync-jira-issues_
