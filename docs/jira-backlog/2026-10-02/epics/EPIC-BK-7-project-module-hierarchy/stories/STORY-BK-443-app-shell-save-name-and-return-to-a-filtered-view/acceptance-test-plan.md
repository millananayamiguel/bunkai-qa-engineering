# BK-443 — Acceptance Test Plan (QA)

> Jira field: `customfield_10137` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-443)

# Shift-Left Refinement: BK-443 — App Shell | Save, name, and return to a filtered view

***Status***: Refined — Awaiting PO Estimation
***Mode***: Shift-Left (pre-sprint, batch grooming — batch size 1)
***Refined on***: 2026-09-22 (revised same day after user review)
***Refined by***: QA — Shift-Left batch session
***Modality***: Xray

---

## Phase 1 — Critical Analysis

### Business context

- ***Main person affected***: Senior QA Engineer (Elena, from the Story's own example) — anyone who keeps re-narrowing one of the four filtered lists.
- ***Other people affected***: any workspace member using Traceability chain, Run history, Bugs list, or the Project workbench filters. The feature doesn't depend on a specific role.
- ***Why this matters***: removes the "rebuild the same filters by hand every time" annoyance the Story describes. No usage metric exists yet to measure this (product has no analytics tool per `.context/PRD/executive-summary.md`) — the value here is qualitative.
- ***Metrics affected***: none tracked today.
- ***Where this sits in the product***: a cross-cutting App Shell capability, not one single screen or flow — it sits underneath four separate parts of the product.

### Technical context

- ***Frontend***: four surfaces — `components/traceability/TraceabilityChainView.tsx`, `components/runs/RunHistoryView.tsx`, `components/bugs/BugsListView.tsx`, `app/(app)/projects/[projectSlug]/{atc-search-filter,test-tag-filter,workbench-context}.tsx`. Confirmed by reading the code: Traceability and Run history already keep their filters in the page address (`router.replace` / `history.replaceState`). Bugs list and the Workbench filters only keep filters in memory (`useState`) — reloading or navigating away loses them today.
- ***Backend***: no saved-view endpoint exists yet anywhere in `.context/business/business-api-map.md` — this has to be built from scratch (see Gap #1 below).
- ***Database table***: `public.user*view*state` — confirmed by reading `../upex-bunkai-tms/supabase/migrations/0009*cross*cutting.sql` lines 163–186. It stores `user*id`, `project*id`, `view*kind`, `state` (the filter data), `updated*at`. Its unique key is the combination `(user*id, project*id, view_kind)` — one row per person per project per surface, no name column yet. Access rule: only the row's own owner can read/write it. Nothing in that rule checks whether the person still belongs to the project (see Ambiguity #5 below — this is something we found by reading the code, not something the Story says).
- ***Outside services***: none involved.
- ***Moving parts specific to this Story***: front-end to a not-yet-built API, that API to the database table above, and front-end to the page address (URL) for two surfaces that don't have that today.

### How complex is this Story

| Part | Rating | Why |
| --- | --- | --- |
| Business logic | Medium | Save/list/rename/update/delete plus a "name must be unique" rule and graceful handling when something a view points to is gone. No money or login logic involved. |
| Moving parts | Medium-High | 4 surfaces, one shared table whose shape isn't finished yet, a brand-new API, and 2 surfaces need URL-syncing for the first time. |
| Data checks | High | The "unique name" rule isn't fully spelled out (see Ambiguity #1), and the database table doesn't yet support what the acceptance criteria ask for. |
| Screen work | Medium | Save/list/rename/update/delete buttons across 4 surfaces, one empty-list screen, one "something's missing" screen. |

***How much testing this will likely need***: a lot — mostly because of the open database-shape question below, and because two surfaces need new URL-syncing work built from nothing.

### Anything inherited from the parent Epic

Nothing yet — the parent Epic (`BK-7`) has no shared plan or notes written down. This is the first Story refined under it in this session.

---

## Phase 2 — Story Quality Analysis

### Things that aren't clear (Ambiguities)

| # | Where | What's unclear | Why it matters for testing | What would fix it |
| --- | --- | --- | --- | --- |
| 1 | AC-08 / the rule that names must be unique | Does `"Failing payments"` collide with `"failing payments"`? Does a name with extra spaces around it count as the same name? | Can't write exact pass/fail checks for near-duplicate names | State the exact rule — suggested: ignore case, ignore extra spaces at the start/end, but keep the name displayed the way the person typed it |
| 2 | AC-05 (rename) vs AC-08 (unique name) | If someone "renames" a view to the exact name it already has, does that count as a duplicate and get blocked? | Renaming with no real change could wrongly fail | Skip the view's own current name when checking for duplicates |
| 3 | AC-06 (save current filters over an existing view) | If someone hits "update" without actually changing anything, does the system still record it as updated (new "last changed" time), or does nothing happen at all? | Affects whether "most recently changed" ordering is predictable to test | State whether an update with no real change still counts as an update |
| 4 | **(withdrawn — see note below)** | — | — | — |
| 5 | The database table's access rule, found by reading the code directly — not written in the Story | The table only checks "is this your row," never "are you still on this project." One of the business rules says visibility should follow current project access, but this table doesn't enforce that. If someone loses access to a project but keeps their account, can they still read their own old saved view for that project? | Decides whether a removed member's saved views should keep working for them or not | Confirm with Dev whether that gap is acceptable (the row is harmless without project access anyway) or needs an extra check |
| 6 | Story and business rules keep saying "member" | The product has five kinds of people: owner, admin, member, viewer, and an automation account (PAT). Does "member" here mean anyone in the workspace, or specifically the person with the "member" role — leaving owner/admin/viewer unclear? | Decides whether owners/admins get the same saved-view behavior, or something different, or nothing at all | Ask PO directly: does "member" mean any workspace person, or one specific role? |

> ***Correction from review****: Ambiguity #4 (archived vs. fully-removed module) is withdrawn. Business rule 8 already says: **"A saved filter value whose target no longer exists or was archived is reported as no longer applicable; the remaining filters still apply and the saved view is not deleted on the member's behalf."* That line covers BOTH cases (fully removed, and archived) the same way. AC-12's wording only mentions "archived," which looked incomplete on its own, but the business rule already settles it. This was missed on first pass and is corrected here. One small confirmation is still worth asking Dev (moved to Technical Questions #5) — that "no longer exists" really does mean the module was deleted, not something else.

### Things missing (Gaps)

| # | Kind | Why it matters | What to add | What happens if it's skipped |
| --- | --- | --- | --- | --- |
| 1 | Technical | No saved-view API exists anywhere yet — nothing describes its shape | Write the exact request/response shape for saving, listing, renaming, updating, deleting a view, before Dev starts | Dev will invent something ad-hoc, and QA will have to reverse-engineer it later instead of testing against a plan |
| 2 | Business rule | No stated limit on how long a name can be, or what characters are allowed | Add a max length and say whether emoji/special characters are OK | Weird text or cut-off names only get found by accident during exploratory testing |
| 3 | Business rule | No stated limit on how many saved views one person can have per surface | Say whether the list can grow forever or has a cap | An endless list could break the "list of saved views" screen with no plan for scrolling/paging |
| 4 | Business rule | AC-09 says views are private to whoever saved them, but nothing says whether an Owner or Admin can see or check on other people's saved views | Confirm whether any role can see other members' saved views, even just for support purposes | If a member reports "my saved view disappeared," nobody with higher access could check what happened |
| 5 **(new — from review)** | Test coverage | Business rule 2 says a saved view belongs to one project and one surface, and never shows up in another project. Surface isolation (AC-04) and person isolation (AC-09) both have a test checking this, but nothing tests project isolation the same way | Add a check: a view saved in one project should not appear when switched to a different project, even with the same surface and same name | Cross-project leakage would go untested even though the rule says it shouldn't happen |

### Things not mentioned in the Story that probably matter (Edge cases)

| # | What could happen | Best guess at what should happen | How serious | What to do about it |
| --- | --- | --- | --- | --- |
| 1 | Someone is removed from a project (project itself still exists), later comes back or is checked on directly | Since the access rule only checks "is this your row," their old saved view for that project probably still exists, just unused | High | Add as a formal rule — needs PO to confirm |
| 2 | The filter **options themselves** change over time (a whole filter type gets removed from the product), not just one thing being archived | Should degrade the same friendly way as AC-12 already describes for one archived item | Medium | Test only — likely already covered by the same fix as AC-12 |
| 3 | Someone double-clicks "Save" or clicks it twice quickly | Should end up with exactly one view, not two | Medium | Add as a formal rule — needs PO to confirm |
| 4 | Same saved view open and edited in two browser tabs at once | Most likely the last save wins and the earlier one is lost quietly — but nothing confirms this | Medium | Add as a formal rule — needs PO to confirm, ties to the open database question |
| 5 | A saved view holds an unusually large amount of filter data | No stated size limit — low risk right now but worth a quick check later | Low | Test only |

### Do any parts of the Story disagree with each other?

No real disagreements. Filters currently only remembered in-memory on 2 of the 4 surfaces looks at first like a mismatch against "keep filters across sessions everywhere," but the Story's own Scope section already asks for those 2 surfaces to be brought up to the same behavior — so it's a stated requirement, not a contradiction. Moved to a question for Dev about effort/scope instead.

### Can this be tested as written?

***Verdict***: Partly.

What's still missing before every scenario can be written exactly:

- The name-matching rule (case/spacing) isn't settled — Ambiguity #1
- No stated limits on name length or character set — Gap #2
- The database table doesn't yet support the "several named views per surface" requirement the acceptance criteria assume — this is the single biggest blocker, see Critical Question #1 below

---

## Phase 3 — Refined Acceptance Criteria

> Full refined scenarios (42 outlines worth of Given/When/Then detail, including all NEEDS PO/DEV CONFIRMATION markers) live in the Acceptance Criteria field on this Story — kept out of this ATP body to stay under the field size limit. See that field for the complete Phase 3 content.

## Phase 4 — Test Outlines (outline names only)

### Coverage estimate

| Type | Count | Notes |
| --- | --- | --- |
| Positive | 21 | Happy-path variants across all 7 save/list/restore/rename/update/delete/empty-state behaviors, plus the new project-isolation check |
| Negative | 8 | Duplicate names, cross-user access, cross-project access, empty-filter save |
| Boundary | 9 | Minimum-valid-filter states, name-matching edge cases, self-rename/no-op update, double-submit, concurrent update, fully-degraded restore |
| Integration | 4 | Save/restore round-trip through the database, database-level access enforcement, cross-member link reproduction, URL-sync added to two more surfaces |
| API | 0 | Folded into Integration — no outside API involved, only internal save/list/restore, already counted there |
| ***Total**** | ****42*** |  |

***Why this many***: each of the 13 original acceptance criteria gets at least one straightforward "does it work" check. The "unique name" rule (AC-08) and the "at least one filter required" rule (AC-10) each need a boundary check at the edge of what's allowed. The save → rename/update → delete sequence behaves like a small lifecycle, which is what produces the self-rename and no-change-update boundary checks plus the cross-user negative check. AC-12 needs checks for both "one thing missing" and "everything missing." AC-09's privacy rule needs both an on-screen check and a database-level check, since the screen hiding something isn't proof the database also protects it. Review added three more: project isolation (business rule 2 says it, nothing tested it), the "member" role question doesn't add its own outline yet (it's a question, not a testable behavior until answered), and the fully-degraded restore case. Because this Story was flagged HIGH risk, the double-submit and concurrent-update checks (E1/E2) and the leftover-access check (E3) stayed in rather than being pushed to later, since they trace straight back to the open database-shape and access-rule questions.

### Outline list (NAMES ONLY — preconditions in 1 line, expected in 1 line)

#### Positive

- ***Should save current view under given name when one filter is applied*** — Pre: surface has 1 filter applied, no view named X exists. Expected: view saved, listed immediately.
- ***Should save current view under given name when multiple filters are applied*** — Pre: surface has 3 filters applied. Expected: all 3 saved together under one name.
- ***Should list a newly saved view immediately after saving*** — Pre: just saved a view. Expected: appears in list without reload.
- ***Should restore exact filter combination after clearing filters*** — Pre: saved view exists, filters since cleared. Expected: all filters restored exactly.
- ***Should restore exact filter combination after changing filters to different values*** — Pre: saved view exists, filters since changed. Expected: filters revert to saved values.
- ***Should list saved view after navigating away and back within the same session*** — Pre: view saved, user navigated away. Expected: still listed on return.
- ***Should list saved view after a full page reload*** — Pre: view saved. Expected: still listed after hard reload.
- ***Should list saved view in a new session on a later day*** — Pre: view saved yesterday. Expected: listed today in a fresh session.
- ***Should list only views saved for the current surface*** — Pre: views saved on 2+ surfaces. Expected: only current surface's views shown.
- ***Should rename a saved view and keep its filters unchanged*** — Pre: saved view with known filters. Expected: new name, same filters.
- ***Should overwrite a saved view's filters without creating a second view*** — Pre: saved view open with changed filters. Expected: same view updated, list count unchanged.
- ***Should remove a saved view from the list after deletion and confirmation*** — Pre: saved view exists. Expected: no longer listed.
- ***Should keep currently applied filters unchanged after deleting a saved view*** — Pre: unrelated filter active, deleting a different saved view. Expected: active filter untouched.
- ***Should accept saving a new view with a genuinely unique name*** — Pre: one differently-named view exists. Expected: both coexist.
- ***Should scope name uniqueness per surface, allowing the same name on two surfaces*** — Pre: name X used on surface A. Expected: name X accepted on surface B.
- ***Should scope name uniqueness per project, allowing the same name + surface in a different project*** — Pre: name X used on surface A in project 1. Expected: name X accepted on surface A in project 2.
- ***Should show an explicit "no saved views yet" state*** — Pre: zero views saved on this surface. Expected: explicit empty-state message, not blank/stuck-loading.
- ***Should offer a save-current-view action from the empty state*** — Pre: empty-state shown. Expected: save action present.
- ***Should restore with an explicit "no longer applies" message when target module was archived*** — Pre: saved view's target archived. Expected: partial restore + explicit message.
- ***Should not delete a saved view whose target was archived*** — Pre: same as above. Expected: view still listed afterward.
- ***Should reflect restored filters in the page address immediately after opening a saved view*** — Pre: page-address-synced surface, saved view exists. Expected: address matches restored filters.

#### Negative

- ***Should reject saving a new view with a name already used on that surface*** — Pre: name X exists. Expected: rejected, told name in use, nothing extra created.
- ***Should reject saving a new view with a name differing only by case*** (NEEDS PO/DEV CONFIRMATION) — Pre: "Failing payments" exists. Expected: "failing payments" rejected — behavior TBD.
- ***Should reject renaming a saved view to a name already used by another saved view*** — Pre: two views exist. Expected: rename refused, both keep original names.
- ***Should reject deleting a saved view that does not belong to the current user*** — Pre: another member's view accessed directly. Expected: refused, not deleted.
- ***Should exclude another member's saved view from my saved-view list*** — Pre: another member saved a view on a shared project. Expected: not visible to me.
- ***Should reject direct access to another member's saved view by id*** (NEEDS PO/DEV CONFIRMATION) — Pre: id known via network inspection. Expected: refused at the database level.
- ***Should exclude a saved view from a different project's saved-view list, even with matching surface and name*** — Pre: same name+surface used in two projects. Expected: only the current project's view shows.
- ***Should refuse saving a view when no filter is applied*** — Pre: filter bar cleared. Expected: told nothing to save, no view created.

#### Boundary

- ***Should restore a saved view holding exactly one filter dimension*** — Pre: view saved with 1 filter (minimum valid). Expected: restores correctly, no extra filters appear.
- ***Should accept saving a view when exactly one filter is applied*** — Pre: 1 filter applied. Expected: accepted (minimum-valid boundary counterpart to AC-10's refusal).
- ***Should reject saving a name differing only by leading/trailing whitespace*** (NEEDS PO/DEV CONFIRMATION) — Pre: "Failing payments" exists. Expected: " Failing payments " rejected after trimming spaces — behavior TBD.
- ***Should allow renaming a saved view to its own current, unchanged name*** (NEEDS PO/DEV CONFIRMATION) — Pre: view named X. Expected: renaming to X again succeeds, not rejected as a duplicate.
- ***Should handle updating a saved view when applied filters are identical to what it already holds*** (NEEDS PO/DEV CONFIRMATION) — Pre: view open, nothing changed. Expected: succeeds with no visible change; whether "last changed" time updates is TBD.
- ***Should show zero views on a surface where none were saved, even though other surfaces have some*** — Pre: views exist elsewhere, none here. Expected: empty list (feeds AC-11).
- ***Should not create two saved views on rapid double-submit of save*** (NEEDS PO/DEV CONFIRMATION) — Pre: name filled in. Expected: exactly one view created from two rapid submits.
- ***Should behave predictably when the same saved view is updated concurrently from two tabs*** (NEEDS PO/DEV CONFIRMATION) — Pre: same view open in 2 tabs, diverging edits. Expected: one filter set wins (the later save), no broken mix.
- ***Should show a fully-degraded state when every filter in a saved view no longer applies*** — Pre: all filter targets in a saved view were archived/removed. Expected: clear "none of this still applies" message, sensible fallback screen instead of a broken one.

#### Integration

- ***Should save a view's name and filters through the surface's save action into the database*** (NEEDS PO/DEV CONFIRMATION — API shape not designed yet) — Pre: save action exists once built. Expected: row lands with the correct shape.
- ***Should enforce owner-only access at the database level independent of what the screen shows*** — Pre: direct request bypassing the screen. Expected: blocked regardless of screen-level behavior.
- ***Should reproduce the same narrowed list when a saved view's restored link is opened by a different authorized member*** — Pre: link copied from a restored saved view. Expected: same narrowed list for any member who already has access to that data.
- ***Should extend page-address syncing to the Bugs list and Workbench filter surfaces*** (NEEDS PO/DEV CONFIRMATION — see Technical Question on scope/effort) — Pre: those 2 surfaces currently don't sync to the page address at all. Expected: they gain the same address-matches-filters behavior as Traceability/Run history.

> ***NOT included here*** (left for in-sprint planning by `/sprint-testing` Stage 1): detailed data tables, per-outline test data, numbered test steps, fake-data generation recipes. The rough count above IS included because PO uses it to estimate effort.

---

## Phase 5 — Edge Cases (outline)

| # | Edge case | In original story? | How serious | What to do about it |
| --- | --- | --- | --- | --- |
| 1 | Member removed from project keeps a leftover, still-readable-by-them saved-view row | No | High | Add as a formal rule (PO confirm) |
| 2 | A whole filter option disappears from the product (not just one archived item) | No | Medium | Test only — likely handled by the same fix as AC-12 |
| 3 | Double-click / rapid re-submit of save | No | Medium | Add as a formal rule (PO confirm) |
| 4 | Concurrent update of the same saved view from two tabs | No | Medium | Add as a formal rule (PO confirm) — ties to the open database-shape question |
| 5 | Very large filter data stored in one saved view | No | Low | Test only |

> Detailed test data and fake-data recipes are not defined here. They come later, once the feature actually exists.

---

## Story Quality Assessment

***Verdict***: Needs Improvement

***Key findings***:

- The 13 acceptance criteria are unusually solid for a pre-sprint Story — clearly written, and they line up well with the business rules, scope, and workflow example.
- One real blocker: the Story itself flags that the database table's current shape (`user*id, project*id, view_kind`, no name column) doesn't support saving several named views per surface. Reading the actual database migration confirms the table really is built that way today. This isn't a guess — it's a decision the Story explicitly leaves open, and it needs an answer before Dev can start.
- One thing found by reading the code, not written anywhere in the Story: the database table's access rule only checks ownership, not current project membership, which sits at odds with a business rule that says visibility should follow project access. Worth a quick confirmation from Dev before treating it as settled.
- Review also caught: an ambiguity that first looked open (archived vs. fully-removed module) actually is already answered by a business rule, once cross-checked. A test for project-level isolation was missing even though the rule requiring it already exists. And "member" is used throughout without saying whether it covers owner/admin/viewer too.

---

## Critical Questions for PO

> These block sprint planning until answered.

1. ***Can one person have more than one saved view per surface, given the database table's current unique key is ****`(user*id, project*id, view_kind)`**** with no name column?***

---

## Technical Questions for Dev

> These don't block PO, but they block building the feature.

1. ***What does the save/list/rename/update/delete API actually look like (routes, request/response shape)?*** — Nothing describes this today; needed before in-sprint test planning can write exact steps.
2. ***Is the case-sensitivity / extra-spaces rule for matching names on purpose, or was it just never decided?*** — Determines the exact result of 3 test outlines (8.2, 8.3, and by extension 5.2).
3. ***Does bringing Bugs list and the Workbench filters up to page-address syncing belong inside this Story, or is it separate prerequisite work?*** — Today only 2 of the 4 surfaces have any page-address syncing; the other 2 need to be built from nothing, not just hooked up to saved views. This meaningfully changes how big and risky this Story actually is depending on the answer.
4. ***Is there meant to be a project-membership check on the saved-view table beyond the current owner-only rule?*** — Confirmed by reading the migration directly: no such check exists today. Determines whether Scenario E3 (leftover access after losing project access) is expected to fail, or is accepted as-is.
5. ***Does "no longer exists" in business rule 8 specifically mean the module was hard-deleted (not just archived)?*** — A quick confirmation, not a blocker: the rule already reads that way, this just closes the loop so the wording in AC-12 can be updated to match.

---

## Suggested Story Improvements

| # | Current state | Suggested change | Benefit |
| --- | --- | --- | --- |
| 1 | AC-08 says names must be unique but doesn't say how names are compared | Add a line: comparison ignores case and ignores extra spaces at the start/end (or state the opposite, explicitly) | Settles Ambiguity #1, unblocks exact pass/fail checks for 8.2/8.3/5.2 |
| 2 | AC-12 only mentions "archived" | Add a line pointing to business rule 8, or fold its wording directly into AC-12 so both say the same thing | Removes the confusion that made this look like an open question at first |
| 3 | No stated limit on how long a name can be or how many views someone can have | Add a max name length and (optionally) a cap on saved-view count | Gives Dev and QA a concrete number to build and test against |
| 4 **(new)** | "Member" is used throughout without defining who it includes | Either say "any workspace user" explicitly, or spell out what owners/admins/viewers get | Removes Ambiguity #6, prevents a built-then-disputed access decision later |

---

## Data feasibility flags

- ***Missing data or setup****: nothing blocking — `user*view*state` already exists on staging via the shipped database change, and all four target screens already exist and show filters. The real blocker isn't missing data, it's a ****decision*** still needed on how the table should be shaped (see Critical Question #1).
- ***Missing API***: no save/list/rename/update/delete endpoint exists yet anywhere in the codebase or in `business-api-map.md` — needs to be designed before exact test steps can be written (Technical Question #1).
- ***What needs to happen first***: (1) settle the database table shape; (2) design the API; (3) decide whether the page-address work on Bugs list/Workbench is part of this Story or separate (Technical Question #3).

---

## Recommended testing strategy

### Before building starts

- PO answers the Critical Question (database shape) before this Story gets estimated.
- Dev confirms the API shape and the page-address-syncing scope question so in-sprint planning can write exact steps.

### While building

- QA should ask for early access to a preview once the database change lands, specifically to confirm the new shape actually supports multiple named views before the rest of the feature gets built on top of it.
- Check the database-level access rule directly (not just through the screen) as soon as the table shape is final — cheap to check early, expensive to discover late.

### After building (handled in-sprint by /sprint-testing)

- Run the full outline set above once real staging data is available.
- Test the highest-priority items first: cross-user isolation (9.1/9.2/9.3), degraded restore when something's gone (12.1/12.2/12.3), duplicate-name blocking (8.1), and the core save → restore → update → delete sequence (1.1 → 2.1 → 6.1 → 7.1).
- Confirm the two still-unconfirmed guesses (double-submit, concurrent update from two tabs) once Dev states the intended behavior.

---

## Risks & mitigation

| # | Risk | How likely | How bad | Which checks catch it |
| --- | --- | --- | --- | --- |
| 1 | The database change ships without supporting multiple named views per surface, forcing a late rebuild | Medium | High | Scenarios 1.1, 1.2, 8.4, 8.5, 8.6 — first checks to run against a real build |
| 2 | Another person's saved view leaks through (AC-09 broken at the database level, not just the screen) | Low | High | Scenarios 9.1, 9.2, 9.3, and the database-level access check |
| 3 | Restoring a view whose target is gone loses or breaks the view instead of degrading gracefully | Medium | Medium | Scenarios 12.1, 12.2, 12.3 |
| 4 | Bringing Bugs list / Workbench up to page-address syncing gets underestimated because it's hidden inside "saved views" scope | Medium | Medium | Integration outline on page-address syncing; flagged as Technical Question #3 |

---

## Next steps

- [ ] PO answers the Critical Question before sprint planning
- [ ] Dev answers the Technical Questions before estimation
- [ ] Story enters sprint at status Ready For Dev once estimated
- [ ] When Story reaches Ready For QA, `/sprint-testing` will short-circuit refinement (label `shift-left-reviewed` detected)

---
_Synced from Jira by sync-jira-issues_
