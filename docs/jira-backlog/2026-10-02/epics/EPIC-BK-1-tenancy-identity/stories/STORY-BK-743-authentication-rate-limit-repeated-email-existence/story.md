# Authentication | Rate-limit repeated email-existence checks

**Jira Key:** [BK-743](https://jira.upexgalaxy.com/browse/BK-743)
**Epic:** [BK-1](https://jira.upexgalaxy.com/browse/BK-1) (Tenancy & Identity)
**Type:** Story
**Status:** Ready For Dev
**Priority:** Medium
**Story Points:** 8

---

## Overview

## Overview

***Source spec:**** NFR §2 "API rate limits" (`.context/SRS/non-functional-specs.md:41`) — a non-functional requirement, not an FR id. The governing contract is ****ADR-0007 — Password-Primary Auth & Mandatory Email-OTP Verification*** (Accepted, Implemented), which accepted an email-enumeration tradeoff on the email-first sign-in step and filed its real mitigation as a separate story. This is that story.

## User story

***As a*** Mateo Silva, QA Lead at a regulated-industry company, who owns the workspace his team signs in to

***I want to*** stop an outsider from harvesting which of my team's email addresses have Bunkai accounts, without making my own people's sign-in slower or flakier

***So that*** the account directory I am accountable for in a compliance review is not something anyone on the internet can enumerate at will

## Context — why this story exists

When [https://jira.upexgalaxy.com/browse/BK-166#icft=BK-166](https://jira.upexgalaxy.com/browse/BK-166#icft=BK-166) made the sign-in screen email-first, it introduced a step that answers, for any submitted address, whether that address has an account and whether that account is verified. That answer is what lets the screen route a person to "sign in", "verify your email", or "create an account" before asking for a password — and it is also, unavoidably, a yes/no oracle about who is registered.

ADR-0007 accepted that tradeoff explicitly and on the record, and named exactly one mitigation for it: an application-level rate limiter. It was filed as a follow-up "separate story" and never created.

> ***NOTE:*** Two facts make this more than paperwork.

- ***The platform's own throttling does not reach this step.*** ADR-0007 `:61` records that the email-existence check reads the account directory through a privileged database function rather than through the authentication service, so that service's built-in abuse throttling never sees it. The other public sign-in and sign-up steps go through the authentication service and inherit its throttling; this one does not.
- ***Nothing else fills the gap.*** No application-level rate limiting exists anywhere in the product today. A search of the application and library trees at `origin/staging` returns no limiter, which is what both the non-functional spec and the API map already say in writing.

The refusal vocabulary this story needs already ships. A rate-limited outcome is a published error code, this step already documents that outcome in its published contract, and the sign-in screen already renders a "too many attempts, wait and retry" message when it receives one. Nothing in the client or the error contract needs inventing — only the enforcement behind it.

## Definition of done

- [ ] Repeated email-existence checks from one source are refused once they pass a published budget, and that budget is low enough that sweeping a directory from a single source stops being practical
- [ ] A person signing in normally — including one who mistypes their address and retries, and one sharing an office network with colleagues — never sees a refusal
- [ ] A refusal is indistinguishable whether the submitted address is registered, unverified, unregistered or malformed: same answer, same wait hint, no new signal, no measurable timing difference
- [ ] Every refusal tells the caller how long to wait
- [ ] The budget survives the product running on more than one server at a time — it is not per-server bookkeeping that resets when a request lands somewhere else
- [ ] The ADR-0007 follow-up entry that filed this work is closed out with a pointer to the outcome

## Three Amigos

***Product.*** The value here is not a feature anyone can see; it is the removal of a finding. The question a compliance reviewer asks is "can an outsider list which of your people have accounts?", and today the honest answer is "yes, slowly". After this story the answer is "not from any one place, at any useful rate". The decision that mattered was refusing to close the oracle entirely — the product needs the email-first routing [https://jira.upexgalaxy.com/browse/BK-166#icft=BK-166](https://jira.upexgalaxy.com/browse/BK-166#icft=BK-166) built, and shutting the step down would break sign-in for everyone to inconvenience an attacker who has other routes anyway. Throttling is the ratified answer, not a compromise invented here.

***Development.*** Two things were genuinely open and were settled on this ticket rather than deferred: what a budget is counted against on a step where nobody is signed in yet (there is no account and no workspace to count against, so the non-functional spec's "per token, per workspace" phrasing simply does not apply), and where the count is kept when the product runs on many short-lived servers. Both rulings, with the alternatives scored, are posted as comments on this ticket. The reusable-shape question — whether this becomes the general limiter the non-functional spec describes — is deliberately answered "not yet": build it so it generalises, ship it scoped to one step.

***Test.*** The interesting cases are not the happy path. They are the boundary (the last allowed check and the first refused one), the refusal being identical for a registered and an unregistered address, the wait hint actually being present, a shared office network not tripping the budget during a morning sign-in rush, and the budget still holding when a sweep is spread across servers or paced out over an hour instead of burst. Timing is a real test surface here: a refusal that comes back measurably faster for an unknown address would reintroduce the leak this story exists to close.

## Sequencing

Independent. Nothing blocks it and it blocks nothing — the error code, the published contract and the client's handling of a refusal all already ship. It is the deferred half of [https://jira.upexgalaxy.com/browse/BK-166#icft=BK-166](https://jira.upexgalaxy.com/browse/BK-166#icft=BK-166) (Ready For Release) and can be picked up whenever an auth-hardening slot opens.

The broader per-PAT budget for the authenticated API (`.context/master-implementation-plan.md:218`, sequenced in Master Sprint 6, load-tested in Master Sprint 7 at `:235`) is a ***different, later*** story. This one deliberately does not deliver it, and deliberately does not reuse its numbers — see the Out Of Scope and Business Rules fields.

***Design.*** No screen of its own — this is a behaviour change behind an existing step. The sign-in screen is the only caller in the product and its wording and layout are unchanged, because it already handles a rate-limited answer. The master design plan §8 row for this story records "no screen".

## Provenance

All line references measured at `origin/staging` = `c893971f07f780060be64c8a5f96c1b0b6e05625`.

| ***Source**** | ****What it establishes*** |
| --- | --- |
| `.context/ADR/ADR-0007-password-auth-and-email-otp.md` | Origin. Points 1 and 5 (`:30`, `:38`), consequences (`:48`, `:50`), the "separate story" follow-up (`:52`), the "GoTrue throttling does not cover this route" finding (`:61`), and the still-open implementation status (`:83`) |
| `.context/SRS/non-functional-specs.md:41` | API rate limits recorded as "TARGET, NOT IMPLEMENTED" |
| `.context/business/business-api-map.md:730-739` | §7.5, the same finding from the API-contract side, plus the target table and the wait-hint expectation |
| `.context/master-implementation-plan.md:68, 218, 220, 235` | Where the general per-PAT limiter sits in the roadmap |
| `app/api/v1/auth/check-email/route.ts:14-24` | The accepted tradeoff, recorded in the code itself |
| `app/api/v1/auth/check-email/route.openapi.ts:32` | The rate-limited outcome already published on this step's contract |
| `lib/api/error-envelope.ts:27, 82` | The rate-limited error code and its status mapping, already shipped |
| `app/(auth)/login/email-first-form.tsx:62-96` | The only caller, and its existing handling of a rate-limited answer |

---

## QA Refinements (Shift-Left Analysis) — Added 2026-09-02

> Refined Acceptance Criteria live in the `acceptance_criteria` field.

### Edge Cases Identified

| # | Edge case | In original Story? | Criticality | Action |
| --- | --- | --- | --- | --- |
| 1 | Unparseable JSON body — does it spend budget? | No | High | Add to AC (PO confirm) |
| 2 | Rate-limit store unreachable — fail-closed status code | No | High | Add to AC (PO confirm) |
| 3 | Concurrent race at count=9 boundary — aggregate ≤10 guarantee | No (implied by comment #2's atomicity ruling) | Medium | Test only — don't add AC |
| 4 | Salted-digest-before-storage of the source value | Comment-only, not in BRs | High | Formalize as BR-11 + DoD line (PO confirm) |
| 5 | Office-network multi-person burst under both windows | workflow.md narrative only, no Gherkin AC | Medium | Add to AC (PO confirm) |
| 6 | Per-hour window recovery symmetry | No (implied by BR-3 + minute-window recovery scenario) | Low | Test only — don't add AC |
| 7 | Timing side-channel assertion tolerance/methodology undefined | No | Medium | Resolve as a Technical Question before Stage 1 automates it |

### Clarified Business Rules

- The stored source-identifier key is a ***salted digest*** of the originating source value, never the raw address/IP — this rule currently lives only in a Tech-Lead comment on the ticket, not in the 10 numbered Business Rules or the Definition of Done. It is being surfaced here because an implementer who reads only the numbered BRs (a realistic failure mode this Story's own BR-6 warning already anticipates) would otherwise ship a table storing raw source identifiers in cleartext — a data-minimization/PII gap that directly undercuts the compliance narrative motivating this Story.
- The key shape is `scope:identifier:step` (from the same Tech-Lead comment) but is not reflected in BR-10's general framing — worth folding in for the implementer building the later per-PAT reuse BR-10 anticipates.
- Pipeline ordering is implied but never stated as a single sequence: resolve source → check/increment budget → (refuse regardless of body validity if over budget) → validate body → call the `auth*email*status` RPC. This ordering is required to satisfy BR-5 (malformed still spends budget) and BR-4 (budget checked before the directory lookup) simultaneously.

### ⚠️ Feasibility flag — citation does not resolve

Comment #2 on this ticket cites `supabase/migrations/0075*run*inactivity*sweep.sql` as existing precedent for sweeping expired rate-limit rows. ***This migration does not exist**** in `origin/staging` (current HEAD `7d63814b8523…`; highest migration present is `0037*run*finish.sql`). The underlying reuse argument for the **table shape* still holds — `idempotency*keys` (migration `0009*cross*cutting.sql`) is a real, directly reusable precedent for the atomic single-statement counter pattern — but the sweep-job itself has no code to copy and needs to be designed fresh. See Technical Question #1 below.

### Critical Questions for PO

> These BLOCK sprint planning until answered.

1. ***Should the "salted digest, not raw address" requirement (currently stated only in a Tech-Lead comment) be formalized as a numbered Business Rule and Definition-of-Done item?***

1. ***How does the automated test suite legitimately produce multiple distinct, platform-verifiable "originating network sources" to prove the cross-source-isolation and multi-server shared-count scenarios, given BR-2 by design forbids a caller from freely setting that value?***

1. ***Which forwarding header does the hosting platform (Vercel) actually guarantee as un-spoofable for an unauthenticated caller, and is that confirmed against the real deployment config — not just assumed?***

### Technical Questions for Dev

> These do not block PO but block implementation.

1. `supabase/migrations/0075*run*inactivity*sweep.sql`, cited as an existing sweep-job precedent, does not exist in `origin/staging`. The store-seam reuse argument still holds via `idempotency*keys` (migration `0009`), but a fresh sweep job needs to be designed.
2. Exact pipeline order: does the budget check run before Zod body validation and before the `auth*email*status` RPC call? Suggested: resolve source → check/increment budget → (refuse if over, regardless of body validity) → validate body → call RPC.
3. Does a request with unparseable JSON spend budget the same as a schema-invalid-but-parseable body?
4. What HTTP status/error code should a rate-limit-store read failure map to — `upstream*error` (502) or `internal*error` (500)?
5. Under a genuine race at the boundary, should tests assert only the aggregate outcome (≤10 total successes) rather than which specific request "wins"?
6. Should the wait-hint's exact field name/shape be added to the OpenAPI contract (`ErrorEnvelopeSchema.details` is currently untyped `z.unknown()`)?
7. What tolerance or methodology should the "no measurably different time" assertion use in an automated test — fixed threshold, statistical comparison over N samples, or a code-review check of the ordering guarantee instead of a runtime timing measurement?

> Full refinement (Phases 1-5, coverage outlines, risk + data feasibility) lives in the ATP — the `acceptance*test*plan` field. `/sprint-testing` Stage 1 later materializes it as the Test Plan issue.

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Workflow](./workflow.md)

---

## Metadata

- **Created:** 2026-08-31
- **Updated:** 2026-09-07
- **Reporter:** Ely
- **Assignee:** Ely
- **Labels:** shift-left-2026-09-02, shift-left-reviewed

---

_Synced from Jira by sync-jira-issues_
