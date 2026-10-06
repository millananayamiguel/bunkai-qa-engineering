# BK-742 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-742)

## AC-01 — A page is bounded, and it always says whether more remains

```
Scenario: A tag lookup answers with a bounded page
  Given the Workspace holds more Tests carrying the tag "smoke" than one page can hold
  When I look up the Tests carrying "smoke" without asking for a particular page size
  Then I receive at most one page of Tests
  And I receive a cursor that lets me ask for the rest
```

```
Scenario: The last page says so, rather than leaving me guessing
  Given I am reading the final page of Tests carrying "smoke"
  When I receive that page
  Then the cursor comes back empty
  And an empty cursor is the only signal I need to know I have them all
```

```
Scenario: A cursor is present whenever, and only whenever, more Tests remain
  Given I look up the Tests carrying a tag
  When the answer holds fewer Tests than the whole matching set
  Then a cursor is present
  And when the answer holds the last of the matching set, no cursor is present
```

## AC-02 — No result is ever dropped in silence

```
Scenario: A caller that ignores the cursor is bounded, but never misled
  Given the Workspace holds far more Tests carrying "smoke" than one page holds
  When I look them up and ignore the cursor entirely
  Then the Tests I received are a truthful prefix of the matching set
  And the cursor in that same answer tells me the set was not exhausted
  And nothing in the answer suggests I have seen every matching Test
```

```
Scenario: Asking for more Tests than the ceiling allows is refused, not quietly shrunk
  Given the largest page size the lookup accepts is fixed
  When I ask for a page larger than that ceiling
  Then the request is refused as a validation failure naming the page size
  And I do not receive a smaller page presented as though it were the size I asked for
```

```
Scenario: A page size below the minimum is refused the same way
  Given I ask for a page of zero Tests, or a negative number of Tests
  Then the request is refused as a validation failure naming the page size
  And no page is returned
```

## AC-03 — Paging forward reaches every matching Test exactly once

```
Scenario: Following the cursors to the end yields the whole matching set
  Given the Workspace holds one hundred Tests carrying the tag "smoke"
  When I read the first page and keep following each cursor until none comes back
  Then I have seen all one hundred Tests
  And no Test appeared on two different pages
  And no Test was skipped between one page and the next
```

```
Scenario: A Test created while I am paging never displaces one I have not read yet
  Given I have read the first page of Tests carrying "smoke"
  And a new Test carrying "smoke" is created before I ask for the second page
  When I ask for the second page using the cursor I was given
  Then the Tests I had not yet read are still delivered to me, none of them skipped
```

```
Scenario: Ordering is stable enough for paging to be meaningful
  Given the Workspace holds Tests carrying "smoke"
  When I read them page by page
  Then the Tests arrive in one consistent order across every page
  And two Tests that would otherwise tie are still ordered the same way on every read
```

## AC-04 — A cursor is opaque, and a bad one is an error

```
Scenario: A malformed cursor is refused rather than served as a fresh start
  Given I ask for a page using a cursor that this lookup did not issue
  Then the request is refused as a bad request naming the cursor
  And I am not silently handed the first page again
```

```
Scenario: The token carries no meaning I am invited to construct myself
  Given I receive a cursor
  When I inspect it
  Then it is an opaque value I am only expected to hand back unchanged
  And I am given no documented way to build one myself
```

## AC-05 — Paging never widens what I am allowed to see

```
Scenario: Tests from a Workspace I do not belong to never appear on any page
  Given a Test carrying "smoke" exists in a Workspace I am not a member of
  When I page through every page of Tests carrying "smoke"
  Then that Test never appears on any page
  And no cursor I am given leads to it
```

```
Scenario: A cursor cannot be repurposed to read another Workspace
  Given I hold a cursor issued for a lookup in a Workspace I belong to
  When that cursor is presented by someone who is not a member of that Workspace
  Then it yields them nothing they were not already entitled to read
```

```
Scenario: A viewer can page
  Given I am a member of the Workspace with the viewer role
  When I look up Tests carrying a tag and follow the cursors
  Then I can read every page
  And paging offers me no ability to change a Test
```

## AC-06 — The behaviour the lookup already had is preserved

```
Scenario: A tag is still required
  Given I look up Tests without naming a tag
  Then the request is refused for the missing tag, exactly as it was before this change
  And paging did not turn this into a way to list every Test in the Workspace
```

```
Scenario: A tag that matches nothing is still an empty answer, not a missing one
  Given no Test carries the tag "nightly"
  When I look up the Tests carrying "nightly"
  Then I receive an empty set of Tests rather than a not-found error
  And no cursor comes back
```

```
Scenario: Reserved suite tags still match regardless of casing
  Given a Test carries the reserved suite tag "smoke"
  When I look up Tests carrying "Smoke" and page through the answer
  Then that Test is among the Tests I receive
```

```
Scenario: A Test's row still carries what it carried before
  Given I receive a page of Tests
  When I read one of its Tests
  Then it tells me the same things about that Test as it did before this change
```

## AC-07 — The one in-product surface that reads this lookup keeps working

```
Scenario: Filtering the explorer by a tag still scopes it to every matching Test
  Given the Workspace holds more Tests carrying "smoke" than one page holds
  When I filter by the tag "smoke" from the Project toolbar
  Then the explorer's Tests group is scoped to every Test carrying "smoke"
  And it is not scoped to only the first page of them
```

```
Scenario: The tag filter never silently under-scopes
  Given a tag matches more Tests than a single page holds
  When I filter by that tag
  Then I am never shown a subset presented as though it were the complete match
```

## AC-08 — The contract is published, not folklore

```
Scenario: The published API contract describes paging
  Given a consumer reads the published API contract for the Test tag lookup
  Then it states the default page size, the largest page size accepted, and how the cursor is used
  And it states what happens when a page size is out of range and when a cursor is malformed
```

```
Scenario: An existing consumer can discover the change before it surprises them
  Given a consumer integrated against this lookup before this change
  When they read the published contract
  Then the bounded answer and the cursor are both documented
  And the contract does not describe the lookup as returning the whole matching set
```

```
Scenario: The paging vocabulary this story introduces is defined, not improvised
  Given this story introduces words the product's domain glossary does not yet define
  When the glossary is read after this story ships
  Then the terms this paging contract depends on are defined there
  And a later reader can check this story's criteria against a definition rather than against usage
```

## AC-09 — The recorded contract stops contradicting the shipped one

```
Scenario: The lookup's published parameters match the ones it actually accepts
  Given the recorded contract for this lookup states which parameters are required
  When it is compared against what the lookup accepts after this story
  Then the tag is recorded as required, because it is
  And no parameter is recorded as required that the lookup does not accept at all
```

```
Scenario: The API map stops describing this lookup as unpaged
  Given the API map describes the product's paging convention
  When this lookup is read against that convention after this story
  Then the map records this lookup as following it
  And the map's stated ceiling agrees with the ceiling the product actually enforces
```

---
_Synced from Jira by sync-jira-issues_
