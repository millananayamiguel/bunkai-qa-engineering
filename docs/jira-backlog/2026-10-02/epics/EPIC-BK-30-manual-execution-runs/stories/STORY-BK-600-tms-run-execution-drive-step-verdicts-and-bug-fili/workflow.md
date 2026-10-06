# BK-600 — Workflow

> Jira field: `customfield_10082` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-600)

## Happy path — a Run walked entirely by keyboard

1. Elena opens a running Run. The first Unrun step is marked as the current step and is in view.
2. She switches to the product under test in her other window, performs the step, and switches back.
3. She presses `P`. The step-result form opens on the current step, pre-set to Pass, with the cursor in the note field.
4. She presses `Cmd+Enter`. The verdict is recorded, the form closes, and the current step moves to the next one.
5. She repeats steps 2 to 4 for each passing step. Her hands never leave the keyboard.

## A failure, and the defect that follows it

1. On step 03, the product misbehaves. Elena presses `F`.
2. The step-result form opens pre-set to Fail, focus in the note field. She types what she observed.
3. She presses `Cmd+Enter`. The step is recorded as Failed and the cursor advances.
4. She presses `ArrowUp` to bring the cursor back onto the failed step.
5. She presses `Cmd+B`. The Report-bug dialog opens, prefilled from that step, with the title field focused and severity at `P3 · Minor`.
6. She types the title. The digits she types land in the title, not on the severity control.
7. She moves focus out of the title and presses `2`. Severity becomes `P2 · Major`.
8. She files the bug. The dialog closes and the cursor is still on the failed step she filed from.

## Skipping a step she is not ready to judge

1. Elena reaches a step that depends on a fixture that is not ready.
2. She presses `Cmd+Enter` with no form open. The cursor moves on and the step stays Unrun.
3. Later she presses `ArrowUp` back to it and records the verdict normally.

## Correcting a mis-picked verdict before it is recorded

1. Elena presses `P`, then realises the step actually failed.
2. With focus outside the note field, she presses `F`. The form's confirm now reads "Mark failed" and everything she typed is still there.
3. She confirms. Nothing was recorded in between.

## What she cannot do by keyboard, and learns immediately

1. On a passing step, Elena presses `Cmd+B` out of habit. Nothing opens, and a short message tells her a bug is filed from a failed step.
2. She presses `P` on a Run that has already finished. Nothing opens, exactly as the buttons themselves would refuse.

## Learning the shortcuts in the first place

1. A tester who has never used them sees the key badge on each verdict control and the legend on the Run screen.
2. The legend shows `Ctrl` or `Cmd` according to the platform they are actually on.
3. Nothing has to be memorised from documentation that lives outside the screen.

---
_Synced from Jira by sync-jira-issues_
