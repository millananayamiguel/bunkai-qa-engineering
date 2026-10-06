# BK-443 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-443)

## Phase 3 — Refined Acceptance Criteria

### Original AC-01 — Save the current filter combination under a name

#### Scenario 1.1: Should save current view under a given name when one filter is applied (Type: Positive, Priority: Critical)

- ***Given***: I am on a filtered surface (e.g. Bugs list) with exactly one filter applied (e.g. `severity = "Critical"`)
- ***When***: I trigger "Save view" and enter the name `"Critical bugs"`
- ***Then***: the view is saved under that name; it shows up in my saved-view list for that surface; nothing extra is created

#### Scenario 1.2: Should save current view under a given name when multiple filters are applied (Type: Positive, Priority: Critical)

- ***Given***: I have `module = "Checkout"`, `severity in ["Critical","High"]`, `date range = this sprint` applied on the Bugs list
- ***When***: I save the view as `"Checkout blockers, this sprint"`
- ***Then***: all three filters are saved together under that one name

#### Scenario 1.3: Should list a newly saved view right after saving it (Type: Positive, Priority: High)

- ***Given***: I just finished Scenario 1.1
- ***When***: I open the saved-view list on the same surface without navigating away
- ***Then***: `"Critical bugs"` shows up without needing a reload

### Original AC-02 — Return to a saved view restores every filter it held

#### Scenario 2.1: Should restore exact filter combination after clearing filters (Type: Positive, Priority: Critical)

- ***Given***: a saved view `"Checkout blockers, this sprint"` holding module/severity/date filters; I've since cleared all filters on that surface
- ***When***: I open the saved view
- ***Then***: all three filters come back exactly as saved; the list shows the same narrowed results

#### Scenario 2.2: Should restore exact filter combination after changing filters to different values (Type: Positive, Priority: High)

- ***Given***: the same saved view; I've since changed `severity` to `["Low"]` and `module` to `"Auth"`
- ***When***: I open the saved view
- ***Then***: the filters go back to the saved values, my unsaved changes are dropped

#### Scenario 2.3: Should restore a saved view holding exactly one filter dimension (Type: Boundary, Priority: Medium)

- ***Given***: a saved view created with only `severity = "Critical"` set (the smallest allowed case per AC-10)
- ***When***: I open it
- ***Then***: only that one filter comes back; nothing extra is applied or cleared by mistake

### Original AC-03 — A saved view survives navigating away and back

#### Scenario 3.1: Should list a saved view after navigating away and back within the same session (Type: Positive, Priority: High)

- ***Given***: I saved a view; I go to a different page and come back
- ***When***: I open the saved-view list
- ***Then***: the view is still listed

#### Scenario 3.2: Should list a saved view after a full page reload (Type: Positive, Priority: High)

- ***Given***: I saved a view; I hard-reload the tab
- ***When***: I return to the surface
- ***Then***: the view is still listed and opens correctly

#### Scenario 3.3: Should list a saved view in a new session on a later day (Type: Positive, Priority: Critical)

- ***Given***: I saved a view yesterday; today I log in fresh (new session)
- ***When***: I visit the surface
- ***Then***: the view is still there — proves it's saved to the database, not just remembered by the browser tab

### Original AC-04 — Saved views are listed per surface

#### Scenario 4.1: Should list only views saved for the current surface (Type: Positive, Priority: High)

- ***Given***: I saved `"Critical bugs"` on the Bugs list and `"My failing runs"` on Run history
- ***When***: I open the saved-view list on the Bugs list
- ***Then***: I only see `"Critical bugs"`, not `"My failing runs"`

#### Scenario 4.2: Should show zero views on a surface where none were saved even though other surfaces have saved views (Type: Boundary, Priority: Medium)

