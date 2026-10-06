# BK-600 — Business Rules

> Jira field: `customfield_10152` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-600)

## BR-1 — One cursor, one Run screen, local only

The current step is a view concept belonging to one tester's screen. It is never persisted, never shared, and never moved by another actor's action on the same Run. Two testers watching the same Run may have their cursors on different steps, and that is correct.

## BR-2 — The cursor's traversal order

Steps are ordered by their Acceptance Test Case's position, then by their own position within it. That single ordering defines the whole of "next" and "previous". Traversal never skips a step because it already carries a verdict, and never wraps past either end.

## BR-3 — Initial cursor position

| ***Run state on open**** | ****Cursor lands on*** |
| --- | --- |
| At least one step is Unrun | the first Unrun step in traversal order |
| Every step carries a verdict | the first step in traversal order |
| The Run has zero steps | no cursor exists; every shortcut is inert |

## BR-4 — A keypress never commits a verdict on its own

`P`, `F` and `B` open the step-result form pre-set to that verdict. The verdict reaches the record only through that form's own confirm action. This holds because a recorded verdict has no return path to Unrun: an accidental keypress that committed directly would be unrecoverable by the tester who made it.

## BR-5 — Shortcut eligibility mirrors control eligibility, exactly

A shortcut may never reach an action its visible control would refuse.

| ***Shortcut**** | ****Fires only when*** |
| --- | --- |
| `P` / `F` / `B` | the Run is running ***and*** the actor may record step results |
| `Cmd+Enter` | a cursor exists on the Run screen |
| `Cmd+B` | the actor may report bugs ***and*** the current step reads Failed |
| `1`-`4` | the Report-bug dialog is open |

A shortcut that is refused changes nothing and says so briefly. It never fails silently and it never fails loudly enough to interrupt.

## BR-6 — Text input always wins

No shortcut fires while the keyboard focus sits in a text input, a text area, a select or any editable region. This is absolute and admits no exception, including the severity digits inside the Report-bug dialog whose title field takes focus the moment it opens.

## BR-7 — Overlays claim the keyboard

While the abort confirmation, the finish confirmation or the Report-bug dialog is open, the Run screen's own shortcuts are inert. Only the bindings defined for the open surface are live — which today means the severity digits, and only inside the Report-bug dialog.

## BR-8 — A held modifier suppresses the single-key bindings

`P`, `F`, `B` and the digits `1`-`4` fire on the bare key only. Any Command, Control, Alt or Meta modifier suppresses them and leaves the combination to the browser and the operating system. `Cmd+Enter` and `Cmd+B` are the two deliberate exceptions, and each maps to `Ctrl` on platforms without a Command key.

## BR-9 — Bindings are read by physical key position

The three verdict keys occupy fixed positions on the keyboard, not fixed characters in a character set. A tester on a Dvorak, AZERTY or Cyrillic layout reaches the same three physical keys the legend draws.

## BR-10 — After a commit, the cursor advances by one

A committed verdict moves the cursor one step forward in traversal order and stops at the last step. This is the only automatic cursor movement in the feature. Cancelling the form moves nothing.

## BR-11 — The legend states what is actually bound

The visible legend and the per-control key badges are the contract with the tester. A binding that exists but is not drawn, or drawn but not bound, is a defect. The legend renders the modifier the tester's own platform uses.

## BR-12 — The cursor is announced, never colour-only

The current step is exposed to assistive technology as the current item in the list. Where the cursor and a deep-linked bug highlight land on the same step, both remain present and remain distinguishable from one another.

---
_Synced from Jira by sync-jira-issues_
