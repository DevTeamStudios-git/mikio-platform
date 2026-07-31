# DTS_ENGINEERING_HANDBOOK.md

**DevTeamStudios — Engineering Handbook**
Applies to: Mikio AI and all DTS repositories
Status: v1.0 (Locked)
Last updated: 2026-07-30

This handbook governs **how DTS engineers — human and AI — work.** It does not restate why Mikio exists, how it's structured, or what technologies it uses. Those live elsewhere:

```
PROJECT_CHARTER   → Why
ARCHITECTURE      → How Mikio is structured
TECH_STACK        → With what
HANDBOOK (this)   → How we work
```

If you find yourself writing "we use NestJS because..." or "the mission is..." in this document, that content belongs in `TECH_STACK.md` or `PROJECT_CHARTER.md` instead — move it there.

---

## 1. Purpose & Scope

This handbook applies to every contributor to any DTS repository, including AI assistants proposing or making changes. It is the practical rulebook: what to do, not why the project exists. When this handbook conflicts with a personal preference or an external convention, this handbook wins. When it conflicts with `PROJECT_CHARTER.md`, the charter wins — file an issue to resolve the conflict.

## 2. Engineering Principles

These are inherited directly from `PROJECT_CHARTER.md` and translated into working rules. They are not open to reinterpretation per-PR.

- **Developer First** — every change is judged by whether it makes a real developer workflow better, not by novelty or personal preference.
- **Documentation First** — a change without documentation is an incomplete change. See Section 7.
- **Reproducibility** — anyone should be able to reproduce a result (a build, a dataset, a trained model) from documented inputs alone.
- **Privacy First** — no undocumented collection, logging, or use of user or customer data, ever.
- **Scientific Methodology** — decisions are evaluated, not assumed. Prefer a small proof of concept over a confident guess.
- **Simplicity** — the simplest solution that meets the requirement wins. Complexity must be justified by a demonstrated need, not a hypothetical one (see the Electron-over-Tauri decision in `TECH_STACK.md` as the reference example).

## 3. Repository Rules

### Monorepo Philosophy
Mikio AI is a single monorepo at Stage 1 (see `ARCHITECTURE.md` §11). Don't fragment it into extra repositories preemptively; splitting happens only at the documented growth stages.

### Folder Responsibilities
Every folder has exactly one responsibility, as defined in `ARCHITECTURE.md` §3. Don't add code to a folder for convenience if it belongs elsewhere — e.g., business logic never lives in `frontend/`, and AI execution logic never lives in `backend/api`.

### Naming
- Repositories, packages, and folders use `kebab-case`.
- Product naming uses `mikio-*`, not `str-*` (the `str-` prefix is reserved for model-family artifacts inside `ai/models/`, per the repository philosophy established during planning).
- No ambiguous names (`utils2`, `new-api`, `temp`). If you can't name it clearly, its responsibility probably isn't defined yet.

### Repository Boundaries
- `ai/`, `backend/`, and `frontend/` communicate through defined interfaces (API contracts), never by reaching into each other's internals.
- Next.js API routes are frontend-only, per `TECH_STACK.md` §2 — they are never a substitute for NestJS.

## 4. Code Standards

### TypeScript
- Strict mode on, everywhere. No `any` without a comment explaining why.
- Shared types belong in `packages/`, not duplicated across `frontend/` and `backend/`.

### Python
- Type hints required on public functions, especially in `ai/training` and `ai/evaluation`.
- Follow PEP 8; formatting is enforced by tooling, not by hand (Section on formatting below).

### Formatting
- TypeScript/JS: Prettier + ESLint, enforced in CI — not a matter of individual style.
- Python: enforced via `uv`-managed tooling (e.g. `ruff`/`black`), also CI-enforced.

### Type Safety
Prefer compile-time errors over runtime errors. If a bug could have been caught by a type, that's a signal to tighten the types, not just fix the bug.

### Error Handling
- Errors are handled explicitly, not swallowed. No empty `catch` blocks.
- User-facing errors are clear and actionable; internal errors are logged with enough context to debug without reproducing the issue live.

### Dependencies
- New dependencies require a reason beyond "it's popular." Check: is it maintained, licensed compatibly, and does it meaningfully reduce complexity?
- Don't add a dependency for something the standard library or an existing dependency already does.

