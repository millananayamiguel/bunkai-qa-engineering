# BK-593 — Acceptance Test Plan (QA)

> Jira field: `customfield_10137` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-593)

# Shift-Left Refinement: BK-593 — TMS-Run Execution | Attach a screenshot as evidence on a step result

***Status***: Refined — Awaiting PO Estimation
***Mode***: Shift-Left (pre-sprint, local staging only)
***Refined on***: 2026-09-17
***Refined by***: QA — Shift-Left Phase 2
***Modality***: Not resolved; no TMS write is requested or performed

---

## Phase 1 — Critical Analysis

### Business context

- ***Primary persona affected***: QA engineer executing a Test Run and recording step-level proof.
- ***Secondary personas (if any)***: Developers and stakeholders reviewing Run reports; agents or CI callers consuming execution evidence.
- ***Business value proposition***: Preserve trustworthy, reviewable evidence at the exact Run step result instead of relying on one free-text URL.
- ***KPI(s) influenced***: Evidence completeness, reproducibility of failed steps, and time to triage execution defects. Numeric targets are not defined.
- ***User journey position***: Execute a Run -> mark a step result -> attach evidence -> finish or abort the Run -> inspect report/history.

### Technical context

- ***Frontend***: Run execution and report views are documented under `app/(app)/projects/[projectSlug]/runs/`; the complete route inventory and selector contract were not verified. A file picker, upload state, step-result attachment list, and error presentation are not yet evidenced.
- ***Backend***: Run creation is documented as `POST /api/v1/tests/{id}/runs` in `.context/business/business-api-map.md:70-88`; the exact step-result mutation/upload endpoint for this Story is not present in the available API map. The existing Run lifecycle is `running -> passed|failed|aborted` per `.context/business/business-data-map.md:209-221`.
- ***Persistence***: Run and Run Step snapshots are established by migration `0031` according to `.context/business/business-data-map.md:112-122`. A target object-storage bucket, upload route, attachment table, or attachment foreign key was not found in the inspected evidence.
- ***External services***: A storage provider is not identified. Supabase provides Auth, PostgreSQL/RPC, and RLS, but object storage configuration for this Story is unverified (`.context/business/business-data-map.md:252-260`).
- ***Integration points specific to this Story***: browser or client upload -> application authorization -> storage service -> attachment metadata persistence -> Run Step result/report readback. Partial-failure rollback and retry behavior are currently unspecified.

### Story complexity

| Axis | Rating | Why |
| --- | --- | --- |
| Business logic | High | Evidence must remain attached to the correct step result across Run lifecycle states. |
| Integration | High | New storage foundation and upload path are not evidenced; provider contract is unknown. |
| Data validation | High | File type, size, zero-byte content, duplicate identity, and malformed content are explicit risks. |
| UI | Medium | Step-result upload, progress, errors, and attachment rendering are user-facing but the existing UI contract is unverified. |

***Estimated test effort***: High; a planning baseline is 15 outline names plus integration/API coverage, subject to PO/Dev answers and the selected storage contract.

### Epic-level inheritance (if applicable)

- ***Discovery Gap***: No parent Epic or epic-level feature plan is verifiable in the local repository cache. The folder `EPIC-UNVERIFIED-run-execution` is deliberately neutral and must be reconciled before Jira handoff.
- ***Risks restated at Story level***: Run snapshot truth, terminal-state integrity, tenant isolation, and partial failure are inherited from `.context/master-test-plan.md:16-19,36-42`.
- ***Integration points inherited***: Supabase Auth/DB/RLS and the Run/report chain are documented; object storage is not.
- ***PO/Dev answers already given at epic level***: None verifiable; no answers are re-used.
- ***Test strategy inherited***: Unit and Integration/API are evidenced; Browser E2E is not verified (`.context/master-test-plan.md:142-151`).

---

## Phase 2 — Story Quality Analysis

### Ambiguities

