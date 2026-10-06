# BK-666 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-666)

## AC-01 — The Tests list is a reachable section of the Project

```
Scenario: A Project's Tests have a list surface of their own
  Given I am viewing a Project
  When I look at the Project's section navigation
  Then I see a "Tests" entry alongside the other built sections
  And selecting it takes me to a list of that Project's Tests
```

```
Scenario: The Tests section stays current while I am inside it
  Given I opened the Project's Tests list
  When I look at the Project's section navigation
  Then "Tests" is marked as the section I am currently in
```

## AC-02 — The list renders every Test the explorer's Tests group exposes (REFINED 2026-09-08)

```
Scenario 2.1: Should list every Test the explorer's Tests group currently exposes, workspace-wide
  Given a Workspace with 3 Projects, where Project A has 2 Tests, Project B has 1 Test, and Project C has 0
  When I open Project A's Tests list
  Then I see all 3 Tests (A's 2 + B's 1), matching exactly what Project A's explorer Tests group already shows
```

```
Scenario 2.2: Should show the exact same set on every Project in the Workspace
  Given the same Workspace as Scenario 2.1
  When I open Project B's Tests list and then Project C's Tests list
  Then both show the identical 3-Test set and identical count as Project A's list
```

```
Scenario 2.3: Should state the count truthfully relative to the (workspace-wide) set
  Given a Workspace holding twelve Tests total, however distributed across its Projects
  When I open any one Project's Tests list with no filter active
  Then the list says "showing twelve Tests" — not "twelve Tests in this Project"
```

## AC-11 — Project-scoped Tests once the attribution defect is fixed (CONFIRMED 2026-09-09 — stays a candidate scenario until BK-620 ships)

```
Scenario E1: Should scope the list to the current Project only, once BK-620 lands
  Given BK-620 is fixed and `tests` carries a resolvable project_id
  When I open a Project's Tests list
  Then only that Project's own Tests appear
```

> ***CONFIRMED 2026-09-09***: PO decision — ship this Story now with Workspace-wide scope, documented as deliberate and temporary (see the Story description's Scope Decision section and the resolution comment). This scenario remains a placeholder for `/sprint-testing` / `/test-documentation` to pick up once BK-620 ships. Dev confirmed the new route reuses the same query layout.tsx already runs — no second query was introduced — keeping AC-07's single-scoping-rule promise mechanically true.

## AC-03 — A row carries enough to choose a Test without opening it

```
Scenario: Each row surfaces the Test's identity, chain length, tags and age
  Given a Test named "Checkout happy path" chains seven ATCs and carries the tag "smoke"
  When I see its row in the Project's Tests list
  Then I can read its name
  And I can read that its chain holds seven ATCs
  And I can read its tags, including "smoke"
  And I can read when it was created
```

```
Scenario: A Test whose chain is empty still states its chain length honestly
  Given a Test exists whose chain holds no ATCs
  When I see its row in the Project's Tests list
  Then its chain length reads as zero
  And the row is not hidden, blanked, or shown as an error
```

## AC-04 — Filtering by tag

```
Scenario: The Project's existing tag filter narrows this list too
  Given the Project holds Tests tagged "smoke" and Tests with no tags
  When I filter by the tag "smoke" using the Project's existing tag control
  Then the Tests list shows only the Tests carrying "smoke"
  And I did not have to enter the tag a second time for this list
```

```
Scenario: Reserved suite tags match regardless of the casing I type
  Given a Test carries the reserved suite tag "smoke"
  When I filter by "Smoke"
  Then that Test still appears in the list
```

```
Scenario: Clearing the tag filter restores the full list
  Given I filtered the Tests list by a tag
  When I clear the tag filter
  Then every Test in the Project is listed again
  And the list's count returns to the unfiltered total
```

```
Scenario: A tag that matches no Test reads as a filter outcome, not an empty Project
  Given the Project holds Tests, none of which carry the tag "nightly"
  When I filter by the tag "nightly"
  Then I see a state telling me no Test carries that tag
  And that state is distinct from the state shown when the Project has no Tests at all
  And nothing on the screen reads as an error
```

## AC-05 — Sorting

```
Scenario: I can sort the list by a column
  Given the Project's Tests list is showing several Tests
  When I sort by the name column
  Then the rows are ordered by name
  And selecting the same column again reverses that order
```

```
Scenario: Sorting orders the whole filtered set, not just what is on screen
  Given the Project holds more Tests than fit on one screen
  When I sort by chain length
  Then the first row is the Test with the smallest chain length in the whole filtered set
  And no Test is excluded from the ordering because it was out of view
```

```
Scenario: Sorting and tag filtering compose
  Given I filtered the Tests list by the tag "smoke"
  When I sort by chain length
  Then only Tests carrying "smoke" are listed
  And those Tests are ordered by chain length
```

## AC-06 — Opening a Test from the list

```
Scenario: A row opens that Test's own detail view
  Given the Project's Tests list shows a Test named "Checkout happy path"
  When I open that row
  Then I land on that Test's detail view
  And I see its chain of ATCs, exactly as I would have reached it from the explorer
```

```
Scenario: Returning from a Test brings the list back as I left it
  Given I filtered the Tests list by a tag and opened a Test from it
  When I navigate back to the Tests list
  Then the tag filter is still applied
```

## AC-07 — The list has one scoping rule, shared with the explorer

```
Scenario: The list never widens the set of Tests the Project already exposes
  Given the Project explorer's Tests group shows a given set of Tests
  When I open the Project's Tests list
  Then it shows exactly that set — no Test that the explorer withholds appears here
```

```
Scenario: Correcting how a Project's Tests are scoped corrects this list with it
  Given the rule that decides which Tests belong to a Project changes
  When I open the Project's Tests list
  Then the list reflects that change without a separate rule of its own having to be found and corrected
```

## AC-08 — Workspace isolation

```
Scenario: A Test from another Workspace never appears
  Given a Test exists in a Workspace I am not a member of
  When I open any Project's Tests list
  Then that Test never appears in the list, in its count, or in any tag-filtered result
```

```
Scenario: A viewer can read the list
  Given I am a member of the Workspace with the viewer role
  When I open a Project's Tests list
  Then I can read the list and open a Test from it
  And no create, edit or delete affordance for a Test is offered to me on this screen
```

## AC-09 — Empty, loading and failure states

```
Scenario: A Project with no Tests says so plainly
  Given the Project has no Tests yet
  When I open the Project's Tests list
  Then I see an explicit "no Tests yet" state
  And nothing on the screen reads as an error
  And the state points me at how a Test gets created
```

```
Scenario: The list shows a loading state while the Tests are still arriving
  Given I just opened the Project's Tests list
  When the Tests have not finished loading
  Then I see a loading state in place of the rows
  And no partial row data is presented as if it were final
```

```
Scenario: A failed tag lookup says what failed and lets me retry
  Given the tag filter's lookup fails
  When I filter the Tests list by a tag
  Then I see an explicit failure state naming what failed
  And I can retry the same filter from that state
  And the list does not silently present the unfiltered set as though the filter had matched everything
```

## AC-10 — The workbench view toggle is untouched

```
Scenario: Table View still shows ATCs only
  Given I am on the Project workbench
  When I switch to Table View
  Then I see the Project's ATCs, exactly as before this story
  And the toggle does not gain a Tests mode
```

---
_Synced from Jira by sync-jira-issues_
