# PostgreSQL + pgvector — Local Development Setup

**Status:** Provisioning docs only. No application code depends on this yet — `backend/`'s
only endpoint today is `GET /` (status). This document exists so Postgres + pgvector is
ready to consume once real DB-backed features start in Phase 4.

**Why direct install, not Docker:** `TECH_STACK.md` §13 explicitly names PostgreSQL as a
local-dev direct process, not a container — Docker is reserved for production, CI, and
genuinely container-appropriate services. This doc follows that boundary. If that tradeoff
ever needs revisiting (e.g. pgvector's Windows build friction below becomes a recurring
blocker), that's a `TECH_STACK.md` §13 change to propose explicitly, not something to work
around quietly here.

---

## 1. Install PostgreSQL

Use a recent PostgreSQL (16+). Install via your platform's normal method:

| Platform | Method |
|---|---|
| macOS | `brew install postgresql@16` (or newer) |
| Ubuntu/Debian | [PGDG APT repo](https://www.postgresql.org/download/linux/ubuntu/) — the distro-default package is often outdated |
| Windows | [Official installer](https://www.postgresql.org/download/windows/) (EDB installer) |

Verify:

```sh
psql --version
```

## 2. Install pgvector

pgvector is a Postgres extension, installed once per Postgres instance, then enabled once
per database.

### macOS

```sh
brew install pgvector
```

### Ubuntu/Debian (matches your Postgres major version)

```sh
sudo apt install postgresql-16-pgvector   # replace 16 with your Postgres version
```

If your distro's package is missing or stale, build from source instead:

```sh
git clone --branch v0.8.6 https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install
```

### Windows

**This is the fiddliest platform — budget extra time the first time.** pgvector has no
official prebuilt Windows binary; it's built with `nmake` against a Visual C++ toolchain.

**Prerequisites:**
1. PostgreSQL installed (via the EDB installer above)
2. [Git for Windows](https://git-scm.com/download/win)
3. Visual Studio (Community edition is fine) with the **"Desktop development with C++"**
   workload installed

**Build steps** — open **"x64 Native Tools Command Prompt for VS 2022"** (search for it in
the Start menu — this is not a regular terminal, it has the C++ build environment
preloaded) and run:

```cmd
set "PGROOT=C:\Program Files\PostgreSQL\16"
cd %TEMP%
git clone --branch v0.8.6 https://github.com/pgvector/pgvector.git
cd pgvector
nmake /F Makefile.win
nmake /F Makefile.win install
```

Adjust `PGROOT` to match your installed Postgres version/path.

**Common issues:**
- `Cannot open include file: 'postgres.h'` → `PGROOT` is wrong; double-check the path
- `error C2196: case value '4' already used` → you're not in the x64 Native Tools prompt;
  reopen the correct one, run `nmake /F Makefile.win clean`, retry
- `Access is denied` → re-run the prompt as Administrator

**Lighter alternative:** if the Visual Studio toolchain is too heavy to install just for
this, `conda-forge` distributes a prebuilt pgvector package (`conda install -c conda-forge
pgvector`) — this sidesteps the build step entirely, at the cost of running Postgres inside
a conda environment. Not the default path here since it's an additional tooling dependency,
but worth knowing about if the build keeps failing.

## 3. Create the database and enable the extension

```sh
createdb mikio_dev
psql -d mikio_dev -c "CREATE EXTENSION vector;"
```

Verify it's active:

```sh
psql -d mikio_dev -c "\dx vector"
```

You should see `vector` listed with an installed version.

## 4. Connection string

Copy `configs/.env.example` to a local `.env` (gitignored) and adjust credentials:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mikio_dev
```

No application code reads this yet (see Status above) — this is the connection string
future `backend/` and `ai/inference` work will consume once DB integration starts.

## 5. Verify connectivity

Run the helper script:

```sh
pwsh ./scripts/check-postgres.ps1
```

This connects using `DATABASE_URL`, confirms `pgvector` is enabled, and exits non-zero on
any failure — useful as a first troubleshooting step before assuming an application-level
bug once real DB code exists.

---

## References

- [pgvector README](https://github.com/pgvector/pgvector) — canonical install instructions, kept current across platforms
- [PostgreSQL downloads](https://www.postgresql.org/download/)
- `TECH_STACK.md` §13 — Docker usage boundary this doc follows