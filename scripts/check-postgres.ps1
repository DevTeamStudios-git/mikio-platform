#Requires -Version 7.0
<#
.SYNOPSIS
  Verify the local PostgreSQL instance is reachable and the pgvector "vector"
  extension is installed.

.DESCRIPTION
  Reads DATABASE_URL (from the environment, else from configs/.env) as documented
  in configs/postgresql.md, then:
    1. pg_isready — the server accepts connections.
    2. psql       — the target database has the "vector" extension installed.

  Exit codes: 0 = all checks pass, 1 = one or more checks failed, 2 = prerequisite
  missing (no DATABASE_URL, or psql/pg_isready not found).

.EXAMPLE
  ./scripts/check-postgres.ps1
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

function Write-Step {
    param([Parameter(Mandatory = $true)][string]$Message)
    Write-Host "==> $Message"
}

function Write-Pass {
    param([Parameter(Mandatory = $true)][string]$Message)
    Write-Host "    PASS: $Message" -ForegroundColor Green
}

function Write-Fail {
    param([Parameter(Mandatory = $true)][string]$Message)
    Write-Host "    FAIL: $Message" -ForegroundColor Red
}

$root = Split-Path -Parent $PSScriptRoot

# --- Resolve DATABASE_URL -----------------------------------------------------
$databaseUrl = $env:DATABASE_URL
if (-not $databaseUrl) {
    $envFile = Join-Path $root 'configs/.env'
    if (Test-Path -LiteralPath $envFile) {
        $line = Get-Content -LiteralPath $envFile | Where-Object { $_ -match '^\s*DATABASE_URL=' } | Select-Object -First 1
        if ($line) {
            $databaseUrl = ($line -replace '^\s*DATABASE_URL=\s*', '').Trim()
        }
    }
}

if (-not $databaseUrl) {
    Write-Host "ERROR: DATABASE_URL not set (env var or configs/.env). See configs/postgresql.md." -ForegroundColor Red
    exit 2
}

# postgresql://user:pass@host:port/dbname
$match = [regex]::Match($databaseUrl, '^postgres(?:ql)?://(?:([^:@/]+)(?::([^@/]*))?@)?([^:/@]+)(?::(\d+))?/([^/\s]+)')
if (-not $match.Success) {
    Write-Host "ERROR: could not parse DATABASE_URL (expected postgresql://user:pass@host:port/dbname)." -ForegroundColor Red
    exit 2
}

$user = $match.Groups[1].Value
$hostName = $match.Groups[3].Value
$port = if ($match.Groups[4].Value) { $match.Groups[4].Value } else { '5432' }
$dbName = $match.Groups[5].Value

# --- Locate PostgreSQL client tools -------------------------------------------
function Find-Tool {
    param([Parameter(Mandatory = $true)][string]$Name)
    $cmd = Get-Command $Name -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }

    $candidates = @()
    $pgRoots = Get-ChildItem 'C:\Program Files\PostgreSQL\*\bin' -ErrorAction SilentlyContinue |
        Sort-Object { if ($_.Name -match '^(\d+)$') { [int]$Matches[1] } else { 0 } } -Descending
    foreach ($dir in $pgRoots) {
        $candidates += (Join-Path $dir.FullName "$Name.exe")
        $candidates += (Join-Path $dir.FullName $Name)
    }
    return $candidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
}

$psql = Find-Tool 'psql'
$pgIsReady = Find-Tool 'pg_isready'

if (-not $psql -or -not $pgIsReady) {
    Write-Host "ERROR: psql/pg_isready not found. Install the PostgreSQL client tools (see configs/postgresql.md)." -ForegroundColor Red
    exit 2
}

Write-Step "Target: postgres://${hostName}:${port}/$dbName (user: $user)"
$failures = 0

# --- 1. Server reachable ------------------------------------------------------
Write-Step "pg_isready - server accepts connections on ${hostName}:$port"
$readyOut = & $pgIsReady -h $hostName -p $port -U $user 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Pass $readyOut
} else {
    $failures++
    Write-Fail "server did not report ready: $readyOut"
}

# --- 2. pgvector extension installed ------------------------------------------
Write-Step "psql - pgvector 'vector' extension installed in '$dbName'"
$extOut = & $psql $databaseUrl -tA -c "SELECT count(*) FROM pg_catalog.pg_extension WHERE extname = 'vector';" 2>&1
if ($LASTEXITCODE -eq 0 -and $extOut.Trim() -eq '1') {
    Write-Pass "vector extension present (enable it with: CREATE EXTENSION IF NOT EXISTS vector; — see configs/postgresql.md)"
} else {
    $failures++
    Write-Fail "vector extension missing in '$dbName': $extOut"
}

# --- Summary ------------------------------------------------------------------
if ($failures -gt 0) {
    Write-Host ("FAILED: {0} check(s) not satisfied. See configs/postgresql.md." -f $failures) -ForegroundColor Red
    exit 1
}

Write-Host "ALL CHECKS PASSED." -ForegroundColor Green
exit 0