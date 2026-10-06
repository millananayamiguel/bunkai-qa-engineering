# BK-595 — Scope

> Jira field: `customfield_10129` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-595)

- One read of a single Acceptance Test Case by its id, over the public versioned API, returning the ATC in the product's standard response envelope
- Support for the four expansions already published for this operation: steps, assertions, anchored Acceptance Criteria, and the Tests that chain the ATC
- Combining expansions in a single request, so a caller resolves an ATC in one round-trip
- A lean default: with no expansion asked for, the read returns the ATC header only
- Workspace scoping, so an ATC outside the caller's reach is indistinguishable from an id that never existed
- A declared capability posture on the route, matching the posture the product's other single-entity reads already carry, plus the refusals for a token without it and for an unauthenticated caller
- Excluding an archived ATC from this read, consistent with how the product's other by-id reads already answer
- Rejecting a malformed id and an unrecognised expansion with named errors, before any data is served
- Route-level test coverage for the read, its expansions, its scoping and its refusals
- Keeping the published API contract and the shipped route in agreement for this operation

---
_Synced from Jira by sync-jira-issues_
