# BK-667 — Scope

> Jira field: `customfield_10129` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-667)

- Adopting the existing `Idempotency-Key` contract on the five create endpoints BK-037 names that never wired it: Workspace creation, Project creation, User Story creation, ATC creation and Bug filing
- Reusing the shipped helper exactly as the two existing adopters use it — begin, record on success, discard on a pre-write failure — with no new helper, no new semantics and no per-endpoint variant
- Refusing a call with no key and a call with a malformed key, each with its own named error, before any record is written
- Replaying the stored answer for a repeat of the same key with the same payload, so a retry returns the first result and writes nothing twice
- Refusing as a conflict both a reused key carrying a different payload and a second call arriving while the first is still in flight
- Keeping keys scoped per caller and per endpoint, so two people, or one person on two endpoints, never collide on the same key text
- Updating every in-product caller of the five endpoints to send a key and to rotate it after a refusal, following the rotation pattern the Run-start control already ships
- The five callers by name: the onboarding form, the create-project form, the user-story form on its create path only, the new-ATC editor, and the file-a-Bug dialog
- Keeping the signup path working — a brand-new account must still complete onboarding and reach the product
- Publishing the header on all five endpoints in the API contract, in the same shape and with the same documented outcomes the two shipped adopters already publish
- Correcting BK-037 so the requirement states the header is required and states the key shape the shipped helper enforces
- Refreshing the API map's adopter count and its `POST /bugs` row so both describe the shipped routes
- Updating the QA testability guide's entry for the Workspace-create call, which is the documented headless bootstrap for a fresh token
- Route-level test coverage per endpoint for the refusals, the replay, the payload-mismatch conflict and the in-flight conflict

---
_Synced from Jira by sync-jira-issues_
