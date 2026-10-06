# BK-667 — Business Rules

> Jira field: `customfield_10152` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-667)

- ******ADR-0002 is the contract; BK-037's prose is the summary that drifted.**** Where the two disagree, the ADR governs and the requirement text is corrected. Implementing to the requirement's "optional header" wording would produce a second, incompatible idempotency contract inside one product, which the ADR's own invariant forbids in as many words.
- ******One contract, not five.**** Every adopting endpoint uses the same header name, the same accepted key shape, the same refusal codes, the same conflict rule and the same window. An endpoint that needs a special case does not get one; it gets a new ADR.
- ******The key is required on any endpoint that adopts.**** There is no lenient mode, no partial mode and no per-caller exemption. A call without a key is refused before any work is done.
- ******The helper is consumed, never re-implemented.**** The route supplies the caller, the endpoint name and the payload; the helper owns replay detection, hashing, the conflict rules and the reclaim races. A route that hand-rolls any part of that creates a second definition of what a duplicate is, and the two will drift.
- ******A key identifies one logical request, not a session.**** The same key with a different payload is a conflict, never an update and never a silent second write.
- ******Absence of a key and a malformed key are different answers.**** A caller that forgot the header and a caller whose generator is wrong need different fixes, so they get different named errors.
- ******Keys are scoped to the caller and the endpoint.**** Two callers may use identical key text without colliding, and one caller may reuse a key across two endpoints without either being read as a replay of the other.
- ******A failure before the record is written must release the key.**** Otherwise the caller's honest retry is refused and the endpoint becomes harder to use than it was before this story.
- ******A record that was written stays written.**** Once the business write commits, a later bookkeeping failure never rolls it back, never turns the answer into an error, and never leaves the key free to mint a duplicate.
- ******Server and client land together.**** Requiring the header is a breaking change for every caller. A change that wires a route without its caller ships an outage, and the onboarding form is the case where that outage is a bricked signup rather than a broken button.
- ******The client rotates the key on refusal, never on success.**** One key per attempt: reusing a key after a refusal, with a corrected payload, is a payload mismatch and is refused again. This is the behaviour the Run-start control already ships and it is copied rather than reinvented.
- ******A double-submit is the user's, and the product absorbs it.**** Two clicks on one form send one key and produce one record. The user is never shown a conflict error caused by their own second click.
- ******Published contract, requirement text, API map and QA guide are part of the change, not follow-up work.**** A required header that no document mentions is indistinguishable from a bug to the person who hits it.

---
_Synced from Jira by sync-jira-issues_
