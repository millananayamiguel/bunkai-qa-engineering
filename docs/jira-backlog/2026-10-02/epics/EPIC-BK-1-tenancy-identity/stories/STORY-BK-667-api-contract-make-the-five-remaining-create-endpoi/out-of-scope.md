# BK-667 — Out Of Scope

> Jira field: `customfield_10081` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-667)

- ******A server-derived fallback key for callers that send no header.**** ADR-0002 Decision #6 defers this explicitly and requires its own ADR, because it would change the shared helper's contract for every consumer including the two already shipped. Nothing here anticipates it.
- ******Any change to the two endpoints that already adopted.**** Test creation and Run start keep their behaviour, their status codes and their published contract exactly as they are. They are the reference, not the subject.
- ******The Stripe checkout route.**** `app/api/v1/workspaces/[id]/billing/checkout/route.ts` also uses the helper, but it is an ADR-0014 billing route and is not one of the endpoints BK-037 names. It is not touched and not counted.
- ******Widening BK-037's list.**** Creating an Acceptance Criterion, a Module, a duplicate ATC, a Personal Access Token, an invite, or accepting an invite are all outside the requirement and stay as they are.
- ******Update, delete and archive paths.**** Only the create half of User Story CRUD is in scope. Editing a User Story, an ATC or a Bug is untouched, and the shared user-story form must keep its edit path working exactly as before.
- ******Any database migration, schema change, index or RPC change.**** The `idempotency_keys` table shipped in migration 0009 and is sufficient as it stands.
- ******Changing the key scope, the retention window, or the payload-hashing rule.**** All three are settled by ADR-0002 and are reused verbatim.
- ******Changing the shared helper itself.**** This story consumes `lib/api/idempotency.ts`; it does not redesign it, add options to it, or extend its error vocabulary.
- ******A grace period, a deprecation window, or a feature flag that lets the header stay optional for a while.**** The decision recorded on this ticket rejects a phased rollout; the header is required from the moment each route adopts.
- ******Retry safety anywhere other than these five creates.**** Terminal Run transitions, step marking and other naturally idempotent writes need no key and get none.
- ******Any UI redesign.**** No screen changes shape, wording or layout. The client work is a header on an existing request plus key rotation on failure — invisible to the user except that a double-submit stops producing two records.
- ******Rate limiting, request coalescing, or any other reliability control.**** Related in spirit, separate in scope.

---
_Synced from Jira by sync-jira-issues_
