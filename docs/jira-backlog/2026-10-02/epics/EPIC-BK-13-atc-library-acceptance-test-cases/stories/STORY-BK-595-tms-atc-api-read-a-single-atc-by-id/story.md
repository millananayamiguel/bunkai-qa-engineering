# TMS-ATC API | Read a single ATC by id

**Jira Key:** [BK-595](https://jira.upexgalaxy.com/browse/BK-595)
**Epic:** [BK-13](https://jira.upexgalaxy.com/browse/BK-13) (ATC Library (Acceptance Test Cases))
**Type:** Story
**Status:** Backlog
**Priority:** Medium
**Story Points:** -

---

## Overview

***Source spec:*** BK-035 — CRUD endpoints exposed (`.context/SRS/functional-specs.md`). This is an SRS functional-requirement id, not a Jira issue key.

## User story

***As a*** "Karim", the autonomous AI test agent that authenticates to Bunkai with a Personal Access Token
***I want to*** fetch one Acceptance Test Case by its id, and ask for its steps, assertions, anchored Acceptance Criteria and chaining Tests in the same round-trip
***So that*** I can resolve a case I already hold the id for without pulling and filtering a whole listing

## Definition of done

- [ ] A caller holding an ATC id can read that ATC by id over the public API and receives the ATC in the standard response envelope
- [ ] The published `expand` parameter is honoured for the four documented expansions, and an unexpanded read stays lean
- [ ] A caller who cannot see the ATC's workspace cannot learn whether the id exists
- [ ] An archived ATC is not returned by this read
- [ ] The route declares a capability posture consistent with its sibling read routes, and a token lacking it is refused
- [ ] The single-entity read target published in the non-functional specs becomes measurable instead of unmeasurable

## Context

The public API exposes the ATC entity as ***write-only by id***. `app/api/v1/atcs/[id]/route.ts` exports `PATCH` and nothing else; `app/api/v1/atcs/route.ts` exports `POST` and nothing else. There is no way to read an ATC over the API at all — not by id, and not as a projection of anything else.

The gap is a routing gap, not a capability gap. The backing read already exists and is already exercised in production code: `lib/supabase/rpc.ts` wraps `bunkai*get*atc`, and the `PATCH` handler itself calls it on the empty-body no-op path. So the composed ATC payload is already being produced, already authorization-gated, and already correct — it is simply never reachable from a URL.

Every sibling entity shipped the full triple. `user-stories/{id`} and `acceptance-criteria/{id`} each export `GET`, `PATCH` and `DELETE`. ATC is the outlier.

Two published commitments are currently unhonoured:

- `.context/SRS/api-contracts.yaml` publishes `get: Get an ATC (expandable)` on `/atcs/{atc*id`}, with an `expand` query parameter documented as `steps,assertions,acceptance*criteria,used_in`.
- `.context/SRS/non-functional-specs.md` sets a `< 200ms p95` target for single-entity reads and names exactly one path to illustrate it: `GET /atcs/{id`}. It is the only endpoint named by path anywhere in that performance table. A target cannot be measured against a route that answers 404.

## What this story is not

This does ***not*** unblock the `bunkai atc list` CLI command. That command maps to `BK-011` — ATC search and autocomplete — which is the listing endpoint with a query parameter, a different route entirely. Nothing in this story touches it.

## Sequencing

Sequence this ***after BK-499***. That Story is in `Ready For QA` and its definition of done asserts a grep-verified count of 24 handlers across 21 files receiving a resolved capability posture. Landing a new read handler in the same domain while that count is being verified invalidates the coverage check the Story is being tested against. Once [https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499](https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499) clears, this route declares its capability posture in the same shape its sibling reads already use, so the posture decided across [https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497](https://jira.upexgalaxy.com/browse/BK-497#icft=BK-497) / [https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498](https://jira.upexgalaxy.com/browse/BK-498#icft=BK-498) / [https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499](https://jira.upexgalaxy.com/browse/BK-499#icft=BK-499) extends to it by construction rather than by a second decision.

## Provenance

Authored 2026-08-22 from the published `get` operation in `.context/SRS/api-contracts.yaml`, the single-entity read target in `.context/SRS/non-functional-specs.md`, and a read of the live route and RPC files confirming the handler is absent while its backing read is present and already called. No open product or technical question was found: the response shape, the expansions, the archived-row behaviour and the capability posture are each already settled by a published contract or an existing sibling route.

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Business Rules](./business-rules.md)
- [Scope](./scope.md)
- [Out Of Scope](./out-of-scope.md)
- [Workflow](./workflow.md)

---

## Traceability

### Story (1)

- [BK-499](https://jira.upexgalaxy.com/browse/BK-499): PAT | Enforce capability scopes on read, identity and notification routes _(Ready For Release)_

---

## Metadata

- **Created:** 2026-08-23
- **Updated:** 2026-08-31
- **Reporter:** Ely
- **Assignee:** Unassigned

---

_Synced from Jira by sync-jira-issues_
