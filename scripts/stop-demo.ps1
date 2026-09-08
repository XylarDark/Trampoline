# Stops the demo database and app started by scripts/start-demo.ps1.
#
# Killing `npm run dev` alone leaves the Next.js child process holding the port,
# so this works from the listening sockets rather than from the npm wrappers.

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "demo: $Message" -ForegroundColor Cyan
}

function Stop-PortOwner {
    param([int]$Port, [string]$Label)

    $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if (-not $connections) {
        Write-Step "nothing listening on $Port, $Label already stopped"
        return
    }

    foreach ($processId in ($connections.OwningProcess | Sort-Object -Unique)) {
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if (-not $process) { continue }
        Write-Step "stopping $Label (pid $processId, $($process.ProcessName))"
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }
}

Stop-PortOwner -Port 3000 -Label "the app"
Stop-PortOwner -Port 5432 -Label "the demo database"

Write-Host "demo: stopped. The database files under .pglite are left in place, so the next start is fast." -ForegroundColor Green
