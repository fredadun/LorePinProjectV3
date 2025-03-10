# Rollback script for LorePin CMS v0.1.0
# This script will restore the project to the state of v0.1.0-cms tag

# Stop any running Node.js processes
Write-Host "Stopping any running Node.js processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Check if we have uncommitted changes
Write-Host "Checking for uncommitted changes..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "You have uncommitted changes. Please commit or stash them before rolling back." -ForegroundColor Red
    Write-Host "Uncommitted changes:"
    git status
    exit 1
}

# Create a backup of the current state
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
Write-Host "Creating a backup of the current state..." -ForegroundColor Yellow
$backupDir = "backups/pre-rollback-$timestamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Compress-Archive -Path backend -DestinationPath "$backupDir/backend.zip" -Force

# Roll back to the tagged version
Write-Host "Rolling back to v0.1.0-cms..." -ForegroundColor Yellow
git checkout v0.1.0-cms

# Restore node_modules if needed
Write-Host "Restoring node_modules..." -ForegroundColor Yellow
if (-not (Test-Path "backend/functions/node_modules")) {
    Set-Location backend/functions
    npm install
    Set-Location ../..
}

if (-not (Test-Path "backend/cms-ui/node_modules")) {
    Set-Location backend/cms-ui
    npm install
    Set-Location ../..
}

# Build the backend
Write-Host "Building the backend..." -ForegroundColor Yellow
Set-Location backend/functions
npm run build
Set-Location ../..

Write-Host "Rollback complete! The project has been restored to v0.1.0-cms." -ForegroundColor Green
Write-Host "To start the CMS UI server, run: cd backend/cms-ui; node server.js" -ForegroundColor Cyan 