## 5. Architecture Rules

These enforce the boundaries already defined in `ARCHITECTURE.md` — this section is about discipline, not design.

- **Application Layer** (`apps/`, `frontend/`): no direct database or model access. Always goes through the backend API.
- **Service Layer** (`backend/`): owns auth, users, projects, sessions, billing, permissions. Delegates AI execution to the FastAPI service — never reimplements it.
- **AI Layer** (`ai/`): owns everything model-related. Does not own product concerns like billing or user accounts.
- **Shared Packages** (`packages/`): code duplicated across two or more layers should be extracted here, not copy-pasted.
- **Separation of Concerns**: if a change to one layer requires touching an unrelated layer just to make it work, that's a signal the boundary has been violated somewhere — flag it rather than working around it.

## 6. Git & GitHub

### Branching
- `main` is always deployable.
- Feature branches: `feature/<short-description>`. Fixes: `fix/<short-description>`. Experimental work stays in `ai/research` and/or a `research/` branch prefix, never on `main`.

### Commits
- Descriptive, present-tense (`Add pgvector migration`, not `fixed stuff`).
- Prefer small, reviewable commits over one giant commit.

### Pull Requests
- Small PRs are preferred over large ones — per the repository philosophy established during planning.
- Every PR description states *what* changed and *why*; the *why* often just links to the relevant doc (charter, architecture, or an ADR — see Section 7).

### Code Review
- At least one approval required before merge.
- Reviewers check for: correctness, adherence to this handbook, and whether documentation was updated alongside the change.

### Releases
- Releases are tagged.
- Model releases additionally follow `MODEL_RELEASE_PROCESS.md` (see Section 9).

### Main Branch Rules
- Never force-push `main` or any release branch.
- No experimental or unreviewed code merges to `main`.

## 7. Documentation

### When Documentation Is Required
Any change that affects behavior a future contributor would need to understand — new folder, new service, new external dependency, new architectural boundary — needs a documentation update in the same PR, not a follow-up.

### Architecture Changes
Any change to layer boundaries or repository structure requires updating `ARCHITECTURE.md` in the same change.

### Decision Records
Significant, non-obvious technical decisions (the kind with real trade-offs — see the Electron vs. Tauri and NestJS+FastAPI vs. Python-only discussions during stack planning) should be captured as short decision records rather than lost in a PR comment thread. Keep these under `docs/architecture/decisions/` (or equivalent) so the reasoning is discoverable later, not just the outcome.

### Documentation Ownership
Whoever makes the change that invalidates a doc owns updating it. "Someone else will update the docs later" is not an acceptable state to merge in.

## 8. Testing

Per `TECH_STACK.md` §10:

- **Unit** (Vitest / pytest) — required for new logic, especially anything with edge cases.
- **Integration** — required where two layers interact (e.g. NestJS ↔ FastAPI, FastAPI ↔ vLLM).
- **E2E** (Playwright) — required for user-facing flows before release.
- **Performance** — required before any change likely to affect latency or throughput at the API or inference layer.
- **AI Evaluation** — model changes are evaluated against the benchmark suite (HumanEval, MBPP, MMLU, SWE-Bench, LiveCodeBench — see `PROJECT_CHARTER.md` §10) before being considered releasable. A model change without an evaluation result is not a candidate for release.

Tests accompany new features whenever practical — this is a norm, not a bureaucratic gate, but reviewers can and should push back on untested non-trivial logic.

## 9. AI & Model Development

### Dataset Rules
- Every dataset has a documented source, license, version, and preprocessing pipeline (checksum where applicable).
- Public datasets live in `ai/datasets/public/` and must be reproducible.
- Private/licensed/synthetic datasets live in `ai/datasets/private/` and must **never** be committed to a public repository.

### Training
- Training runs follow the pipeline in `ARCHITECTURE.md` §6 (continued pretraining → instruction tuning → preference optimization).
- Training code and configuration are version-controlled even when the resulting checkpoints are not (checkpoints are gitignored — see Section 10).

### Evaluation
No model is considered for release without a **completed evaluation pass and documented results** across the benchmark suite (HumanEval, MBPP, MMLU, SWE-Bench, LiveCodeBench). Partial or cherry-picked benchmark results are not sufficient.

