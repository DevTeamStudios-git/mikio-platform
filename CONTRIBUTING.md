# CONTRIBUTING.md

**Mikio AI — Contributing Guide**
Company: DevTeamStudios (DTS)
Status: v1.0
Last updated: 2026-07-30

This is the short, practical version: how to actually get a change from idea to merged. For the *rules and reasoning* behind each step, see [`DTS_ENGINEERING_HANDBOOK.md`](./DTS_ENGINEERING_HANDBOOK.md) — this document won't repeat them.

---

## Before You Start

1. Check `ROADMAP.md` and existing issues — is this already planned, in progress, or explicitly out of scope?
2. For anything beyond a small fix, open an issue first describing what you want to change and why. This avoids duplicate work and surfaces disagreement early.
3. If your change touches an architectural boundary, a layer defined in `ARCHITECTURE.md`, or a locked decision in `TECH_STACK.md`, flag that in the issue — it needs the review path described in handbook §13, not a quick PR.

## Making a Change

```
1. Branch
      ↓
2. Implement
      ↓
3. Test
      ↓
4. Document
      ↓
5. Open PR
      ↓
6. Review
      ↓
7. Merge
```

### 1. Branch
Branch off `main`. Name it `feature/<short-description>` or `fix/<short-description>`. Experimental or unproven work belongs under `ai/research`, not a feature branch off `main` — see handbook §11.

### 2. Implement
Follow the code standards and architecture rules in the handbook (§4–5). If you're an AI assistant contributing, read handbook §12 before making changes.

### 3. Test
Add or update tests appropriate to what changed — unit, integration, e2e, or an evaluation run, per handbook §8. A non-trivial change with no tests is not ready for review.

### 4. Document
If your change affects something a future contributor would need to know — new folder, new dependency, new boundary, a non-obvious technical trade-off — update the relevant doc in the *same* change:

| Change touches... | Update... |
|---|---|
| Repo structure or layer boundaries | `ARCHITECTURE.md` |
| A technology choice | `TECH_STACK.md` |
| A significant decision with real trade-offs | A new ADR in `docs/architecture/decisions/` |
| How contributors should work | `DTS_ENGINEERING_HANDBOOK.md` |

### 5. Open a PR
Describe **what** changed and **why**. The "why" can just link to an issue, ADR, or the relevant doc section — you don't need to re-explain reasoning that's already written down elsewhere.

### 6. Review
At least one approval is required. Reviewers check correctness, handbook adherence, and whether docs were updated. Don't take review pushback personally — it's checking the change against the same handbook everyone else is held to.

### 7. Merge
Once approved and CI passes, merge. `main` is always deployable — don't merge something you know is broken with a plan to "fix it in a follow-up."

## A Few Things Worth Repeating

- **Small PRs beat large ones.** If your change is hard to review, it's probably doing too much at once.
- **`main` is never force-pushed**, and neither is any release branch.
- **Don't invent requirements.** If something's ambiguous, ask in the issue rather than guessing and presenting the guess as settled.
- **Terminology:** the current foundation model is DeepSeek. `STR-3.5 Pro` refers to DTS's own fine-tuned model — don't use the two names interchangeably before the corresponding STR checkpoint actually exists.

## Reporting Bugs or Requesting Features

Open a GitHub issue. Include:
- What you expected vs. what happened (for bugs)
- Which layer/folder it likely touches (`apps/`, `ai/`, `backend/`, `frontend/`, etc.)
- Any relevant logs, reproduction steps, or context

## Reporting a Security Issue

Do **not** open a public issue. Follow the process in [`SECURITY.md`](./SECURITY.md) instead.

## Questions

If something in this guide, the handbook, or the architecture docs is unclear, that's worth raising as an issue itself — documentation gaps are bugs too.
