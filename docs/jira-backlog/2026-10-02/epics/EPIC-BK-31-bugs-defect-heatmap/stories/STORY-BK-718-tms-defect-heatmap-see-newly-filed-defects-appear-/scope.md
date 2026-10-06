# BK-718 — Scope

> Jira field: `customfield_10129` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-718)

- The Heatmap view of the Bug Reports screen updates its own figures when a defect is filed anywhere in the project the reader is looking at, with no reader action required.
- Both figures on a cell move: the defect count for the selected window, and the week-over-week trend word and delta. The heat tag is recomputed from the new count.
- The five-second budget from the MVP shippability checkbox is the acceptance bound for how quickly a filed defect shows up.
- The same active-module rule the defect lists already apply governs what may appear: a defect attributed to an archived module does not surface here, so the heatmap and the lists never disagree.
- A reader only ever sees movement caused by defects in workspaces they are already entitled to read.
- The window selector (7d / 30d / 90d) keeps behaving as it does today while live updates are running, including repeated switching.
- Loss of the live connection degrades quietly: the last-loaded figures stay, the "as of" stamp keeps stating what it stated, and the manual refresh control stays exactly where it is.
- Reconnection reconciles to true current figures rather than resuming mid-stream, because anything that happened during the outage is not replayed.
- Listening stops when the reader leaves the view and starts fresh when they return.
- The channel/binding shape is added as a small, separately testable unit alongside the two that already exist, and reuses the generic coalescing and reconnect logic rather than re-deriving it.

---
_Synced from Jira by sync-jira-issues_
