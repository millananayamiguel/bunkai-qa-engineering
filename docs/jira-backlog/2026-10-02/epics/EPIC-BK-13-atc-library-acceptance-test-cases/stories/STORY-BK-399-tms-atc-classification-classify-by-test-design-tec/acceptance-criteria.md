# BK-399 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-399)

# BK-399 — Refined Acceptance Criteria (Corrected 2026-09-08)

> All 7 contract corrections from Ely (AI Product Owner + AI Tech Lead 06/09/2026) incorporated.

---

## Phase 3 — Refined Acceptance Criteria

> ***Correcciones aplicadas 2026-09-08*** de las decisiones de Ely (AI Product Owner 06/09/2026 02:02:45 + AI Tech Lead 06/09/2026 02:04:21-24). Las 7 correcciones del comentario "Acceptance-criteria corrections" están incorporadas y documentadas inline con `[ELY CORRECTION]`.

### Original AC-01 — Set a test-design technique when editing an ATC

#### Scenario 1.1: Should set technique to Boundary Value Analysis and show it after save (Type: Positive, Priority: High)

- ***Given***: ATC `ATC-101` exists in project `BK-13` module `auth`, anchored to US `US-42` + AC `AC-42-1`, with `technique=NULL`, `priority=NULL`, `layer=API`, owned by a member via `AtcEditor.tsx` attribute panel.

- ***When***: I open the editor for `ATC-101`, pick technique `Boundary Value Analysis` from the technique control (native styled `<select>` — Ely Q7b), and click `Save ATC`.

- ***Then***:

- UI: editor shows `Boundary Value Analysis` as selected technique after save (and after `router.refresh()`), no error toast.

- API: `PATCH /api/v1/atcs/ATC-101` returns `200` with `data.technique="Boundary Value Analysis"` (stored value = display label verbatim, case-sensitive — Ely Q1).

- DB: `atcs.technique='Boundary Value Analysis'`, `version` incremented by 1, `updated*at` > `created*at`.

- System state: `PATCH /api/v1/atcs/ATC-101` empty-body no-op returns same technique. ***[ELY CORRECTION: era `GET /api/v1/atcs/ATC-101` — ese endpoint no existe; el re-read es vía PATCH no-op o search]***

#### Scenario 1.2: Should reject an unrecognized technique value via API (Type: Negative, Priority: High)

- ***Given***: ATC `ATC-101` as above.

- ***When****: I send `PATCH /api/v1/atcs/ATC-101` with `technique="Mutation Testing"` (outside the five). ****[ELY CORRECTION: era PUT — es PATCH]***

- ***Then****: API returns `422` `validation*failed`, `details.reason="technique*invalid"`, message contains the allowed set, DB keeps `technique` unchanged. ****[ELY CORRECTION: era `400` + `code=ATC*INVALID*TECHNIQUE` — es `422 validation_failed` con discriminator en `details.reason`, igual que `layer` en el mismo payload]***

### Original AC-02 — Set a priority when editing an ATC

#### Scenario 2.1: Should set priority to High and show it after save (Type: Positive, Priority: High)

- ***Given***: ATC `ATC-101` with `priority=NULL`.

- ***When***: I pick priority `High` and save.

- ***Then****: UI shows `High` selected; `PATCH` returns `200` with `data.priority="High"` (stored = display label, case-sensitive — Ely Q1); DB `atcs.priority='High'`, `version` +1. ****[ELY CORRECTION: era PUT — es PATCH]***

#### Scenario 2.2: Should reject an unrecognized priority value via API (Type: Negative, Priority: High)

- ***Given***: ATC `ATC-101`.

- ***When****: `PATCH` with `priority="Urgent"`. ****[ELY CORRECTION: era PUT — es PATCH]***

