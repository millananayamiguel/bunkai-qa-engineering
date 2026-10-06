# BK-743 — Workflow

> Jira field: `customfield_10082` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-743)

## Workflow

### The normal path — nobody notices anything

1. Elena opens the sign-in screen and submits her work address.
2. The screen recognises the address and takes her straight to the password step.
3. She mistypes her password once, retries, and gets in. She was never near the budget, and the screen behaved exactly as it does today.

### The office-network path — many people, one source

1. It is 9:05am. Fourteen people at Mateo's company sign in within a few minutes, all from the same office network, so all from one source.
2. Each address is checked once, occasionally twice after a typo. The short window absorbs it. Nobody is refused.
3. Nothing lands in Mateo's inbox and nothing changes in anyone's day. This is the case the short window exists to protect, and the reason the budget is not tighter still.

### The sweep — what this story is actually for

1. Someone with a list of 50,000 addresses starts feeding them to the sign-in screen from one place, to learn which of them belong to Bunkai accounts.
2. The first ten answers come back normally. The eleventh, inside the same minute, is refused, with a hint saying how long to wait.
3. They slow down to stay under the short window. After sixty checks in the hour they are refused again, and the pace they are left with turns a morning's work into years of it.
4. They try padding the list with rubbish submissions to reset the count. It does not help — every submission spends budget, valid or not.
5. They study the refusals, hoping the refusal itself reveals which addresses were real. There is nothing to find: the product refused before it ever looked the address up, so the refusal carries no knowledge of it.
6. They spread the list across many sources. That is beyond what a per-source budget can see, and it is named out of scope — but the cheap single-source version, the one ADR-0007 was worried about, is gone.

### What a compliance reviewer sees afterwards

Mateo is asked whether an outsider can list which of his team have accounts. He can now answer that the check is budgeted per source, that the budget is published and tested, that exceeding it is refused identically for every address, and that the ADR which accepted the underlying disclosure now points at the control that bounds it.

---
_Synced from Jira by sync-jira-issues_
