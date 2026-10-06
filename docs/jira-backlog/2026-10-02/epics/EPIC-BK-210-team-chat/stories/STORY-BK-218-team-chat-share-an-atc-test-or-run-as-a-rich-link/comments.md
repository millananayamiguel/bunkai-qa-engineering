# Comments for BK-218

[View in Jira](https://jira.upexgalaxy.com/browse/BK-218)

---

### Ely - 2026-07-30 16:29 UTC

Mockup — Team Chat — ATC/Test/Run rich cards. Source: .context/designs/bunkai-test-management-tool/bk-210-team-chat/chat-entity-rich-link.html · spec: master-design-plan §4.14



---

### Miguel Millan - 2026-09-28 11:22 UTC

## AI Product Owner — Decision: Rich-link status terminology

### Alternatives scored

Scores use a 1–5 scale; higher is better. Totals are unweighted sums out of 25.

| Option | Product value | Domain consistency | Implementation cost | Reversibility | Information-disclosure risk | Total |
| --- | --- | --- | --- | --- | --- | --- |
| A. Use one shared “workflow status” lifecycle for ATCs and Tests, including “Ready” | 2 | 1 | 1 | 3 | 4 | 11/25 |
| B. Use each entity’s established state: ATC Execution Status; Test Automation Status; Run outcome/status | 5 | 5 | 4 | 5 | 5 | 24/25 |
| C. Show latest execution outcome for both ATC and Test | 4 | 4 | 3 | 4 | 5 | 20/25 |
| D. Omit state from ATC and Test cards; show title only | 2 | 5 | 5 | 5 | 5 | 22/25 |

### Decision

Choose ***Option B***. Do not use “workflow status” for ATCs or Tests, and do not present “Ready” as an ATC lifecycle state.

- ***ATC card******:**** show the ATC’s ****Execution Status*** using the existing execution-status vocabulary (`pass`, `fail`, `blocked`, `skipped`, `running`, `unrun`); never imply a draft/ready/automated lifecycle.
- ***Test card******:**** show ****Automation Status*** (`manual-only`, `candidate`, `automated`). This is the product’s per-Test automation classification, not the methodology’s TC Workflow Status and not the latest Run result.
- ***Run card******:*** show that Run’s own outcome/status, separate from the Test’s Automation Status.
- Preserve the existing permission boundary: unauthorized readers see the neutral restricted placeholder without entity title or state. Deleted references remain inert placeholders.

### Rationale

The canonical domain glossary says there is no ATC documentation-maturity lifecycle and defines `status_dot` as an execution-status presentation term. It separately defines Automation Status as the simple, persistent Test attribute and distinguishes it from per-execution outcomes. The design brief asks for the Run’s verdict and the ATC’s status, while the rich-link mockup’s “Ready” example conflicts with the glossary and should not establish a new lifecycle. Option B keeps the card informative without conflating authorship maturity, automation classification, and execution evidence. It also leaves the restricted placeholder behavior intact, avoiding new disclosure.

### Remaining technical question

Confirm the data source and derivation for an ATC’s Execution Status in the rich-link read path (including which applicable Run/ATC result wins when there are several). The glossary establishes the vocabulary but does not define that selection rule. This does not change the terminology decision.

---

### Miguel Millan - 2026-09-28 11:57 UTC

## AI Tech Lead — Decision: ATC execution status source

### Alternatives scored

Scores are 1–5; higher is better. Totals are unweighted sums out of 25. For implementation cost, higher means cheaper; for information-disclosure/security risk, higher means safer/lower risk.

| Option | Product value | Precedent consistency | Implementation cost | Reversibility | Security / data-integrity safety | Total |
| --- | --- | --- | --- | --- | --- | --- |
| A. Read `atcs.status` directly | 1 | 1 | 5 | 4 | 1 | 12/25 |
| B. Resolve the latest `run_atcs` position for the ATC | 5 | 5 | 4 | 5 | 4 | 23/25 |
| C. Aggregate/worst-case status across all Tests and Runs | 3 | 2 | 2 | 3 | 2 | 12/25 |
| D. Show no status until a dedicated ATC status model exists | 2 | 3 | 5 | 5 | 5 | 20/25 |

### Selected rule

Choose ***Option B***. ATC Execution Status is a point-in-time projection from the latest `run_atcs` position referencing that ATC, not a persisted field on `atcs` and not an aggregate over its execution history.

1. Scope candidate rows to the ATC's authorized Project and `run*atcs.atc*id`.
2. Select newest parent Run by `runs.started*at DESC`, then `runs.id DESC`; if the same ATC occurs more than once in that Run, select the last chain position by `run*atcs.position DESC`, then `run_atcs.id DESC`.
3. Render `running` while the selected Run is `running`; otherwise map the selected position status: `pending` → `unrun`, `passed` → `pass`, `failed` → `fail`, `blocked` → `blocked`, `skipped` → `skipped`.
4. If no position exists, render `unrun`. Do not infer status from ATC edits, Test Automation Status, or older Runs.

### Evidence and rationale

- `supabase/migrations/0050*project*coverage*report*real*execution*source.sql` documents `atcs.status` as stale: it defaults to `unrun`, is never written by production paths, and the established execution source is `run*atcs.status`. Its `atc*real*status` CTE selects the most recent Run by `runs.started*at DESC` and uses a stable row tiebreak.
- `supabase/migrations/0037*run*finish.sql` explicitly states `atcs.status` is never touched; it closes `runs`, skips remaining pending positions, and preserves recorded position results.
- `supabase/migrations/0031*runs.sql` defines the separate Run and position enums and workspace-member RLS on `run*atcs`; `supabase/migrations/0042*run*step_mark.sql` derives each position status from its step results.
- `supabase/migrations/0068*story*traceability_report.sql` establishes “most recently started Run” semantics, includes an in-flight Run as latest, and orders ties deterministically by Run id. `components/traceability/TraceabilityChainView.tsx` renders the resolved latest-run state, including the no-run placeholder.
- `supabase/migrations/0050*project*coverage*report*real*execution*source.sql` also demonstrates the safe read boundary: bind the actor, resolve the Project, re-check workspace read membership, scope rows to the Project, and return a non-disclosing not-found outcome. The future rich-link resolver must enforce equivalent channel/project authorization before returning title or status; unauthorized references remain the neutral restricted placeholder.
- The glossary's ATC Execution Status vocabulary is `pass | fail | blocked | skipped | running | unrun`; its distinct Run/position grain split means `aborted` is a Run outcome, not an ATC position status.

### Residual dependency / precondition

BK-215 is the prerequisite for this story per `.context/dev-roadmap.md`'s BK-210 dependency graph, and Team Chat has no shipped read path yet. BK-218 implementation must add a permission-checked rich-link resolver and apply the rule above. Separately, a repository search found no persisted `automation_status` field or implementation for the Product Owner's Test-card contract; Test Automation Status needs an explicit schema/read-path implementation before Test cards can display it. This decision does not authorize a fallback to `atcs.status` or a Test's latest Run for that missing Test attribute.

---

### Miguel Millan - 2026-09-28 12:10 UTC

## AI Tech Lead — Decision: Run-card outcome source

### Alternatives scored

Scores are 1–5; higher is better. For implementation cost, 5 means cheaper; for safety, 5 means safer/lower risk. Totals are unweighted out of 25.

| Option | Product value | Precedent consistency | Implementation cost | Reversibility | Safety / grain integrity | Total |
| --- | --- | --- | --- | --- | --- | --- |
| A. Run card shows only persisted runs.status; child positions remain on Run detail | 5 | 5 | 5 | 5 | 5 | 25/25 |
| B. Run card shows runs.status plus a blocked-child indicator/count; details show positions | 4 | 3 | 3 | 4 | 3 | 17/25 |
| C. Promote any blocked run_atcs.status to a blocked whole-Run card outcome | 3 | 1 | 3 | 2 | 1 | 10/25 |
| D. Derive the whole-Run outcome by aggregating run_atcs statuses | 3 | 2 | 2 | 3 | 2 | 12/25 |

### Decision and mapping

Select Option A: the Run card outcome source is runs.status only. Use existing persisted literals without inventing or coercing enum values: running → running; passed → passed; failed → failed; aborted → aborted. A blocked child position does not change the Run outcome. Show position-level blocked status only on the separate Run detail surface, where it remains explicitly a position result. Do not add blocked to runs.status or map blocked to failed/aborted.

The Product Owner's landed decision says the Run card shows that Run's own outcome/status, separate from Test Automation Status. This contract is compatible with that decision. Product label remains unresolved: the story's existing Run-card AC says “verdict PASS”, while the database literal is passed. Until product copy is resolved, preserve the persisted value in the technical contract; do not silently choose a new display label.

### Evidence

- supabase/migrations/0031_runs.sql, runs.status CHECK: running | passed | failed | aborted (lines 72–80). It does not include blocked.
- supabase/migrations/0031*runs.sql, run*atcs.status CHECK: pending | passed | failed | blocked | skipped (lines 120–128); this is per chain position.
- supabase/migrations/0042*run*step*mark.sql, lines 73–80 and 158–176: run*atcs status is derived from its run_steps; pending remains pending until the last pending step resolves, then failed overrides blocked, blocked precedes passed.
- supabase/migrations/0037*run*finish.sql, lines 39–51 and 92–118: finish accepts only passed/failed, persists that whole-Run verdict, skips pending child steps/positions, and preserves recorded position outcomes.
- supabase/migrations/0036*run*abort.sql, lines 129–141 and 175–206: abort persists aborted at Run grain, skips pending child steps/positions, and preserves recorded results.
- .context/business/domain-glossary.md §3, Run-status grain split: blocked exists at position grain, not Run grain; aborted is Run-only.
- BK-218's current Run AC (synced acceptance-criteria.md): says verdict PASS; that conflicts with the persisted literal passed and must not be used to expand the schema enum.

### Implementation prerequisite

The existing BK-218 AC uses “PASS” where the run schema stores passed; product/UI label needs an explicit resolution. The rich-link implementation must read the authorized Run's persisted runs.status for the card and expose run_atcs.status only on the Run detail surface, retaining the existing permission boundary. No schema change is needed for this outcome contract.

---

### Miguel Millan - 2026-09-28 12:10 UTC

## AI Product Owner — Decision: Run-card status grain

### Alternatives scored

Scores use a 1–5 scale; higher is better. For implementation cost and risk, higher means cheaper and safer/lower risk. Totals are unweighted sums out of 25.

| Option | Product value | Precedent consistency | Implementation cost | Reversibility | Risk | Total |
| --- | --- | --- | --- | --- | --- | --- |
| A. Show only persisted Run-level status; show blocked positions separately as position detail | 5 | 5 | 5 | 5 | 5 | 25/25 |
| B. Derive an overall BLOCKED Run outcome from run_atcs | 4 | 2 | 2 | 3 | 3 | 14/25 |
| C. Show the latest position state as the Run-card verdict | 2 | 1 | 4 | 4 | 3 | 14/25 |
| D. Omit blocked position information from the Run card entirely | 2 | 4 | 5 | 5 | 4 | 20/25 |

### Selected decision

Choose Option A. A Run card displays the referenced Run’s own persisted runs.status only: Running, Passed, Failed, or Aborted. It never displays BLOCKED as the Run verdict and does not derive a new Run outcome from child positions.

ABORTED is a Run-grain terminal outcome: display Aborted when runs.status = aborted, regardless of any preserved earlier position results. BLOCKED is a position-grain outcome: run_atcs.status = blocked means that one chain position was blocked and is displayed only as position detail, clearly labelled with that position/ATC. It does not convert the Run to BLOCKED. No new database value is introduced.

### Consequences for BK-218

Update the business rule that currently lists Run verdicts PASS/FAIL/ABORTED/BLOCKED: the Run card must use only the persisted Run-level state set running | passed | failed | aborted (with user-facing labels Running | Passed | Failed | Aborted). Amend the Run-card acceptance criteria to exclude BLOCKED from its verdict and, if position detail is in scope, describe it as separately labelled run_atcs detail, not the Run status. The card continues to show the Test name and environment and retains existing permission and deleted-entity behavior. This is an AI Product Owner decision, not human PO approval.

### Rationale

The domain glossary explicitly separates runs.status (running | passed | failed | aborted) from run_atcs.status (pending | passed | failed | blocked | skipped), and the migrations enforce those distinct CHECK constraints. The finish and abort procedures update the Run header while retaining already-recorded blocked positions; a blocked position therefore cannot be treated as a persisted Run verdict. Showing the Run-level state is deterministic, directly reflects stored data, and preserves useful blocked-position evidence without conflating entity grains.

---

### Miguel Millan - 2026-09-28 16:01 UTC

## AI Product Owner — Decision: Malformed and missing rich links

### Alternatives scored

Scores are 1–5; higher is better. Implementation cost scores higher when cheaper; risk scores higher when safer/lower risk. Totals are unweighted sums out of 25.

| Option | Product value | Precedent consistency | Implementation cost | Reversibility | Safety / disclosure risk | Total |
| --- | --- | --- | --- | --- | --- | --- |
| A. Leave malformed syntax as ordinary message text; render valid supported IDs that are missing/archived as the existing inert unavailable placeholder | 5 | 5 | 5 | 5 | 5 | 25/25 |
| B. Render both malformed and valid-missing references as unavailable placeholders | 3 | 2 | 4 | 4 | 4 | 17/25 |
| C. Reject malformed references at send time and show a generic resolver-error state for valid IDs that cannot be resolved | 2 | 1 | 2 | 3 | 2 | 10/25 |

### Selected behavior

Choose Option A.

- If reference syntax cannot be parsed into a supported entity type and identifier, do not call the entity resolver and do not create a card. Preserve the original text in the message, like an unsupported entity reference or external URL; surrounding message content remains intact.
- If syntax is valid for a supported ATC, Test, or Run reference, resolve it at render time. If the entity is absent or (for entities covered by FR-039) archived, render the existing inert “No longer available” placeholder. Do not show stale title/state, a destination, or resolver/error details.
- Apply authorization before returning entity details. A reference the reader cannot access renders the existing neutral restricted placeholder, with no title/state. Do not distinguish authorization failures by exposing resolver errors or entity details.
- Unsupported entity types and arbitrary external URLs remain ordinary links, with no rich preview.

### Rationale and scope impact

This preserves the established contract: only supported ATC/Test/Run references become cards; unsupported links stay plain; inaccessible entities get a non-disclosing restricted placeholder; deleted/archived available entities get an inert unavailable placeholder; and cards use current state when rendered. Treating malformed syntax as plain text avoids inventing a new error surface, prevents parser failures from breaking chat history, and matches unsupported-reference behavior. Valid-but-missing is a lifecycle outcome, not malformed input, so it belongs with the existing unavailable placeholder. This clarifies edge-case behavior without expanding the existing BK-218 feature scope or changing its supported entity set.

This is an AI Product Owner decision, not human approval.

---

### Miguel Millan - 2026-09-28 16:17 UTC

## Acceptance Test Plan (ATP) — ready for pre-sprint review

The pre-sprint ATP and refined coverage outlines are published in the Acceptance Test Plan field on BK-218.

Please review the technical feasibility notes, especially the missing Test Automation Status source and the BK-215 channel/message dependency. The issue is ready for estimation at 5 Story Points; this AI-generated refinement is not human PO or Dev sign-off.

Refined on: 2026-09-28 — QA Shift-Left session.
When the Story reaches Ready For QA, run `/sprint-testing`; Stage 1 will validate this refinement and materialize the in-sprint ATP.

---

### Miguel Millan - 2026-09-28 20:24 UTC

## AI Product Owner — Decision: BK-218 Story Points review

### Scoring criteria

Each criterion is scored 1–5; higher is better. Scores are equally weighted and summed out of 20.

- Product-scope fit: how well the point value covers the refined feature without bundling unrelated foundations.
- Dependency/readiness risk: how manageable the estimate is given prerequisites; a low score reflects exposure to an unshipped hard dependency.
- Implementation uncertainty: how well the estimate accounts for missing data/read paths and unresolved integration work; higher means lower uncertainty.
- Reversibility: how safely the estimate can be revisited before implementation if assumptions change.

| Candidate | Product-scope fit | Dependency/readiness risk | Implementation uncertainty | Reversibility | Total |
| --- | --- | --- | --- | --- | --- |
| 5 SP — retain as conditional | 3 | 2 | 2 | 5 | 12/20 |
| 8 SP — recommended | 5 | 2 | 3 | 5 | 15/20 |
| 13 SP — foundational expansion | 4 | 2 | 2 | 3 | 11/20 |

### Recommendation

Recommend ***8 Story Points*** for BK-218. This is an AI Product Owner recommendation for estimation review only. It is not human PO or Dev approval, and it does not change the current Jira estimate of 5 SP.

The refined scope is a focused but cross-cutting rich-link capability: render and navigate ATC, Test, and Run cards; project each entity's distinct approved status; insert references from a keyboard-accessible picker; preserve surrounding message text; distinguish malformed, unsupported, missing/archived, and inaccessible references; and enforce permissions before disclosing entity details. The ATC status also needs a deterministic latest-Run/position projection. These requirements support 8 SP over 5 SP, while the existing entity models and mockup keep 13 SP unjustified unless additional foundational work is folded into this Story.

The 30 Acceptance Test Plan outlines are coverage descriptions, not development tasks or a proxy for engineering effort; they are not used as a point-count conversion.

### Dependency and assumptions

BK-215 is an explicit hard prerequisite for the channel/message foundation and is currently 8 SP / Ready For Dev in Jira. That workflow status is not evidence it has shipped: the dev roadmap records BK-215 as the hard gate, and the design plan describes Team Chat as not built. Do not start BK-218 integration until BK-215 is delivered.

The 8-SP recommendation assumes BK-215 supplies durable channel/message primitives, and BK-218 adds only its own entity resolver, picker, and card rendering. It also assumes the Test Automation Status source can be added as a bounded pre-work item or a small persisted/read-path change, and that no broader chat infrastructure or unrelated entity-model redesign is charged to BK-218. Revisit sizing before implementation if those assumptions fail. Because implementation has not started and the estimate is easy to reconsider, the assessment is reversible.

### Evidence

- BK-218 refined Acceptance Criteria and business rules: three entity-specific state contracts, authorization-safe restricted placeholders, unavailable placeholders, picker insertion, multiple references, and render-time freshness.
- BK-218 refinement identifies the missing persisted Test Automation Status source and resolver/picker read path; it explicitly says not to substitute latest Run status.
- BK-218 comments 12975–12979 establish the canonical entity-state and malformed/missing-reference decisions.
- BK-215 is BK-218's hard dependency per `.context/dev-roadmap.md` §3.1; BK-13, BK-24, and BK-30 provide supporting entity data.
- `.context/design/master-design-plan.md` §4.14 and the Team Chat design brief provide the card/picker design; the mockup reduces UI uncertainty but is not shipped implementation.
- BK-215 is 8 SP / Ready For Dev. Sibling estimates currently available are BK-219 at 5 SP / Ready For Dev; BK-216, BK-217, and BK-220 have no points set. Sibling estimates are context, not a sizing formula.

The recommendation is to assess 8 SP while leaving Jira Story Points, acceptance criteria, ATP, labels, assignee, and workflow status unchanged.

---

### Miguel Millan - 2026-09-28 20:33 UTC

## AI Tech Lead — Decision: BK-218 implementation sizing

### Scoring

Scores are 1–5, equally weighted, total /20. Higher means better fit to the estimate with more code reuse, lower integration/schema risk, and greater reversibility. Integration and data scores are higher when complexity/uncertainty is lower.

| Candidate | Code readiness / reuse | Integration and permission complexity | Data/schema certainty | Reversibility | Total |
| --- | --- | --- | --- | --- | --- |
| 5 SP | 3 | 2 | 2 | 5 | 12/20 |
| 8 SP | 4 | 3 | 3 | 5 | 15/20 |
| 13 SP | 3 | 2 | 2 | 3 | 10/20 |

### Recommendation

Recommend ***8 Story Points*** for BK-218 implementation, conditional on BK-215 shipping first. This is an AI Tech Lead sizing recommendation, not human approval. BK-218 is currently recorded at 5 SP; this comment does not update Story Points or workflow status.

### Evidence and scope boundary

The target currently has ***no shipped Team Chat route, channel/message persistence, or rich-link resolver/picker***. `.context/design/master-design-plan.md` §1 and §4.14 mark Team Chat as unbuilt; `chat-entity-rich-link.html` and `BRIEF.md` are design references, not implementation. BK-215 is a hard dependency: its channel and durable message foundation must ship before BK-218 integration begins. Jira currently shows BK-215 at 8 SP / Ready For Dev; that status is not evidence it has shipped.

BK-218 can reuse existing entity data and read conventions rather than recreate those domains:

- Runs: `app/api/v1/runs/[id]/route.ts`, `lib/runs/`, and `supabase/migrations/0031_runs.sql` expose persisted `runs.status`, environment, and per-position snapshot data. The card must use Run status only.
- Tests: `app/api/v1/tests/[id]/route.ts`, `lib/tests/load-test-detail.ts`, and `supabase/migrations/0024_tests.sql` provide existing Test reads and access patterns.
- ATCs and execution projection: existing ATC detail/read code plus `run*atcs` and the deterministic latest-run projection precedent in `supabase/migrations/0050*project*coverage*report*real*execution*source.sql` and `0068*story*traceability*report.sql` support the approved ATC status rule. Do not read stale `atcs.status`.
- Authorization: the API gateway, project/workspace membership checks, and RLS/RPC non-disclosure patterns are reusable precedents, but the new resolver and picker still need to enforce channel visibility and referenced-Project access before returning entity details.
- Chat references, composer picker, card rendering, navigation, and restricted/unavailable states are greenfield. Message text/reference persistence should use BK-215's delivered message contract; resolve valid references at render time so current state and deleted/archived placeholders work without a second snapshot store.

One material data gap remains: repository search found no persisted/readable Test Automation Status (`manual-only | candidate | automated`) in `app/`, `lib/`, or `supabase/migrations/`. A Test card cannot ship its approved contract without a small authorized source for that value, and latest Run status is not an acceptable substitute. ATC and Run sources already exist; Test Automation Status is the bounded schema/read-path uncertainty that makes 5 SP too optimistic. The 30 ATP outlines describe coverage, not a direct point conversion.

### Dependency gate and assumptions

The 8-SP estimate assumes BK-215 provides a durable message/channel API and permission model, BK-218 adds only a bounded persisted Test Automation Status source plus its authorized resolver/read, and no broader chat infrastructure or entity-model redesign is charged to this story. Include regression coverage for parser/picker behavior, status projection, inaccessible and missing/archived entities, and authorized navigation. Reassess at 13 SP before implementation if BK-215 lacks the assumed primitives or the Test status requirement expands beyond a bounded field/read path. Keep current Jira Story Points, status, labels, AC/ATP fields, and assignee unchanged.

***Attribution******:*** AI Tech Lead assessment generated by the OpenCode agent; not human sign-off.

---

### Miguel Millan - 2026-10-01 21:25 UTC

# PO perspective — AI role simulation / recommendations

I am answering in the simulated Product Owner role for this quality-engineering exercise, using the product requirements and current implementation evidence. This is an AI PO assessment, not a human PO identity or sign-off. The recommendations below do not silently amend the acceptance criteria, estimate, or workflow.

## What Shift-Left delivered for Product

BK-218 now describes a clear customer outcome: Elena shares QA evidence without screenshots or bare-ID handoffs; Sara understands the referenced work; Mateo receives trustworthy quality context. We preserved 14 acceptance scenarios and 30 coverage outlines. These are planned coverage, not executed tests or proof of delivery. We exposed missing prerequisites before implementation and found stale Business Rules/Scope text that contradicts the refined status contract.

## Product answers

***What information should each card convey?*** Preserve decisions 12975–12979: ATC Execution Status, Test Automation Status, and persisted Run-level status are different meanings. A failed execution must not make an automated Test appear manual; a blocked ATC position must not become a Run verdict. Keep the approved malformed, unsupported, unavailable, restricted, and render-time freshness behavior. No reopening of those decisions is needed.

***What takes precedence when collaboration conflicts with privacy?*** Privacy. Channel visibility alone cannot authorize entity metadata. Cards and picker results must disclose no inaccessible title, identifier, Project, environment, state, or count. If authorization cannot be established, disclose nothing; never use cached details or a permissive fallback. This preserves the reviewed acceptance contract rather than expanding it.

***How should workspace-scoped Tests satisfy the Project boundary?*** Current code confirms Tests have workspace-level membership semantics and Project is route/environment context; it does not establish the rich-link permission mapping. My recommendation is Option A below, pending the joint Dev integration contract. Scores are 1–5 (higher is better), summed equally; these are reasoned judgments, not measured results.

| Policy | User value | Existing-model fit | Low implementation cost | Reversibility | Disclosure safety | Total |
| --- | --- | --- | --- | --- | --- | --- |
| A. Reuse the authorized workspace Test read plus an explicit server-validated reference Project context and channel gate | 5 | 5 | 4 | 5 | 5 | 24 |
| B. Treat workspace membership alone as sufficient for Test cards | 4 | 4 | 5 | 5 | 1 | 19 |
| C. Redesign Tests as Project-owned entities | 3 | 1 | 1 | 2 | 4 | 11 |

A preserves the current model and reviewed privacy promise. Dev must specify the authoritative context binding and deny missing/invalid context before returning metadata. It must not fabricate a Test-to-Project ownership relation. This recommendation does not claim that binding already exists.

***Is the story ready to deliver?*** Ready For Dev is a planning status. BK-215 must deliver durable channel/message primitives; Test Automation Status needs a persisted, authorized source; the resolver/picker must implement the access contract. Preserve the recorded 5 SP; earlier conditional 8-SP recommendations remain recommendations, not approved changes. Do not add mentions, search, moderation, or mounted live updates.

## Evidence

BK-218 AC/ATP and comments 12975–12979; prior sizing comments 12985–12986. Target repository: `.context/PRD/executive-summary.md`, `user-personas.md`, `.context/business/domain-glossary.md`, `.context/design/master-design-plan.md` §4.14, `.context/dev-roadmap.md`; `lib/tests/load-test-detail.ts` lines 21–29 and 85–89. Sibling stories BK-215–BK-220 establish scope boundaries. No live application or database verification was performed.

---

### Miguel Millan - 2026-10-01 21:25 UTC

# DEV perspective — AI role simulation / recommendations

I am responding in the DEV / Tech Lead role for this quality-engineering exercise. This is an AI-authored, evidence-based recommendation, not approval by an actual developer or proof that the feature is implemented. Facts below are verified against the synced story and local source; proposals remain recommendations.

## What Shift-Left gives development

The refinement separates three state models that would otherwise create conflicting implementations: ATC execution, Test automation classification, and Run header outcome. It preserves 14 acceptance scenarios and 30 coverage outlines, identifies authorization boundaries before implementation, and distinguishes malformed input from inaccessible or unavailable entities. These are planning artifacts, not executed tests. I recommend correcting the stale Business Rules and Scope wording to match decisions 12975–12979. Keep the current 5 SP estimate; this exercise does not authorize 8 SP.

## My engineering answers

***1. How should Test access work?*** The existing Test reader explicitly treats Tests as workspace-scoped; Project is route/environment context, not a `tests.project_id`. I recommend requiring channel access, an independently authorized reference Project context in the same workspace, and the existing authorized Test read. Validate that association/context server-side before returning metadata; never trust an arbitrary client Project id. This resolves the proposed rich-link boundary without pretending Tests became Project-owned. PO/Dev should ratify this interpretation before encoding it as a new contract.

The following scores are recommendation judgments, not measured results. Higher is better; cost means lower implementation cost.

| Policy option | Value | Precedent | Cost | Reversibility | Safety | Total |
| --- | --- | --- | --- | --- | --- | --- |
| Authorized Project context + existing workspace Test read | 5 | 5 | 4 | 5 | 5 | 24/25 |
| Workspace Test read alone, ignoring the stated Project boundary | 3 | 4 | 5 | 5 | 2 | 19/25 |
| Redesign Tests as Project-owned for this feature | 3 | 1 | 1 | 2 | 3 | 10/25 |

***2. Where does Test Automation Status come from?*** The inspected Test reader, API directory and original Test migration contain no persisted `automation_status` source. Recommend delivering an explicit persisted, authorized read contract for `manual-only`, `candidate`, `automated`, including ownership of updates. The exact migration/API design remains implementation work. A latest Run result is not a substitute.

***3. Which execution determines an ATC card?*** Preserve decision 12976: restrict candidates to the authorized ATC/Project; newest Run by `started*at DESC, id DESC`; repeated ATC position by `position DESC, run*atcs.id DESC`. A running parent maps to `running`; otherwise `pending/passed/failed/blocked/skipped` map to `unrun/pass/fail/blocked/skipped`. No applicable position means `unrun`. Never use stale `atcs.status` or aggregate unrelated history.

***4. What is a Run verdict?*** Use only `runs.status`: Running, Passed, Failed, Aborted. `blocked` and `skipped` belong to positions and must not become Run verdicts.

***5. How should resolution fail?*** Malformed syntax stays text without a resolver call; unsupported links stay plain links/text. Authorized missing/archived references use an inert unavailable placeholder. Denied readers receive no title, identifier, Project, environment, status or counts; picker results exclude inaccessible entities. Channel denial must stop downstream reads. Enforce authorization before shaping metadata, including RPC result scoping. Render-time freshness is required; mounted live updates remain out of scope.

## Implementation readiness

BK-215 supplies channel/message persistence and is a hard dependency. Its synced Ready For Dev status is not evidence of delivered code. Deliver that foundation, the secure resolver/picker and Test Automation Status source before end-to-end validation. Sprint testing should exercise entity-specific authorization, permission changes, ordering ties and every documented state partition.

***Evidence******:*** BK-218 AC field and comments 12975–12979; BK-215 synced story; target `lib/tests/load-test-detail.ts:21–29,87–95`; `supabase/migrations/0024*tests.sql:40–48`; `0031*runs.sql:72–80,120–127`; `lib/runs/report-constants.ts:23–29`; `.context/dev-roadmap.md:355–360`. ADR-0012 documents actor/result-scoping risk but is marked Proposed. Evidence is local/synced, not live deployment inspection.

---

### Miguel Millan - 2026-10-01 21:25 UTC

# Designer perspective — AI role simulation / recommendations

I am answering in the simulated Product Designer role for this quality-engineering exercise. I reviewed the actual design system, Team Chat brief/mockup, and refined story. This is an AI design assessment, not a human designer identity or approval. Recommendations are grounded in files, but no live UI, keyboard, screen-reader, or contrast test was executed.

## What Shift-Left delivered for Design

We made the card and picker behavior explicit before UI construction: three entity-specific state meanings, restricted/unavailable states, malformed and unsupported text, keyboard insertion, multiple references, and new-render freshness. The 14 acceptance scenarios and 30 coverage outlines provide a reviewable behavioral contract, not a completed accessibility audit.

The reviewed mockup is older than that contract. `chat-entity-rich-link.html` lines 478–487 still depicts an ATC workflow status of Ready; lines 450–471 use Run Pass/Fail. These must not override decisions 12975–12979. The brief also lacks the complete Test Automation Status variants. Recommend updating these examples before development, without changing the approved scope.

## Design answers and recommended handoff

***How should users understand the status?*** Label the meaning, not just the value: ATC Execution Status; Test Automation Status (`manual-only`, `candidate`, `automated`); Run Running/Passed/Failed/Aborted. Pair visible text with existing icons/signal tokens; never rely on color alone. A blocked ATC position cannot become the Run verdict. For Test Automation Status, recommend neutral existing badge styling plus text rather than pass/fail colors: automation readiness is not execution success. Final Test badge styling is a recommendation to align with the system, not a newly approved token or behavior.

***How do we protect privacy in the UI?*** A restricted card must have no entity title, ID, Project, environment, state, count, destination, tooltip, or accessible-name metadata. Omit inaccessible picker results entirely; do not announce hidden-result counts. The mockup's generic restricted label is a useful precedent. UI hiding complements authorization; it cannot replace the server gate.

***What happens when a reference cannot be used?*** Preserve an inert, stable-footprint “No longer available” placeholder and surrounding text for supported missing/archived references. Recommend generic accessible copy without restoring stale details or inventing a deletion reason. The mockup's deleted Run example is visual inspiration, not a new Run-deletion requirement. Malformed syntax stays text without resolver lookup; unsupported URLs/entities stay ordinary text/links without previews. Placeholders must have no link destination or fake interactive focus.

***How should insertion and navigation work?*** Use the documented composer picker: search by ID/title, arrows select, Enter inserts at the caret, Escape dismisses. Recommend restoring focus and caret to the composer on close and exposing accessible input/result selection semantics. Authorized cards should be keyboard-operable links with accurate accessible names. Retain adjacent text and independently render each reference. Do not add mounted live updates.

***Which visual system applies?*** Reuse existing components and frozen DESIGN.md tokens: Inter prose, JetBrains Mono IDs, established surfaces/borders and signal palette. Keep the 1px accent focus outline with 1px offset; respect reduced motion. Verify actual combinations against WCAG AA during implementation rather than assuming historical token checks prove the new UI.

## Sources and limits

Target: `DESIGN.md` §§2–3, 7, 10; `components/ui/badge.tsx`; `.context/design/master-design-plan.md` §§2, 4.14; `.context/designs/bunkai-test-management-tool/bk-210-team-chat/BRIEF.md` and `chat-entity-rich-link.html` lines 159, 450–518, 558 onward. BK-218 refined AC/ATP and decisions 12975–12979 govern behavior. Test authorization binding and persisted Automation Status remain Dev prerequisites; this design recommendation does not establish them or alter 5 SP/status.

---


_Synced from Jira by sync-jira-issues_
