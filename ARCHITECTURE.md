# ARCHITECTURE.md

**Mikio AI — System Architecture**
Company: DevTeamStudios (DTS)
Status: Draft v0.1
Last updated: 2026-07-30

This document explains how Mikio AI is organized and how its pieces fit together. It's the most likely document to change as the project grows — update it whenever the repository layout or system design shifts.

---

## 1. System Overview

Mikio AI is a monorepo containing three layers:

1. **AI layer** (`ai/`) — the STR model family: foundation model, training, datasets, evaluation, inference, and the tools/prompts the model uses
2. **Application layer** (`apps/`, `frontend/`) — desktop, web, and mobile clients
3. **Service layer** (`backend/`) — API, auth, memory, storage, and database that connect the applications to the AI

Shared code lives in `packages/`, cross-cutting docs live in `docs/`, and everything is validated through `tests/`.

At this stage (Stage 1 of the growth plan), all three layers live in a single repository. As any layer outgrows the monorepo, it's designed to split cleanly — see [Section 11](#11-future-expansion).

## 2. Repository Layout

```
mikio-ai/
├── .github/       # CI/CD, issue templates, PR templates, CODEOWNERS
├── apps/          # desktop, web, mobile
├── ai/            # foundation, models, training, datasets, evaluation, inference, prompts, tools, research
├── backend/       # api, auth, services, storage, memory, database
├── frontend/      # components, layouts, pages, assets, styles, themes
├── packages/      # shared libraries (ui, sdk, common, logger)
├── scripts/       # automation, formatting, release, dataset prep, model conversion
├── tests/         # unit, integration, performance, e2e
├── docs/          # public, internal, architecture, specifications, images
├── configs/       # configuration files
├── resources/     # icons, brand assets, fonts, illustrations, sounds
└── examples/      # sample projects, API examples, SDK examples
```

## 3. Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `apps/` | User-facing products (desktop, web, mobile). Thin — delegates to `frontend/` and `backend/`. |
| `ai/` | Everything in the model lifecycle: base model selection, training, datasets, evaluation, inference runtime, prompts, and tool/MCP definitions. |
| `backend/` | Server-side logic: authentication, API surface, memory, storage, database access. |
| `frontend/` | Reusable UI components with no business logic. |
| `packages/` | Shared libraries used across apps and backend (e.g. `ui`, `sdk`, `common`, `logger`). |
| `scripts/` | One-off and recurring automation: formatting, releases, dataset prep, model conversion. |
| `tests/` | All test types, organized by scope (unit → e2e). |
| `docs/` | Public docs, internal docs, architecture references, versioned specs. |
| `configs/` | Environment and service configuration. |
| `resources/` | Non-code brand and media assets. |
| `examples/` | Reference implementations for contributors and SDK consumers. |

Sub-structure inside `ai/`:

```
ai/
├── foundation/    # the selected base model (DeepSeek)
├── models/        # Mikio releases (mikio-3.5, mikio-4, ...)
├── training/       # training pipeline
├── datasets/       # public/ and private/ training data
├── evaluation/     # benchmarks
├── inference/       # runtime
├── prompts/         # system + developer prompts
├── tools/            # function calling, tool definitions, MCP integrations
└── research/          # experimental, unproven work
```

## 4. High-Level Components

- **Foundation Model** — DeepSeek, selected for strong coding performance ([PROJECT_CHARTER.md](./PROJECT_CHARTER.md))
- **STR Model Family** — DTS's fine-tuned lineage (current target: STR-3.5 Pro)
- **Inference Runtime** — serves the trained model to applications
- **Tool Layer** — web search, Python, calculator, shell, git, IDE, browser, vision, plus filesystem-style tools (Read, Write, Edit, Glob, Grep, Bash, PowerShell, NotebookEdit, Monitor, Agent/orchestration, AskUserQuestion)
- **Backend Services** — auth, memory, storage, database, API
- **Client Applications** — desktop, web, mobile, all consuming the same backend/API surface

## 5. Data Flow

```
User (desktop / web / mobile)
        │
        ▼
   Frontend (apps/ + frontend/)
        │
        ▼
   Backend API (backend/api)
        │
   ┌────┴─────┐
   ▼          ▼
 Auth /    Inference Runtime (ai/inference)
 Memory /        │
 Storage         ▼
              STR Model (ai/models)
                  │
                  ▼
              Tool Layer (ai/tools) — shell, git, IDE, browser,
              Python, web search, vision, etc.
```

Requests flow from a client through the backend to the inference runtime; the model may call tools mid-response before returning a final answer through the same path.

## 6. AI Pipeline

```
Foundation Model (DeepSeek)
        │
        ▼
Continued Pretraining (ai/training)
        │
        ▼
Instruction Tuning
        │
        ▼
Preference Optimization
        │
        ▼
Evaluation (ai/evaluation) ──► Benchmarks: HumanEval, MBPP, MMLU,
        │                       SWE-Bench, LiveCodeBench
        ▼
Release (ai/models/mikio-X.X)
```

Training data is split into `ai/datasets/public/` (reproducible, documented sources) and `ai/datasets/private/` (licensed, synthetic, internal — never committed to a public repository).

## 7. Backend Architecture

*(To be detailed in `TECH_STACK.md` once frameworks are selected.)* Known responsibilities:

- **API** — the surface apps talk to
- **Auth** — user identity and access control
- **Memory** — persisted context across sessions
- **Storage** — file and object storage
- **Database** — structured application data

## 8. Frontend Architecture

Shared, business-logic-free UI components live in `frontend/`; each app in `apps/` composes them into a full product. This keeps desktop, web, and mobile visually consistent without duplicating UI code.

## 9. Testing Strategy

Tests are organized by scope in `tests/`:

- **Unit** — individual functions/modules
- **Integration** — components working together (e.g. backend ↔ inference runtime)
- **Performance** — latency/throughput under load
- **E2E** — full user flows through a client application

Per the engineering handbook: tests accompany new features whenever practical, and no experimental code goes on `main`.

## 10. Deployment Strategy

*(Not yet defined.)* Desktop and mobile support are targeted as supported platforms; offline support is explicitly out of scope for now. Deployment details (hosting, CI/CD pipeline specifics, release cadence) belong here once decided — see `.github/workflows/` and `MODEL_RELEASE_PROCESS.md`.

## 11. Future Expansion

The repository is intentionally structured to split cleanly as the project grows:

- **Stage 1 (now):** single `mikio-ai` monorepo
- **Stage 2 (growing AI team):** `ai/` may split out into its own `mikio-training` repository
- **Stage 3 (products expand):** `apps/desktop`, `apps/web`, `apps/mobile` may each become independent repositories (`mikio-desktop`, `mikio-web`, `mikio-mobile`)

The same applies to `backend/` or `tools/` if they outgrow the monorepo. Splitting should preserve the same folder-responsibility boundaries defined in Section 3.
