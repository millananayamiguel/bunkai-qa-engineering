# BK-600 — Scope

> Jira field: `customfield_10129` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-600)

> ***INFO:*** Every item below is drawn in the frozen Test Runner mockup (`run.jsx:212-214`, `run.jsx:248`) or required by the §4.5 screen spec (`master-design-plan.md:200`). Nothing here is invented.

## 1. A focused-step cursor on the Run screen

- Exactly one step is the current step at any moment, across all Acceptance Test Cases in the Run
- It starts on the first Unrun step, or on the very first step when nothing is Unrun
- Up and Down arrows move it one step at a time, crossing Acceptance Test Case boundaries, without wrapping at either end
- Clicking a step moves it there
- It advances by one after a verdict is committed, and holds still at the last step
- The step it sits on scrolls into view
- It is announced to assistive technology as the current step, and never signalled by colour alone
- It stays put when somebody else records a verdict on the same Run

## 2. Verdict keys on the current step

| ***Key**** | ****Effect*** |
| --- | --- |
| `P` | opens the step-result form on the current step, pre-set to Pass |
| `F` | opens the step-result form on the current step, pre-set to Fail |
| `B` | opens the step-result form on the current step, pre-set to Block |

- The form is the one that already exists; the note and evidence fields keep their current optional status
- Focus lands in the note field when the form opens by keyboard
- Pressing a different verdict key while the form is open re-picks the verdict and keeps whatever was typed
- Committing still requires the form's own confirm action

## 3. Advancing without recording a verdict

- `Cmd+Enter` on macOS, `Ctrl+Enter` everywhere else, moves the cursor to the next step in document order
- It lands on already marked steps as readily as on Unrun ones
- It is a no-op on the last step of the last Acceptance Test Case
- With a step-result form open, it commits that form and then advances

## 4. Opening the Report-bug dialog

- `Cmd+B` / `Ctrl+B` opens the Report-bug dialog for the current step
- It carries the same prefill the existing per-step button carries
- It obeys the same eligibility rule that button obeys, and explains itself briefly when refused

## 5. Severity keys inside the Report-bug dialog

- `1` through `4` set severity to `P1 · Critical`, `P2 · Major`, `P3 · Minor` and `P4 · Trivial`
- They are live only while that dialog is open
- Each severity control shows its digit

## 6. Guards that make the above safe

- No shortcut fires while focus sits in a text field, a select or an editable region
- No shortcut fires while the abort, finish or Report-bug confirmation is open, except the ones defined for that surface
- A bare verdict key never fires while a modifier is held
- Verdict keys obey exactly the conditions the visible verdict controls obey: the Run is running and the actor may record results
- Key bindings are read by physical key position, so a non-QWERTY layout is not locked out

## 7. Discoverability

- Each verdict control carries its key badge, as drawn at `run.jsx:212-214`
- The Run screen shows the shortcut legend drawn at `run.jsx:248`, without needing to scroll to find it
- The legend names the platform's own modifier

---
_Synced from Jira by sync-jira-issues_