Note: this requires a completed pass with results documented — it does not yet require beating a specific score. `PROJECT_CHARTER.md` §10 marks quantitative success criteria as provisional; until DTS leadership defines actual thresholds, "must score ≥ X" is not a release gate. Once thresholds are defined, they belong in `PROJECT_CHARTER.md` (or a dedicated spec), and this section should be updated to reference them.

```
Training
   ↓
Evaluation
   ↓
Full benchmark pass
   ↓
Results documented
   ↓
Release decision
   ↓
STR release
```

### Experiments
Experimental training runs, prompts, or architectures live in `ai/research`, isolated from anything considered production.

### Model Releases
Model releases follow `MODEL_RELEASE_PROCESS.md`: every released model must be reproducible from documented inputs (dataset versions, training config, base model version), and must have a completed, documented evaluation pass per the note above before a release decision is made.

### Reproducibility
If a model result can't be reproduced from what's committed and documented, the result doesn't count as validated yet — go back and document what's missing.

## 10. Security & Privacy

### Secrets
Never commit API keys, credentials, `.env` files, or key material. These are gitignored by default (`.env`, `.env.*`, `secrets/`, `keys/`, `*.pem`, `*.key`).

### User Data
No customer or user data is committed to a repository, logged beyond what's necessary for debugging, or used for training without explicit, documented consent and licensing.

### Dependencies
Dependencies are checked for maintenance status and license compatibility before being added (see Section 4). Known-vulnerable dependencies are patched, not ignored.

### Model/Data Licensing
Every training data source and every base model must have a documented, compatible license. Upstream foundation model weights (currently DeepSeek) are never modified in ways that violate their license.

### Vulnerability Handling
Security issues are reported and handled per `SECURITY.md`. Do not open a public issue for a suspected vulnerability — follow the disclosure process defined there.

## 11. Experimental Work

### Research Isolation
All exploratory work — new architectures, unproven training techniques, speculative product features — lives in `ai/research` (or an equivalent isolated space) until it has evidence behind it.

### Prototypes
Prototypes are allowed to be rough. They are not allowed to be merged into `main` or depended on by production code.

### Promotion to Production
An experiment graduates out of `research/` only when it has: a clear result, adequate test coverage, and documentation explaining what it does and why it's ready. Promotion is a deliberate decision, not something that happens by a prototype quietly staying in place long enough.

### Abandoning Experiments
Failed or abandoned experiments are not deleted silently — leave a short note on what was tried and why it didn't work, so the next person (human or AI) doesn't repeat it.

## 12. AI Contributor Guidelines

For any AI assistant (including Claude) contributing to DTS repositories:

- **Understand Before Editing** — read the relevant parts of this handbook, `ARCHITECTURE.md`, and `TECH_STACK.md` before proposing a change. Don't pattern-match to a generic solution.
- **Don't Invent Requirements** — if something is undocumented or ambiguous, say so and ask, rather than assuming a plausible-sounding default and presenting it as settled.
- **Explain Significant Decisions** — any non-trivial technical choice needs its reasoning stated, not just the result.
- **Preserve Existing Architecture** — don't restructure layer boundaries, folder responsibilities, or locked tech-stack choices without an explicit decision to do so. "Locked" in `TECH_STACK.md` means locked.
- **Verify Changes** — don't claim a change works without a basis for that claim (tests, a run, or an explicit caveat that it's unverified).

## 13. Change Management

### Minor Changes
Bug fixes, small refactors, dependency bumps — standard PR + review flow (Section 6).

### Architectural Changes
Any change to a layer boundary, repository structure, or locked tech-stack decision requires: an explicit proposal, an updated `ARCHITECTURE.md` or `TECH_STACK.md`, and review from someone beyond the author.

### Breaking Changes
Breaking changes to any shared package, API contract, or model interface require a documented migration path before merge — not after.

### Deprecation
Deprecated code, endpoints, or model versions are marked clearly (with a removal target) rather than silently left in place indefinitely.

## 14. Enforcement & Evolution

### Exceptions
Exceptions to this handbook are possible but must be explicit and time-bound (e.g., "temporary exception until X is resolved"), not silent deviations.

### Handbook Changes
This handbook changes the same way architecture does: propose the change, explain the reasoning, get review, update the version.

### Versioning
This document is versioned. Material changes bump the version number and are noted at the top of the file with a short changelog entry.