| # | Location in Story | Question for PO/Dev | Impact on testing | Suggested clarification |
| --- | --- | --- | --- | --- |
| 1 | Description: “screenshot as evidence on a step result” | Is the scope one screenshot per step result, multiple attachments, or both? | Determines duplicate, ordering, removal, and count coverage. | State cardinality and whether existing attachments remain visible. |
| 2 | Description: “storage foundation” | Which storage provider, bucket, object-key convention, and retention policy are in scope? | No contract or integration outline can be made executable without this. | Name provider, bucket policy, object identity, retention, and cleanup ownership. |
| 3 | Existing free-text evidence URL | Is the URL replaced, preserved for backward compatibility, or migrated? | Legacy-link behavior and report rendering cannot be assessed. | Define read/write behavior for legacy URLs and new attachments. |
| 4 | Upload during Run completion/abort risk | May an upload start or finish while the Run is transitioning to `passed`, `failed`, or `aborted`? | Race outcomes and state-transition assertions are otherwise undefined. | Specify allowed timing and the authoritative result when operations race. |
| 5 | Cross-workspace access risk | Which roles may attach, view, remove, or download evidence? | RBAC and tenant-isolation coverage cannot be reduced to authenticated access only. | Provide role-by-action matrix for viewer/member/admin/owner and PAT scopes. |
| 6 | “Screenshot” | Must the server validate file bytes, or only MIME/extension? Are SVG and animated formats allowed? | Extension spoofing and invalid-content cases have different outcomes. | Define accepted media types and content-sniffing requirement. |
| 7 | Max size risk | What is the exact byte limit, and is it per file, per step, per Run, or per request? | BVA cannot use a concrete boundary or expected status/error contract. | Define each quota and exact boundary behavior. |

### Gaps (missing info)

| # | Type | Why critical | What to add | Risk if omitted |
| --- | --- | --- | --- | --- |
| 1 | AC | No accepted AC text was available in the local evidence. | Reconcile Jira ACs and explicitly state success, failure, and persistence assertions before handoff. | QA may validate inferred behavior as if PO accepted it. |
| 2 | Technical detail | No upload endpoint, storage provider, or metadata schema is identified. | Add endpoint/contract, provider, object metadata, and transaction boundary. | Implementation and API coverage cannot be estimated reliably. |
| 3 | Business rule | No retention, deletion, replacement, or duplicate policy exists. | State whether attachments are immutable, removable, replaceable, or deduplicated. | Orphaned objects, unexpected evidence loss, or duplicate charges/storage. |
| 4 | AC | Error status, body shape, and user-facing message are absent. | Define exact error code/message for type, size, empty, invalid, unauthorized, unavailable, and partial failures. | Tests pass on the wrong error and operators cannot diagnose failures. |
| 5 | Technical detail | Existing Run state transitions are known, but upload transition interaction is not. | Define upload allowed states and atomicity at finish/abort. | Evidence can point to an incomplete or terminally inconsistent result. |

### Edge cases not in Story

| # | Scenario | Expected behavior (best guess) | Criticality | Action |
| --- | --- | --- | --- | --- |
| 1 | Zero-byte screenshot | Reject without creating metadata or storage object. ***NEEDS PO/DEV CONFIRMATION*** | High | Add to AC or confirm as negative outline. |
| 2 | Valid extension with invalid file bytes | Reject after content validation; no orphan object. ***NEEDS PO/DEV CONFIRMATION*** | High | Add validation rule and error contract. |
| 3 | File exactly at and just above the maximum | Accept at limit and reject above it. ***NEEDS PO/DEV CONFIRMATION*** | High | Define limit and BVA cases. |
| 4 | Upload interrupted after object creation but before metadata commit | Remove or quarantine the orphan object and return a retryable error. ***NEEDS PO/DEV CONFIRMATION*** | High | Define rollback ownership and observable state. |
| 5 | Same file submitted twice to the same step | Prevent duplicate attachment or explicitly retain two records. ***NEEDS PO/DEV CONFIRMATION*** | High | Decide idempotency/deduplication policy. |
| 6 | Two users upload concurrently to one step | Both valid attachments persist, or one request is rejected according to a concurrency rule. ***NEEDS PO/DEV CONFIRMATION*** | High | Define conflict and ordering behavior. |
| 7 | Upload completes while Run finish or abort commits | Attachment is either included consistently or rejected with no partial state. ***NEEDS PO/DEV CONFIRMATION*** | Critical | Add state-transition/race rule. |
| 8 | Member accesses an attachment through another Workspace or guessed object URL | Access is denied and no metadata/content leaks. ***NEEDS PO/DEV CONFIRMATION*** | Critical | Add tenant-isolation AC. |
| 9 | Auth session expires during upload | Upload fails safely and can be retried without duplicate object. ***NEEDS PO/DEV CONFIRMATION*** | High | Define session/error behavior. |
| 10 | Pasted external URL is supplied instead of a file | Reject, retain as legacy URL, or import content according to an explicit rule. ***NEEDS PO/DEV CONFIRMATION*** | Medium | Clarify URL compatibility. |

### Contradictions

