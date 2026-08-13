# TECH_STACK.md

**Mikio AI — Technology Stack**
Company: DevTeamStudios (DTS)
Status: v1.0 (Locked)
Last updated: 2026-07-30

This document records the actual technology decisions for Mikio AI, not a wish list. Each choice includes the reasoning behind it. Items marked 🟡 are locked for v1 with a known revisit condition; items marked ✅ are locked with no planned revisit.

---

## Quick Reference

```
MIKIO AI — TECH STACK v0.1
══════════════════════════════════════════════
APPLICATION
├── TypeScript
├── React
├── Next.js
├── Electron
└── Node.js

BACKEND
├── NestJS
├── FastAPI
└── PostgreSQL

MEMORY
└── pgvector

AI
├── Python
├── PyTorch
├── Hugging Face Transformers
├── PEFT
├── DeepSpeed
├── Axolotl
└── vLLM

TOOLING
├── pnpm
├── Turborepo
└── uv

TESTING
├── Vitest
├── Playwright
└── pytest

AUTH
└── Auth.js

CI/CD
└── GitHub Actions

INFRASTRUCTURE
├── Cloud GPU provider — TBD
├── Cloud provider — TBD
└── Docker — deployment/CI only

FUTURE
├── llama.cpp — local inference
├── Qdrant — if pgvector becomes insufficient
├── SSO/SAML — enterprise phase
├── Kubernetes — scale-out phase
└── Tauri — only if Electron becomes a demonstrated problem
```

The sections below give the reasoning and revisit conditions behind each choice above.

---

## 1. Languages

| Layer | Choice | Status |
|---|---|---|
| Application (frontend, backend, desktop) | **TypeScript** | ✅ Lock |
| AI (training, evaluation, dataset tooling) | **Python** | ✅ Lock |

**Why:** One language across the entire application layer means shared types between client and server. Python is non-negotiable for the AI layer — it's where the fine-tuning ecosystem (PyTorch, Transformers, PEFT) lives.

## 2. Frontend — Web

**React + Next.js (TypeScript)** ✅ Lock

Largest ecosystem, easiest hiring, well suited to chat panes, diff viewers, and streaming responses.

**Rule:** Next.js API routes are for **frontend-specific concerns only** (e.g. session glue, edge-cached lookups). They are **not** a second application backend.

```
Next.js API routes
        ↓
Only frontend-specific concerns
```

Not:

```
Next.js API
        ↓
Main application backend
```

The real backend path is always:

```
Next.js
   ↓
NestJS
   ↓
FastAPI
   ↓
vLLM
```

Business logic that lives partly in Next.js and partly in NestJS defeats the clean architecture we're establishing — it does not belong in Next.js routes.

## 3. Desktop

**Electron** 🟡 Lock for v1

```
React
  ↓
TypeScript
  ↓
Next.js / Web UI
  ↓
Electron
  ↓
Desktop
```

**Why:** No second systems language required — the same React/TypeScript frontend ships directly to desktop. Tauri is technically lighter (smaller binaries, Rust core, lower memory footprint) but introducing Rust solely for that benefit would violate the principle of not adding complexity before there's a demonstrated need.

**Revisit condition:** If Mikio's desktop memory footprint becomes a real, measured problem, re-evaluate Tauri at that point — not before.

## 4. Backend

**NestJS (main API) + FastAPI (AI service)** ✅ Lock — split architecture

```
                    ┌───────────────┐
                    │ React / Next  │
                    │ Electron      │
                    │ Web / Mobile  │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    NestJS     │
                    │ Main API      │
                    │ Auth          │
                    │ Users         │
                    │ Projects      │
                    │ Sessions      │
                    │ Billing       │
                    │ Permissions   │
                    └───────┬───────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
        ┌────────────────┐    ┌────────────────┐
        │   PostgreSQL   │    │    FastAPI     │
        │ + pgvector     │    │ AI Service     │
        └────────────────┘    └───────┬────────┘
                                       │
                                       ▼
                                ┌──────────────┐
                                │     vLLM     │
                                │ STR-3.5 Pro  │
                                └──────────────┘
```

**Why the split, not a Python-only backend:**
- **Clean ownership boundary** — NestJS owns the product (auth, users, projects, sessions, billing, permissions); FastAPI owns AI execution. Python does not slowly spread throughout the product backend.
- **Independent scaling** — the AI service can scale on its own axis, separate from the application servers:

```
100 API servers
       │
       ├───────────────┐
       │               │
       ▼               ▼
 FastAPI #1         FastAPI #2
       │               │
       └───────┬───────┘
               ▼
          GPU Cluster
```

Application servers stay CPU-oriented; only the FastAPI/vLLM layer needs GPU-backed scaling.

## 5. Database

**PostgreSQL** ✅ Lock

Structured application data — users, projects, sessions. Mature, open-source, strong TypeScript ORM support (Prisma).

Local development provisioning (direct install, no Docker, per §13) is documented in [`configs/postgresql.md`](./configs/postgresql.md); automated health check via [`scripts/check-postgres.ps1`](./scripts/check-postgres.ps1).

