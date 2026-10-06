# BK-593 — Mockup

> Jira field: `customfield_10118` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-593)

Design plan §4.5 (Test Runner) · `project/screens/run.jsx` lines 224-239

The control this story builds was designed and frozen, and never wired. `run.jsx:224` renders the section header "Notes & evidence" with the qualifier "optional · attached to step result"; `run.jsx:227` renders a `📎 Attach` button beside it; `run.jsx:228` renders the URL button that is the only one of the two that does anything today. Design plan §4.5 lists the same control verbatim in its Test Runner requirements: "Notes & evidence (textarea + Attach + URL)".

So this is not a new surface and it is not a divergence: the mockup already places the affordance, the frozen §2 tokens already cover it, and the story delivers the behaviour behind a button the design has been drawing since the runner was specified. Build against the live runner per Critical Rule #14 (live-UI-first) and reuse the existing evidence row treatment rather than inventing a second one.

Note that `run.jsx:227` has no `onClick` handler — the mockup shows placement and label, not interaction. The thumbnail, the full-size view, and the removal affordance are not drawn anywhere in the frozen set. Where this story needs a treatment the mockup does not carry, follow the defect record's evidence list (`bk-31-bug-reports/bug-detail.html`, design plan §4.6) rather than deriving a new visual language.

---
_Synced from Jira by sync-jira-issues_
