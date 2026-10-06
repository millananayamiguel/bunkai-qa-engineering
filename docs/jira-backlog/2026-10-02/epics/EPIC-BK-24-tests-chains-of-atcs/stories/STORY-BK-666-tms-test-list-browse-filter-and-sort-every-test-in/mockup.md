# BK-666 — Mockup

> Jira field: `customfield_10118` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-666)

🔒 ***Mockup-gated, unratified — no mockup in the set draws a Project's Tests as a list.***

An exhaustive read of `.context/designs/bunkai-test-management-tool/` finds no Tests index anywhere. What exists, and what a screen for this story would have to be built from:

- `project/screens/project.jsx` — the workbench. Its `TableView` is explicitly ATC-only: it flattens ATCs out of the tree (`// flatten ATCs from tree`), pushes only `node.type === 'atc'` nodes, and labels its count "N ATCs". Its filter bar (status / layer / module / tag pills, a Sort control, a Group control) and its dense sticky-header table are the ***row and toolbar grammar to reuse*** — not the entity, and not a surface to convert.
- `bk-13-atc-library-global/atc-library-global.html` — the closest structural analogue in the set: an index table with ID / Name / Project / Module / Layer / Anchor / "Used in" columns, incremental search, combinable facets, a one-gesture "Clear all", and an explicit states strip (default / filtered / no-match / loading skeleton / named error with retry). It is a ***workspace-scoped ATC index***, so it is a shape reference only. Its no-match-versus-empty distinction and its named-error-with-retry treatment are directly applicable.
- `bk-201-test-plans-milestones/plan-detail.html` — draws a table headed "Tests in this plan" (Test / Name / Layer / Latest outcome / Latest run) plus a searchable picker over a "test library". It is the nearest thing to a Tests table in the set, but it is ***plan-membership***, not a Project index, and its seed data uses `ATC-` ids for the rows it calls tests — so it cannot be copied without importing that conflation.

Not drawn anywhere and therefore not to be inferred: a chain-length column, a Tests entry in the project sub-nav, and a Tests-specific empty state.

Per Critical Rule #14 (live-UI-first), the live surfaces are the fidelity source: `AtcTable.tsx` for the table grammar and its sorting behaviour, `project-sub-nav.tsx` for the section entry, and the existing toolbar tag control for the filter. Per Critical Rule #15, any deliberate departure is ratified in `master-design-plan.md` §5 before build. This story's §8 US→Screen row is owned by the orchestrator, not by this ticket.

---
_Synced from Jira by sync-jira-issues_