## 6. Vector / Memory

**pgvector (inside the existing PostgreSQL instance)** ✅ Lock

One less service to operate versus a dedicated vector DB (Qdrant/Weaviate). Sufficient at expected scale for the first year+. Migrate to a dedicated vector DB only if/when memory search becomes a measured bottleneck — not upfront.

pgvector ships either preinstalled (Postgres.app, hosted providers), as a distro package, or builds from source — install guide: [`configs/postgresql.md`](./configs/postgresql.md).

## 7. AI / Model Runtime

**vLLM** ✅ Lock — verify model compatibility with STR-3.5 Pro during implementation

High-throughput serving, supports tool calling, generally compatible with DeepSeek-derived architectures. Compatibility should be explicitly verified once STR-3.5 Pro's final architecture is settled, before treating this as fully proven.

**Future consideration:** llama.cpp for quantized local/on-device inference, if offline support ever becomes an actual goal (currently out of scope per the Project Charter).

## 8. Training

| Component | Choice | Status |
|---|---|---|
| Core framework | **PyTorch + Hugging Face Transformers** | ✅ Lock |
| Efficient fine-tuning | **PEFT (LoRA / QLoRA)** | ✅ Lock |
| Distributed training | **DeepSpeed** | 🟡 Use when needed |
| Orchestration | **Axolotl** | 🟡 Use initially — not an architectural dependency |

**Why 🟡 on DeepSpeed and Axolotl:** Both are genuinely useful today, but neither should become something the rest of the system architecturally depends on. DeepSpeed is adopted only once distributed training is actually needed; Axolotl speeds up early iteration but the training pipeline should not be designed such that replacing it later is a rewrite.

## 9. Authentication

**Auth.js (NextAuth)** 🟡 Good for v1

Fast OAuth integration for v1. **Revisit condition:** enterprise customers will eventually need SSO/SAML — at that point, front it with WorkOS or migrate to self-hosted Keycloak. Not built now; just don't design auth in a way that blocks this later.

## 10. Testing

| Layer | Tooling | Status |
|---|---|---|
| Frontend / Backend (TypeScript) | **Vitest** (unit/integration) + **Playwright** (e2e) | ✅ Lock |
| AI layer (Python) | **pytest** | ✅ Lock |

> **Named deviation — `backend/` uses Jest, not Vitest.** `backend/` (NestJS) was scaffolded with Jest, which is Nest's idiomatic default (`nest new` + `@nestjs/testing` + `ts-jest`), instead of checking back against the Vitest lock above. This decision predates the frontend work and is an **accepted deviation** — recorded here rather than silently absorbed, and scheduled for migration in `ROADMAP.md`. `frontend/` uses Vitest per this table; future TypeScript work should default to the locked stack (Vitest + Playwright) unless there's a documented reason otherwise.

## 11. Build / Package Management

| Ecosystem | Tooling | Status |
|---|---|---|
| JS/TS monorepo | **pnpm workspaces + Turborepo** | ✅ Lock |
| Python | **uv** | ✅ Lock |

## 12. CI/CD

**GitHub Actions** ✅ Lock

Already on GitHub; `.github/workflows/` is already part of the repository layout. No reason to introduce a second CI system.

## 13. Hosting / Infrastructure

| Concern | Choice | Status |
|---|---|---|
| Cloud provider | **AWS or GCP** | 🟡 Don't choose provider yet |
| GPU compute | **Cloud GPU provider** (e.g. CoreWeave, Lambda Labs, RunPod) | ✅ Lock conceptually |
| Containers | **Docker** | 🟡 Deployment tool — not core application architecture |

**Docker usage boundary:**

```
Development
────────────
Node
Python
PostgreSQL
vLLM
Direct processes (no containers required)

Production
────────────
Containers
Docker
Cloud infrastructure
```

Docker is used for production deployment, CI, reproducible services, GPU environments, and infrastructure where containers are genuinely useful — not imposed on local development by default.

---

## Summary — Full Stack at a Glance

```
Languages:        TypeScript (app) · Python (AI)
Web:               React + Next.js
Desktop:           Electron
Backend:           NestJS (product) + FastAPI (AI service)
Database:          PostgreSQL + pgvector
Inference:         vLLM
Training:          PyTorch + Transformers + PEFT (+ DeepSpeed, Axolotl as needed)
Auth:              Auth.js (v1) → WorkOS/Keycloak (enterprise, later)
Testing:           Vitest + Playwright + pytest
JS Tooling:        pnpm + Turborepo
Python Tooling:    uv
CI/CD:             GitHub Actions
Cloud:             AWS/GCP (provider TBD) + Cloud GPU provider
Containers:        Docker (production/CI only)
```

## Open Decisions

- Cloud provider: AWS vs. GCP
- vLLM ↔ STR-3.5 Pro compatibility, to be verified during implementation
- Point at which DeepSpeed/Axolotl get promoted from "use when needed" to a permanent dependency
- Point at which Auth.js gets replaced/fronted for enterprise SSO
