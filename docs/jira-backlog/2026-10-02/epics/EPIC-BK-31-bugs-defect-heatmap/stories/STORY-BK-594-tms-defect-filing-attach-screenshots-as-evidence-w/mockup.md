# BK-594 — Mockup

> Jira field: `customfield_10118` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-594)

Design plan §4.6 (Bug Reports) · `bk-31-bug-reports/bug-detail.html` lines 590-596 — read surface · `project/screens/run.jsx` (Report-bug drawer) — filing surface

The read half is frozen. `bug-detail.html:590` opens the evidence panel, `:592` heads it "Evidence", `:593` renders the `N / 10` count, `:594` states "Up to 10 attachments per defect", and `:596` holds the list whose rows are each openable. Design plan §4.6 restates it as "evidence list (`N / 10`, each row openable)". This story does not redesign that panel; it makes the word "attachments" in the frozen copy literally true.

The filing half stays where §4.6's own build-order note puts it: "BK-40 (file from failing step) continues to render into the Test Runner's Report-bug drawer, not this screen". The drawer is drawn in `run.jsx`, which is also where the sibling story adds attachment to a step result — reuse that treatment rather than deriving a second one.

Two boundaries the mockup fixes, and this story respects rather than reopens: `bug-detail.html`'s evidence panel carries no upload input and no Add-evidence control, because §4.6 states the record has "No edit/status-transition controls" — evidence is fixed at filing. And the panel is a list of openable rows, not a gallery; where a thumbnail treatment is needed it comes from the sibling story's runner work, not from a new visual language invented here.

Build against the live drawer and the live defect record per Critical Rule #14 (live-UI-first), reusing the frozen §2 tokens.

---
_Synced from Jira by sync-jira-issues_
