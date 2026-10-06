# BK-743 — Out Of Scope

> Jira field: `customfield_10081` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-743)

## Out of scope

| ***#**** | ****Excluded**** | ****Why*** |
| --- | --- | --- |
| 1 | The general per-PAT budget for the authenticated API (100 writes and 600 reads per minute) | Separate, later work, already sequenced in the roadmap for Master Sprint 6 and load-tested in Master Sprint 7. This story does not deliver it, and its numbers deliberately differ — see the Business Rules field. |
| 2 | Throttling the other public sign-in and sign-up steps | They already inherit the authentication service's own throttling. Layering a second budget on top is a separate decision carrying its own risk of locking real people out. |
| 3 | Removing or narrowing the email-existence answer itself | ADR-0007 ratified that answer as the price of email-first routing. Reversing it is an ADR-level decision, not a hardening story. |
| 4 | Any change to the sign-in screen's wording or layout | The screen already handles a rate-limited answer and already shows a wait message. Rewording it to count the wait down is a nice-to-have, not this story. |
| 5 | A blocklist, a CAPTCHA, an allowlist, or any reputation service | Throttling is the mitigation ADR-0007 named. Anything beyond it is a new security posture and needs its own ADR first. |
| 6 | Defending against a sweep spread across many sources | Beyond the reach of a per-source budget by definition. Named here so nobody reads this story as delivering it. |
| 7 | Alerting, dashboards or metrics on throttling events | Observability lands with the wider observability pass already sequenced in the roadmap. |
| 8 | Any estimate | Story Points stay empty; sizing belongs to the team that picks the story up. |

---
_Synced from Jira by sync-jira-issues_
