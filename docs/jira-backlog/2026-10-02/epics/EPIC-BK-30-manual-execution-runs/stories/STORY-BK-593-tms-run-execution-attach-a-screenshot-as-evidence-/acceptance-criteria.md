# BK-593 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-593)

## Phase 3 — Refined Acceptance Criteria

> No original AC identifiers were available locally. The following are proposed scenarios derived from the Story evidence and must not be treated as accepted requirements until confirmed.

### Proposed contract — attach evidence to a step result

#### Scenario P1: Should attach an accepted screenshot to the selected Run step result (Type: Positive, Priority: Critical)

- ***NEEDS PO/DEV CONFIRMATION***: inferred from the Story title and description.
- ***Given***: an authorized user has a `running` Run and a selected Run Step result.
- ***When***: the user submits one valid screenshot within the confirmed size/type policy.
- ***Then***: the attachment is associated with that Run Step, is visible in the step result/report, and the API returns the confirmed success status and metadata shape; no unrelated step or Workspace receives it.

#### Scenario N1: Should reject an unsupported screenshot type without persistence (Type: Negative, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: accepted media types and error contract are inferred.
- ***Given***: an authorized user has a `running` Run and a file outside the accepted media policy.
- ***When***: the user submits the file.
- ***Then***: the API returns the confirmed validation status and exact error shape/message; no attachment metadata or storage object remains.

#### Scenario N2: Should reject malformed content that claims an accepted image type (Type: Negative, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: byte-level validation is inferred.
- ***Given***: an authorized user has a `running` Run and a payload whose declared type is accepted but whose bytes are not a valid screenshot.
- ***When***: the user submits it.
- ***Then***: the system rejects it with the confirmed error contract and leaves no persisted attachment or orphan object.

#### Scenario B1: Should accept a screenshot exactly at the confirmed per-file limit (Type: Boundary, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: the limit and inclusive boundary are not specified.
- ***Given***: an authorized user has a `running` Run and a valid screenshot whose size equals the confirmed maximum.
- ***When***: the user submits it.
- ***Then***: the system accepts it if the limit is inclusive, persists one attachment, and reports the confirmed metadata.

#### Scenario B2: Should reject a screenshot one byte above the confirmed per-file limit (Type: Boundary, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: the limit and error contract are not specified.
- ***Given***: an authorized user has a `running` Run and a valid screenshot one byte above the confirmed maximum.
- ***When***: the user submits it.
- ***Then***: the system rejects it before durable attachment completion and returns the confirmed size-limit error.

#### Scenario B3: Should reject a zero-byte screenshot (Type: Boundary, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: zero-byte treatment is inferred from the Story risk list.
- ***Given***: an authorized user has a `running` Run and an empty file.
- ***When***: the user submits it.
- ***Then***: the system rejects it with the confirmed validation error and creates no metadata or object.

#### Scenario A1: Should deny evidence mutation to a viewer while preserving the Run Step result (Type: Negative, Priority: Critical)

- ***NEEDS PO/DEV CONFIRMATION***: role permissions are not defined per action.
- ***Given***: a viewer can read the relevant Workspace but lacks mutation permission.
- ***When***: the viewer attempts to attach or remove evidence from a Run Step.
- ***Then***: the API returns the confirmed authorization status/error without changing the Run Step or storage state.

#### Scenario A2: Should deny evidence access across Workspace boundaries (Type: Negative, Priority: Critical)

- ***NEEDS PO/DEV CONFIRMATION***: cross-Workspace behavior is inferred from the project-wide RLS policy.
- ***Given***: an authenticated member of Workspace B knows an attachment or Run Step identifier belonging to Workspace A.
- ***When***: the member requests metadata or content.
- ***Then***: the system denies access without revealing whether the resource exists.

#### Scenario S1: Should allow evidence attachment while the Run is running (Type: Positive, Priority: Critical)

- ***NEEDS PO/DEV CONFIRMATION***: the allowed Run state is inferred from the execution flow.
- ***Given***: the Run is `running` and the selected step result is mutable.
- ***When***: the user attaches an accepted screenshot.
- ***Then***: the attachment is associated with the step and remains available in the Run report.

#### Scenario S2: Should reject evidence mutation after the Run is terminal (Type: State, Priority: Critical)

- ***NEEDS PO/DEV CONFIRMATION***: terminal mutability policy is not specified.
- ***Given***: the Run is `passed`, `failed`, or `aborted`.
- ***When***: a user attempts to attach or remove step evidence.
- ***Then***: the system rejects the mutation with the confirmed state error and preserves the terminal Run/report state.

#### Scenario S3: Should resolve an upload racing with Run completion or abort consistently (Type: State, Priority: Critical)

- ***NEEDS PO/DEV CONFIRMATION***: race outcome and transaction boundary are unspecified.
- ***Given***: an upload and a Run finish/abort request overlap.
- ***When***: both operations reach the server concurrently.
- ***Then***: the system applies the confirmed serialization rule, leaving either a complete evidence record or no partial record, with a consistent report.

#### Scenario E1: Should avoid duplicate evidence after a retry of the same upload (Type: Edge, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: idempotency/deduplication policy is inferred.
- ***Given***: the client retries the same logical upload after an ambiguous response.
- ***When***: the retry is processed.
- ***Then***: the system applies the confirmed idempotency rule and does not create unintended duplicate attachments or orphan objects.

#### Scenario E2: Should recover safely from storage or metadata persistence failure (Type: Edge, Priority: Critical)

- ***NEEDS PO/DEV CONFIRMATION***: rollback and retry behavior are inferred.
- ***Given***: storage succeeds but attachment metadata persistence fails, or storage is unavailable before completion.
- ***When***: the upload operation returns.
- ***Then***: the system exposes the confirmed retryable/non-retryable error and leaves no inconsistent Run Step evidence state.

---

---
_Synced from Jira by sync-jira-issues_
