# LorePin CMS UI

This is the Content Management System (CMS) UI for the LorePin project, built with React Admin and Firebase.

## Quick Start

### With Firebase Emulators (Recommended for Development)

Start both Firebase emulators and the server in one step:

#### Windows (PowerShell)

```powershell
# Navigate to the cms-ui-react directory
cd backend\cms-ui-react

# Run the PowerShell script with emulators
.\start-with-emulators.ps1
```

#### Windows (Command Prompt)

```cmd
cd backend\cms-ui-react
start-with-emulators.bat
```

This will:
- Start Firebase emulators (Auth, Firestore, Functions, Storage)
- Create a test user (admin@example.com / password123)
- Optionally seed the database with sample data
- Start the CMS server

### Server Only (If Emulators Are Already Running)

#### Windows (PowerShell)

```powershell
# Navigate to the cms-ui-react directory
cd backend\cms-ui-react

# Run the PowerShell script
.\powershell-start.ps1
```

#### Windows (Command Prompt)

```cmd
cd backend\cms-ui-react
start-server.bat
```

#### macOS/Linux

```bash
cd backend/cms-ui-react
node server.js
```

## Available Scripts

- `start-with-emulators.ps1` - PowerShell script to start both Firebase emulators and server (recommended)
- `start-with-emulators.bat` - Batch file to start both Firebase emulators and server
- `powershell-start.ps1` - PowerShell script for server only
- `start-server.bat` - Batch file for server only
- `server.js` - Main server with full Firebase integration
- `quick-server.js` - Simplified server for quick testing
- `create-test-user.js` - Script to create a test user in the Firebase Auth emulator
- `seed-firestore.js` - Script to populate Firestore emulator with sample data
- `verify-emulator-setup.js` - Script to verify that all Firebase emulator files are properly synchronized
- `sync-emulator-config.js` - Script to sync Firebase emulator configuration between local and remote environments

## Important Notes

1. **PowerShell Users**: Do NOT use the `&&` operator in PowerShell as it is not a valid command separator. Instead, use semicolons `;` or separate commands.

2. **Port Conflicts**: If you see an error about the port being in use, you can kill existing Node.js processes:
   ```powershell
   Get-Process -Name node | Stop-Process -Force
   ```

3. **Firebase Emulators**: The emulator scripts will automatically start Firebase emulators. If you want to start them manually:
   ```bash
   firebase emulators:start --only auth,firestore,functions,storage
   ```

4. **Test User**: When using emulators, a test user is automatically created:
   - Email: admin@example.com
   - Password: password123

5. **Sample Data**: You can seed the Firestore emulator with sample data:
   ```bash
   node seed-firestore.js
   ```

## Environment Variables

The server uses environment variables from the `.env` file. The emulator startup scripts will create a default `.env` file if one doesn't exist.

## Documentation

For detailed instructions, please refer to:

- [SERVER_STARTUP_GUIDE.md](./SERVER_STARTUP_GUIDE.md) - Comprehensive guide for starting the server
- [FIREBASE_EMULATOR_GUIDE.md](./FIREBASE_EMULATOR_GUIDE.md) - Detailed guide for using Firebase emulators
- [FIREBASE_EMULATOR_CHANGES.md](./FIREBASE_EMULATOR_CHANGES.md) - Summary of all Firebase emulator improvements
- [SetupGuide.md](../../Docs/SetupGuide.md) - General project setup guide

## Accessing the CMS

Once the server is running:

- CMS UI: http://localhost:3003
- Test Page: http://localhost:3003/react-test.html
- Firebase Test Page: http://localhost:3003/firebase-test.html

## Troubleshooting

If you encounter any issues, please check the [SERVER_STARTUP_GUIDE.md](./SERVER_STARTUP_GUIDE.md) for troubleshooting steps. 