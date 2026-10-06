# BK-743 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-743)

## Phase 3 — Refined Acceptance Criteria

### Original AC1 — A person signing in normally is never throttled

#### Scenario 1.1: Should answer every check normally through a typo-then-retry cycle within budget (Type: Positive, Priority: Critical)

- ***Given***: Elena has made no email-existence checks in the past hour
- ***When***: she submits her address, mistypes it once, corrects it, and continues (2 checks total, well under both windows)
- ***Then***: both checks return 200 with `{exists, confirmed}`; neither is refused; no wait hint appears

#### Scenario 1.2: Should answer every check normally during an office-network morning burst — NEEDS PO/DEV CONFIRMATION (Type: Positive, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: exact count/timing inferred from `workflow.md`'s office-network narrative, not a literal Gherkin scenario
- ***Given***: a source has made no checks in the past hour
- ***When***: ~14 distinct addresses are submitted from that source within a few minutes (each once, a few with one retry)
- ***Then***: every check returns 200 normally; the per-minute window (10/60s) is never tripped because no single 60-second slice exceeds 10 checks

### Original AC2 — A burst from one source is cut off at the minute boundary

#### Scenario 2.1: Should answer normally for exactly the 10th check within the rolling minute (Type: Boundary, Priority: Critical)

- ***Given***: no checks have come from this source in the past hour
- ***When***: 10 different addresses are submitted from that source within one minute
- ***Then***: all 10 return 200

#### Scenario 2.2: Should refuse exactly the 11th check within the same rolling minute (Type: Boundary, Priority: Critical)

- ***Given***: the source from 2.1 has just spent its 10th check inside the current minute
- ***When***: an 11th address is submitted from that source within the same minute
- ***Then***: 429, error code `rate_limited`, body carries a numeric wait-hint in seconds; response is otherwise identical regardless of the 11th address's registration state

### Original AC3 — A slow sweep is cut off at the hour boundary

#### Scenario 3.1: Should answer normally for exactly the 60th check within the rolling hour (Type: Boundary, Priority: Critical)

- ***Given***: a source has stayed under the per-minute budget for the whole hour and has made 59 checks so far
- ***When***: it submits its 60th address inside the same hour
- ***Then***: 200

#### Scenario 3.2: Should refuse exactly the 61st check within the same rolling hour (Type: Boundary, Priority: Critical)

- ***Given***: 60 checks from a source have already been answered within the hour (per-minute budget never tripped)
- ***When***: a 61st address is submitted inside the same hour
- ***Then***: 429, `rate_limited`, numeric wait-hint in seconds

### Original AC4 — A refusal reveals nothing about the address submitted (Scenario Outline — kept as ONE parametrized artifact per test-design-doctrine Part 2.5: same precondition/action, only the address-kind data varies, same outcome shape)

#### Scenario 4: Should refuse identically regardless of address kind once budget is exhausted (Type: Negative, Priority: Critical)

- ***Given***: a source has exhausted its budget
- ***When***: it submits an address of kind `<address_kind>`
- ***Then***: 429, `rate_limited`, identical wording and wait-hint across every row below

| address_kind |
| --- |
| verified account |
| unverified account |
| unregistered address |
| syntactically invalid address |

#### Scenario 4.5: Should show no measurably different response time across all four address kinds above — NEEDS PO/DEV CONFIRMATION on methodology (Type: Boundary, Priority: Critical)

- ***Given***: a source has exhausted its budget
- ***When***: each of the 4 address kinds above is submitted N times (N and tolerance TBD — see Technical Question #7)
- ***Then***: response-time distributions are statistically indistinguishable across kinds

### Original AC5 — Throttling one source does not throttle anybody else

#### Scenario 5.1: Should answer normally for a different source while another source is being throttled — NEEDS PO/DEV CONFIRMATION on test mechanism (Type: Positive, Priority: Critical)

- ***NEEDS PO/DEV CONFIRMATION***: how the test suite legitimately produces two distinct, platform-asserted sources without becoming the same spoofing vector BR-2 defends against (see Critical Question #2)
- ***Given***: a source has exhausted its budget and is being refused
- ***When***: Sara submits her address from a genuinely different network source
- ***Then***: 200, answered normally

### Original AC6 — The budget holds however many servers are answering

#### Scenario 6.1: Should still refuse the 11th minute-window check when requests are served by different server instances — NEEDS PO/DEV CONFIRMATION on test mechanism (Type: Integration, Priority: Critical)

- ***Given***: the product is running on more than one server instance
- ***When***: one source submits 11 addresses within one minute, answered by different instances
- ***Then***: the 11th is still refused — proves the count is shared via the Postgres store, not per-instance memory

### Original AC7 — A malformed submission still spends budget

#### Scenario 7.1: Should refuse a well-formed address once budget was exhausted entirely by malformed submissions (Type: Negative, Priority: High)

- ***Given***: a source has already spent its whole per-minute budget on submissions rejected as malformed (invalid email syntax)
- ***When***: it submits a well-formed address in that same minute
- ***Then***: 429, `rate_limited` — NOT 200, proving malformed submissions counted

#### Scenario 7.2: Should count an unparseable JSON body toward the same budget as a schema-invalid body — NEEDS PO/DEV CONFIRMATION (Type: Edge, Priority: High)

- ***NEEDS PO/DEV CONFIRMATION***: inferred from BR-5's rationale ("otherwise the cheapest sweep sends rubbish"), not literally stated — BR-5's wording ("a submission that fails validation") may or may not have been intended to reach a request whose body isn't valid JSON at all
- ***Given***: a source has budget remaining
- ***When***: it submits a request body that is not valid JSON at all (today: `bad_request`, thrown before `BodySchema.parse` runs)
- ***Then***: TBD — should still decrement the same budget as a schema-invalid-but-parseable submission

### New scenarios surfaced from Phase 2 edge cases — NEEDS PO/DEV CONFIRMATION

#### Scenario E1: Should fail closed when the rate-limit store is unreachable

- ***NEEDS PO/DEV CONFIRMATION***: exact status/error code (BR-9 names the failure class, not the code)
- ***Given***: the Postgres rate-limit store is unreachable at check time
- ***When***: any check is submitted
- ***Then***: the request fails (not silently passes) with the same error class this route already uses for RPC/store failures (`upstream*error`/502, matching the existing `error.code === '429'`→ pattern, or `internal*error`/500) — never a 200

#### Scenario E2: Should guarantee at most the window's budget of successes under a concurrent race at the boundary

- ***Given***: a source is at count 9 within the current minute
- ***When***: two requests for that source arrive simultaneously
- ***Then***: at most 10 total successes are recorded for the window (atomic single-statement increment, per comment #2's ruling); which of the two racing requests is the "winner" is not asserted

---
_Synced from Jira by sync-jira-issues_
