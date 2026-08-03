# GitHub Settings Checklist

**Mikio AI — repository settings & branch protection**
Repo: `DevTeamStudios-git/mikio-platform`
Last verified: 2026-08-03 (via GitHub REST API, authenticated as `Gabrieldevgit`, admin)

This checklist records the *actual, verified* state of GitHub settings for this repository, including how each item was applied and confirmed. It exists because the original configuration was applied by Manus (not through a connected tool) and, as it turns out, did **not** fully persist — see the Branch Protection note below.

---

## 1. Branch Protection

> ⚠️ **Important context — the PR #2 mystery is now explained.** `main` was **never actually protected** until 2026-08-03. GitHub's free plan does not support branch protection rules (required status checks, required reviews) on **private** repositories — only public ones. This repo was private for essentially the entire project, so Manus's configuration almost certainly "succeeded" at the settings level while the plan restriction silently prevented enforcement. This is why PR #2 merged with a failing `python-ai` check: nothing was ever actually blocking merges. Verified via API response: `Upgrade to GitHub Pro or make this repository public to enable this feature.`

### Resolution

The repository was made **public** (2026-08-03) to enable branch protection on the free plan, then the rules were applied via the GitHub REST API and read back to verify.

### `main` — classic branch protection (verified, read-back 200 OK)

| Setting | Value | Verified |
|---|---|---|
| Repository visibility | **public** | `private: false` via API |
| Require pull request reviews | Yes | ✔ |
| Required approving reviews | **1** | ✔ |
| Dismiss stale reviews | Yes | ✔ |
| Require review thread resolution | Yes | ✔ |
| Required status checks | `js-ts`, `python-ai` | ✔ |
| Status check strict mode | Yes (must be up to date) | ✔ |
| Enforce admins | Yes | ✔ |
| Block force pushes | Yes | ✔ |
| Restrict deletions | Yes | ✔ |
| Bypass actors | None | ✔ |

### `release/*` — repository ruleset (created 2026-08-03, ruleset id 20325124)

Applied as an active repository ruleset matching `refs/heads/release/*`:

- `pull_request` — 1 required approving review, dismiss stale reviews on push, require last push approval, require review thread resolution
- `required_status_checks` — `js-ts`, `python-ai` (strict policy)
- `deletion` — restricted
- `non_fast_forward` — force pushes blocked

---

## 2. General Repository Settings

| Setting | Status |
|---|---|
| Default branch | `main` |
| Merge strategy | Squash-only merging (per CHANGELOG) |
| Auto-delete head branches | Enabled |
| Discussions | Enabled (categories configured) |
| Dependabot alerts | Enabled |
| Dependabot security updates | Enabled |
| Dependency graph | Enabled |

## 3. Labels

Full label set configured (per CHANGELOG entry).

## 4. Projects

**Mikio Platform Roadmap** project board: https://github.com/orgs/DevTeamStudios-git/projects/1

---

## Unconfirmed / Remaining Items

- **Secret scanning** — status unconfirmed (not mentioned in the original Manus configuration report).
- **Push protection** — status unconfirmed; note that with a public repo, secret-scanning push protection is more important than ever.
- **CODEOWNERS population** — `CODEOWNERS` file not yet created/populated.
- **Security contact** — SECURITY.md §2/§10 still marked TBD (no dedicated reporting channel).
- **Severity matrix** — SECURITY.md §4 still marked TBD (see the "Accepted Risks" section there, added with the first concrete case).
- **NestJS 11 upgrade** — required to close the `@nestjs/core` CVE (CVE-2026-35515); tracked in ROADMAP.md under Future / Not Yet Scheduled. A Dependabot PR for `@nestjs/core` 11.1.18 already exists (`dependabot/npm_and_yarn/nestjs/core-11.1.18`).

## Change Log for This File

- **2026-08-03** — Created after re-applying branch protection on a now-public repo. Replaces the originally-referenced (but never materialized) checklist from the Manus configuration period. Documents the free-plan limitation that left `main` unprotected, and the verified re-application of `main` + `release/*` rules.
