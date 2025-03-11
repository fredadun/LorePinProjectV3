# Firebase Emulator Guide for LorePin CMS

This guide provides detailed instructions for setting up and using Firebase emulators with the LorePin CMS application.

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Configuration Files](#configuration-files)
5. [Starting the Emulators](#starting-the-emulators)
6. [Working with Emulated Services](#working-with-emulated-services)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Usage](#advanced-usage)

## Introduction

Firebase emulators allow you to run a local version of Firebase services (Authentication, Firestore, Functions, Storage) without connecting to the production Firebase servers. This is ideal for development and testing.

Benefits of using Firebase emulators:
- Develop offline
- Test without affecting production data
- Reset data easily
- Faster development cycles
- No costs or quota limits

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (v6 or later)
- Firebase CLI (`npm install -g firebase-tools`)
- Java Runtime Environment (JRE) version 8 or higher (required for Firebase emulators)

## Initial Setup

1. **Install Firebase CLI globally** (if not already installed):
   ```
   npm install -g firebase-tools
   ```

2. **Log in to Firebase** (only needed once):
   ```
   firebase login
   ```

3. **Initialize Firebase in your project directory**:
   ```
   firebase init
   ```
   
   Select the following services:
   - Firestore
   - Functions
   - Storage
   - Emulators

   When prompted for emulators, select:
   - Auth Emulator
   - Firestore Emulator
   - Functions Emulator
   - Storage Emulator

4. **Verify your setup**:
   ```
   npm run verify:emulators
   ```

## Configuration Files

The following files are essential for Firebase emulator configuration:

- **firebase.json**: Main configuration file for Firebase services and emulators
- **.firebaserc**: Project configuration
- **firestore.rules**: Security rules for Firestore
- **firestore.indexes.json**: Index definitions for Firestore
- **storage.rules**: Security rules for Storage
- **.env**: Environment variables for connecting to emulators

### Sample firebase.json

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "source": "functions"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "functions": {
      "port": 5001
    },
    "firestore": {
      "port": 8080
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

### Sample .env Configuration

```
# Firebase Configuration
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id

# Emulator Configuration
FIREBASE_USE_EMULATORS=true
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIREBASE_FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_FUNCTIONS_EMULATOR_HOST=localhost:5001
FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
```

## Starting the Emulators

### Using Provided Scripts

We provide several scripts to make working with emulators easier:

1. **Start emulators and server together** (recommended):
   ```
   # PowerShell
   ./start-with-emulators.ps1
   
   # Command Prompt
   start-with-emulators.bat
   ```

2. **Start server only** (if emulators are already running):
   ```
   # PowerShell
   ./powershell-start.ps1
   
   # Command Prompt
   start-server.bat
   ```

### Manual Start

1. **Start Firebase emulators**:
   ```
   firebase emulators:start
   ```

2. **Start the server in a separate terminal**:
   ```
   node server.js
   ```

## Working with Emulated Services

### Authentication

The Auth emulator runs on port 9099 by default. You can create test users with:

```
npm run create:test-user
```

This script creates a test user with the following credentials:
- Email: test@example.com
- Password: password123

### Firestore

The Firestore emulator runs on port 8080 by default. You can seed it with test data:

```
npm run seed:firestore
```

### Storage

The Storage emulator runs on port 9199 by default. Files uploaded to the emulator are stored locally and do not count against your Firebase Storage quota.

### Functions

The Functions emulator runs on port 5001 by default. It automatically hot-reloads when you make changes to your functions code.

## Troubleshooting

### Common Issues

1. **Port conflicts**:
   If you see errors about ports being in use, you can change the ports in `firebase.json` and update your `.env` file accordingly.

2. **Java not found**:
   Firebase emulators require Java. Install JRE 8 or higher and ensure it's in your PATH.

3. **Emulator data not persisting**:
   By default, emulator data is cleared when the emulators are stopped. To persist data, use:
   ```
   firebase emulators:start --import=./emulator-data --export-on-exit=./emulator-data
   ```

4. **Connection issues**:
   Ensure your application is correctly configured to use the emulators. Check the `.env` file and verify that `FIREBASE_USE_EMULATORS` is set to `true`.

### Verification and Sync

If you're having issues with your emulator configuration, use our verification and sync tools:

```
# Verify emulator setup
npm run verify:emulators

# Sync emulator configuration between environments
npm run sync:emulators
```

## Advanced Usage

### Custom Emulator Data

You can import and export emulator data to maintain a consistent test environment:

```
# Export current data
firebase emulators:export ./emulator-data

# Import data
firebase emulators:start --import=./emulator-data
```

### CI/CD Integration

For continuous integration environments, you can start emulators programmatically:

```javascript
const { spawn } = require('child_process');
const emulators = spawn('firebase', ['emulators:start', '--no-ui']);

// Do something with the emulators

// When done
emulators.kill();
```

### Testing with Emulators

In your test files, ensure you connect to the emulators:

```javascript
// Initialize Firebase with emulator connections
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

const db = getFirestore();
const auth = getAuth();
const functions = getFunctions();
const storage = getStorage();

connectFirestoreEmulator(db, 'localhost', 8080);
connectAuthEmulator(auth, 'http://localhost:9099');
connectFunctionsEmulator(functions, 'localhost', 5001);
connectStorageEmulator(storage, 'localhost', 9199);
```

---

For more information, refer to the [official Firebase Emulator documentation](https://firebase.google.com/docs/emulator-suite). 