The description identifies one free-text evidence URL as the current model, while the requested capability is attachment storage. This is a migration/compatibility decision, not yet a contradiction because no accepted AC text is locally available. Parent Epic and team-discussion evidence are also absent locally; both are Discovery Gaps, not assumed decisions.

### Testability validation

***Verdict***: No

Issues blocking a testable contract:

- Accepted AC text is not available in local evidence.
- Provider, bucket, endpoint, object metadata, and attachment persistence model are unspecified.
- Exact file-size and media-type limits are missing.
- Exact status codes, error body, and UI messages are missing.
- Role and PAT-scope permissions are not mapped per action.
- Partial-upload rollback, retry, idempotency, and concurrency behavior are missing.
- Run finish/abort interaction is not defined.
- Browser E2E route/selector and accessibility expectations are unverified.

---

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

## Phase 4 — Test Outlines (outline names only)

### Coverage estimate

| Type | Count | Notes |
| --- | --- | --- |
| Positive | 2 | Valid attachment in running state and successful report visibility. |
| Negative | 6 | Invalid type/content, unauthorized mutation/access, terminal mutation, and URL policy. |
| Boundary | 3 | Exact size limit, one byte over, and zero-byte input. |
| Integration | 4 | Client/API, API/storage, metadata persistence, and report/history readback. |
| API | 4 | Upload/mutation contract, readback, authorization, and error envelope. |
| ***Total**** | ****19*** | Outline estimate; final count depends on confirmed limits, roles, and provider contract. |

***Rationale***: This is a high-risk storage and execution-lifecycle change with critical tenant-boundary and data-integrity concerns. EP is required for valid and distinct invalid file classes, BVA is required for size limits, State-Transition is required for running versus terminal Runs, Decision Table is required for role x Run state, and Error Guessing is required for retry, partial upload, and concurrency anomalies. API counts are shown separately from the total outline estimate because API-level assertions may support the same business outline.

### Derivation record

- ***EP***: valid screenshot; unsupported type; malformed content; empty content; pasted URL; missing file.
- ***BVA***: confirmed maximum minus one, exactly maximum, maximum plus one; zero-byte boundary.
- ***State-Transition***: upload in `running`; reject in `passed`, `failed`, and `aborted`; race with finish/abort.
- ***Decision Table***: viewer/member/admin/owner or PAT scope x Run state x action (attach/view/remove).
- ***Error Guessing***: retry, duplicate submission, timeout, partial commit, stale session, guessed object URL, and concurrent uploads.
- ***Pairwise***: N/A at this stage; browser, locale, and execution-mode values are not sufficiently specified as three independent factors.

### Outline list (NAMES ONLY — preconditions in 1 line, expected in 1 line)

#### Positive

- ***Should attach an accepted screenshot to the selected Run step result*** — Pre: authorized user, `running` Run, mutable step result. Expected: attachment metadata and step report association persist.
- ***Should display persisted step evidence in the Run report after successful attachment*** — Pre: completed upload associated with one Run Step. Expected: report shows the same attachment without cross-step or cross-Workspace leakage.

#### Negative

- ***Should reject an unsupported screenshot type without creating an attachment*** — Pre: authorized user, `running` Run, disallowed media. Expected: confirmed validation error and no durable state.
- ***Should reject malformed screenshot bytes with an accepted declared type*** — Pre: authorized user, `running` Run, invalid content. Expected: confirmed content-validation error and no orphan object.
- ***Should deny evidence mutation for a viewer role*** — Pre: viewer can read but cannot mutate the Run. Expected: confirmed authorization error and unchanged state.
- ***Should deny attachment access across Workspace boundaries*** — Pre: member of another Workspace with a guessed identifier. Expected: non-disclosing authorization/not-found response.
- ***Should reject evidence mutation after a terminal Run state*** — Pre: Run is `passed`, `failed`, or `aborted`. Expected: confirmed state error and unchanged report.
- ***Should reject a pasted external evidence URL when file-only evidence is required*** — Pre: authorized user, `running` Run, URL supplied instead of file. Expected: confirmed input-policy error or explicitly retained legacy behavior.

#### Boundary

- ***Should accept a valid screenshot exactly at the confirmed maximum file size*** — Pre: valid file at inclusive limit. Expected: one accepted attachment.
- ***Should reject a valid screenshot one byte above the confirmed maximum file size*** — Pre: valid file above limit. Expected: size error before inconsistent persistence.
- ***Should reject a zero-byte screenshot*** — Pre: empty file and `running` Run. Expected: validation error and no object or metadata.

#### Integration

