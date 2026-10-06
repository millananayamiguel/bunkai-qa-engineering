# BK-399 — Implementation Plan (Dev)

> Jira field: `customfield_10070` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-399)

## Implementation Plan — BK-399 ATC Classification

> Authored 2026-09-06 by the sprint-development orchestrator. Every open `NEEDS PO/DEV CONFIRMATION` flag from the 2026-09-04 shift-left was resolved BEFORE this plan, by two attributed decision passes published as comments on this issue (AI Product Owner — product surface; AI Tech Lead — technical surface, 3 parts). This plan does not re-derive those rulings; it executes them. Where this plan and a decision comment disagree, the comment wins.

### Goal

Add two optional classification fields to the ATC header — `technique` (five test-design techniques) and `priority` (four levels) — editable from the same attribute surface that already sets Layer and Tags, and filterable from the project workbench ATC list.

### Resolved contracts (the short version; rationale lives in the decision comments)

| Contract | Value |
| --- | --- |
| Stored values | The display label verbatim, case-sensitive. `Equivalence Partitioning` · `Boundary Value Analysis` · `State Transition` · `Decision Table` · `Pairwise`; `Critical` · `High` · `Medium` · `Low`. Unset is SQL `NULL`, never a sentinel string. |
| Column shape | `text` + named table-level `CHECK`, matching `atcs.layer` (`0004_atcs.sql:60`). This schema declares zero native enum types across 86 migrations. |
| Unset copy | Verbatim `Not specified`, everywhere. First `<select>` option (`value=""`) in the editor; a rendered row in the preview. |
| Filter cardinality | Single-select per facet. `Not specified` IS selectable and matches `NULL` ***client-side over the already-loaded workbench rows***; the API gains no null-sentinel query parameter in this story. |
| Option order | The project's canonical declaration order, verbatim, in every surface. `All …` first, `Not specified` last in filters. Priority is severity-descending. |
| Error contract | HTTP `422`, `error.code = "validation*failed"`, discriminator in `details.reason` (`technique*invalid` / `priority*invalid`). ***No new ***`ApiErrorCode` — this overrules the story's proposed `400/422 + ATC*INVALID*TECHNIQUE`, because `layer` on this same payload already returns `422 validation*failed` today. |
| Case / whitespace | Strict byte-identical match. No case folding, no trimming. E1 and E2 both stay Negative outlines. |
| Clearing | `null` ***or*** key omission clears, matching how `tags` already behaves under this endpoint's documented PUT-style full replace. |
| Composition | AND, as narrowing conjuncts in the existing `where` clause. Nothing about composition changes. |
| Versioning | Automatic. `bunkai*update*atc` already bumps `version` + `updated_at` on every call. `tsv` is correctly untouched (its trigger fires `of title, tags` only). |
| Design gate | Ratified as a spec-only departure, `master-design-plan.md` §5 ***D41***, on the D39 / D40 precedent. No mockup commissioned; both surfaces build against the LIVE components per Critical Rule #14. |
| ADR | None. Fails gate 1 of the two-gate test — every ruling applies an already-ratified decision (ADR-0001 envelope, ADR-0009 §3-5, ADR-0012 DEFINER posture, the `layer` precedent from `0004`). |

### Premise correction carried into this plan

`Scope` says the new filters must combine with "the Project, Module, and layer filters already available on that list". ***They are not available.**** `components/atcs/AtcTable.tsx` renders six columns and zero filter controls; project scope comes from the route, module scope from the explorer tree, and the layer/Project/Module/anchor facets are BK-441 on the workspace-scoped `/atcs` index that BK-439 has not built. AC-09 and edge case E6 are therefore unexecutable as written. ****Resolution******:****** BK-399 ships the Layer chip filter*** as the minimum that makes both executable. A Module facet does NOT ship and stays with BK-441.

### Steps

***Step 1 — Migration ****`supabase/migrations/0087*atc*classification.sql`****.***
Two `add column if not exists` (no default, so pre-existing rows stay `NULL` by construction, not by policy) plus two named validated CHECK constraints. Then five function rewrites: `bunkai*atc*json` and `bunkai*duplicate*atc` in place (signatures unchanged), and `bunkai*create*atc`, `bunkai*update*atc`, `bunkai*search*atcs` via explicit `drop function` on the old signature before creating the widened one. ***No new indexes*** — `atcs.layer`, the identical-shape optional narrow on the same table filtered by the same RPC, has none.
`verify:` `supabase db push` applies clean; `select technique, priority from atcs limit 5` returns two NULL columns; `\df bunkai*update*atc` lists exactly one overload.

***Step 2 — Regenerate the derived artifacts.*** `bun run types:gen` and `bun run openapi:gen`. Both are generated; mark them `// generated, do not review` and exclude from the review budget.
`verify:` `bun run types:check` clean; `bun run openapi:check` passes.

***Step 3 — Constants, schemas and RPC wrappers.*** Export `ATC*TECHNIQUES` / `ATC*PRIORITIES` beside `ATC_LAYERS`. Add `technique` / `priority` to `AtcWriteBodySchema` as `.nullable().optional().default(null)`, and to the search schema as `z.enum(...).optional()`. Widen the `rpc.ts` call sites to the new argument lists.
`verify:` unit tests for the schemas cover accept / reject / clear / case-mismatch / whitespace-padded.