- ***Then****: `422` `validation*failed`, `details.reason="priority*invalid"`, no DB change. ****[ELY CORRECTION: era `400`/`422` + `code=ATC*INVALID*PRIORITY` — es `422 validation_failed` con discriminator en `details.reason]`***

### Original AC-03 — Both fields are optional

#### Scenario 3.1: Should save with neither technique nor priority set and show explicit not specified (Type: Positive, Priority: Critical)

- ***Given***: Creating a new ATC in module `auth` with valid `title`, `layer=UI`, `user*story*id`, `acIds`, `steps`, `assertions` — or editing an existing ATC.

- ***When****: I leave both technique and priority unset (the controls on `Not specified` / empty ****NEEDS PO/DEV CONFIRMATION*** on exact unset affordance) and save.

- ***Then****: Save succeeds (`201` on create, `200` on edit), no field-level error. Detail view shows technique=`not specified` and priority=`not specified` ****NEEDS PO/DEV CONFIRMATION*** on verbatim copy/testid (see A3). DB holds `technique=NULL, priority=NULL`.

### Original AC-04 — Filter the ATC list by technique

#### Scenario 4.1: Should filter list by Pairwise showing only Pairwise ATCs (Type: Positive, Priority: High)

- ***Given***: Project has 6 ATCs: `T1=Equivalence Partitioning`, `T2=Pairwise`, `T3=Pairwise`, `T4=NULL`, `T5=Decision Table`, `T6=Boundary Value Analysis` — all in same project, mixed modules.

- ***When***: I apply the ATC list filter `technique=Pairwise` (single-select — Ely Q3a).

- ***Then****: List shows exactly `T2, T3` (2 rows), excludes `NULL` and other techniques. API: `GET /api/v1/atcs/search?query=<text>&project*id=<uuid>&technique=Pairwise` returns 2 results. ****[ELY CORRECTION: faltaban `query` y `project*id` — son requeridos en `/atcs/search`]***

### Original AC-05 — Filter the ATC list by priority

#### Scenario 5.1: Should filter list by Critical showing only Critical ATCs (Type: Positive, Priority: High)

- ***Given***: Project has 5 ATCs with priorities `Critical`, `High`, `NULL`, `Critical`, `Low`.

- ***When***: I filter by `priority=Critical`.

- ***Then****: List shows exactly the 2 `Critical` rows, excludes `NULL`/others. API: `GET /api/v1/atcs/search?query=<text>&project*id=<uuid>&priority=Critical` returns 2. ****[ELY CORRECTION: faltaban `query` y `project*id` — son requeridos]***

### Original AC-06 — A filter that matches nothing reads as empty, not broken

#### Scenario 6.1: Should show explicit empty result when filtering by State Transition with no matches (Type: Positive, Priority: Medium)

- ***Given***: No ATC in the project carries `technique=State Transition` (setup: create ATCs with other techniques only).

- ***When***: I filter by `technique=State Transition`.

- ***Then****: UI shows an explicit filtered-empty state (copy: `No ATCs match the current filters` — Ely Q4), with a dedicated testid `atc-list-no-match` (Ely Q6/implementation-plan), 0 rows, no error toast. ****[ELY CORRECTION: era `atcs-filter-empty` — el nombre correcto es `atc-list-no-match`]***

### Original AC-07 — Values persist across a reload

#### Scenario 7.1: Should persist Decision Table + Medium across reload (Type: Positive, Priority: High)

- ***Given***: ATC `ATC-101` saved with `technique=Decision Table`, `priority=Medium` via Scenario 1.1 + 2.1 path.

- ***When***: I reload the page (`location.reload()` / `page.reload()`), then reopen `ATC-101` detail, and also refetch the ATC list filtered view.

- ***Then****: Detail still shows `Decision Table` + `Medium`; `GET /api/v1/atcs/search?query=<text>&project*id=<uuid>&technique=Decision+Table` includes `ATC-101` — persistence is DB-sourced, not localStorage. ****[ELY CORRECTION: eliminé `GET /api/v1/atcs/ATC-101` (endpoint no existe) y agregué `query` + `project*id` a la search call]***

### Original AC-08 — Pre-existing ATCs show an explicit unset state

#### Scenario 8.1: Should show not specified for both fields on a legacy ATC with no default (Type: Positive, Priority: High)

- ***Given***: An ATC `ATC-LEGACY` created before this story shipped (fixture: `atcs` row inserted with `technique=NULL, priority=NULL` to simulate the pre-migration state; migration must have left existing rows `NULL` — verify via `SELECT technique, priority FROM atcs WHERE id='ATC-LEGACY'`).

- ***When***: I view `ATC-LEGACY` in `AtcEditor.tsx` / detail.

- ***Then****: Technique reads as `not specified` and priority as `not specified` (verbatim ****NEEDS PO/DEV CONFIRMATION***), and neither field shows a real enum value. DB still `NULL` for both.

### Original AC-09 — Technique/priority filters combine with existing filters

#### Scenario 9.1: Should combine technique filter with active layer filter using AND (Type: Positive, Priority: High)

- ***Given***: ATCs: `A1(layer=API, technique=Decision Table)`, `A2(layer=UI, technique=Decision Table)`, `A3(layer=API, technique=Pairwise)`, `A4(layer=API, technique=NULL)`. Layer filter `API` is already active.

- ***When***: I also filter by `technique=Decision Table`.

- ***Then****: List shows only `A1` (the intersection `layer=API AND technique=Decision Table`), 1 row. Clearing the technique filter returns to the 2-row `layer=API` view; clearing the layer filter with technique still active shows `A1+A2`. API: `GET /api/v1/atcs/search?query=<text>&project*id=<uuid>&layer=API&technique=Decision+Table`. ****[ELY CORRECTION: faltaban `query` y `project*id`]***

### New scenarios surfaced from Phase 2 edge cases — NEEDS PO/DEV CONFIRMATION

#### Scenario E1: Should reject case-mismatched technique value via API (Type: Negative, Priority: Medium)

- ***Given***: ATC `ATC-101` with `technique=NULL`.

- ***When****: `PATCH` with `technique="boundary value analysis"` (lowercase) or `"BOUNDARY VALUE ANALYSIS"`. ****[ELY CORRECTION: era PUT — es PATCH]***

- ***Then****: Rejected as unrecognized (`422` `validation*failed`, `details.reason="technique*invalid"`), no DB change. ****Confirmed: strict match, no normalization**** — Ely Q9. ****[ELY CORRECTION: antes decía `400`/`422` + `code=ATC*INVALID*TECHNIQUE` y dejaba abierta la posibilidad de case-insensitive; ahora es `422 validation_failed` y se confirma strict sin normalización]***

#### Scenario E2: Should reject whitespace-padded priority via API or trim consistently (Type: Negative, Priority: Low)

- ***Given***: ATC `ATC-101`.

- ***When****: `PATCH` with `priority=" High "` (padded spaces). ****[ELY CORRECTION: era PUT — es PATCH]***

- ***Then****: Rejected (`422` `validation*failed`, `details.reason="priority*invalid"`). ****Confirmed: strict, no trim**** — Ely Q9. ****[ELY CORRECTION: antes dejaba abierto trim-vs-reject; ahora se confirma strict sin trim]***

#### Scenario E3: Should clear a previously-set technique back to not specified (Type: Edge, Priority: Medium)

- ***Given***: ATC `ATC-101` with `technique=Pairwise`.

- ***When***: I clear the technique control to `Not specified` (select the `Not specified` option — Ely Q6) and save.

- ***Then****: `PATCH` with `technique=null` (or omitted) succeeds, UI shows `Not specified`, DB becomes `NULL`, `version` bumps. ****Confirmed: `Not specified` is a permanent option in the same control**** — Ely Q6. ****[ELY CORRECTION: antes decía "select the empty / click clear ×" — no hay botón ×, es la opción `Not specified` dentro del mismo select]***

#### Scenario E4: Should duplicate an ATC carrying its technique and priority to the copy (Type: Positive, Priority: Medium)

- ***NEEDS PO/DEV CONFIRMATION***: duplicate-carry inferred from Business Rule 11.

- ***Given***: ATC `ATC-SRC` with `technique=Equivalence Partitioning`, `priority=Critical`, `layer=API`, `tags=["smoke"]`.

- ***When***: I duplicate via `POST /api/v1/atcs/ATC-SRC/duplicate` (or the editor `Duplicate` button `AtcEditor.tsx:158-177`).

- ***Then***: New ATC `ATC-COPY` has `technique=Equivalence Partitioning`, `priority=Critical`, same `layer`/`tags`, new `id`/`slug`, `version=1`.

#### Scenario E5: Should handle all-unspecified boundary when filtering by technique with every ATC unspecified (Type: Boundary, Priority: Low)

- ***NEEDS PO/DEV CONFIRMATION***: all-unspecified empty boundary inferred (E4).

- ***Given***: Project where all 4 ATCs have `technique=NULL`.

- ***When***: I filter by `technique=Pairwise`.

- ***Then***: Explicit filtered-empty state with 0 rows, no error — same contract as AC-06.

#### Scenario E6: Should combine priority filter with technique and layer via triple AND (Type: Positive, Priority: Medium)

- ***NEEDS PO/DEV CONFIRMATION***: triple-combine inferred from Business Rule 9 "every other active filter".

- ***Given***: ATCs covering the `layer × technique × priority` matrix, with module/project filters also available.

- ***When***: I apply `layer=API` + `technique=Decision Table` + `priority=High`, and separately verify `priority=Critical` with the same technique.

- ***Then****: Each combination returns exactly the intersection; API combines params with `AND` (`WHERE layer AND technique AND priority`). This is the ****Pairwise-relevant*** combinatorial surface — log that Pairwise was considered and reduced to representative combos, not the full `3 × 5 × 4 = 60` grid.

---

---
_Synced from Jira by sync-jira-issues_
