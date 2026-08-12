# apps/desktop

Mikio AI's desktop application — an **Electron shell wrapping the shared web UI** (per `TECH_STACK.md` §3, `ARCHITECTURE.md` §8). Thin by design: product/business logic lives in `backend/` (NestJS), shared UI in `frontend/`, and the web app in `apps/web`.

## What this scaffold does

- Launches a secure Electron `BrowserWindow` (`contextIsolation`, no `nodeIntegration`, `sandbox`)
- Loads the web app at `MIKIO_WEB_APP_URL` (default `http://localhost:3000`, the `apps/web` dev server)
- Exposes a minimal read-only bridge to the renderer via `preload.ts`

## Development

```bash
pnpm install                        # from the repo root
pnpm --filter @mikio-ai/desktop dev # compiles to dist/ then launches Electron
```

The shell expects the web app to be served at its target URL:

```bash
pnpm --filter @mikio-ai/web dev     # in a separate terminal
```

## Structure

- `src/main.ts` — Electron main process (window lifecycle, app entry)
- `src/preload.ts` — minimal `contextBridge` surface
- `src/window-options.ts` — pure builder for secure window options (unit-tested)
- `src/web-app-url.ts` — pure resolver for the web-app URL (unit-tested)
- `tests/` — Vitest unit tests (run without launching Electron — no `electron` runtime import, only type imports, so the pure logic is testable in plain Node)

## Layout conventions

- Pure/UI logic is kept free of runtime `electron` imports so it's unit-testable in Node (Vitest per `TECH_STACK.md` §10).
- No application logic here yet — this is the shell. Real desktop features (wiring the shell to a specific product UI, packaging/distribution) are Phase 4+.