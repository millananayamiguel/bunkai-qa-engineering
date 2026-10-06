# BK-600 — Mockup

> Jira field: `customfield_10118` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-600)

Test Runner — `.context/designs/bunkai-test-management-tool/project/screens/run.jsx`

- `run.jsx:212-214` — the three verdict controls carry `kbd="P"`, `kbd="F"` and `kbd="B"`, so the key badge is drawn onto the control itself.
- `run.jsx:248` — the footer legend, drawn in full: P pass · F fail · B block · Cmd+Enter next step · Cmd+B bug.
- `.context/design/master-design-plan.md:200` — the frozen §4.5 Test Runner spec requires both halves: "Pass / Fail / Block verdict buttons (P/F/B kbd)" and "keyboard footer (P/F/B/Cmd+Enter/Cmd+B)".

Adaptation, per Critical Rule #14: the mockup draws these bindings around a single-active-step wizard. The live runner renders the full checklist flat, a divergence ratified as D-UI-1 on [https://jira.upexgalaxy.com/browse/BK-35#icft=BK-35](https://jira.upexgalaxy.com/browse/BK-35#icft=BK-35). The bindings are therefore implemented against the live flat checklist, with a focused-step cursor supplying the referent the mockup's `active` index supplied. The wizard is NOT restored.

Not drawn anywhere, therefore out of scope: a help overlay, a shortcut settings surface, remappable keys, and any jump-to-step-N binding.

---
_Synced from Jira by sync-jira-issues_
