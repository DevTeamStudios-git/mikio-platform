# backend

Mikio AI's main API, built with NestJS + TypeScript.

## Scope

Per `ARCHITECTURE.md` §4 / §7 and `TECH_STACK.md` §4, this app owns the product surface: auth, users, projects, sessions, billing, permissions. It does **not** own AI execution — that's `ai/inference` (FastAPI + vLLM), reached over HTTP, never imported directly.

## Current State

Smallest useful slice: the app boots, exposes one endpoint (`GET /` → `{ status: "ok", service: "mikio-ai-backend" }`), and has one e2e test proving it. `api/`, `auth/`, `services/`, `storage/`, `memory/`, `database/` remain placeholder directories (see their individual `README.md`s) until each is actually built as a real Nest module and imported into `app.module.ts`.

> **Testing setup is temporary.** Until real unit-testable logic lands, `test/` points at `jest-e2e.json` (the standard Nest e2e shape) so `pnpm run test` actually runs the one e2e test instead of silently collecting nothing. The moment a module with real logic is added, split this back into the conventional `test` (unit, `.*\.spec\.ts$`) + `test:e2e` (`.e2e-spec.ts$`) scripts — do not let the e2e-only wiring become the default.

## Development

Hand-authored scaffold — no package registry access at scaffold time, same as `apps/web`. Before running it:

```bash
pnpm install   # from the repo root
pnpm --filter @mikio-ai/backend dev
```

Runs on `http://localhost:4000` by default (override with `PORT`).

## Structure

- `main.ts` — bootstraps the Nest application
- `app.module.ts` — root module; feature modules get imported here as they're built
- `app.controller.ts` / `app.service.ts` — the one status endpoint above
- `test/` — e2e tests (Jest + Supertest, per `TECH_STACK.md` §10)
- `api/`, `auth/`, `services/`, `storage/`, `memory/`, `database/` — placeholders for feature modules, per `ARCHITECTURE.md` §3