- ***Should persist an accepted upload through the client-to-API-to-storage path*** — Pre: provider and API contract configured. Expected: content and metadata remain linked to the selected Run Step.
- ***Should roll back storage when attachment metadata persistence fails*** — Pre: storage succeeds while metadata commit is forced to fail. Expected: no orphan object and retryable/error outcome per confirmed policy.
- ***Should preserve step evidence in report and history readback*** — Pre: attachment persisted before report generation. Expected: report/history expose the same step association and metadata.
- ***Should resolve concurrent upload and Run terminalization without partial evidence*** — Pre: upload overlaps finish or abort. Expected: confirmed serialization outcome with consistent Run state and report.

> API outline support: upload/mutation contract, attachment readback, RBAC/tenant denial, and validation error envelope are API-level assertions across the named business outlines. No test data JSON, parametrization table, numbered steps, Faker recipe, or execution detail is included in this pre-sprint artifact.

---

## Phase 5 — Edge Cases (outline)

| # | Edge case | In original Story? | Criticality | Action |
| --- | --- | --- | --- | --- |
| 1 | Zero-byte file | Yes, risk listed | High | Confirm expected rejection and error contract. ***NEEDS PO/DEV CONFIRMATION*** |
| 2 | Extension/MIME mismatch or invalid bytes | Yes, risk listed | High | Define content validation. ***NEEDS PO/DEV CONFIRMATION*** |
| 3 | Exact max and max+1 size | Yes, max-size risk listed; limit absent | High | Define numeric limit and inclusive rule. ***NEEDS PO/DEV CONFIRMATION*** |
| 4 | Duplicate attachment | Yes, risk listed | High | Define idempotency/deduplication. ***NEEDS PO/DEV CONFIRMATION*** |
| 5 | Pasted external link | Yes, risk listed | Medium | Define legacy URL compatibility. ***NEEDS PO/DEV CONFIRMATION*** |
| 6 | Partial upload / orphan object | Yes, risk listed | Critical | Define transaction and cleanup ownership. ***NEEDS PO/DEV CONFIRMATION*** |
| 7 | Upload during finish | Yes, risk listed | Critical | Define state serialization. ***NEEDS PO/DEV CONFIRMATION*** |
| 8 | Upload during abort | Yes, risk listed | Critical | Define state serialization. ***NEEDS PO/DEV CONFIRMATION*** |
| 9 | Cross-Workspace content request | Yes, risk listed | Critical | Add explicit non-disclosure assertion. ***NEEDS PO/DEV CONFIRMATION*** |
| 10 | Concurrent uploads | Yes, risk listed | High | Define ordering/conflict/idempotency rule. ***NEEDS PO/DEV CONFIRMATION*** |
| 11 | Expired session during upload | No | High | Add negative outline if session behavior is not inherited. ***NEEDS PO/DEV CONFIRMATION*** |
| 12 | Storage provider timeout | No | High | Define retryability and user-visible state. ***NEEDS PO/DEV CONFIRMATION*** |

> Test-data generation strategy and Faker recipes are deferred to in-sprint planning.

---

## Story Quality Assessment

***Verdict***: Significant Issues

***Key findings***:

- The local evidence does not contain accepted AC text or a verifiable parent Epic; Jira reconciliation is required before handoff.
- Storage provider, endpoint, limits, permissions, persistence model, and rollback contract are missing.
- The Story covers a critical execution-evidence path where partial state or cross-Workspace exposure would invalidate QA evidence.

---

## Critical Questions for PO

> These BLOCK sprint planning until answered.

1. ***What is the accepted scope and cardinality of step-result screenshots?***
2. ***What exact file policy applies?***
3. ***What behavior is required when upload overlaps Run finish or abort?***

---

## Technical Questions for Dev

1. ***Which storage provider, bucket, object-key format, and metadata schema will be implemented?**** This blocks API and integration contract assertions. ****NEEDS PO/DEV CONFIRMATION***
2. ***Will upload and Run Step metadata commit be atomic, compensating, or asynchronous?**** This determines orphan cleanup and retry coverage. ****NEEDS PO/DEV CONFIRMATION***
3. ***Where are authorization checks enforced for attach, read, download, and remove?**** Confirm handler, storage policy, and RLS responsibilities. ****NEEDS PO/DEV CONFIRMATION***
4. ***How will the implementation preserve tenant isolation for direct object URLs?**** A signed URL, proxy, or other access mechanism must not bypass Workspace checks. ****NEEDS PO/DEV CONFIRMATION***
5. ***What is the authoritative API contract for step-result evidence?**** Add route, request/response schema, status codes, error codes, and retry/idempotency semantics. ****NEEDS PO/DEV CONFIRMATION***

