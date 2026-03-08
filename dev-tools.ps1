# ╔═══════════════════════════════════════════════════════════════╗
# ║  Portfolio React — Dev Tools                                 ║
# ║  Interactive CLI for local development tasks                 ║
# ╚═══════════════════════════════════════════════════════════════╝

$Host.UI.RawUI.WindowTitle = "Portfolio React — Dev Tools"
$projectDir = $PSScriptRoot

# ── Colors ────────────────────────────────────────────────────────
function Write-Header {
    Clear-Host
    Write-Host ""
    Write-Host "  ╔═══════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║     " -ForegroundColor Cyan -NoNewline
    Write-Host "Portfolio React — Dev Tools" -ForegroundColor White -NoNewline
    Write-Host "          ║" -ForegroundColor Cyan
    Write-Host "  ║     " -ForegroundColor Cyan -NoNewline
    Write-Host "l7feeders.dev" -ForegroundColor DarkGray -NoNewline
    Write-Host "                       ║" -ForegroundColor Cyan
    Write-Host "  ╚═══════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Write-MenuTitle($title) {
    Write-Host "  ┌─ " -ForegroundColor DarkCyan -NoNewline
    Write-Host "$title" -ForegroundColor Yellow
}

function Write-MenuItem($key, $label) {
    Write-Host "  │  " -ForegroundColor DarkCyan -NoNewline
    Write-Host "[$key]" -ForegroundColor Green -NoNewline
    Write-Host " $label" -ForegroundColor White
}

function Write-MenuEnd {
    Write-Host "  └──────────────────────────────────────────" -ForegroundColor DarkCyan
}

function Write-Status($msg, $color = "DarkGray") {
    Write-Host ""
    Write-Host "  → $msg" -ForegroundColor $color
}

function Write-Success($msg) { Write-Status $msg "Green" }
function Write-Warn($msg)    { Write-Status $msg "Yellow" }
function Write-Err($msg)     { Write-Status $msg "Red" }

function Pause-Menu {
    Write-Host ""
    Write-Host "  Press any key to continue..." -ForegroundColor DarkGray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# ── Run npm script in new terminal window ─────────────────────────
function Start-NpmScript($scriptName, $title) {
    $cmd = "cd '$projectDir'; `$Host.UI.RawUI.WindowTitle = '$title'; npm run $scriptName; Read-Host 'Press Enter to close'"
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", $cmd
    Write-Success "$title started in new window"
}

# ── Run npm script inline (blocking) ─────────────────────────────
function Invoke-NpmScript($scriptName) {
    Write-Host ""
    Push-Location $projectDir
    & npm run $scriptName
    Pop-Location
}

# ── Main Menu ─────────────────────────────────────────────────────
function Show-MainMenu {
    while ($true) {
        Write-Header

        Write-MenuTitle "Dev Servers"
        Write-MenuItem "1" "Start Dev Server + Client (concurrently)"
        Write-MenuItem "2" "Start Server only  (node server.js)"
        Write-MenuItem "3" "Start Client only  (vite)"
        Write-Host ""

        Write-MenuTitle "Cron / Queue"
        Write-MenuItem "4" "Trigger Cron — Process Queue → LibreDesk"
        Write-MenuItem "5" "Process Queue (local script)"
        Write-Host ""

        Write-MenuTitle "Build & Quality"
        Write-MenuItem "6" "Run Lint        (eslint .)"
        Write-MenuItem "7" "Run Tests       (vitest run)"
        Write-MenuItem "8" "Run Build       (vite build)"
        Write-MenuItem "9" "Run Full Check  (lint + test + build)"
        Write-Host ""

        Write-MenuTitle "Utilities"
        Write-MenuItem "P" "Preview production build"
        Write-MenuItem "V" "Bump version (patch)"
        Write-MenuItem "A" "npm audit"
        Write-Host ""

        Write-MenuItem "Q" "Quit"
        Write-MenuEnd

        Write-Host ""
        $choice = Read-Host "  Select"

        switch ($choice.ToUpper()) {
            "1" { Start-NpmScript "dev" "Dev (Full)" }
            "2" { Start-NpmScript "dev:server" "Dev Server" }
            "3" { Start-NpmScript "dev:client" "Dev Client (Vite)" }
            "4" { Invoke-CronProcessQueue }
            "5" { Invoke-NpmScript "queue:process"; Pause-Menu }
            "6" { Invoke-NpmScript "lint"; Pause-Menu }
            "7" { Invoke-NpmScript "test"; Pause-Menu }
            "8" { Invoke-NpmScript "build"; Pause-Menu }
            "9" { Invoke-NpmScript "check"; Pause-Menu }
            "P" { Start-NpmScript "preview" "Preview" }
            "V" { Invoke-NpmScript "version:patch"; Pause-Menu }
            "A" { Push-Location $projectDir; npm audit; Pop-Location; Pause-Menu }
            "Q" { Clear-Host; return }
            default { Write-Warn "Invalid selection" ; Start-Sleep -Milliseconds 800 }
        }
    }
}

# ── Cron: Process Queue ──────────────────────────────────────────
function Invoke-CronProcessQueue {
    $envFile = Join-Path $projectDir ".env.local"
    if (-not (Test-Path $envFile)) {
        Write-Err ".env.local not found — cannot read CRON_SECRET"
        Pause-Menu
        return
    }

    $secret = (Get-Content $envFile | Where-Object { $_ -match '^CRON_SECRET=' }) -replace '^CRON_SECRET=', ''
    if (-not $secret) {
        Write-Err "CRON_SECRET not set in .env.local"
        Pause-Menu
        return
    }

    Write-Status "Triggering cron/process-queue..." "Cyan"
    try {
        $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/cron/process-queue' `
            -Headers @{ Authorization = "Bearer $secret" } `
            -ErrorAction Stop

        Write-Success "Queue processed!"
        Write-Host "  │  Processed : " -ForegroundColor DarkCyan -NoNewline
        Write-Host "$($response.processed)" -ForegroundColor White
        Write-Host "  │  Successful: " -ForegroundColor DarkCyan -NoNewline
        Write-Host "$($response.successful)" -ForegroundColor Green

        if ($response.results) {
            foreach ($r in $response.results) {
                $icon = if ($r.success) { "✓" } else { "✗" }
                $color = if ($r.success) { "Green" } else { "Red" }
                Write-Host "  │  $icon $($r.id)" -ForegroundColor $color
            }
        }
    }
    catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq 401) {
            Write-Err "401 Unauthorized — check CRON_SECRET"
        } else {
            Write-Err "Request failed: $_"
            Write-Warn "Is the dev server running? (option 2)"
        }
    }
    Pause-Menu
}

# ── Entry Point ───────────────────────────────────────────────────
Show-MainMenu
