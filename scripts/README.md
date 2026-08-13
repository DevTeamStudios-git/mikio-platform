# scripts

Automation: formatting, releases, dataset preparation, model conversion.

- `check-postgres.ps1` — verify the local PostgreSQL instance is reachable and pgvector's `vector` extension is installed (reads `DATABASE_URL` per [`configs/postgresql.md`](../configs/postgresql.md); `pwsh ./scripts/check-postgres.ps1`)