---

## Suggested Story Improvements

| # | Current state | Suggested change | Benefit |
| --- | --- | --- | --- |
| 1 | Parent Epic and accepted ACs are not locally verifiable | Reconcile Jira parent and copy only through the read-only sync before handoff | Prevents incorrect ownership and invented acceptance scope |
| 2 | “Attach a screenshot” has no cardinality or lifecycle rule | State attach/view/remove behavior and legacy URL compatibility | Makes persistence and report assertions testable |
| 3 | File policy is a risk list, not a contract | Add accepted types, byte limits, zero-byte/content validation, and exact errors | Enables EP and BVA with objective outcomes |
| 4 | Storage foundation is unnamed | Specify provider, bucket, object metadata, access model, retention, and cleanup | Makes implementation and integration scope estimable |
| 5 | Run finish/abort races are only noted as risks | Define allowed states and atomic outcome for concurrent operations | Protects execution evidence integrity |
| 6 | Role access is not mapped | Add attach/read/remove matrix for viewer/member/admin/owner and PAT scopes | Prevents privilege escalation and tenant leakage |

---

## Data feasibility flags

***DATA-FEASIBILITY-RISK******:****** High***

- ***Entity / fixture missing***: No attachment entity, Run Step attachment relation, or object-storage fixture is evidenced. Existing Run/Run Step snapshot data is documented, but live schema and seed/reset procedures are unverified.
- ***API contract gap***: The business API map documents Run start but not the evidence upload, attachment readback, removal, signed URL, or cleanup endpoints.
- ***Required pre-work***: Dev must define the storage and metadata contract; QA needs isolated Workspace/Run/Run Step fixtures, authorized role variants, cross-Workspace records, and controlled storage failure/race seams before execution planning.
- ***Blocker****: Critical attachment persistence and tenant-isolation scenarios have no confirmed data path until the above contract exists. ****NEEDS PO/DEV CONFIRMATION***

---

## Recommended testing strategy

### Pre-implementation

- Reconcile the parent Epic and accepted ACs from Jira through the canonical sync.
- Resolve provider, API, metadata, permissions, limits, retention, and failure semantics.
- Define a contract test seam for storage success, timeout, and partial persistence without relying on live production storage.

### During implementation

- Unit-test file partition and BVA validation, object-key/metadata invariants, idempotency, and Run-state guards.
- Integration/API-test authorization, RLS/tenant isolation, atomic or compensating persistence, error envelopes, and report readback.
- Add concurrency tests for duplicate upload and upload versus finish/abort.

### Post-implementation (in-sprint by `/sprint-testing`)

- Validate the refined ACs against the synced Jira source and expand these outlines with concrete data and numbered steps.
- Execute UI, API, and DB checks in isolated staging data; verify report/history consistency and cleanup after induced failures.
- Run focused accessibility and responsive checks for the upload control and attachment presentation once the UI contract exists.

---

## Risks & mitigation

| # | Risk | Likelihood | Impact | Mitigated by which outlines |
| --- | --- | --- | --- | --- |
| 1 | Cross-Workspace attachment disclosure | Medium | Critical | A2, integration storage/readback |
| 2 | Orphan storage object or metadata after partial failure | High | Critical | E2, storage rollback integration |
| 3 | Evidence attached to the wrong Run Step | Medium | Critical | P1, P2, API readback |
| 4 | Invalid or oversized content accepted | High | High | N1, N2, B1, B2, B3 |
| 5 | Duplicate evidence after retry/concurrency | High | High | E1, concurrent upload integration |
| 6 | Terminal Run report changes unexpectedly | Medium | Critical | S2, S3 |
| 7 | Legacy free-text URLs silently lost | Medium | High | URL policy negative outline and report readback |

---

## Next steps

- [ ] Resolve the parent Epic Discovery Gap before Jira handoff.
- [ ] Reconcile and sync the accepted AC text for `BK-593`; do not treat proposed scenarios as accepted.
- [ ] PO answers Critical Questions before sprint planning.
- [ ] Dev answers Technical Questions before estimation.
- [ ] Define storage/API/data fixtures and remove the DATA-FEASIBILITY-RISK blocker.
- [ ] Story enters sprint only after scope is estimable and confirmed.
- [ ] When the Story reaches `Ready For QA`, run `/sprint-testing` to expand these outlines into executable planning.

---
_Synced from Jira by sync-jira-issues_
