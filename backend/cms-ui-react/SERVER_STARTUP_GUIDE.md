# LorePin CMS Server Startup Guide

This document provides instructions for starting the LorePin CMS server in different environments.

## Prerequisites

- Node.js v16 or higher
- NPM v7 or higher
- Firebase CLI (for emulators)

## Starting the Server

### Starting with Firebase Emulators (Recommended for Development)

We've created scripts that automatically start both Firebase emulators and the server in one step.

#### Windows (PowerShell)

```powershell
# Navigate to the cms-ui-react directory
cd C:\path\to\LorePinProjectV3\backend\cms-ui-react

# Run the PowerShell script with emulators
.\start-with-emulators.ps1
```

#### Windows (Command Prompt)

```cmd
:: Navigate to the cms-ui-react directory
cd C:\path\to\LorePinProjectV3\backend\cms-ui-react

:: Run the batch file with emulators
start-with-emulators.bat
```

These scripts will:
1. Kill any existing Node.js processes
2. Check for and create a default `.env` file if needed
3. Install Firebase CLI if not already installed
4. Start Firebase emulators in a separate window
5. Create a test user (admin@example.com / password123) for the Auth emulator
6. Start the CMS server

### Starting the Server Only

If you already have Firebase emulators running or want to connect to production Firebase services, use these methods:

#### Windows (PowerShell)

In Windows PowerShell, use the provided PowerShell script:

```powershell
# Navigate to the cms-ui-react directory
cd C:\path\to\LorePinProjectV3\backend\cms-ui-react

# Run the PowerShell script
.\powershell-start.ps1
```

**IMPORTANT:** Do NOT use the `&&` operator in PowerShell as it is not a valid command separator. Instead, use semicolons `;` or separate commands:

```powershell
# CORRECT - Using semicolon
cd backend\cms-ui-react; node server.js

# CORRECT - Separate commands
cd backend\cms-ui-react
node server.js

# INCORRECT - Will cause an error
cd backend\cms-ui-react && node server.js
```

#### Windows (Command Prompt)

In Windows Command Prompt, use the provided batch file:

```cmd
:: Navigate to the cms-ui-react directory
cd C:\path\to\LorePinProjectV3\backend\cms-ui-react

:: Run the batch file
start-server.bat
```

Or use the following commands:

```cmd
:: Navigate to the cms-ui-react directory
cd C:\path\to\LorePinProjectV3\backend\cms-ui-react

:: Start the server
node server.js
```

#### macOS/Linux (Bash/Zsh)

In macOS or Linux terminals, use the following commands:

```bash
# Navigate to the cms-ui-react directory
cd /path/to/LorePinProjectV3/backend/cms-ui-react

# Start the server
node server.js
```

## Troubleshooting

### Port Already in Use

If you see an error like `EADDRINUSE: address already in use :::3003`, it means the port is already being used by another process. To fix this:

#### Windows (PowerShell)

```powershell
# Find processes using port 3003
Get-Process -Id (Get-NetTCPConnection -LocalPort 3003).OwningProcess

# Kill the process
Stop-Process -Id <process_id> -Force
```

#### macOS/Linux

```bash
# Find processes using port 3003
lsof -i :3003

# Kill the process
kill -9 <PID>
```

### Node.js Process Not Terminating

If the Node.js process doesn't terminate properly and you need to restart:

#### Windows (PowerShell)

```powershell
# Kill all Node.js processes
Get-Process -Name node | Stop-Process -Force
```

#### macOS/Linux

```bash
# Kill all Node.js processes
pkill -f node
```

## Server Files

- `server.js` - The main server file with full Firebase integration
- `quick-server.js` - A simplified server for quick testing
- `powershell-start.ps1` - PowerShell script for Windows users (server only)
- `start-server.bat` - Batch file for Windows Command Prompt users (server only)
- `start-with-emulators.ps1` - PowerShell script to start both Firebase emulators and server
- `start-with-emulators.bat` - Batch file to start both Firebase emulators and server

## Environment Variables

The server uses environment variables from the `.env` file. Make sure this file exists and contains the necessary configuration. The emulator startup scripts will create a default `.env` file if one doesn't exist.

## Firebase Emulators

### Manual Emulator Setup

If you prefer to start emulators manually:

```bash
# Start Firebase emulators
firebase emulators:start --only auth,firestore,functions,storage
```

Set `FIREBASE_USE_EMULATORS=true` in the `.env` file to connect to the emulators.

### Test User for Emulators

When using the emulator startup scripts, a test user is automatically created:
- Email: admin@example.com
- Password: password123

You can also manually create a test user by running:
```bash
node create-test-user.js
``` 