# ai/inference

Mikio AI's inference service, built with FastAPI. Serves the STR model family to `backend/` over HTTP — see `ARCHITECTURE.md` §5 for the full request path (client → NestJS → this service → vLLM).

## Scope

Per `TECH_STACK.md` §7 / `ARCHITECTURE.md` §4,§7, this service owns AI execution exclusively. `backend/` (NestJS) reaches it over HTTP and never imports it directly — same boundary discipline as the Next.js-API-routes rule on the frontend side.

## Current State

Smallest useful slice: the service boots and exposes one endpoint (`GET /` → `{"status": "ok", "service": "mikio-ai-inference"}`), with one test proving it. No model is loaded — `ai/models/` is still empty (Phase 5 work), and there's no vLLM connection yet. This is deliberately the AI-layer mirror of what `backend/`'s root endpoint already does: prove the service boots and is reachable before anything real depends on it.

## Development

This is now a real `uv` workspace member — added to `pyproject.toml`'s `[tool.uv.workspace]` `members` list in the same change that gave it this `pyproject.toml`, per the rule documented there.

```bash
uv sync --all-extras --dev
uv run uvicorn app.main:app --reload --port 8000
```

Separately: `uv run pytest`

## Structure

- `app/main.py` — the FastAPI app and its one endpoint
- `tests/test_main.py` — the test proving it
- `pyproject.toml` — this service's own dependencies (FastAPI, uvicorn) and dev tooling (pytest, httpx, ruff)
