# PostgreSQL + pgvector — Local Development Provisioning

Authoritative, platform-specific guide for standing up a local **PostgreSQL** instance with the **pgvector** extension. Covers development environments only.

## Scope

- **Direct processes, no containers** — matches the `TECH_STACK.md` §13 development boundary, where PostgreSQL is an explicitly-named local process (Docker is production/CI only and is *not* imposed on local development by default).
- **No cloud database yet.** `TECH_STACK.md` §14 defers the provider choice (`🟡 Don't choose provider yet`) and `ARCHITECTURE.md` §10 lists deployment as *(Not yet defined.)*, so standing up a hosted instance would force a decision this phase deliberately leaves open.
- This guide provisions the engine only. Connecting an application to it via `DATABASE_URL` is Phase 4 (`ROADMAP.md` — "Configuration system (`configs/`) wired up across services").

## Requirements

- PostgreSQL **13 or newer** (18 is current; 17 is the previous stable).
- Postgres must be installed **before** pgvector — pgvector compiles/loads against your installed Postgres and is version-specific.

## 1. PostgreSQL Installation (brief)

Install Postgres however is native to your OS:

| Platform | Options |
|---|---|
| Linux (Debian/Ubuntu) | `sudo apt install postgresql` (or the PGDG repo for a specific major) |
| Linux (Fedora/RHEL) | `sudo dnf install postgresql-server` (PGDG repo for specific majors) |
| macOS | `brew install postgresql@18` or [Postgres.app](https://postgresapp.com/) |
| Windows | Official installer from [postgresql.org/download](https://www.postgresql.org/download/) (`C:\Program Files\PostgreSQL\18` is the default) |

Then start the server and create the database used by the project (example for a local `postgres` superuser):

```bash
# Linux/macOS: create the app database
createdb mikio

# Windows (psql):
psql -U postgres -c "CREATE DATABASE mikio;"
```

## 2. pgvector Installation

pgvector **0.8.6** (current). It must be installed *per Postgres major version* — if you later upgrade Postgres, rebuild/reinstall pgvector for the new major.

### Linux — Debian / Ubuntu (APT)

Package names follow the Postgres major (PGDG repo required for full coverage):

```bash
sudo apt install postgresql-18-pgvector   # PostgreSQL 18
# or, for another major: postgresql-<major>-pgvector
```

### Linux — Fedora / RHEL (DNF)

```bash
sudo dnf install -y pgvector_18   # PostgreSQL 18 (PGDG repo); other majors: pgvector_<major>
```

### macOS — Homebrew

```bash
brew install pgvector
```

> Homebrew's `pgvector` formula installs into Homebrew's own `postgresql@17`/`postgresql@18`. If your Postgres came from elsewhere (e.g. Postgres.app), use the from-source build below instead.

### macOS — Postgres.app

pgvector ships **preinstalled** in Postgres.app — no build needed. Skip to step 3.

### Windows — build from source (official path)

Requires **Visual Studio** with the **Desktop development with C++** workload, run from an **x64 Native Tools Command Prompt as Administrator**:

```bat
set "PGROOT=C:\Program Files\PostgreSQL\18"

git clone --branch v0.8.6 https://github.com/pgvector/pgvector.git
cd pgvector
nmake /F Makefile.win
nmake /F Makefile.win install
```

Adjust `PGROOT` to your installed Postgres major (`...\PostgreSQL\17` etc.).

**Windows alternative — conda-forge** (only if Postgres is conda-managed):

```bash
conda install -c conda-forge pgvector
```

### Any POSIX system — build from source (fallback / non-Homebrew installs)

Requires the PostgreSQL server dev headers (e.g. `postgresql-server-dev-18` on Debian/Ubuntu):

```bash
cd /tmp
git clone --branch v0.8.6 https://github.com/pgvector/pgvector.git
cd pgvector
make && make install
```

Other options documented upstream: PGXN packages and host-provided installs (Supabase, Neon, etc. ship pgvector preinstalled).

## 3. Activate the Extension

pgvector is a Postgres **extension** — install once per database that needs it:

```bash
psql -d mikio -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

## 4. Verify

```sql
-- Extension is installed (installed_version ≥ 1, ideally 0.8.6)
SELECT name, default_version, installed_version
FROM pg_available_extensions WHERE name = 'vector';

-- Smoke test: creation + insert + distance operator
CREATE TEMP TABLE t (v vector(3));
INSERT INTO t VALUES ('[1,2,3]'), ('[4,5,6]');
SELECT '[1,2,3]'::vector <-> '[4,5,6]'::vector AS l2_distance;  -- expect 5.196152422706631
```

There is also an automated helper — see [`scripts/check-postgres.ps1`](../scripts/check-postgres.ps1).

> **Verification status:** instructions above were checked against pgvector's official README (v0.8.6) at the time of writing, but **no live Postgres instance exists in the drafting environment**, so the exact commands have not been run end-to-end here. Run them on your machine and confirm output before relying on them.

## Connection String

Services read the connection from `DATABASE_URL` (see [`configs/.env.example`](./env.example)):

```
postgresql://postgres:postgres@localhost:5432/mikio
```

## References

- pgvector README: <https://github.com/pgvector/pgvector#installation>
- postgresql.org download: <https://www.postgresql.org/download/>
- `TECH_STACK.md` §13 — Docker usage boundary (this guide exists *because* local dev is direct processes)