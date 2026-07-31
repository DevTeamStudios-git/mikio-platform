# ROADMAP.md

**Mikio AI — Roadmap**
Company: DevTeamStudios (DTS)
Status: v1.0 (Living document)
Last updated: 2026-07-30

This roadmap tracks *when* things happen. It doesn't restate *why* (`PROJECT_CHARTER.md`), *how it's structured* (`ARCHITECTURE.md`), *with what* (`TECH_STACK.md`), or *how we work* (`DTS_ENGINEERING_HANDBOOK.md`) — update those documents directly when the underlying decisions change, and update this one when timing or sequencing changes.

---

## Phase 1 — Foundation Documentation ✅ In Progress

The groundwork every other phase depends on.

- [x] Vision & goals defined
- [x] Foundation model selected (DeepSeek)
- [x] Repository strategy & skeleton
- [x] `README.md`
- [x] `PROJECT_CHARTER.md`
- [x] `ARCHITECTURE.md`
- [x] `TECH_STACK.md` (all technology decisions locked)
- [x] `DTS_ENGINEERING_HANDBOOK.md`
- [ ] `ROADMAP.md` ← *you are here*
- [ ] `CONTRIBUTING.md`
- [ ] `SECURITY.md`
- [ ] `CHANGELOG.md`
- [ ] `LICENSE`
- [ ] `PROJECT_CHARTER.md` — Out of Scope and Success Criteria sections finalized *(currently open; blocked on a DTS decision, not on drafting)*

## Phase 2 — Repository & Environment Setup

Turning the documented skeleton into a real, working repository.

- [ ] Create the GitHub organization and `mikio-ai` repository
- [ ] Create the full folder skeleton per `ARCHITECTURE.md` §2
- [ ] Configure `.github/` (workflows, issue templates, PR template, CODEOWNERS)
- [ ] Set up `pnpm` workspaces + Turborepo for the JS/TS side
- [ ] Set up `uv` for the Python side
- [ ] Configure GitHub Actions CI (lint, format check, test run) per `TECH_STACK.md`
- [ ] Set up first ADRs retroactively for decisions already made (Electron vs. Tauri, NestJS+FastAPI split) — see `docs/architecture/decisions/`
- [ ] GitHub Projects, Issues, Labels, and Discussions configured

## Phase 3 — Application & Service Skeleton

Standing up the empty shells for each layer, per `ARCHITECTURE.md`.

- [ ] `backend/` — NestJS project scaffolded (auth, users, projects, sessions stubs)
- [ ] `ai/` — FastAPI service scaffolded, connected to a placeholder vLLM instance
- [ ] `frontend/` — shared component library scaffolded
- [ ] `apps/web` — Next.js app scaffolded, wired to NestJS
- [ ] `apps/desktop` — Electron shell wrapping the web app
- [ ] `packages/` — shared `ui`, `sdk`, `common`, `logger` packages initialized
- [ ] PostgreSQL + pgvector provisioned (development environment)
- [ ] Auth.js integrated for v1 authentication

## Phase 4 — First End-to-End Feature

Proving the whole stack works together before investing further.

- [ ] Basic chat flow: web/desktop client → NestJS → FastAPI → vLLM → response
- [ ] Inference pipeline serving an initial STR checkpoint (or a stand-in base model, if STR isn't trained yet)
- [ ] Configuration system (`configs/`) wired up across services
- [ ] Baseline test coverage per `DTS_ENGINEERING_HANDBOOK.md` §8 (unit + integration at minimum)

## Phase 5 — Training Pipeline & Model Development

Where the AI layer becomes real, per `ARCHITECTURE.md` §6.

- [ ] `ai/datasets/public/` and `ai/datasets/private/` structured and documented
- [ ] Training pipeline built (PyTorch + Transformers + PEFT; DeepSpeed/Axolotl added when needed)
- [ ] Continued pretraining on DeepSeek foundation
- [ ] Instruction tuning
- [ ] Preference optimization
- [ ] Evaluation pipeline running the full benchmark suite (HumanEval, MBPP, MMLU, SWE-Bench, LiveCodeBench)
- [ ] First STR-3.5 Pro checkpoint with documented, completed evaluation results (see handbook §9 — thresholds still pending DTS decision)
- [ ] Memory system (pgvector-backed) integrated with the chat flow
- [ ] Tool calling / MCP integrations (shell, git, IDE, browser, Python, web search, vision)

## Phase 6 — Beta Release

- [ ] Desktop, web, and mobile apps feature-complete for v1 scope
- [ ] Security review complete (`SECURITY.md` checklist)
- [ ] Documentation reviewed for accuracy against the shipped system
- [ ] Beta released to an initial group of developers
- [ ] Feedback loop established for post-beta iteration

## Future / Not Yet Scheduled

Tracked as known future work, not committed to a phase:

- Local/on-device inference via llama.cpp (offline support is explicitly out of scope for now — `PROJECT_CHARTER.md`)
- Migration from pgvector to a dedicated vector DB (Qdrant), if memory search becomes a bottleneck
- Enterprise SSO/SAML (WorkOS or self-hosted Keycloak), replacing/fronting Auth.js
- Kubernetes, once scale requires orchestration beyond single-instance deployment
- Re-evaluating Tauri for desktop, only if Electron's footprint becomes a demonstrated problem
- Splitting `ai/`, `apps/*`, or `backend/` into independent repositories, per the Stage 2/3 growth plan in `ARCHITECTURE.md` §11

---

## How This Roadmap Is Maintained

- Checking off an item here should never be the *only* record of it happening — significant work should also be reflected in the relevant document (`ARCHITECTURE.md`, `TECH_STACK.md`, an ADR, etc.).
- Phases are sequential in intent but not strictly blocking — e.g., early training experiments (Phase 5) may reasonably start in `ai/research` before Phase 4 is fully complete, per the Experimental Work rules in the handbook.
- If a phase's scope changes meaningfully, update it here directly rather than letting the roadmap drift out of sync with reality.
