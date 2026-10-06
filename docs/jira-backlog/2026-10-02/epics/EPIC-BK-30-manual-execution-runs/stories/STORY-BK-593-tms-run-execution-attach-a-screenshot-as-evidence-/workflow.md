# BK-593 — Workflow

> Jira field: `customfield_10082` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-593)

1. Elena, a Senior QA Engineer, is midway through a manual Run. On step 4 the application under test shows a validation message that should not be there.
2. She marks the step failed. What she needs the record to carry is not a sentence describing the screen — it is the screen.
3. Today she would screenshot it, drop the image somewhere else entirely, copy a link back, and paste that link into the notes. The Run then depends on a service Bunkai does not control, and on that link still resolving whenever someone reads the Run.
4. Instead she attaches the screenshot directly from her machine, on the step itself. It appears as a thumbnail on the step result, and she can open it full size to check she captured the right thing.
5. She attaches a second image, of the network panel, because one picture is not the whole story. Both sit on the same step result.
6. She realises the first capture cropped the message off, removes it, and attaches a better one. The Run is still running, so the correction is hers to make.
7. She grabs the wrong file — a log, not an image. Bunkai refuses it and tells her what it accepts, and step 4 keeps the evidence it already had.
8. She tries a very large capture. Bunkai refuses it and names the limit, rather than failing silently or half-storing it.
9. Her connection drops mid-upload. Nothing is recorded: step 4 still reads failed, still carries her note, and still holds the evidence attached before the drop.
10. She still has a link to a recording in another tool, so she pastes it exactly as she always has. That path is untouched, and the link and the images sit together as the step's evidence.
11. The Run finishes. Weeks later Mateo, the QA Lead, opens it during a release review and sees the screenshots inside the Run, not a link to somewhere that no longer answers.
12. A tester from another Workspace, handed the reference to one of those images, cannot open it. The image is readable only inside the Workspace that owns the Run.

---
_Synced from Jira by sync-jira-issues_
