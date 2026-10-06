# ACCEPTANCE TEST RESULTS (ATR): ATR: BK-202: Story Testing

**Jira Key:** [BK-590](https://jira.upexgalaxy.com/browse/BK-590)
**Status:** Close
**Components:** None

> Run results / coverage are NOT synced — read those via xray-cli. This file mirrors the issue description.

---

## Description

[https://jira.upexgalaxy.com/browse/BK-202#icft=BK-202](https://jira.upexgalaxy.com/browse/BK-202#icft=BK-202) TEST RESULTS
Tested: 2026-08-21 (retested 2026-08-23)
Environment: Staging
Tester: [REDACTED_EMAIL]
Result: PASSED (16/16)

SUMMARY
Exercised all 19 ratified AC scenarios for [https://jira.upexgalaxy.com/browse/BK-202#icft=BK-202](https://jira.upexgalaxy.com/browse/BK-202#icft=BK-202) (TMS-Test Plan | Create a test plan
grouping tests for a goal), formalized into 16 Xray Tests. Covered the full create/edit
flow (name/description/goal, boundary lengths, duplicate detection incl. case/space/tab/
NBSP padding, cross-project reuse, rename collision, concurrent-create race), plus the
role-gate suite (viewer-role UI hiding, API 403 rejection, server-side re-verification of
a stale client-cached role). Smoke: GO (login, list, create, detail, edit all confirmed
working end-to-end).
Overall outcome (2026-08-21): one genuine functional defect found and filed ([https://jira.upexgalaxy.com/browse/BK-591#icft=BK-591](https://jira.upexgalaxy.com/browse/BK-591#icft=BK-591),
blocking) – NBSP-padded Test Plan names were wrongly rejected as duplicates,
contradicting the ratified whitespace rule. A second, non-blocking cosmetic defect
([https://jira.upexgalaxy.com/browse/BK-592#icft=BK-592](https://jira.upexgalaxy.com/browse/BK-592#icft=BK-592)) was also filed for error-copy mismatches on two validation paths. All 15 other
scenarios PASSED, including the full role-gate suite with zero defects (positive
security-posture confirmation).

RETEST (2026-08-23)
Both [https://jira.upexgalaxy.com/browse/BK-591#icft=BK-591](https://jira.upexgalaxy.com/browse/BK-591#icft=BK-591) and [https://jira.upexgalaxy.com/browse/BK-592#icft=BK-592](https://jira.upexgalaxy.com/browse/BK-592#icft=BK-592) shipped fixes and are Closed. Re-verified live on staging:

- [https://jira.upexgalaxy.com/browse/BK-580#icft=BK-580](https://jira.upexgalaxy.com/browse/BK-580#icft=BK-580) (Scenario 2.4): NBSP-padded name ("Release 2.4 regression" + U+00A0) now
    returns 201 Created, DB-confirmed as a distinct row (byte-exact NBSP preserved,
    char_length +1 vs base). Tab-padded control case re-checked: still 409 (unaffected,
    correct) – no regression. Status flipped FAILED -> PASSED.
- [https://jira.upexgalaxy.com/browse/BK-575#icft=BK-575](https://jira.upexgalaxy.com/browse/BK-575#icft=BK-575) (Scenario 1.4, 101-char name) and [https://jira.upexgalaxy.com/browse/BK-583#icft=BK-583](https://jira.upexgalaxy.com/browse/BK-583#icft=BK-583) (Scenarios 3.1-3.3, blank/
    whitespace-only/tab-newline-only names): all four 422 responses now return the exact
    ratified copy "Name must be between 1 and 100 characters." (previously the raw Zod
    messages "Name must be 100 characters or fewer" / "Name is required"). Status codes
    and rejection behavior were already correct before the fix; only the message text
    changed. Both Tests were already PASSED and remain PASSED.
  All 16 Tests now PASSED. No new defects found in this retest pass.

TEST CASES

[https://jira.upexgalaxy.com/browse/BK-589#icft=BK-589](https://jira.upexgalaxy.com/browse/BK-589#icft=BK-589): Should create a test plan with name, description, and goal ... PASSED
[https://jira.upexgalaxy.com/browse/BK-574#icft=BK-574](https://jira.upexgalaxy.com/browse/BK-574#icft=BK-574): Should create a minimal test plan with name only ... PASSED
[https://jira.upexgalaxy.com/browse/BK-575#icft=BK-575](https://jira.upexgalaxy.com/browse/BK-575#icft=BK-575): Should validate a test plan name at the 100-character boundary ... PASSED
[https://jira.upexgalaxy.com/browse/BK-576#icft=BK-576](https://jira.upexgalaxy.com/browse/BK-576#icft=BK-576): Should accept a test plan name that trims to exactly 1 character ... PASSED
[https://jira.upexgalaxy.com/browse/BK-577#icft=BK-577](https://jira.upexgalaxy.com/browse/BK-577#icft=BK-577): Should reject a duplicate plan name differing only by case ... PASSED
[https://jira.upexgalaxy.com/browse/BK-578#icft=BK-578](https://jira.upexgalaxy.com/browse/BK-578#icft=BK-578): Should reject a duplicate name padded with leading/trailing spaces ... PASSED
[https://jira.upexgalaxy.com/browse/BK-579#icft=BK-579](https://jira.upexgalaxy.com/browse/BK-579#icft=BK-579): Should allow the same plan name to be reused in a different project ... PASSED
[https://jira.upexgalaxy.com/browse/BK-580#icft=BK-580](https://jira.upexgalaxy.com/browse/BK-580#icft=BK-580): Should apply the tab-vs-non-breaking-space distinction to duplicate detection ... PASSED (retest 2026-08-23)
[https://jira.upexgalaxy.com/browse/BK-581#icft=BK-581](https://jira.upexgalaxy.com/browse/BK-581#icft=BK-581): Should reject a plan rename that collides with another existing plan's name ... PASSED
[https://jira.upexgalaxy.com/browse/BK-582#icft=BK-582](https://jira.upexgalaxy.com/browse/BK-582#icft=BK-582): Should reject one of two concurrent create requests for the same plan name ... PASSED
[https://jira.upexgalaxy.com/browse/BK-583#icft=BK-583](https://jira.upexgalaxy.com/browse/BK-583#icft=BK-583): Should reject a blank test plan name ... PASSED
[https://jira.upexgalaxy.com/browse/BK-584#icft=BK-584](https://jira.upexgalaxy.com/browse/BK-584#icft=BK-584): Should hide the create-plan option from a viewer-role user ... PASSED
[https://jira.upexgalaxy.com/browse/BK-585#icft=BK-585](https://jira.upexgalaxy.com/browse/BK-585#icft=BK-585): Should reject a direct API create-plan request from a viewer-role user ... PASSED
[https://jira.upexgalaxy.com/browse/BK-586#icft=BK-586](https://jira.upexgalaxy.com/browse/BK-586#icft=BK-586): Should allow a member-role user to edit an existing plan they did not create ... PASSED
[https://jira.upexgalaxy.com/browse/BK-587#icft=BK-587](https://jira.upexgalaxy.com/browse/BK-587#icft=BK-587): Should reject a viewer's inline-edit attempt on an existing plan ... PASSED
[https://jira.upexgalaxy.com/browse/BK-588#icft=BK-588](https://jira.upexgalaxy.com/browse/BK-588#icft=BK-588): Should re-verify role server-side even with a stale client-cached role ... PASSED

TEST DATA
Test Plan: "Smoke Test Plan BK-202" (project smoke-project-1786682625505-501)
Workspace: Aiden Workspace (workspace_id 9a210dc0-cc0d-4deb-8ee7-8af4df62f2c7)
Test user: STAGING*USER*EMAIL (owner role; temporarily demoted to viewer for the
role-gate suite, then restored – DB-confirmed exact match to original)
Retest data (2026-08-23): "Release 2.4 regression" base plan (project
smoke-project-1786682625505-501), NBSP- and tab-padded variants POSTed via curl.

BUGS FOUND (2026-08-21, both now Closed)
[https://jira.upexgalaxy.com/browse/BK-591#icft=BK-591](https://jira.upexgalaxy.com/browse/BK-591#icft=BK-591) - Moderada/Medium (blocking) - NBSP-padded Test Plan names wrongly rejected as
duplicates (violates AC 2.4 / ratified whitespace rule). Root cause: Postgres `\s` in
the RPC's regexp_replace matches U+00A0, diverging from the Zod layer. Fixed, closed,
and re-verified 2026-08-23.
[https://jira.upexgalaxy.com/browse/BK-592#icft=BK-592](https://jira.upexgalaxy.com/browse/BK-592#icft=BK-592) - Menor/Low (non-blocking) - Validation errors return the raw Zod message instead
of the ratified user-facing copy (AC 1.4, 3.1-3.3). Status codes and rejection
behavior were correct; only the message text diverged. Fixed, closed, and re-verified
2026-08-23.

OBSERVATIONS
Server-side role gate (bunkai*can*write_workspace) held under every condition tested,
including the highest-rigor case (stale client-cached role, mid-session DB demote,
same already-authenticated browser session, no reload) – a positive security-posture
confirmation, not a finding.
DB-level unique index (project_id, lower(name)) closes the concurrent-duplicate-create
race with zero app-level TOCTOU window (verified via two backgrounded, non-awaited
curl requests).
No Delete anywhere in the schema, RPCs, routes, or UI – confirmed by design (epic-wide
rule; Close is the sole exit from "Open").

RECOMMENDATIONS
Automate the 16 Xray Tests as KATA E2E/API ATCs (Stage 5) – the boundary,
duplicate-detection, and role-gate scenarios are all strong regression-suite
candidates. No further re-execution needed; all 16 Tests are terminal PASSED.

Traceability
ATP: [https://jira.upexgalaxy.com/browse/BK-573#icft=BK-573](https://jira.upexgalaxy.com/browse/BK-573#icft=BK-573) · Story: [https://jira.upexgalaxy.com/browse/BK-202#icft=BK-202](https://jira.upexgalaxy.com/browse/BK-202#icft=BK-202)
Defects: [https://jira.upexgalaxy.com/browse/BK-591#icft=BK-591](https://jira.upexgalaxy.com/browse/BK-591#icft=BK-591) (Closed) · [https://jira.upexgalaxy.com/browse/BK-592#icft=BK-592](https://jira.upexgalaxy.com/browse/BK-592#icft=BK-592) (Closed)

---

## Related Issues

- executes: [BK-580](https://jira.upexgalaxy.com/browse/BK-580) - BK-202: TC6: should reject a tab-padded duplicate but accept an NBSP-padded name
- executes: [BK-585](https://jira.upexgalaxy.com/browse/BK-585) - BK-202: TC11: should return 403 when a viewer calls the create-plan API directly
- executes: [BK-579](https://jira.upexgalaxy.com/browse/BK-579) - BK-202: TC5: should allow the same plan name when it is reused in a different project
- executes: [BK-581](https://jira.upexgalaxy.com/browse/BK-581) - BK-202: TC7: should reject a plan rename when it collides with another plan's name
- executes: [BK-583](https://jira.upexgalaxy.com/browse/BK-583) - BK-202: TC9: should reject a blank plan name when it is empty or whitespace-only
- executes: [BK-589](https://jira.upexgalaxy.com/browse/BK-589) - BK-202: TC1: should create a test plan in Open state with 0 tests when the name is valid and description and goal are optional
- created: [BK-591](https://jira.upexgalaxy.com/browse/BK-591) - Test Plan uniqueness check incorrectly treats NBSP-padded names as duplicates (violates AC 2.4 / ratified whitespace rule)
- executes: [BK-582](https://jira.upexgalaxy.com/browse/BK-582) - BK-202: TC8: should accept exactly one of two concurrent create requests for the same name
- executes: [BK-586](https://jira.upexgalaxy.com/browse/BK-586) - BK-202: TC12: should allow a member to edit a plan when they did not create it
- executes: [BK-587](https://jira.upexgalaxy.com/browse/BK-587) - BK-202: TC13: should hide inline edit controls given a viewer-role user
- executes: [BK-588](https://jira.upexgalaxy.com/browse/BK-588) - BK-202: TC14: should reject create or edit with 403 when the client-cached role is stale
- executes: [BK-578](https://jira.upexgalaxy.com/browse/BK-578) - Should reject a duplicate name padded with leading/trailing spaces
- executes: [BK-584](https://jira.upexgalaxy.com/browse/BK-584) - BK-202: TC10: should hide the New plan option given a viewer-role user
- tests: [BK-202](https://jira.upexgalaxy.com/browse/BK-202) - TMS-Test Plan | Create a test plan grouping tests for a goal
- executes: [BK-577](https://jira.upexgalaxy.com/browse/BK-577) - BK-202: TC4: should reject a duplicate plan name when it differs only by case or surrounding spaces
- executes: [BK-574](https://jira.upexgalaxy.com/browse/BK-574) - Should create a minimal test plan with name only
- executes: [BK-575](https://jira.upexgalaxy.com/browse/BK-575) - BK-202: TC2: should accept a 100-character name and reject a 101-character name
- executes: [BK-576](https://jira.upexgalaxy.com/browse/BK-576) - BK-202: TC3: should accept a name that trims to exactly 1 character
- created: [SX-824](https://jira.upexgalaxy.com/browse/SX-824) - Login con usuario y contraseña

---

## Metadata

- **Created:** 2026-08-21
- **Updated:** 2026-08-31
- **Reporter:** Alfonso Hernandez
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_

---
_Source: Xray Test Execution [BK-590](https://jira.upexgalaxy.com/browse/BK-590) description · ATR · synced by sync-jira-issues_
