# Changelog

All notable changes to Mikio AI are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Mikio AI is currently pre-release — see `ROADMAP.md` for phase status. Versioning will follow [Semantic Versioning](https://semver.org/) once the first release ships.

## [Unreleased]

### Added
- Foundation documentation: `README.md`, `PROJECT_CHARTER.md`, `ARCHITECTURE.md`, `TECH_STACK.md`, `DTS_ENGINEERING_HANDBOOK.md`, `ROADMAP.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`
- `LICENSE` (MIT, application code) and `ai/models/LICENSE` (DevTeamStudios STR Model License, draft — pending legal review)
- Stage 1 monorepo skeleton per `ARCHITECTURE.md` (`apps/`, `ai/`, `backend/`, `frontend/`, `packages/`, `scripts/`, `tests/`, `docs/`, `configs/`, `resources/`, `examples/`), with a purpose `README.md` in each directory
- `.gitignore`, `.github/` (issue templates, PR template, CODEOWNERS scaffolding), `.vscode/`
- JS/TS workspace tooling: `package.json`, `pnpm-workspace.yaml`, `turbo.json`
- Python/AI workspace tooling: `pyproject.toml` (uv workspace), `.python-version`
- CI: `.github/workflows/ci.yml` — lint + test for both the JS/TS (pnpm + Turborepo) and Python/AI (uv + ruff + pytest) workspaces
- `docs/architecture/decisions/` established for future ADRs (Electron vs. Tauri and NestJS+FastAPI split to be documented retroactively)
- Toolchain versions locked: Python 3.11, pnpm 9.15.0 (`TECH_STACK.md` §14)
- GitHub repository configuration for `mikio-platform` — branch protection on `main` and `release/*`, general repo settings (squash-only merging, auto-delete head branches), full label set, Dependabot (alerts + security updates + dependency graph), Discussions categories, and the **Mikio Platform Roadmap** project board (https://github.com/orgs/DevTeamStudios-git/projects/1). *Configured via Manus, not through a connected tool in this conversation — see `GITHUB_SETTINGS_CHECKLIST.md` for the full breakdown and remaining unconfirmed items (secret scanning, push protection, CODEOWNERS population, repo visibility).*
- **`apps/web`** — first real application code in the repo. Next.js 15 (App Router) + TypeScript + React 19, scaffolded per `TECH_STACK.md` §2. **Verified running locally** (`pnpm install` → `pnpm run dev`): compiled clean, served `http://localhost:3000`, rendered the placeholder landing page as expected. `pnpm --version` resolved to `9.15.0` automatically via the `packageManager` field, confirming the toolchain pin works end-to-end outside the drafting environment. A `pnpm-lock.yaml` was generated locally during verification and should be committed alongside this entry.
- **`backend`** — NestJS main API scaffolded per `TECH_STACK.md` §4 / `ARCHITECTURE.md` §4,§7: root module, one status endpoint (`GET /` → `{ status: "ok", service: "mikio-ai-backend" }`), one e2e test. **Verified and merged**: lint, e2e test, and type-check all green locally, plus the root `turbo`-driven CI-equivalent commands; CI itself (`js-ts`, `python-ai`) passed on the actual PR. Fixed two bugs found during verification: a `supertest` default-vs-namespace import mismatch under `ts-jest`, and a missing `.next/` entry in `.gitignore`. `test/jest-e2e.json` added as the standard Nest e2e config, with `package.json`'s `test` script pointed at it directly since e2e is the only test that exists today — flagged in `backend/README.md` as temporary, to be revisited once real unit-testable logic lands.
- Backend transitive dependency security: added `pnpm.overrides` for `glob`, `ajv`, `picomatch`, `webpack`, `body-parser`, `qs`, `multer`, `file-type`, and `tmp`, clearing 17 of 18 `pnpm audit` findings introduced with the backend scaffold. The remaining finding — `@nestjs/core` CVE-2026-35515 — has no NestJS 10 patch and is tracked as an accepted risk in `SECURITY.md` §4 (see `ROADMAP.md` Future / Not Yet Scheduled for the NestJS 11 upgrade path).
- `GITHUB_SETTINGS_CHECKLIST.md` — created to record the *verified* state of repository settings. The original Manus configuration had not actually persisted: branch protection was never enforced because GitHub's free plan does not support it on private repositories (this retroactively explains why PR #2 merged with a failing check). The repository was made **public** and branch protection for `main` (classic) and `release/*` (ruleset) was re-applied and verified via API on 2026-08-03.

### Investigated (no change needed)
- A `pnpm@11.x`-vs-`9.15.0` version-warning ("the pnpm field is no longer read") raised a false alarm that the `postcss`/`sharp` CVE overrides in `package.json` might have silently failed to apply. Empirical check (fresh lockfile regeneration, byte-identical hash to the existing committed `pnpm-lock.yaml`; `pnpm audit`; GitHub Security tab) confirmed the overrides were applying correctly the whole time — `pnpm.overrides` in `package.json` is the correct location for the pinned `pnpm@9.15.0` (the pnpm-workspace.yaml location is a v10/v11-only change; the warning came from an outer, newer global `pnpm` wrapper describing itself, not the pinned version actually running the install). No files were changed as a result. Documented here so the same false alarm doesn't get re-investigated from scratch later.

### Decided
- Split licensing: [MIT](./LICENSE) for application code; a custom [DevTeamStudios STR Model License](./ai/models/LICENSE) (draft, pending legal review) for trained STR model weights — resolves the "Open Source: Required" vs. "Redistribution: Not allowed" tension from the original requirements, by applying each constraint to the layer it actually fits
- Foundation model: DeepSeek (`PROJECT_CHARTER.md`, `TECH_STACK.md`)
- Full technology stack locked — see `TECH_STACK.md`
- Repository/model naming convention: `mikio-*` for product/repository, `str-*` for model-family artifacts (`DTS_ENGINEERING_HANDBOOK.md` §3)

### Open
- `PROJECT_CHARTER.md` — Out of Scope and Success Criteria sections pending DTS decision
- `SECURITY.md` — security contact and formal severity/SLA matrix pending DTS decision
- GitHub CODEOWNERS — not populated, blocked on DTS assigning maintainer handles per layer
- GitHub secret scanning + push protection — status unconfirmed, not mentioned in the Manus configuration report
- GitHub repository visibility — not confirmed still private in the Manus report

[Unreleased]: https://github.com/DevTeamStudios-git/mikio-platform/compare/main...HEAD
