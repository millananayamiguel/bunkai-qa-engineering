# BK-596 — Workflow

> Jira field: `customfield_10082` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-596)

Elena is cleaning up a Test set that has drifted. Two Tests cover a checkout flow that was replaced last release. She wants them out of the way, and she also spots that one of the Tests she is keeping was named in a hurry and no longer says what it does.

She opens the badly-named one first and renames it. The new name follows her everywhere the Test is mentioned: search, the command palette, its Run history, the Traceability chain it appears in. Its chain of ATCs is untouched. The rename shows up in the workspace Activity Stream with the old name and the new one, so nobody has to guess what happened.

Then she opens one of the retired Tests and chooses to archive it. A confirmation names the Test, says plainly that archiving is reversible, and tells her that twelve Runs have been recorded against it and that all twelve are kept and stay readable. It does not refuse her; it just makes sure she knows. She confirms.

The Test leaves circulation. It stops surfacing in search and in the command palette, filtering by its tags no longer returns it, and the ATCs in its chain stop counting it in their "used in N Tests" report. Nobody is offered a button to run it. What does ***not*** change is everything already recorded: all twelve Runs still open and still show every step, its content and the result it recorded; the Test's own Run history still lists all twelve; the User Story's Traceability chain still shows this Test as the evidence covering its Acceptance Criterion, marked as archived rather than reported as a gap; and last quarter's pass rate reads exactly the number it read yesterday. Opening the Test itself still works — it is there, clearly marked archived, its chain rendered read-only, and nothing on it can be changed until it comes back.

Weeks later the old checkout flow is reinstated for one customer and her QA Lead asks whether a Test for it still exists. She opens the Test at the address she still has, sees it marked as archived, and restores it. It reappears in search and in the palette, its tags filter again, its ATCs count it again, and a Run can be started from it — with the same chain, the same tags and the same twelve Runs behind it. Both the archive and the restore sit in the Activity Stream as separate entries, so the history of the decision is legible to the whole team.

---
_Synced from Jira by sync-jira-issues_
