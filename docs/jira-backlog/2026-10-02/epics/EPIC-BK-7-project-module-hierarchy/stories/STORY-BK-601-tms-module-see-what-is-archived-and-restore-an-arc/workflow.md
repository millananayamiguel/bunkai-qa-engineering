# BK-601 — Workflow

> Jira field: `customfield_10082` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-601)

Elena is reorganising a Project whose tree has drifted. The `Checkout` Module covers a flow that was rebuilt last quarter, so she opens its context menu in the explorer and archives it. The confirmation tells her what is going with it — two sub-Modules, five User Stories, fourteen Acceptance Criteria and nine ATCs — and she confirms. The branch disappears from the tree, and the ATCs under it stop being offered for reuse.

A week later her QA Lead asks what happened to the boundary cases for guest checkout. Elena opts into including archived rows. The tree redraws with `Checkout` back in place, plainly marked as archived, showing that she archived it last Tuesday. Its sub-Modules, their User Stories and those Stories' Acceptance Criteria are all there beneath it, each marked the same way. Nothing about the active part of the tree has moved; the archived rows simply became visible.

She decides the branch should come back and restores it from the same menu she archived it from. Everything the archive took down returns at once: both sub-Modules, all five User Stories, all fourteen Acceptance Criteria and all nine ATCs, each at the position it held before. She is told exactly what came back, and the Module is no longer marked as archived.

One thing deliberately does ***not*** come back. A month before any of this, Elena had archived a single obsolete User Story inside `Checkout` on its own. That Story is still archived after the restore, because the restore undid the archive of the Module — not every archive that ever touched that branch. If it had ridden back in, a decision she made deliberately would have been silently reversed by an unrelated action.

Later she tries to restore a sub-Module that a colleague had archived separately, without first restoring its parent. The restore is refused, and the refusal names the parent Module that is still archived and has to come back first. Nothing changes, she restores the parent, and the sub-Module then restores cleanly under it — exactly where it used to sit.

The workspace Activity Stream carries the whole story as separate entries: the archive, and later the restore with its counts. Nobody has to reconstruct what happened from the state of the tree.

---
_Synced from Jira by sync-jira-issues_
