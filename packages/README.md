# packages

Non-UI shared libraries used across apps and backend (e.g. `sdk`, `common`, `logger`). Code duplicated across two or more layers belongs here, not copy-pasted — see `DTS_ENGINEERING_HANDBOOK.md` §5.

**Note:** `ui` was originally planned as a member here, but shared UI components live in `frontend/` (see `ARCHITECTURE.md` §8), which supersedes `packages/ui`. `packages/` is reserved for non-UI shared code.
