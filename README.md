# Mikio AI

**A developer-first AI assistant for coding, debugging, and building software faster.**

Built by [DevTeamStudios (DTS)](https://github.com/DevTeamStudios-git) · Powered by the **STR** model family

---

## What is Mikio AI?

Mikio AI is an AI assistant purpose-built for developers. It's designed to check code syntax, write and debug code, understand documentation, and act as a reliable coding companion — from quick syntax questions to multi-step agentic workflows.

The underlying model, **STR-3.5 Pro**, is a continued-pretrained and instruction-tuned derivative of a DeepSeek foundation model, chosen specifically for its strong coding performance.

## Why Mikio?

Developers lose time context-switching between documentation, debugging, and boilerplate. Mikio AI aims to close that gap by combining:

- Strong code generation and syntax awareness
- Debugging that explains *why* something broke — and fixes related issues it finds along the way
- Long-context understanding for large codebases and documents
- Tool use (shell, git, browser, IDE, Python, and more) for real agentic workflows

> **Vision:** *(to be finalized — see [PROJECT_CHARTER.md](./PROJECT_CHARTER.md))*

## Who is it for?

- **Developers** — the primary audience
- **Companies** — enterprise coding assistance
- **Researchers** — secondary audience
- **General public** — not the primary focus today, but planned for the future

## Core Capabilities

| Capability | Priority |
|---|---|
| Coding | ⭐⭐⭐⭐⭐ |
| Programming (multi-language) | ⭐⭐⭐⭐⭐ |
| Long Context | ⭐⭐⭐⭐⭐ |
| Document Analysis | ⭐⭐⭐⭐⭐ |
| Planning | ⭐⭐⭐⭐⭐ |
| Tool Use | ⭐⭐⭐⭐½ |
| Reasoning | ⭐⭐⭐⭐ |
| Vision | ⭐⭐⭐⭐ |

**Priority languages:** HTML, JavaScript, CSS (Tier 1) · Lua/Luau, C, C++ (Tier 2)

## Repository Structure

```
mikio-ai/
├── apps/        # Desktop, web, and mobile applications
├── ai/          # Foundation model, training, datasets, evaluation, inference
├── backend/     # API, auth, services, database
├── frontend/    # Shared UI components
├── packages/    # Shared libraries (ui, sdk, common, logger)
├── scripts/     # Automation, formatting, release tooling
├── tests/       # Unit, integration, performance, e2e
├── docs/        # Public docs, internal docs, architecture, specs
└── configs/     # Configuration files
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full breakdown of each folder's responsibility.

## Quick Start

> 🚧 Coming soon — this section will be filled in once the application skeleton (Phase 2) is in place.

## Documentation

| Document | Purpose |
|---|---|
| [PROJECT_CHARTER.md](./PROJECT_CHARTER.md) | Why Mikio exists |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | How everything fits together |
| [TECH_STACK.md](./TECH_STACK.md) | Technologies and why they were chosen |
| [DTS_ENGINEERING_HANDBOOK.md](./DTS_ENGINEERING_HANDBOOK.md) | Engineering rules and philosophy |
| [ROADMAP.md](./ROADMAP.md) | Planned features and milestones |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute |
| [SECURITY.md](./SECURITY.md) | Security and vulnerability policy |

## Roadmap Snapshot

- [x] Vision & goals defined
- [x] Foundation model selected (DeepSeek)
- [x] Repository strategy & skeleton
- [ ] Root documentation (in progress)
- [ ] Application skeleton
- [ ] Training pipeline
- [ ] Beta release

Full roadmap: [ROADMAP.md](./ROADMAP.md)

## Contributing

Contribution guidelines are being finalized — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Security

Please review [SECURITY.md](./SECURITY.md) before reporting vulnerabilities or handling sensitive data.

## License

*(License to be finalized — Mikio AI targets an open-source license with commercial use allowed. See [LICENSE](./LICENSE).)*

## Credits

Built by the DevTeamStudios team.
