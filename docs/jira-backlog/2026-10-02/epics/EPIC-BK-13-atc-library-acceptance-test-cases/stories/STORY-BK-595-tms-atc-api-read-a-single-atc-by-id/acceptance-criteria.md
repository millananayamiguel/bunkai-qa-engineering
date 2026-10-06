# BK-595 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-595)

## AC-01 — Read an ATC by id

```
Scenario: A member of the ATC's workspace reads it by id
  Given I hold a Personal Access Token for a workspace
  And that workspace contains an ATC named "Login with expired token"
  When I request GET /api/v1/atcs/{atc_id} for that ATC
  Then I receive 200
  And the response carries the ATC in the product's standard response envelope
  And it includes the ATC's id, slug, title, layer, version, owning Module and anchored User Story
```

```
Scenario: An unexpanded read returns the ATC header only
  Given an ATC with 5 steps and 3 assertions
  When I request it by id with no expand parameter
  Then I receive 200
  And the payload does not carry the step bodies, the assertion bodies, the anchored Acceptance Criteria, or the Tests that chain it
```

## AC-02 — The published expansions are honoured

```
Scenario Outline: Each documented expansion is accepted and returns its data
  Given an ATC that has steps, assertions, at least one anchored Acceptance Criterion, and is chained by at least one Test
  When I request it by id with expand=<expansion>
  Then I receive 200
  And the payload carries <expansion> in full

  Examples:
    | expansion            |
    | steps                |
    | assertions           |
    | acceptance_criteria  |
    | used_in              |
```

```
Scenario: Several expansions can be combined in one round-trip
  Given an ATC with steps and assertions
  When I request it by id with expand=steps,assertions
  Then I receive 200
  And the payload carries both, each in its recorded order starting at position 1
```

```
Scenario: An unrecognised expansion is rejected rather than silently ignored
  Given an ATC I can read
  When I request it by id with expand=steps,not*a*real_expansion
  Then the request is refused with a named error identifying the unrecognised value
  And no partial payload is returned
```

```
Scenario: An expansion with nothing to return renders as empty, not as an error
  Given an ATC that no Test chains
  When I request it by id with expand=used_in
  Then I receive 200
  And the payload carries an empty collection for the Tests that chain it
```

## AC-03 — The read is scoped, and a stranger learns nothing

```
Scenario: An ATC in a workspace I am not a member of is indistinguishable from one that does not exist
  Given an ATC exists in a workspace I am not a member of
  When I request it by id
  Then I receive the same 404 outcome I would receive for an id that has never existed
  And the response reveals no title, no workspace, no project and no timestamps
```

```
Scenario: A malformed id is rejected before any lookup happens
  Given I request GET /api/v1/atcs/not-a-uuid
  Then the request is refused as a bad request
  And the response names the id as the offending input
```

## AC-04 — An archived ATC is not served by this read

```
Scenario: An archived ATC is not returned
  Given an ATC has been archived
  When I request it by id
  Then it is not returned as an active ATC
  And the outcome matches how the product's other by-id reads already answer for an archived record
```

## AC-05 — The route carries a capability posture

```
Scenario: A token holding the read capability succeeds
  Given my Personal Access Token holds the capability the product requires of its single-entity reads
  When I request an ATC by id in a workspace I belong to
  Then I receive 200
```

```
Scenario: A token without the read capability is refused
  Given my Personal Access Token holds only a write capability
  When I request an ATC by id
  Then the request is refused as forbidden
  And no ATC data is returned
```

```
Scenario: An unauthenticated request is refused
  Given I present no token and no session
  When I request an ATC by id
  Then the request is refused as unauthorised
```

```
Scenario: A browser session reads the same ATC through the same route
  Given I am signed in with a browser session and can read the ATC's Project
  When the route is called for that ATC
  Then I receive the same payload a capable token receives
```

## AC-06 — Reading never writes

```
Scenario: A read leaves the ATC untouched
  Given an ATC at version 4
  When I read it by id, with and without expansions, several times
  Then its version is still 4
  And its updated timestamp is unchanged
  And no entry is added to the workspace Activity Stream
```

## AC-07 — The published single-entity read target becomes measurable

```
Scenario: The named performance target can be exercised
  Given an ATC with 5 steps and 3 assertions in a workspace holding 5000 ATCs
  When the route is measured under the product's stated single-entity read target
  Then the measurement runs against a live route rather than against a missing one
  And the result is recorded against the target published for single-entity reads
```

---
_Synced from Jira by sync-jira-issues_
