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