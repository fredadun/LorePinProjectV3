# PowerShell script to start the LorePin CMS server
# This script uses proper PowerShell syntax and avoids the '&&' operator issue

# Display startup message
Write-Host "Starting LorePin CMS Server..." -ForegroundColor Green

# Kill any existing Node.js processes that might be using port 3003
try {
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        Write-Host "Stopping existing Node.js processes..." -ForegroundColor Yellow
        $nodeProcesses | Stop-Process -Force
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "No existing Node.js processes found or could not stop them." -ForegroundColor Yellow
}

# Set the current directory to the script's location
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $scriptPath

# Check if the quick-server.js file exists
if (-not (Test-Path -Path "quick-server.js")) {
    Write-Host "Error: quick-server.js not found in the current directory." -ForegroundColor Red
    Write-Host "Current directory: $scriptPath" -ForegroundColor Red
    exit 1
}

# Start the server
Write-Host "Starting server from: $scriptPath" -ForegroundColor Cyan
Write-Host "Running: node quick-server.js" -ForegroundColor Cyan

# Run the server
node quick-server.js

# This line will only execute if the server stops
Write-Host "Server has stopped." -ForegroundColor Red 