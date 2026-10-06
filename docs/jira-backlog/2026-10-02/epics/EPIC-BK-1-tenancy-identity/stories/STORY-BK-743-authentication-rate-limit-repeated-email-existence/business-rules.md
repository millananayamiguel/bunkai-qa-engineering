# BK-743 — Business Rules

> Jira field: `customfield_10152` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-743)

## Business rules

All file references below are measured at `origin/staging` = `c893971f07f780060be64c8a5f96c1b0b6e05625`.

### BR-1 — What the budget is counted against

The count is kept against the ***originating network source*** of the request and against nothing else. It is never kept against the submitted email address.

Counting per address would defeat the purpose: a directory sweep submits a different address every time, so every request would land in a fresh, empty bucket and the budget would never fire. It would also create a second disclosure surface — a per-address bucket that can be probed tells an outsider that somebody else has recently been asking about that address.

### BR-2 — The source is taken from the hosting platform, not from the caller

Whatever value identifies the source is read from the value the hosting platform itself asserts, never from a value a caller can set freely. A caller must not be able to reset its own budget by claiming to be somewhere else.

> ***WARNING:**** ****Implementer note.*** Confirm which forwarding header the current host actually guarantees before relying on one. A header a caller can forge silently turns the entire budget into a no-op that still passes every test written against a single client.

### BR-3 — The budget, and why it is not the number in the non-functional spec

Two rolling windows, both per source, both scoped to this step alone:

| ***Window**** | ****Budget**** | ****What it is for*** |
| --- | --- | --- |
| 60 seconds | 10 checks | Absorbs real human behaviour — a typo and a retry, a password manager, several colleagues signing in at once from one office — while stopping a burst |
| 60 minutes | 60 checks | Caps a patient sweep at roughly 1,440 addresses a day from one source, instead of the ~14,400 a minute-only budget would allow |

The non-functional spec's 100-writes and 600-reads per minute figures are a ***per-PAT budget for the authenticated API***. They do not transfer here and must not be copied here: nobody is signed in at this step, so there is no PAT and no workspace to count against, and 100 a minute would permit around 144,000 address probes a day from a single source, which is not a mitigation at all. This divergence is deliberate and reasoned. Do not "correct" it toward the per-PAT numbers.

### BR-4 — A refusal must not disclose more than an answer would

Every refusal is identical regardless of the address submitted: same outcome, same wording, same wait hint, and no measurable difference in how long it takes to arrive.

The budget is checked ***before*** the account directory is consulted, so at the moment of refusal the product has not looked the address up and physically cannot leak what it would have found. A throttle that answered differently for a known address would make the disclosure ADR-0007 accepted worse rather than better; that is a defect, not a trade-off.

### BR-5 — Malformed submissions spend budget too

A submission that fails validation still counts against the budget. Otherwise a caller buys unlimited free attempts by sending rubbish, and the cheapest sweep becomes the one that never sends a valid address until the last request of each window.

### BR-6 — Every refusal carries a wait hint

A refusal states how many seconds the caller should wait, as the non-functional spec already requires of every rate-limited answer in this product (`.context/SRS/non-functional-specs.md:41`) and as the API map already publishes as the expected shape (`.context/business/business-api-map.md:734-737`).

> ***WARNING:**** ****Implementer note.*** The product's shared error-response builder currently accepts no additional headers (`lib/api/error-envelope.ts:116-129`) — it takes a request id and nothing else. The wait hint will silently never ship unless that builder is extended or the refusal is constructed around it. This is the single most likely way this rule gets quietly dropped, and it will not show up as a failing type check.

### BR-7 — The refusal reuses the published vocabulary

The refusal is the product's existing `rate_limited` outcome, already declared in the closed error-code set (`lib/api/error-envelope.ts:27`), already mapped to its status (`:82`), already published on this step's contract (`app/api/v1/auth/check-email/route.openapi.ts:32`), and already handled by the sign-in screen (`app/(auth)/login/email-first-form.tsx:72-75`). No new error code, no new status, no client change.

### BR-8 — A shared count, not a per-server one

The count is shared across every server answering requests, so one source hitting several servers spends one budget rather than one budget per server. A per-server count is not an acceptable degradation: it multiplies the effective budget by however many servers happen to be warm, which is a number nobody controls or can test against.

### BR-9 — When the count cannot be read

This step cannot answer at all without reading the account directory it already reads, so a failure to read the count belongs to the same class of failure as a failure to answer, and is reported as such. The budget is never silently skipped so that the request can proceed.

### BR-10 — Scoped now, general later

The budget is keyed so that what is counted (a network source now, a PAT later) and where the count is kept are separable concerns. The later per-PAT budget in the non-functional spec should be able to adopt this shape without a redesign. This story still ships it enabled on one step only.



### BR-11 — Source identifier storage

The stored key for the originating network source is a ***salted digest*** of that value, never the raw address/IP. Add the corresponding item to the Definition of Done.

---
_Synced from Jira by sync-jira-issues_
