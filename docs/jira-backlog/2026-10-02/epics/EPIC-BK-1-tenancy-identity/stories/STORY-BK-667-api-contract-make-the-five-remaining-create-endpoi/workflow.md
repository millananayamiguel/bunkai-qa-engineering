# BK-667 — Workflow

> Jira field: `customfield_10082` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-667)

Karim is an autonomous test agent holding a Personal Access Token. It is standing up a fresh Workspace, filing the Project it will work in, and pushing a batch of Acceptance Test Cases ahead of a run. Every one of those calls is a create, and every one of them travels over a network that occasionally drops an answer after the write has already landed.

Today the agent has no safe move. If a create times out, it cannot tell whether the record exists. Retrying may mint a duplicate; not retrying may leave the batch incomplete. The two endpoints where this problem was solved — starting a Run and creating a Test — solved it properly, with a required `Idempotency-Key`, a stored answer and a hard conflict on a reused key. The other five endpoints the requirement names were simply never wired, so the agent's protection ends exactly where its batch begins.

After this story the agent generates one key per attempt and sends it. A create that answers cleanly behaves as it always did. A create that times out can be repeated with the same key, and Bunkai returns the first answer rather than writing again — the Workspace it already made, the ATC it already stored. If the agent changes its mind and sends different content under a key it already used, it is refused rather than quietly given a second record, because a key names one request and not one session. If two of its workers race on the same key, one wins and the other is told to wait rather than both writing. And a key burned on a request that failed before anything was written is released, so an honest retry still works.

For the people using the product, the change is invisible until the moment it matters. The onboarding form, the create-project form, the user-story form, the ATC editor and the file-a-Bug dialog each start sending a key. A double-click on submit now produces one record instead of two, and it produces no error — the second click is recognised as the same request, not as a conflict. When a submit is refused, for a taken slug or a validation problem, the form rotates its key before the next attempt, so a corrected retry is a fresh request rather than a mismatch against the old one.

The riskiest part of the story is the part with no visible feature in it. Because the header becomes required the instant a route adopts, a caller that is not updated stops working outright. That includes the signup path: onboarding is what creates a new account's first Workspace, so a change that wires the server and forgets that one file does not degrade the product, it locks new users out of it. The five callers are named in the scope for exactly that reason, and the server and client halves land together.

Nothing about the product's shape changes. No screen moves, no wording changes, no new affordance appears. What changes is that the guarantee the requirement has promised since the beginning finally covers the endpoints it named, the published contract stops describing a header the routes ignore, and a retry stops being a gamble.

---
_Synced from Jira by sync-jira-issues_
