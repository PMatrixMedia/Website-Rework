# Reinstall dependencies when Yarn fails with EPERM / "Access denied" on Windows (often
# @tailwindcss/oxide *.node locked by Node, the IDE, or antivirus).
#
# BEFORE RUNNING: Fully quit Cursor / VS Code (File > Exit), not just closing the window.
# Optional: run PowerShell "As administrator" if the steps below still fail.

$ErrorActionPreference = "Continue"
Set-Location (Split-Path -Parent $PSScriptRoot)
if (-not (Test-Path "package.json")) {
  Set-Location $PSScriptRoot\..
}

$projectRoot = (Get-Location).Path
$nm = Join-Path $projectRoot "node_modules"

function Stop-CommonLockers {
  Write-Host "Stopping processes that often lock node_modules (Node, esbuild)..." -ForegroundColor Yellow
  @("node", "esbuild") | ForEach-Object {
    Get-Process -Name $_ -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
  }
  Start-Sleep -Seconds 3
}

function Clear-ReadOnlyTree {
  param([string]$Path)
  if (-not (Test-Path $Path)) { return }
  Write-Host "Clearing read-only / system attributes under node_modules..." -ForegroundColor Gray
  cmd /c "attrib -s -h -r `"$Path\*`" /s /d" 2>$null | Out-Null
}

function Remove-WithRobocopyMirror {
  param([string]$TargetDir)
  # Mirror an empty folder into TargetDir — deletes contents without the same locks as Remove-Item.
  $empty = Join-Path ([System.IO.Path]::GetTempPath()) ("nm_empty_" + [guid]::NewGuid().ToString("n").Substring(0, 12))
  New-Item -ItemType Directory -Path $empty -Force | Out-Null
  Write-Host "Using robocopy /MIR empty folder (Windows workaround for stubborn locks)..." -ForegroundColor Yellow
  $null = & robocopy $empty $TargetDir /MIR /NFL /NDL /NJH /NJS /NC /NS /R:1 /W:1
  Remove-Item -LiteralPath $empty -Recurse -Force -ErrorAction SilentlyContinue
}

function Unlock-TailwindOxideIfPresent {
  param([string]$Root)
  $oxideFile = Get-ChildItem -Path $Root -Recurse -Filter "tailwindcss-oxide.win32-x64-msvc.node" -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if (-not $oxideFile) { return }

  $full = $oxideFile.FullName
  Write-Host "Trying takeown/icacls on: $full" -ForegroundColor Yellow
  Write-Host "(If this says Access denied, right-click PowerShell > Run as administrator and run this script again.)" -ForegroundColor Gray
  $null = & takeown /f $full /a 2>&1
  $null = & icacls $full /grant "${env:USERNAME}:(F)" 2>&1
  Start-Sleep -Milliseconds 500
  Remove-Item -LiteralPath $full -Force -ErrorAction SilentlyContinue
}

Stop-CommonLockers

if (-not (Test-Path $nm)) {
  Write-Host "No node_modules folder — running yarn install only." -ForegroundColor Green
} else {
  Clear-ReadOnlyTree $nm

  Write-Host "Removing node_modules (first attempt)..." -ForegroundColor Yellow
  Remove-Item -LiteralPath $nm -Recurse -Force -ErrorAction SilentlyContinue

  if (Test-Path $nm) {
    Write-Host "First remove failed — trying robocopy mirror..." -ForegroundColor Yellow
    Remove-WithRobocopyMirror $nm
    Remove-Item -LiteralPath $nm -Recurse -Force -ErrorAction SilentlyContinue
  }

  if (Test-Path $nm) {
    Unlock-TailwindOxideIfPresent $nm
    Clear-ReadOnlyTree $nm
    Remove-Item -LiteralPath $nm -Recurse -Force -ErrorAction SilentlyContinue
  }

  if (Test-Path $nm) {
    Write-Host ""
    Write-Host "Could not delete node_modules completely." -ForegroundColor Red
    Write-Host "Do this, then run this script again:" -ForegroundColor Yellow
    Write-Host "  1. Quit Cursor/VS Code fully (File > Exit)." -ForegroundColor White
    Write-Host "  2. In Task Manager, end any remaining 'Node.js' or 'Cursor' tasks." -ForegroundColor White
    Write-Host "  3. Run PowerShell as Administrator and run: yarn windows:reinstall" -ForegroundColor White
    Write-Host "  4. Or reboot, then delete the folder manually in Explorer." -ForegroundColor White
    exit 1
  }
}

Write-Host "Running yarn install..." -ForegroundColor Green
Set-Location $projectRoot
if (Get-Command yarn -ErrorAction SilentlyContinue) {
  yarn install
} else {
  corepack yarn install
}
exit $LASTEXITCODE
