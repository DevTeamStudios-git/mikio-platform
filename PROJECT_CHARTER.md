# PROJECT_CHARTER.md

**Mikio AI — Project Charter**
Company: DevTeamStudios (DTS)
Status: Draft v0.1
Last updated: 2026-07-30

This charter rarely changes. It defines *why* Mikio exists, what it will not do, how decisions get made, and what stays constant as the project grows. When in doubt, this document — not a roadmap, not a feature request — is the source of truth.

---

## 1. Purpose

Build an AI assistant that helps developers write, understand, debug, and ship code faster — without sacrificing transparency, reproducibility, or user trust.

Mikio AI exists to close the gap between "I have a coding problem" and "it's solved and I understand why," across syntax checking, debugging, documentation, and multi-step agentic work.

## 2. Vision

> ⚠️ **Not yet finalized.** The source requirements mark this as open. Draft direction, to be confirmed by DTS leadership:
>
> *Become the AI a developer reaches for by default — one that understands their whole codebase, explains its reasoning, and gets more useful the longer they use it.*

## 3. Mission

Follow instructions precisely, reason accurately, and help developers build better software faster through code generation, debugging, documentation understanding, and tool integration.

## 4. Goals

- Deliver a coding-first AI assistant (general assistant, coding assistant, AI agent, research assistant, productivity, enterprise use)
- Serve developers first, with companies and researchers as immediate secondary audiences
- Support real developer workflows: syntax checking, debugging with root-cause explanation, multi-file reasoning, and tool use (shell, git, IDE, browser, Python)
- Build on a foundation model (DeepSeek) chosen for coding strength, then specialize via continued pretraining, instruction tuning, and preference optimization
- Reach long-context, agentic capability (target: 256K context now, 1M as a future goal)

## 5. Non-Goals

*(Carried forward from the "Out of Scope" section, which is currently undefined in the source requirements — to be filled in as DTS makes explicit exclusions. Provisional exclusions inherited from the engineering handbook:)*

- Closed-source models
- Hidden training methods
- Undocumented experiments
- Unlicensed or unattributed datasets
- Black-box engineering
- Unrestricted redistribution of model weights (not permitted under current licensing stance)
- Full offline/on-device support (explicitly deferred, not a current goal)

## 6. Core Principles

- **Developer first** — every decision is evaluated against real developer workflows
- **Documentation first** — nothing ships without a documented rationale
- **Reproducibility** — every dataset and every released model must be reproducible from documented inputs
- **Privacy-friendly** — no undocumented collection or use of user/customer data
- **Scientific methodology** — evaluate before choosing; don't chase hype

## 7. Engineering Principles

- Build systems that can still be understood five years from now
- Prefer maintainability, modularity, reproducibility, documentation, and simplicity
- Avoid unnecessary complexity, undocumented behavior, hidden dependencies, and "magic" implementations
- One repository = one responsibility; one folder = one responsibility
- Experimental work stays isolated (e.g., in a research directory) until proven

## 8. Decision Priorities

When trade-offs are unavoidable, DTS resolves them in this order:

1. **User value**
2. **Engineering quality**
3. **Security**
4. **Performance**
5. **Convenience**

## 9. What Never Changes

- Open engineering
- Documentation first
- Developer first
- Privacy first
- Reproducibility
- Scientific methodology

## 10. Success Criteria

*(To be quantified — see Section 14 of the requirements doc for benchmark targets: HumanEval, MBPP, MMLU, SWE-Bench, LiveCodeBench.)* Provisional criteria:

- STR-3.5 Pro meets or exceeds comparable open-weight models on coding benchmarks (HumanEval, MBPP, SWE-Bench, LiveCodeBench)
- Mikio AI is usable end-to-end (desktop, web, mobile) for real developer tasks by the end of the roadmap's Phase 4
- Every training data source has a documented license and origin
- Every model release is reproducible from documented inputs

---

**Open items requiring a decision from DTS leadership before this charter can move from Draft to v1.0:**
- Finalize the Vision Statement (Section 2)
- Define explicit Non-Goals (Section 5)
- Set quantified Success Criteria (Section 10)
