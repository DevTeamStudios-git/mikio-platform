# apps/web

Mikio AI's web application, built with Next.js (App Router) and TypeScript.

## Scope

Per `TECH_STACK.md` §2, this app owns:
- The web client experience
- Frontend-specific API routes only (session glue, edge lookups)

It does **not** own product/business logic — that lives in `backend/` (NestJS). See the rule in `TECH_STACK.md` §2 before adding anything under `app/api/`.

## Development

This scaffold was hand-authored (no package registry access at scaffold time). Before running it:

```bash
pnpm install   # from the repo root — installs this app's dependencies via the workspace
pnpm --filter @mikio-ai/web dev
```

## Structure

- `app/` — App Router pages, layouts, and (later) frontend-only API routes
- `public/` — static assets

Shared, business-logic-free UI components will be pulled in from `frontend/` (per `ARCHITECTURE.md` §3) as they're built — this app doesn't yet import from there.
