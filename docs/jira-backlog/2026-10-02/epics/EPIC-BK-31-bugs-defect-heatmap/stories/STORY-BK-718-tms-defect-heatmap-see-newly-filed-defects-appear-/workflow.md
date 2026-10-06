# BK-718 — Workflow

> Jira field: `customfield_10082` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-718)

## Mateo's regression afternoon

Mateo, the QA Lead, has a regression pass running across the Checkout project. Two engineers and one automated agent are working through it and filing what they find. He opens the Bug Reports screen, switches to the Heatmap view, and leaves it on the second monitor while he works on something else.

***Today****, that screen is a photograph. It shows what was true the moment it loaded, and the "as of" stamp underneath honestly says so. To learn anything new he has to come back and press refresh — and, more to the point, he has to **decide* to. Between decisions he is reading a stale board and does not know it.

***After this story***, the numbers move on their own. Elena files a defect against `Checkout / Payments`; within a few seconds that cell goes from 2 to 3, its trend flips from `Flat ±0` to `Rising +1`, and its tag steps up from Low to Elevated. Nothing announces it — no toast, no flash, no badge. The cell is simply correct now. Mateo glances over, sees `Checkout / Payments` has become the loudest cell on the grid, and goes and asks about it. That glance is the whole point of the screen, and it only pays off if the grid is telling the truth at the moment he glances.

The automated agent filing on the team's behalf is treated no differently. Its defects land in the same cells within the same few seconds, so the agent's work becomes visible without anybody reloading anything to find out what it has been doing.

## What Mateo can still steer

The window buttons (7d / 30d / 90d) work exactly as they always have. Switching to 7d reloads for that window and then keeps **that** window current; switching back does the same. Nothing double-counts and nothing stacks up.

## When the connection goes

If the live connection drops — a laptop lid, a flaky hotel network, a sleeping tab — the screen does not turn into an error. The figures stay where they are, and the "as of" stamp keeps stating the moment they were produced, which is now the reader's honest signal that time has passed. The refresh control is where it has always been. When the connection comes back, the heatmap re-reads current figures in one go, picks up whatever was filed during the gap, and the stamp advances.

When Mateo switches to the List view or moves to another project, the heatmap stops listening. Coming back starts fresh.

---
_Synced from Jira by sync-jira-issues_
