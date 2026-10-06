# BK-594 — Workflow

> Jira field: `customfield_10082` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-594)

1. Elena, a Senior QA Engineer, marks step 4 of a Run as failed and opens the Report-bug drawer from that step, exactly as she does today.
2. The drawer already carries the title, the severity, the module, and the steps to reproduce copied from the failing step. What it cannot carry is the screen she is looking at.
3. She attaches the screenshot straight from her machine, inside the drawer, without leaving the flow she is in.
4. She adds a second image of the network panel, and pastes a link to a screen recording she made in another tool. The drawer shows her the defect now holds three evidence items of the ten it is allowed.
5. She keeps going and reaches ten. On the eleventh, Bunkai refuses and tells her the defect is already at its limit. The ten she has are all still there, in the order she added them; nothing was quietly dropped to make room.
6. She picks the wrong file once — a log rather than an image. It is refused, with a message naming what is accepted, and the evidence she already gathered is untouched.
7. She files the defect. Her connection falters and one image never lands, so the filing reports the failure rather than creating a defect that points at nothing. Her title, her description, and her other evidence are all still in the drawer, so she retries instead of retyping.
8. On the retry it goes through. The defect is created with its evidence intact.
9. Sara, a Full-Stack Developer, opens the defect a day later. The Evidence panel reads 3 of 10, and every row opens — the two screenshots and the recording link alike.
10. She reads the record, but she cannot alter its evidence. What Elena filed is what the defect says, permanently.
11. A tester in another Workspace, handed a direct reference to one of those screenshots, cannot open it. The image is readable only inside the Workspace that owns the defect.
12. Elena files a second defect the same afternoon with no evidence at all, because the failure needed none. That defect is valid, and its record reads 0 of 10 rather than showing an error.

---
_Synced from Jira by sync-jira-issues_
