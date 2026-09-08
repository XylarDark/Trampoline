# Starts the provider demo for a retention interview and opens the caseload
# screen. Safe to run repeatedly: every step checks for existing state and
# reuses it rather than rebuilding.
#
# Run it with `npm run demo`. Stop it with `npm run demo:stop`.

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$databaseUrl = "postgres://trampoline:trampoline@127.0.0.1:5432/trampoline"
$caseloadUrl = "http://localhost:3000/provider"
$databasePort = 5432
$serverPort = 3000

function Write-Step {
    param([string]$Message)
    Write-Host "demo: $Message" -ForegroundColor Cyan
}

function Write-Problem {
    param([string]$Message)
    Write-Host "demo: $Message" -ForegroundColor Red
}

function Test-PortListening {
    param([int]$Port)
    return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

# Launches a command in its own window so it outlives this script. The demo
# needs two long-running processes and the interviewer should not have to keep
# a terminal alive by hand.
function Start-Detached {
    param([string]$Command, [string]$Title)
    Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c", "title $Title && $Command" `
        -WorkingDirectory $repoRoot | Out-Null
}

function Wait-For {
    param(
        [scriptblock]$Condition,
        [int]$TimeoutSeconds,
        [string]$Description
    )
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (& $Condition) { return $true }
        Start-Sleep -Milliseconds 700
    }
    Write-Problem "gave up waiting for $Description after $TimeoutSeconds seconds."
    return $false
}

Write-Step "starting from $repoRoot"

# --- Environment file ---------------------------------------------------------
# 127.0.0.1 rather than localhost is load-bearing: the demo database binds IPv4
# only, and on Windows localhost resolves to ::1 first. See docs/KNOWN_ERRORS.md.
if (Test-Path ".env.local") {
    $envText = Get-Content ".env.local" -Raw
    Write-Step "reusing the existing .env.local"
    if ($envText -match "DATABASE_URL=.*localhost") {
        Write-Problem "DATABASE_URL uses localhost. The demo database needs 127.0.0.1 and will refuse the connection. Fix .env.local before continuing."
        exit 1
    }
    if ($envText -notmatch "DATABASE_DRIVER=pglite") {
        Write-Problem "DATABASE_DRIVER is not pglite. Set it in .env.local, or the app will open too many connections for the demo database."
        exit 1
    }
} else {
    Write-Step "no .env.local found, writing one for the demo"
    $secret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
    $envLines = @(
        "# Written by scripts/start-demo.ps1 for the local read-only demo.",
        "DATABASE_URL=$databaseUrl",
        "DATABASE_DRIVER=pglite",
        "",
        "AUTH_SECRET=$secret",
        "AUTH_EMAIL_SERVER=",
        "AUTH_EMAIL_FROM=no-reply@localhost",
        "NEXT_PUBLIC_APP_URL=http://localhost:3000"
    )
    Set-Content -Path ".env.local" -Value $envLines -Encoding utf8
}

# --- Dependencies ------------------------------------------------------------
if (Test-Path "node_modules") {
    Write-Step "dependencies already installed, skipping npm install"
} else {
    Write-Step "installing dependencies, this takes a few minutes the first time"
    npm install
}

# --- Database ----------------------------------------------------------------
if (Test-PortListening -Port $databasePort) {
    Write-Step "database already listening on $databasePort, reusing it"
} else {
    Write-Step "starting the demo database"
    Start-Detached -Command "npm run db:demo" -Title "Trampoline demo database"
    if (-not (Wait-For -Condition { Test-PortListening -Port $databasePort } -TimeoutSeconds 90 -Description "the database to accept connections")) {
        Write-Problem "check the 'Trampoline demo database' window for the reason."
        exit 1
    }
    Write-Step "database is up"
}

# --- Schema and cohort -------------------------------------------------------
# db:migrate reads the connection string from the process environment, not from
# .env.local, so it is set here as well.
$env:DATABASE_URL = $databaseUrl
$env:DATABASE_DRIVER = "pglite"

Write-Step "applying migrations"
npm run db:migrate 2>&1 | Out-Null

Write-Step "seeding the demo cohort, reporting 0 of 12 clients means they already exist"
npm run db:seed

# --- Dev server --------------------------------------------------------------
if (Test-PortListening -Port $serverPort) {
    Write-Step "a server is already listening on $serverPort, reusing it"
} else {
    Write-Step "starting the app"
    Start-Detached -Command "npm run dev" -Title "Trampoline demo server"
    if (-not (Wait-For -Condition { Test-PortListening -Port $serverPort } -TimeoutSeconds 120 -Description "the app to start listening")) {
        Write-Problem "check the 'Trampoline demo server' window for the reason."
        exit 1
    }
}

# The first request compiles the route, so this both warms the page and proves
# the whole chain works before anyone is on the phone.
Write-Step "loading the caseload screen once to compile it"
$ready = Wait-For -Condition {
    try {
        (Invoke-WebRequest -Uri $caseloadUrl -UseBasicParsing -TimeoutSec 120).StatusCode -eq 200
    } catch {
        $false
    }
} -TimeoutSeconds 180 -Description "the caseload screen to return a page"

if (-not $ready) {
    Write-Problem "the app is listening but the caseload screen did not load. Check the 'Trampoline demo server' window."
    exit 1
}

Start-Process $caseloadUrl

Write-Host ""
Write-Host "demo: ready. The caseload screen is open at $caseloadUrl" -ForegroundColor Green
Write-Host "demo: twelve synthetic clients, nothing writes, running on this machine." -ForegroundColor Green
Write-Host "demo: run 'npm run demo:stop' when the calls are finished." -ForegroundColor Green
