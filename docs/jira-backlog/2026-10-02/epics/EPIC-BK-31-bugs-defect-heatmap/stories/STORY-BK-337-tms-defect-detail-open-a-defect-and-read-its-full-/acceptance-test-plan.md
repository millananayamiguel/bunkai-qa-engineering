# ACCEPTANCE TEST PLAN (ATP): ATP: BK-337: TMS-Defect Detail | Open a defect and read its full record

**Jira Key:** [BK-516](https://jira.upexgalaxy.com/browse/BK-516)
**Status:** READY
**Components:** Bunkai Bugs

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

# Acceptance Test Plan

Story ***BK-337**** TMS-Defect Detail | Open a defect and read its full record. Epic ****BK-31*** Bugs & Defect Heatmap.

## Surface under test

| Layer | What was added | Where |
| --- | --- | --- |
| UI | new read-only page | `/projects/[projectSlug]/bugs/[bugId]` |
| UI | two cells turned into links | `BugsListView.tsx`, the Bug and Run columns |
| API | new single-defect read | `GET /api/v1/bugs/{id}` |
| DB | composer widened, no schema change | migration `0070*bug*detail_composer.sql` |

All three levels of the pyramid are reachable, so this Story is testable end to end rather than through the UI alone.

## Test analysis

Risk assessed ***MEDIUM***. The Shift-Left pass on 2026-08-11 opened at HIGH with an authorization-perimeter veto; QA retracted that veto in its own correction after the Tech Lead's review, and two outlines were dropped with it.

Coverage was derived along three axes, crossed rather than listed:

- ***Record shape***: run-linked with full provenance, standalone with all provenance null
- ***Entry point***: defects-list Bug cell, defects-list Run cell, notification deep link, direct URL
- ***Reader***: owner, admin, viewer, foreign-tenant non-member, unauthenticated

Thirty-four outlines were estimated at refinement. Twenty-two were executed. Ten were promoted to the regression repository. That funnel is the point: a scenario is documented for regression because it will be re-executed, never to reach a coverage count.

## Techniques applied, and what triggered each

| Technique | Trigger present in the criteria | Where it landed |
| --- | --- | --- |
| Equivalence Partitioning | every input | reader role in BK-528, evidence scheme in BK-527 |
| Boundary Value Analysis | the `0..10` evidence cap enforced by `bunkai*bugs*check_consistency` | BK-524 at 0, 6 and 10 |
| Decision Table | credential state crossed with identifier shape | BK-532, five surviving rules |
| State coverage | the bug status lifecycle | BK-540 across open, in_progress, resolved, closed |
| Error guessing | 0-based storage against 1-based display | the failing-step arithmetic inside BK-519 |

## Acceptance criteria to test case coverage

| Criterion | Covers | Regression Test | Verdict |
| --- | --- | --- | --- |
| AC 1.1 full header | run-linked header | BK-519 | Candidate |
| AC 1.2 description and steps | body render | BK-519 | Candidate |
| AC 1.3 failing step in Origin | position + 1 arithmetic | BK-519 | Candidate |
| AC 1.4 Origin links | ATC and run links | BK-519 | Candidate |
| AC 2.1 standalone record | manual-filing notice, six Details rows | BK-523 | Candidate |
| AC 3.1 evidence count 6 | mid-range partition | BK-524 | Candidate |
| AC 3.2 evidence count 0 | lower boundary | BK-524 | Candidate |
| AC 3.3 evidence count 10 | hard cap | BK-524 | Candidate |
| AC 3.4 non-http scheme | render-path allowlist | BK-527 | Candidate |
| AC 4.1 no controls at admin | read-only enforcement | BK-528 | Candidate |
| AC 5.1 Bug cell navigation | list entry point | BK-529 | Candidate |
| AC 5.2 Run cell navigation | the negative assertion | BK-529 | Candidate |
| AC 5.3 notification deep link | notification entry point | BK-531 | ***Deferred***, ROI 0.9 |
| AC E-1 foreign workspace 404 | cross-tenant isolation | BK-532 | Candidate |
| AC E-2 unknown 404, malformed 400 | identifier validation | BK-532 | Candidate |
| AC E-3 wrong project slug | within-tenant slug re-check | BK-534 | Candidate |
| AC E-4 viewer reads, no controls | lowest reading role | BK-528 | Candidate |
| AC E-5 archived module renders | deliberate composer divergence | BK-536 | ***Deferred***, ROI 2.0 |
| AC E-6 assignee read-only | Details panel | BK-519 | Candidate |
| beyond AC | API response contract | BK-538 | Candidate |
| beyond AC | API authentication | BK-532 | Candidate |
| beyond AC | status and severity chip labels | BK-540 | Candidate |

Every criterion has a Test. Two criteria are covered by a Test that is ***not*** in the regression suite, which is a deliberate ROI decision recorded on each of those issues, not a gap.

## Explicit handoffs

Deferring a concern out of this Story's scope is a handoff, not a silent drop. Three are recorded:

| Concern | Where it goes |
| --- | --- |
| Colour contrast, focus order, screen-reader naming on the chips | app-level accessibility suite. BK-540 keeps only the label-text assertion |
| Unscoped evidence anchors on ***RunnerView**** | ****BK-466***, still `Ready For QA`. BK-527 guards the detail page only and does not cover it |
| Expected vs Actual capture at filing time | ***BK-465***, cut from this Story by the Product Owner's Q1 ruling |

## Fixture inventory

Seeded in staging through DBHub, respecting `bunkai*bugs*check_consistency`, and verified end to end through the real endpoint.

| Fixture | Identifier | Project slug |
| --- | --- | --- |
| run-linked, P1, 6 evidence, assignee set, run step at position 2 | `...011` | `new-project-example-qa2` |
| standalone, 0 evidence | `...012` | `new-project-example-qa2` |
| standalone, 10 evidence including one `javascript:` entry | `...013` | `new-project-example-qa2` |
| standalone, module archived after filing | `...014` | `new-project-example-qa2` |
| foreign tenant, caller holds no membership row | `...034` | `bk337-foreign-project-qa` |
| admin-role membership | `...044` | `bk337-admin-project-qa` |
| viewer-role membership | `...054` | `bk337-viewer-project-qa` |
| second project, same workspace, no defect of its own | none needed | `bk337-project-b-qa` |

> ***ERROR:*** Fixture `...013` was cycled through all four statuses during sprint execution and is now permanently `closed`. Bug statuses are forward-only. BK-540 needs four fixtures pinned at distinct statuses, seeded fresh, rather than one fixture advanced four times.

---

## Related Issues

- designs: [BK-524](https://jira.upexgalaxy.com/browse/BK-524) - BK-337: TC06: should report the evidence count against the ten-item cap at every boundary
- designs: [BK-532](https://jira.upexgalaxy.com/browse/BK-532) - BK-337: TC14: should answer the not-found convention for every identifier the reader may not resolve
- designs: [BK-537](https://jira.upexgalaxy.com/browse/BK-537) - BK-337: TC19: should show the assignee read-only on the record
- designs: [BK-538](https://jira.upexgalaxy.com/browse/BK-538) - BK-337: TC20: should return a 200 body matching the OpenAPI schema for GET bugs id
- designs: [BK-539](https://jira.upexgalaxy.com/browse/BK-539) - BK-337: TC21: should return 401 from GET bugs id without credentials
- tests: [BK-337](https://jira.upexgalaxy.com/browse/BK-337) - TMS-Defect Detail | Open a defect and read its full record
- designs: [BK-519](https://jira.upexgalaxy.com/browse/BK-519) - BK-337: TC01: should render the complete record when the defect was filed from a failing run step
- designs: [BK-520](https://jira.upexgalaxy.com/browse/BK-520) - BK-337: TC02: should render description and steps with no Expected/Actual block
- designs: [BK-521](https://jira.upexgalaxy.com/browse/BK-521) - BK-337: TC03: should state Failed at step N in the Origin panel using stored position plus 1
- designs: [BK-522](https://jira.upexgalaxy.com/browse/BK-522) - BK-337: TC04: should link the Origin panel to both the originating ATC and the run
- designs: [BK-523](https://jira.upexgalaxy.com/browse/BK-523) - BK-337: TC05: should show the manual-filing notice and exactly six Details rows when the defect has no run provenance
- designs: [BK-525](https://jira.upexgalaxy.com/browse/BK-525) - BK-337: TC07: should read 0 of 10 with an empty state when no evidence was attached
- designs: [BK-526](https://jira.upexgalaxy.com/browse/BK-526) - BK-337: TC08: should read 10 of 10 at the hard cap with no truncation
- designs: [BK-527](https://jira.upexgalaxy.com/browse/BK-527) - BK-337: TC09: should render an evidence URL as an inert label when its scheme is neither http nor https
- designs: [BK-528](https://jira.upexgalaxy.com/browse/BK-528) - BK-337: TC10: should offer no editable field and no lifecycle control at every role that can read the record
- designs: [BK-529](https://jira.upexgalaxy.com/browse/BK-529) - BK-337: TC11: should open the defect record from either the Bug cell or the Run cell of the defects list
- designs: [BK-530](https://jira.upexgalaxy.com/browse/BK-530) - BK-337: TC12: should navigate from the defects-list Run cell to the same detail record, not the run report
- designs: [BK-531](https://jira.upexgalaxy.com/browse/BK-531) - BK-337: TC13: should resolve a bug notification deep link to the same detail record for both record shapes
- designs: [BK-533](https://jira.upexgalaxy.com/browse/BK-533) - BK-337: TC15: should answer 404 for an unknown identifier and 400 for a malformed one
- designs: [BK-534](https://jira.upexgalaxy.com/browse/BK-534) - BK-337: TC16: should answer not-found when the identifier is real but the URL names a different project
- designs: [BK-535](https://jira.upexgalaxy.com/browse/BK-535) - BK-337: TC17: should let a viewer-role member read the record with no controls
- designs: [BK-536](https://jira.upexgalaxy.com/browse/BK-536) - BK-337: TC18: should render a defect whose module was archived after filing
- designs: [BK-540](https://jira.upexgalaxy.com/browse/BK-540) - BK-337: TC22: should label every status and severity chip with text alongside its colour

---

## Metadata

- **Created:** 2026-08-19
- **Updated:** 2026-09-02
- **Reporter:** Ely
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Plan [BK-516](https://jira.upexgalaxy.com/browse/BK-516) description · ATP · synced by sync-jira-issues_
