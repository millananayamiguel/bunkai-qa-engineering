# DEFECT: Settings > Tokens: zero-scope submission gives no inline validation error, only a silently disabled control (AC2)

**Jira Key:** [BK-1079](https://jira.upexgalaxy.com/browse/BK-1079)
**Related Story:** [BK-88](https://jira.upexgalaxy.com/browse/BK-88) - Settings | Manage Personal Access Tokens
**Priority:** Low
**Status:** In Review
**Components:** Bunkai API Tokens
**Severity:** Menor
**Fix Type:** Bugfix

---

## Description

## Summary

AC2 of BK-88 requires that a zero-scope submission surfaces an ***inline validation error*** reading "At least one scope is required." The shipped form instead disables the submit control silently: no message is rendered, and nothing tells the user or a screen reader why the control cannot be used.

The substantive half of AC2 holds - no token is created and no POST is sent - so this is a conformance and accessibility gap, not a data or security problem.

## Environment

staging - https://staging-upexbunkai.vercel.app/settings/tokens, verified 2026-09-17.

## Steps to reproduce

1. Sign in and open Settings > Tokens.
2. Click "New token".
3. Type any name in "Token name".
4. Leave every scope checkbox unchecked.
5. Attempt to submit.

## Expected

An inline validation error is shown, worded per AC2 as "At least one scope is required.", and it is programmatically associated with the control so assistive technology announces it.

## Actual

- The submit control is `disabled`, so the form cannot be submitted at all.
- No element carrying `role="alert"` or `aria-live` holds any message. Measured in-page: `inlineMessages: []`.
- The submit control has no `aria-describedby`, so nothing explains the disabled state.
- The only related text is the static fieldset legend "Scopes - at least one", which is a field hint rendered before any interaction, not a response to the user's attempt.

## Why it matters

A disabled control with no stated reason is the classic dead-end: a sighted user can often infer the cause from the legend, a screen-reader user cannot, and neither is told what to do next. It is also a literal deviation from a written acceptance criterion, so leaving it unrecorded would let the story close against an AC it does not meet.

## Suggested fix

Either render the AC2 message when the user attempts to submit with no scope selected, or keep the control enabled and let the submit produce the message. If the team prefers the disabled-control pattern, associate an `aria-describedby` hint with it and amend AC2 so the specification and the product agree.

## Evidence

- `.context/PBI/epics/EPIC-BK-85-account-settings/stories/STORY-BK-88-settings-manage-personal-access-tokens/evidence/w1-tc18-zero-scopes-no-inline-error.png`
- Test case BK-1042 (TC18), run recorded FAILED in ATR BK-1060.

---

## Related Issues

- created by: [BK-1042](https://jira.upexgalaxy.com/browse/BK-1042) - BK-88: TC18: should block submission and create no token when no scope is selected in the issue-token form
- created by: [BK-1060](https://jira.upexgalaxy.com/browse/BK-1060) - ATR: BK-88: Story Testing
- created by: [BK-88](https://jira.upexgalaxy.com/browse/BK-88) - Settings | Manage Personal Access Tokens

---

## Metadata

- **Created:** 2026-09-18
- **Updated:** 2026-09-24
- **Reporter:** Ely
- **Assignee:** Ely

---

_Synced from Jira by sync-jira-issues_
