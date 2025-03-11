# PowerShell script to start Firebase emulators and the LorePin CMS server
# This script uses proper PowerShell syntax and avoids the '&&' operator issue

# Display startup message
Write-Host "Starting LorePin CMS with Firebase Emulators..." -ForegroundColor Green

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

# Check if the .env file exists
if (-not (Test-Path -Path ".env")) {
    Write-Host "Error: .env file not found in the current directory." -ForegroundColor Red
    Write-Host "Creating a default .env file..." -ForegroundColor Yellow
    
    # Create a default .env file
    @"
# Firebase Configuration
FIREBASE_API_KEY=AIzaSyB1eLfwECUvufRcFFwBDaQY6tHHdwkA3Mg
FIREBASE_AUTH_DOMAIN=lorebacking-test.firebaseapp.com
FIREBASE_PROJECT_ID=lorebacking-test
FIREBASE_STORAGE_BUCKET=lorebacking-test.appspot.com
FIREBASE_MESSAGING_SENDER_ID=532363101127
FIREBASE_APP_ID=1:532363101127:web:645922acc5144943d54fe2
FIREBASE_MEASUREMENT_ID=G-MSFZ41D7GM

# React App Environment Variables (for backward compatibility)
REACT_APP_FIREBASE_API_KEY=AIzaSyB1eLfwECUvufRcFFwBDaQY6tHHdwkA3Mg
REACT_APP_FIREBASE_AUTH_DOMAIN=lorebacking-test.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=lorebacking-test
REACT_APP_FIREBASE_STORAGE_BUCKET=lorebacking-test.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=532363101127
REACT_APP_FIREBASE_APP_ID=1:532363101127:web:645922acc5144943d54fe2
REACT_APP_FIREBASE_MEASUREMENT_ID=G-MSFZ41D7GM

# Firebase Emulators
FIREBASE_USE_EMULATORS=true
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIREBASE_FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_FUNCTIONS_EMULATOR_HOST=localhost:5001
FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199

# React App Emulator Configuration (for backward compatibility)
REACT_APP_USE_EMULATORS=true
REACT_APP_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
REACT_APP_FIRESTORE_EMULATOR_HOST=localhost:8080
REACT_APP_FUNCTIONS_EMULATOR_HOST=localhost:5001
REACT_APP_FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199

# Server Configuration
PORT=3003

# Environment
NODE_ENV=development

# API Configuration
REACT_APP_API_URL=http://localhost:5001/lorebacking-test/europe-west2/cms
"@ | Out-File -FilePath ".env" -Encoding utf8
    
    Write-Host "Default .env file created." -ForegroundColor Green
}

# Check if firebase-tools is installed
$firebaseInstalled = $null
try {
    $firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
} catch {
    $firebaseInstalled = $null
}

if (-not $firebaseInstalled) {
    Write-Host "Firebase CLI not found. Installing firebase-tools globally..." -ForegroundColor Yellow
    npm install -g firebase-tools
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error installing firebase-tools. Please install it manually with 'npm install -g firebase-tools'." -ForegroundColor Red
        exit 1
    }
}

# Start Firebase emulators in a new PowerShell window
Write-Host "Starting Firebase emulators..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ..; firebase emulators:start --only auth,firestore,functions,storage"

# Wait for emulators to start
Write-Host "Waiting for emulators to start (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Create test user for the emulator
Write-Host "Creating test user for Firebase Auth emulator..." -ForegroundColor Cyan
try {
    # Check if firebase module is installed
    $firebaseModuleInstalled = $null
    try {
        $firebaseModuleInstalled = npm list firebase
    } catch {
        $firebaseModuleInstalled = $null
    }
    
    if (-not $firebaseModuleInstalled) {
        Write-Host "Firebase module not found. Installing..." -ForegroundColor Yellow
        npm install firebase
    }
    
    # Run the script to create a test user
    node create-test-user.js
} catch {
    Write-Host "Error creating test user: $_" -ForegroundColor Red
    Write-Host "Continuing without test user..." -ForegroundColor Yellow
}

# Ask if the user wants to seed the database
$seedDatabase = Read-Host "Do you want to seed the Firestore database with sample data? (y/n)"
if ($seedDatabase -eq "y" -or $seedDatabase -eq "Y") {
    Write-Host "Seeding Firestore database..." -ForegroundColor Cyan
    try {
        node seed-firestore.js
    } catch {
        Write-Host "Error seeding database: $_" -ForegroundColor Red
        Write-Host "Continuing without seeding..." -ForegroundColor Yellow
    }
}

# Start the server
Write-Host "Starting server from: $scriptPath" -ForegroundColor Cyan
Write-Host "Running: node server.js" -ForegroundColor Cyan

# Run the server
node server.js

# This line will only execute if the server stops
Write-Host "Server has stopped." -ForegroundColor Red 