- ***Given***: I've saved views on Bugs list and Run history but never on the Workbench ATC search
- ***When***: I open the saved-view list on the Workbench
- ***Then***: the list is empty for that surface (leads into AC-11's empty screen)

### Original AC-05 — Rename a saved view

#### Scenario 5.1: Should rename a saved view and keep its filters unchanged (Type: Positive, Priority: High)

- ***Given***: a saved view `"Critical bugs"` holding `severity = "Critical"`
- ***When***: I rename it to `"P1 bugs"`
- ***Then***: it now shows as `"P1 bugs"`; opening it still restores `severity = "Critical"`

#### Scenario 5.2: Should reject renaming a saved view to a name already used by another saved view on the same surface (Type: Negative, Priority: High)

- ***Given***: two saved views `"Critical bugs"` and `"P1 bugs"` on the same surface
- ***When***: I try to rename `"P1 bugs"` to `"Critical bugs"`
- ***Then***: I'm told the name is already used; the rename is blocked; both views keep their original names

#### Scenario 5.3: Should allow renaming a saved view to its own current, unchanged name (Type: Boundary, Priority: Low) — ***NEEDS PO/DEV CONFIRMATION***

- ***Given***: a saved view named `"Critical bugs"`
- ***When***: I submit a rename using the same name `"Critical bugs"`
- ***Then***: it's accepted with no error, not blocked as a duplicate (best guess — see Ambiguity #2)

### Original AC-06 — Update a saved view with the filters currently applied

#### Scenario 6.1: Should overwrite a saved view's filters without creating a second view (Type: Positive, Priority: Critical)

- ***Given***: I opened `"Critical bugs"` (holding `severity = "Critical"`) and changed the filter to `severity in ["Critical","High"]`
- ***When***: I choose "Update saved view"
- ***Then***: `"Critical bugs"` now holds `severity in ["Critical","High"]`; my saved-view list still shows exactly one view named `"Critical bugs"`

#### Scenario 6.2: Should handle updating a saved view when the currently applied filters are identical to what it already holds (Type: Boundary, Priority: Low) — ***NEEDS PO/DEV CONFIRMATION***

- ***Given***: I opened `"Critical bugs"` and changed nothing
- ***When***: I choose "Update saved view"
- ***Then***: it succeeds with no visible change (best guess — see Ambiguity #3)

### Original AC-07 — Delete a saved view

#### Scenario 7.1: Should remove a saved view from the list after deletion and confirmation (Type: Positive, Priority: High)

- ***Given***: a saved view `"Old filters"` exists
- ***When***: I delete it and confirm
- ***Then***: it no longer shows in the saved-view list

#### Scenario 7.2: Should keep the currently applied filters unchanged after deleting a saved view (Type: Positive, Priority: Medium)

- ***Given***: I have `severity = "Low"` currently applied on the list (unrelated to the view I'm deleting)
- ***When***: I delete a saved view
- ***Then***: `severity = "Low"` stays applied — deleting a saved view never touches my live filters

#### Scenario 7.3: Should reject deleting a saved view that does not belong to the current user (Type: Negative, Priority: Critical)

- ***Given***: another member's saved view exists on a shared project (reached via a direct request, bypassing the screen which wouldn't show it per AC-09)
- ***When***: I try to delete it
- ***Then***: the request is refused (403/404) and the view stays untouched

### Original AC-08 — A name must be given and must be unique for that surface

#### Scenario 8.1: Should reject saving a new view with a name already used on that surface (Type: Negative, Priority: Critical)

- ***Given***: `"Failing payments"` already exists on this surface
- ***When***: I try to save another view named `"Failing payments"` on the same surface
- ***Then***: I'm told the name is already used; nothing extra is created

#### Scenario 8.2: Should reject saving a new view with a name differing only by case from an existing one (Type: Negative, Priority: Medium) — ***NEEDS PO/DEV CONFIRMATION***

- ***Given***: `"Failing payments"` exists
- ***When***: I try to save `"failing payments"`
- ***Then***: blocked as a duplicate (best guess — see Ambiguity #1; exact rule still TBD)

#### Scenario 8.3: Should reject saving a new view with a name differing only by leading/trailing whitespace (Type: Boundary, Priority: Medium) — ***NEEDS PO/DEV CONFIRMATION***

- ***Given***: `"Failing payments"` exists
- ***When***: I try to save `" Failing payments "` (with extra spaces around it)
- ***Then***: blocked as a duplicate once spaces are trimmed (best guess — see Ambiguity #1)

#### Scenario 8.4: Should accept saving a new view with a genuinely unique name (Type: Positive, Priority: High)

- ***Given***: `"Failing payments"` exists
- ***When***: I save a new view named `"Passing payments"`
- ***Then***: both views exist side by side under their own names

#### Scenario 8.5: Should scope name uniqueness per surface, allowing the same name on two different surfaces (Type: Positive, Priority: Medium)

- ***Given***: `"Critical bugs"` exists on the Bugs list
- ***When***: I save a view also named `"Critical bugs"` on Run history
- ***Then***: both are accepted — the "must be unique" rule only applies within one surface, not across the whole product

#### Scenario 8.6 **(new — from review)**: Should keep name uniqueness scoped to one project, allowing the same surface + name combination in a different project (Type: Positive, Priority: Medium)

- ***Given***: `"Critical bugs"` exists on the Bugs list in Project A
- ***When***: I save a view also named `"Critical bugs"` on the Bugs list in Project B
- ***Then***: both are accepted — the "must be unique" rule doesn't cross project boundaries (per business rule 2)

### Original AC-09 — Saved views are private to the person who saved them

#### Scenario 9.1: Should exclude another member's saved view from my saved-view list on a shared project (Type: Negative, Priority: Critical)

- ***Given***: another member of my workspace saved a view on a surface I also use
- ***When***: I open the saved-view list on that surface
- ***Then***: I don't see their view

#### Scenario 9.2: Should reject direct access to another member's saved view by id (Type: Negative, Priority: Critical) — ***NEEDS PO/DEV CONFIRMATION***

- ***Given***: another member's saved-view id is known (e.g. seen via a browser network request)
- ***When***: I try to open or fetch it directly (bypassing the screen)
- ***Then***: the request is refused by the server itself, not just hidden by the screen — this checks the database-level protection, not just what the UI shows

#### Scenario 9.3 **(new — from review)**: Should exclude a saved view saved in a different project from my current project's saved-view list, even with the same surface and same name (Type: Negative, Priority: High)

- ***Given***: I saved `"Critical bugs"` on the Bugs list in Project A
- ***When***: I open the Bugs list saved-view list while working in Project B
- ***Then***: I don't see the Project A view, even if I later save a view with the identical name in Project B

### Original AC-10 — Saving with no filters set is refused

#### Scenario 10.1: Should refuse saving a view when no filter is applied (Type: Negative, Priority: High)

- ***Given***: the filter bar is fully cleared
- ***When***: I try to save the current view
- ***Then***: I'm told there's nothing to save; nothing is created

#### Scenario 10.2: Should accept saving a view when exactly one filter is applied, as the minimum valid boundary (Type: Boundary, Priority: Medium)

- ***Given***: exactly one filter is set
- ***When***: I save the view
- ***Then***: it's accepted (mirrors Scenario 1.1, restated as the direct boundary counterpart to 10.1)

### Original AC-11 — No saved views yet reads as empty, not broken

#### Scenario 11.1: Should show an explicit "no saved views yet" state (Type: Positive, Priority: Medium)

- ***Given***: I've never saved a view on this surface
- ***When***: I open its saved-view list
- ***Then***: I see a clear empty-state message, not a blank panel or a spinner stuck forever

#### Scenario 11.2: Should offer a save-current-view action from the empty state (Type: Positive, Priority: Medium)

- ***Given***: the empty state described above
- ***When***: I view it
- ***Then***: it includes a way to save the view I'm currently on

### Original AC-12 — A saved view referring to something that no longer exists degrades cleanly

#### Scenario 12.1: Should restore with an explicit "no longer applies" message when the saved view's target module was archived (Type: Edge, Priority: Critical)

- ***Given***: I saved a view filtered to `module = "Legacy Checkout"`; that module was archived afterward
- ***When***: I open the saved view
- ***Then***: the filters that still work are applied; I'm told which part (the module filter) no longer applies; the saved view isn't quietly deleted

#### Scenario 12.2: Should not delete a saved view whose target was archived (Type: Positive, Priority: High)

- ***Given***: the same setup as 12.1
- ***When***: I re-open the saved-view list after opening the degraded view
- ***Then***: the view is still listed (not auto-removed)

#### Scenario 12.3 **(new — from review)**: Should show a fully-degraded state when every filter in a saved view points to something that no longer applies (Type: Boundary, Priority: High)

- ***Given***: a saved view holding two filters, and both of the things they point to (e.g. two modules) were archived
- ***When***: I open the saved view
- ***Then***: I'm told none of the saved filters still apply; the surface falls back to a sensible default (likely the same "nothing to show yet" handling as an unfiltered list) rather than breaking or showing a half-built screen

### Original AC-13 — Opening a saved view leaves the list shareable by link

#### Scenario 13.1: Should reflect restored filters in the page address immediately after opening a saved view (Type: Positive, Priority: High)

- ***Given***: I'm on the Traceability chain (already keeps filters in the page address)
- ***When***: I open a saved view holding a specific filter combination
- ***Then***: the page address matches exactly those filters

#### Scenario 13.2: Should reproduce the same narrowed list when a copied link from a restored saved view is opened by another authorized member (Type: Integration, Priority: High)

- ***Given***: I opened a saved view and copied the resulting link; another member of the same project can already see that data
- ***When***: they open the copied link
- ***Then***: they see the same narrowed list — the link itself carries the filters, separate from my private saved view (since the saved view itself stays private per AC-09, only the resulting link is shareable, not the view)

### New scenarios surfaced from Phase 2 edge cases — NEEDS PO/DEV CONFIRMATION

#### Scenario E1: Should not create two saved views on rapid double-submit of "save" (Type: Edge, Priority: Medium)

- ***NEEDS PO/DEV CONFIRMATION***: best guess — confirm whether the second click is blocked on-screen, refused by the server as a duplicate name, or silently ignored
- ***Given***: I fill in a name and click "Save" twice quickly
- ***When***: both clicks reach the server
- ***Then***: exactly one view is created, not two

#### Scenario E2: Should behave predictably when the same saved view is updated concurrently from two open tabs (Type: Edge, Priority: Medium)

- ***NEEDS PO/DEV CONFIRMATION***: last-save-wins is the best guess given how the table is built; nothing in the Story confirms it
- ***Given***: I have the same saved view open in two tabs and change its filters differently in each
- ***When***: both updates are sent
- ***Then***: the view ends up holding one of the two filter sets (the last one saved), not a broken mix of both

#### Scenario E3: Should retain a saved view whose owning member later loses project access, without exposing it to anyone else (Type: Edge, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: best guess based on reading the database access rule directly — confirm intended behavior with Dev
- ***Given***: a member saved a view, then had their project access removed (project itself still exists)
- ***When***: any other member checks the surface's saved views, or the removed member somehow logs back in
- ***Then***: the leftover view is never shown to anyone else; whether the removed member can still see their own leftover view is the open question in Ambiguity #5

---

---
_Synced from Jira by sync-jira-issues_
