# BK-743 — Scope

> Jira field: `customfield_10129` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-743)

## In scope

| ***#**** | ****Item*** |
| --- | --- |
| 1 | Throttling applied to the sign-in screen's email-existence check, and to that step only |
| 2 | A budget counted per originating network source, in two rolling windows: a short one that absorbs normal human retrying, and a longer one that caps how much of a directory one source can walk in a day |
| 3 | A refusal that reuses the product's already-published rate-limited outcome, so no new failure vocabulary enters the API contract and no client has to change |
| 4 | A wait hint on every refusal, as the non-functional spec already requires of every rate-limited answer in this product |
| 5 | A refusal that is identical in outcome, wording, wait hint and timing whether the submitted address is registered, unverified, unregistered or malformed — the throttle must not widen the disclosure it exists to narrow |
| 6 | Bookkeeping shared across every server answering requests, so a budget cannot be reset by a request landing somewhere else |
| 7 | A shape a later, broader budget can adopt without redesign: what is counted and where the count is kept are each changeable on their own |
| 8 | Automated coverage for the two window boundaries, the identical-refusal guarantee, the malformed-submission rule and the shared-count behaviour |
| 9 | Closing out the ADR-0007 follow-up entry that filed this work, with a pointer to the outcome |

---
_Synced from Jira by sync-jira-issues_