***Step 4 — API surface.*** `mapAtcRpcError` gains two `23514` branches keyed on constraint name, mirroring the existing `atcs*title*min_length` branch. `/atcs/search` accepts `?technique=` and `?priority=`. OpenAPI descriptions state the omission-clears semantics in the same words `tags` uses.
`verify:` a DB-integration test asserts 422 + the right `details.reason` for each bad value, against the real database.

***Step 5 — Editor and preview.*** Two native styled `<select>` controls in the existing attribute row of `AtcEditor.tsx` and `NewAtcEditor.tsx`, reusing the frozen select atom verbatim (`NewAtcEditor.tsx:323`). The Layer segmented control and the Tags chip input are untouched. `AtcPreview.tsx` gains `Technique` and `Priority` rows.
`verify:` live-UI pass against the running dev server — set, save, reload, clear back to `Not specified`, and a legacy row rendering `Not specified` for both.

***Step 6 — Filter strip and empty states.*** A toolbar inside `AtcTable.tsx` above the table header, mirroring `bugs-list-toolbar`: Technique `<select>` · Priority `<select>` · Layer chip group · `Reset filters`. Filter state lives in `workbench-context`, applied as a predicate over `rows`. A second, distinct filtered-empty state (`atc-list-no-match` + `Clear filters`) beside the existing never-had-any block, which gains `atc-list-empty`.
`verify:` live-UI pass covering AC-04, AC-05, AC-06, AC-09 and E5 / E6, including the triple AND.

***Step 7 — DB-integration tests.**** New `lib/atcs/classification-rpc.test.ts` (set / clear / persist / duplicate-carries / CHECK rejection) and an extension of the existing BK-635 guard `lib/atcs/search-rpc-grant-isolation.test.ts` so it targets the ****8-arg*** `bunkai*search*atcs`.
`verify:` both suites green against the live database, not a mocked `db.rpc`.

### Security notes that bind Step 1

- `revoke`*** / ****`grant`**** do not survive a ****`drop function`****.**** Postgres grants `EXECUTE` to `PUBLIC` by default on every newly created function, and `anon` / `authenticated` are members. Every recreate must re-emit its revoke/grant pair. For `bunkai*search*atcs`, `revoke ... from authenticated` ****is*** BK-635's fix — omitting it silently reopens that vulnerability with the test suite green.
- `bunkai*search*atcs`***'s step-0 actor bind must be re-emitted verbatim.*** The two new predicates are narrowing conjuncts inside the same `where`, never a post-filter and never a second read of `public.atcs`.
- ***The missing actor bind on ****`bunkai*create*atc`**** / ****`bunkai*update*atc`**** / ****`bunkai*duplicate*atc`**** is NOT retrofitted here.*** ADR-0012 is explicit that a story touching one of the 22 known-unbound functions for unrelated reasons does not retrofit the guard. The count does not grow: each dropped signature and its widened twin are one function. Recorded for BK-249 / BK-263, ~1 point.
- ***Open wrinkle to resolve before writing the migration***: appending `p*technique` / `p*priority` without defaults, combined with the `drop function` of the old 9-arg signature, leaves a window where a deployed 9-name PostgREST call has no candidate. Giving the two new parameters `default null` on the recreated function closes it without reintroducing the overload ambiguity, because the old signature no longer exists.

### Non-goals (from Out of Scope, restated so they are not smuggled in)

Coverage reporting by technique or priority · bulk edit across more than one ATC · backfilling legacy rows · any value beyond the five techniques and four priorities · ATC parameterization editors (EPIC Phase 3) · new Technique / Priority table columns · adding the new fields to the CSV export contract · `technique` / `priority` in the tsvector.

## Review Workload Forecast

Estimated: 1788 additions + 130 deletions = 1918 total lines
400-line budget risk: High
Chain strategy: feature-branch-chain
Decision trace: Q1=No (45% of the estimate is mechanical SQL re-emission, but the remaining ~1050 lines are new product behaviour — two editor controls, a preview surface, a filter strip, two empty states, validation and DB-integration tests — so the change is not mostly mechanical) · Q2=No (the migration slice alone is ~870 lines, over budget on its own, and it is not independently safe: it drops the 9-arg `bunkai*update*atc` / `bunkai*create*atc` signatures the deployed staging code still calls by name, so `staging` breaks between that merge and the code merge) · Q3=Yes (migration + regenerated `lib/types/supabase.ts` + the enum constants + the widened RPC wrappers are scaffolding that the API params, the editor, the preview and the filter strip all consume; any partial merge to `staging` breaks ATC editing) → feature-branch-chain
Decided by: /git-flow-master §Chained-PR decision tree (branching-strategies.md)
Decision needed before apply: No

### Branch plan (contract for execution)

Integration branch `feat/BK-399-atc-classification`, cut from `staging`. Child PR 1 = Steps 1-3. Child PR 2 = Step 4 + its tests. Child PR 3 = Steps 5-6 + live-UI validation. Step 7 travels with the PR whose surface it tests. Final PR merges the integration branch into `staging` with `--no-ff`. If the real diff exceeds the estimate, re-invoke the chained-PR decision rather than silently up-budgeting.

---
_Synced from Jira by sync-jira-issues_
