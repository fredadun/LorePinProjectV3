@echo off
REM Batch script to start Firebase emulators and the LorePin CMS server

echo Starting LorePin CMS with Firebase Emulators...

REM Kill any existing Node.js processes
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 >nul

REM Set the current directory to the script's location
cd /d "%~dp0"

REM Check if the .env file exists
if not exist .env (
    echo Error: .env file not found in the current directory.
    echo Creating a default .env file...
    
    (
        echo # Firebase Configuration
        echo FIREBASE_API_KEY=AIzaSyB1eLfwECUvufRcFFwBDaQY6tHHdwkA3Mg
        echo FIREBASE_AUTH_DOMAIN=lorebacking-test.firebaseapp.com
        echo FIREBASE_PROJECT_ID=lorebacking-test
        echo FIREBASE_STORAGE_BUCKET=lorebacking-test.appspot.com
        echo FIREBASE_MESSAGING_SENDER_ID=532363101127
        echo FIREBASE_APP_ID=1:532363101127:web:645922acc5144943d54fe2
        echo FIREBASE_MEASUREMENT_ID=G-MSFZ41D7GM
        echo.
        echo # React App Environment Variables (for backward compatibility^)
        echo REACT_APP_FIREBASE_API_KEY=AIzaSyB1eLfwECUvufRcFFwBDaQY6tHHdwkA3Mg
        echo REACT_APP_FIREBASE_AUTH_DOMAIN=lorebacking-test.firebaseapp.com
        echo REACT_APP_FIREBASE_PROJECT_ID=lorebacking-test
        echo REACT_APP_FIREBASE_STORAGE_BUCKET=lorebacking-test.appspot.com
        echo REACT_APP_FIREBASE_MESSAGING_SENDER_ID=532363101127
        echo REACT_APP_FIREBASE_APP_ID=1:532363101127:web:645922acc5144943d54fe2
        echo REACT_APP_FIREBASE_MEASUREMENT_ID=G-MSFZ41D7GM
        echo.
        echo # Firebase Emulators
        echo FIREBASE_USE_EMULATORS=true
        echo FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
        echo FIREBASE_FIRESTORE_EMULATOR_HOST=localhost:8080
        echo FIREBASE_FUNCTIONS_EMULATOR_HOST=localhost:5001
        echo FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
        echo.
        echo # React App Emulator Configuration (for backward compatibility^)
        echo REACT_APP_USE_EMULATORS=true
        echo REACT_APP_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
        echo REACT_APP_FIRESTORE_EMULATOR_HOST=localhost:8080
        echo REACT_APP_FUNCTIONS_EMULATOR_HOST=localhost:5001
        echo REACT_APP_FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
        echo.
        echo # Server Configuration
        echo PORT=3003
        echo.
        echo # Environment
        echo NODE_ENV=development
        echo.
        echo # API Configuration
        echo REACT_APP_API_URL=http://localhost:5001/lorebacking-test/europe-west2/cms
    ) > .env
    
    echo Default .env file created.
)

REM Check if firebase-tools is installed
where firebase >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Firebase CLI not found. Installing firebase-tools globally...
    call npm install -g firebase-tools
    
    if %ERRORLEVEL% neq 0 (
        echo Error installing firebase-tools. Please install it manually with 'npm install -g firebase-tools'.
        exit /b 1
    )
)

REM Start Firebase emulators in a new command window
echo Starting Firebase emulators...
start cmd /k "cd .. && firebase emulators:start --only auth,firestore,functions,storage"

REM Wait for emulators to start
echo Waiting for emulators to start (10 seconds^)...
timeout /t 10 >nul

REM Create test user for the emulator
echo Creating test user for Firebase Auth emulator...
call npm list firebase >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Firebase module not found. Installing...
    call npm install firebase
)

REM Run the script to create a test user
node create-test-user.js

REM Ask if the user wants to seed the database
set /p SEED_DB="Do you want to seed the Firestore database with sample data? (y/n): "
if /i "%SEED_DB%"=="y" (
    echo Seeding Firestore database...
    node seed-firestore.js
    if %ERRORLEVEL% neq 0 (
        echo Error seeding database. Continuing without seeding...
    )
)

REM Start the server
echo Starting server from: %~dp0
echo Running: node server.js

REM Run the server
node server.js

REM This line will only execute if the server stops
echo Server has stopped. 