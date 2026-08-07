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

### `main` — split repository rulesets (verified 2026-08-03, read-back via API)

`main` is protected by **two** active repository rulesets. Classic branch protection is **not** used (it was a stopgap; see below). Rulesets allow the required-approval bypass to be scoped to admins *without* also letting admins skip status checks — which classic `enforce_admins` could not do (it was all-or-nothing).

**Ruleset 1 — `main: required status checks (no bypass)`** (id 20328652)

| Setting | Value |
|---|---|
| Required status checks | `JS/TS — Lint & Test`, `Python/AI — Lint & Test` (exact check-run names) |
| Strict mode | Yes (must stay up to date) |
| Block force pushes (`non_fast_forward`) | Yes |
| Restrict deletions (`deletion`) | Yes |
| Bypass actors | **None — not even admins** (`can_bypass = never`) |

> This is the non-negotiable rule: **CI must pass to merge, for everyone.** An admin merge can bypass the review requirement (ruleset 2) but can never again bypass a failing status check — the exact hole that let PR #2 merge with a failing `python-ai` check.

> ⚠️ **Historical caveat — the em-dash root cause.** The rule references the job names *exactly* as GitHub produces them: `JS/TS — Lint & Test` and `Python/AI — Lint & Test`, each with an **em dash (U+2014)**, not a hyphen. Earlier configurations (both the original Manus setup and the 2026-08-03 re-application) used contexts like `js-ts`/`python-ai` that **no check-run or commit-status context ever matched**. Consequence: the "required" status checks were decorative from PR #1 through PR #8 — a green or red CI was never actually gatekeeping any merge. **PR #9 is the first merge in this project's history where a failing check would have genuinely, mechanically blocked the merge.** Code was reviewed properly (lint/test/build were run and observed by hand), but the automated enforcement layer did not exist until this fix.

**Ruleset 2 — `main: require PR + 1 approval (admin bypass)`** (id 20328653)

| Setting | Value |
|---|---|
| Require pull request | Yes |
| Required approving reviews | **1** |
| Dismiss stale reviews on push | Yes |
| Require last push approval | Yes |
| Require review thread resolution | Yes |
| Bypass actors | Admin role (`RepositoryRole`, id 5, mode `always`) → `can_bypass = always` |

> The admin bypass exists because GitHub never allows a PR author to approve their own PR, and this repo currently has a single active contributor (the owner). With no bypass, *no* PR could ever be merged. Admins can merge solo; non-admin contributors still require PR + 1 approval + passing checks. If a second active contributor joins, consider removing the admin bypass and adding a dedicated reviewer.

**Why not classic `enforce_admins`?** A brief `enforce_admins = false` was tried on classic protection to unblock the solo-dev merge, but classic `enforce_admins` is all-or-nothing — setting it false lets admins bypass *both* the review requirement *and* the status checks. The split rulesets above are the fix for that: the status-check bypass is scoped out for everyone, while the approval bypass is scoped to admins only. Classic protection on `main` was deleted (204) once the rulesets were confirmed active.

### `release/*` — repository ruleset (created 2026-08-03, ruleset id 20325124)

Applied as an active repository ruleset matching `refs/heads/release/*`:

- `pull_request` — 1 required approving review, dismiss stale reviews on push, require last push approval, require review thread resolution
- `required_status_checks` — `JS/TS — Lint & Test`, `Python/AI — Lint & Test`, exact em-dash check-run names (strict policy)
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
- **2026-08-03 (later)** — Replaced `main` classic protection (with `enforce_admins = false`) with **two split rulesets**: status checks (no bypass for anyone) + PR/1-approval (admin bypass). Removes the all-or-nothing `enforce_admins` hole where an admin merge could skip CI. Added `docs/internal/README.md` gitignore negation so the folder has its purpose README in the public tree.

> **2026-08-03 (final):** The `release/*` and `main` rulesets' `required_status_checks` contexts were corrected from `js-ts`/`python-ai` to the exact GitHub Actions check-run names `JS/TS — Lint & Test`/`Python/AI — Lint & Test` (em dash U+2014). The original short names matched no commit status or check run, so the "required" checks were **decorative from PR #1 through PR #8** — PR #9 was the first merge a failing check could have actually blocked. This is the verification step that catches a ruleset that isn't really enforcing.
