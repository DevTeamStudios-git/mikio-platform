# SECURITY.md

**Mikio AI — Security Policy**
Company: DevTeamStudios (DTS)
Status: v0.1 (Process defined; two items pending DTS decision — see marked TBDs)
Last updated: 2026-07-30

This document defines the actual security process: how a vulnerability gets reported, handled, and disclosed. It does not repeat the general engineering security rules already established in [`DTS_ENGINEERING_HANDBOOK.md`](./DTS_ENGINEERING_HANDBOOK.md) §10 — this is the missing process that document points to.

---

## 1. Scope

This policy covers all DTS repositories under the Mikio AI project: applications (`apps/`), backend services (`backend/`), the AI layer (`ai/`), shared packages (`packages/`), and infrastructure/config used to build or deploy them.

It does not cover general bug reports (use standard GitHub issues per `CONTRIBUTING.md`) — only issues with security or privacy impact.

## 2. Reporting a Vulnerability

### Where to report
> ⚠️ **TBD.** A dedicated security-report contact (email address or private reporting channel) has not yet been established by DTS. Until one exists, do not report a suspected vulnerability through a public GitHub issue, per handbook §10. Until a channel is designated, escalate directly to a DTS maintainer through a private channel rather than a public one.

### What to include
- A clear description of the vulnerability and its potential impact
- Steps to reproduce (or a proof of concept, if safe to share privately)
- Affected component(s) — which repository, service, or layer
- Any suggested remediation, if you have one

### What not to include publicly
- Do not open a public issue, pull request, or discussion describing the vulnerability
- Do not post exploit details, proof-of-concept code, or affected data in any public forum before a fix is available
- Do not include real user or customer data in a report, even as an example — describe the exposure instead

## 3. What Happens After a Report

```
Report received
      ↓
Acknowledgement
      ↓
Assessment
      ↓
Remediation
      ↓
Disclosure
```

- **Acknowledgement** — the report is confirmed as received.
- **Assessment** — the issue is reproduced and its severity/scope evaluated (see Section 4).
- **Remediation** — a fix is developed and tested following the normal handbook process (§6, §13), but on a private branch/fork until it's ready, not in the open.
- **Disclosure** — once a fix is released, the vulnerability and fix are disclosed. Reporters are credited unless they request otherwise.

> ⚠️ **TBD.** Specific response-time commitments (e.g. "acknowledged within 48 hours") are not yet defined. DTS has not established formal SLAs for this process. This section will be updated once those commitments are set — do not treat any timeframe as implied until then.

## 4. Severity & Prioritization

> ⚠️ **TBD.** A formal severity matrix (e.g. Critical/High/Medium/Low with defined criteria) has not yet been established. Until one exists, severity is assessed case-by-case based on: exposure of user/customer data, potential for unauthorized system access, and potential for unauthorized model or tool execution. This section should be replaced with an explicit matrix once DTS defines one.

## 5. Supported Versions

Mikio AI is currently pre-release (see `ROADMAP.md`). Until a versioned public release exists, security fixes apply to `main` only. This section will be updated with a supported-version table once versioned releases begin.

## 6. Security Development Practices

These are enforced day-to-day per `DTS_ENGINEERING_HANDBOOK.md` §10; summarized here for completeness:

- **Secrets** — never committed; `.env`, `secrets/`, `keys/`, `*.pem`, `*.key` are gitignored by default.
- **Dependencies** — checked for maintenance status and license compatibility before being added; known-vulnerable dependencies are patched, not ignored.
- **User Data** — no customer or user data committed to a repository, logged beyond debugging necessity, or used for training without documented consent and licensing.
- **Authentication** — handled via the mechanism defined in `TECH_STACK.md` (Auth.js for v1); auth-related code changes require review per handbook §6.
- **AI / Model / Dataset Security** — every dataset has a documented source and license; private/licensed/synthetic datasets never leave `ai/datasets/private/`; upstream foundation model weights are never modified in ways that violate their license.

## 7. AI-Specific Security

Security considerations specific to an AI system with tool access, beyond standard application security:

### Prompt Injection
Content the model processes (documents, web pages, tool outputs, user-supplied text) may contain instructions attempting to override system behavior. Tool-use and inference code should treat all such content as untrusted input, not as instructions to follow implicitly.

### Tool Execution
Given the tool layer includes shell, git, browser, and filesystem access (`ai/tools`), any tool capable of taking real-world action (writing files, executing commands, network requests) must be evaluated for what it could do if misused — either through a malicious prompt or a model error — before being enabled by default.

### Training Data
Applies the same rules as Section 6: documented source and license per dataset, private data never committed publicly, and no undocumented use of user data for training.

### Model Artifacts
Trained checkpoints and weights are gitignored (per `.gitignore` conventions established in planning) and distributed only through the documented model-release process (`MODEL_RELEASE_PROCESS.md`, referenced in the handbook §9) — not committed directly to a repository.

### Evaluation
Evaluation results (benchmark scores, red-team findings, known failure modes) that reveal exploitable weaknesses should be handled with the same care as a vulnerability report until any necessary mitigation is in place.

## 8. Disclosure Policy

DTS follows coordinated disclosure: vulnerabilities are not made public until a fix is available (or a reasonable amount of time has passed without resolution, at DTS's discretion, absent a formally defined SLA — see Section 3). Reporters are credited by name or handle in the disclosure unless they request anonymity.

## 9. Security Updates

Security-relevant updates will be communicated through the repository's release notes and `CHANGELOG.md` once that process exists. There is currently no separate security mailing list or advisory feed — this section will be updated if one is established.

## 10. Contact

> ⚠️ **TBD.** No official security contact has been established yet (see Section 2). This section will be updated as soon as DTS designates one. Until then, treat the absence of a public contact as a reason to escalate privately and directly, not as a reason to delay reporting a genuine concern.
