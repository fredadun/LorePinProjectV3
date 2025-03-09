# LorePin Project Setup Guide

This guide provides step-by-step instructions for setting up the LorePin project development environment.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18.x or later)
- **npm** (v9.x or later)
- **Git** (v2.x or later)
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Visual Studio Code** (recommended) or your preferred IDE
- **Flutter SDK** (v3.19.0 or later) for mobile development
- **Android Studio** (latest version) for Android development
- **Xcode** (latest version, Mac only) for iOS development

## 1. Project Structure Setup

First, let's create the project structure:

```bash
# Create the project root directory
mkdir lorepin
cd lorepin

# Initialize Git repository
git init

# Create frontend, backend, and mobile directories
mkdir -p frontend/public frontend/src
mkdir -p backend/functions
mkdir -p mobile/lib
```

## 2. Frontend Setup (Next.js)

### 2.1 Initialize Next.js Project

```bash
cd frontend

# Create Next.js app with TypeScript and Tailwind CSS
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install additional dependencies
npm install framer-motion @react-three/fiber @react-three/drei three firebase react-query zustand
npm install -D @types/three
```

### 2.2 Configure Next.js

Create or update the following configuration files:

#### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config) => {
    // Add support for importing .glb and other 3D model files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
      },
    });
    return config;
  },
};

module.exports = nextConfig;
```

#### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#8B5CF6',
          DEFAULT: '#6200EA',
          dark: '#4A00E0',
        },
        secondary: {
          light: '#FF7EB3',
          DEFAULT: '#FF49DB',
          dark: '#FF16D1',
        },
        accent: {
          midnightVelvet: '#1A1A2E',
          deepSpace: '#16213E',
        },
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
```

### 2.3 Set Up Firebase Client

Create a Firebase configuration file at `src/lib/firebase.ts`:

```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Enable offline persistence for Firestore (only in client-side environments)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    console.error('Firestore persistence error:', err);
  });
}

export { app, auth, db, storage, functions };
```

### 2.4 Create Environment Variables

Create a `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 3. Backend Setup (Firebase)

### 3.1 Initialize Firebase Project

```bash
cd ../backend

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init
```

During the initialization:
- Select Firestore, Functions, Storage, and Hosting
- Choose TypeScript for Functions
- Enable ESLint for Functions
- Choose to install dependencies with npm

### 3.2 Configure Firebase Functions

Update the `backend/functions/package.json` file:

```json
{
  "name": "functions",
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "lib/index.js",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "firebase-admin": "^11.8.0",
    "firebase-functions": "^4.3.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@typescript-eslint/eslint-plugin": "^5.12.0",
    "@typescript-eslint/parser": "^5.12.0",
    "eslint": "^8.9.0",
    "eslint-config-google": "^0.14.0",
    "eslint-plugin-import": "^2.25.4",
    "firebase-functions-test": "^3.1.0",
    "typescript": "^4.9.0"
  },
  "private": true
}
```

### 3.3 Set Up Firestore Security Rules

Update `backend/firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == userId;
      
      // User's private data
      match /private/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Challenges
    match /challenges/{challengeId} {
      allow read;
      allow create: if request.auth != null && 
                     (request.resource.data.sponsorId == request.auth.uid || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      allow update, delete: if request.auth != null && 
                             (resource.data.sponsorId == request.auth.uid || 
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
    
    // Submissions
    match /submissions/{submissionId} {
      allow read;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                             (resource.data.userId == request.auth.uid || 
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
    
    // LoreCoin transactions
    match /lorecoins/{transactionId} {
      allow read: if request.auth != null && 
                    (resource.data.userId == request.auth.uid || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      allow create, update, delete: if request.auth != null && 
                                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Sponsors
    match /sponsors/{sponsorId} {
      allow read;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                             (resource.data.userId == request.auth.uid || 
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
  }
}
```

### 3.4 Set Up Storage Security Rules

Update `backend/storage.rules`:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /submissions/{userId}/{allPaths=**} {
      allow read;
      allow write: if request.auth != null && request.auth.uid == userId &&
                     request.resource.size < 10 * 1024 * 1024 && // 10MB
                     (request.resource.contentType.matches('image/.*') ||
                      request.resource.contentType.matches('video/.*'));
    }
    
    match /sponsors/{sponsorId}/{allPaths=**} {
      allow read;
      allow write: if request.auth != null && 
                     (request.auth.uid == sponsorId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true) &&
                     request.resource.size < 5 * 1024 * 1024 && // 5MB
                     request.resource.contentType.matches('image/.*');
    }
    
    match /users/{userId}/{allPaths=**} {
      allow read;
      allow write: if request.auth != null && request.auth.uid == userId &&
                     request.resource.size < 2 * 1024 * 1024 && // 2MB
                     request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 4. Setting Up Development Environment

### 4.1 Create Root Package.json

Create a `package.json` file in the project root:

```json
{
  "name": "lorepin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "frontend": "cd frontend && npm run dev",
    "backend": "cd backend && firebase emulators:start",
    "dev": "concurrently \"npm run frontend\" \"npm run backend\"",
    "install:all": "npm install && cd frontend && npm install && cd ../backend/functions && npm install",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend/functions && npm run build",
    "build": "npm run build:frontend && npm run build:backend",
    "deploy:frontend": "cd frontend && npm run build && cd ../backend && firebase deploy --only hosting",
    "deploy:backend": "cd backend && firebase deploy --only functions,firestore,storage",
    "deploy": "npm run build && cd backend && firebase deploy"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

### 4.2 Set Up Git Configuration

Create a `.gitignore` file in the project root:

```
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Next.js
.next/
out/
build
dist

# Production
build
dist

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log
ui-debug.log

# IDE
.idea
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json

# Misc
.DS_Store
*.pem
```

### 4.3 Set Up GitHub Actions for CI/CD

Create a GitHub Actions workflow file at `.github/workflows/firebase-hosting-merge.yml`:

```yaml
name: Deploy to Firebase Hosting on merge
'on':
  push:
    branches:
      - main
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - name: Install dependencies
        run: npm run install:all
      - name: Build
        run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-firebase-project-id
```

## 5. Initial Project Setup

### 5.1 Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend/functions
npm install

# Return to project root
cd ../../
```

### 5.2 Start Development Environment

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- Next.js development server at http://localhost:3000
- Firebase Emulators at http://localhost:4000

## 6. Project Structure Overview

After setup, your project structure should look like this:

```
lorepin/
├── frontend/                # Next.js frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and libraries
│   │   ├── store/           # State management
│   │   └── types/           # TypeScript type definitions
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── next.config.js       # Next.js configuration
│   └── package.json         # Frontend dependencies
│
├── backend/                 # Firebase backend
│   ├── functions/           # Cloud Functions
│   │   ├── src/             # Functions source code
│   │   ├── package.json     # Backend dependencies
│   │   └── tsconfig.json    # TypeScript configuration
│   ├── firestore.rules      # Firestore security rules
│   ├── storage.rules        # Storage security rules
│   └── firebase.json        # Firebase configuration
│
├── .github/                 # GitHub configuration
│   └── workflows/           # GitHub Actions workflows
│
├── Doc/                     # Project documentation
│   ├── TechnicalArchitecture.md  # Technical architecture document
│   └── ProjectSetup.md      # This setup guide
│
├── .gitignore               # Git ignore file
├── package.json             # Root package.json for scripts
└── README.md                # Project documentation
```

## 7. Next Steps

After completing the setup, you can:

1. **Create Basic UI Components**: Start building the common UI components like Header, Footer, Button, etc.
2. **Set Up Authentication**: Implement Firebase Authentication and user profiles
3. **Implement Challenge System**: Create the challenge creation and submission flows
4. **Add 3D Visualization**: Implement the map view with Three.js and React Three Fiber
5. **Develop LoreCoins System**: Implement the reward system with transactions

## 8. Troubleshooting

### Common Issues

#### Firebase Emulator Connection Issues
- Ensure ports 4000, 8080, 9000, and 9099 are not in use
- Try running `firebase emulators:start --only functions,firestore,auth,storage` directly

#### Next.js Build Errors
- Check for TypeScript errors with `cd frontend && npm run lint`
- Ensure all required environment variables are set

#### Dependency Conflicts
- If you encounter dependency conflicts, try using `npm install --legacy-peer-deps`

## 9. Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Three.js Documentation](https://threejs.org/docs/)

## 10. Mobile App Setup (Flutter)

### 10.1 Initialize Flutter Project

```bash
# Navigate to the mobile directory
cd mobile

# Create a new Flutter project
flutter create --org com.lorepin --platforms=android,ios .

# Install dependencies
flutter pub add firebase_core firebase_auth cloud_firestore firebase_storage firebase_messaging
flutter pub add flutter_riverpod google_maps_flutter image_picker path_provider shared_preferences
flutter pub add go_router cached_network_image intl url_launcher package_info_plus
flutter pub add flutter_dotenv flutter_secure_storage
flutter pub add --dev flutter_launcher_icons flutter_native_splash
```

### 10.2 Configure Firebase for Flutter

Create a Firebase configuration file at `mobile/lib/core/config/firebase_options.dart`:

```dart
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart' show defaultTargetPlatform, TargetPlatform;

// Replace with your Firebase configuration values
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'YOUR_ANDROID_API_KEY',
    appId: 'YOUR_ANDROID_APP_ID',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'YOUR_IOS_API_KEY',
    appId: 'YOUR_IOS_APP_ID',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    iosBundleId: 'com.lorepin.app',
  );
}
```

### 10.3 Set Up Environment Variables

Create a `.env` file in the mobile directory:

```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
```

### 10.4 Configure App Icons and Splash Screen

Create a `flutter_launcher_icons.yaml` file in the mobile directory:

```yaml
flutter_launcher_icons:
  android: "launcher_icon"
  ios: true
  image_path: "assets/images/app_icon.png"
  min_sdk_android: 21
  adaptive_icon_background: "#FFFFFF"
  adaptive_icon_foreground: "assets/images/app_icon_foreground.png"
```

Create a `flutter_native_splash.yaml` file in the mobile directory:

```yaml
flutter_native_splash:
  color: "#6200EA"
  image: assets/images/splash_logo.png
  color_dark: "#1A1A2E"
  image_dark: assets/images/splash_logo.png
  android_12:
    image: assets/images/splash_logo.png
    icon_background_color: "#6200EA"
    image_dark: assets/images/splash_logo.png
    icon_background_color_dark: "#1A1A2E"
  web: false
```

Run the following commands to generate icons and splash screen:

```bash
flutter pub run flutter_launcher_icons
flutter pub run flutter_native_splash:create
```

### 10.5 Project Structure

Organize the mobile app with a clean architecture approach:

```
mobile/
├── android/                 # Android-specific files
├── ios/                     # iOS-specific files
├── assets/                  # Static assets (images, fonts, etc.)
│   ├── images/              # Image assets
│   └── fonts/               # Font assets
├── lib/
│   ├── core/                # Core functionality
│   │   ├── config/          # Configuration files
│   │   │   ├── firebase_options.dart  # Firebase configuration
│   │   │   ├── app_config.dart        # App configuration
│   │   │   └── theme.dart             # App theme
│   │   ├── constants/       # Constants and enums
│   │   ├── errors/          # Error handling
│   │   ├── utils/           # Utility functions
│   │   └── extensions/      # Extension methods
│   ├── data/                # Data layer
│   │   ├── datasources/     # Data sources (remote, local)
│   │   │   ├── remote/      # Remote data sources (API)
│   │   │   └── local/       # Local data sources (SharedPreferences, SQLite)
│   │   ├── models/          # Data models
│   │   │   ├── user_model.dart
│   │   │   ├── challenge_model.dart
│   │   │   ├── submission_model.dart
│   │   │   └── lorecoin_model.dart
│   │   └── repositories/    # Repository implementations
│   ├── domain/              # Domain layer
│   │   ├── entities/        # Business entities
│   │   ├── repositories/    # Repository interfaces
│   │   └── usecases/        # Business logic
│   ├── presentation/        # Presentation layer
│   │   ├── providers/       # State providers (Riverpod)
│   │   ├── screens/         # App screens
│   │   │   ├── auth/        # Authentication screens
│   │   │   ├── challenges/  # Challenge-related screens
│   │   │   ├── explore/     # Explore/map screens
│   │   │   ├── profile/     # User profile screens
│   │   │   └── lorecoins/   # LoreCoins screens
│   │   ├── widgets/         # Reusable widgets
│   │   │   ├── common/      # Common widgets
│   │   │   ├── challenges/  # Challenge-related widgets
│   │   │   └── map/         # Map-related widgets
│   │   └── routes/          # App routes
│   └── main.dart            # Entry point
├── test/                    # Unit and widget tests
├── integration_test/        # Integration tests
├── pubspec.yaml             # Dependencies
└── README.md                # Documentation
```

### 10.6 Initialize Main App

Update the `lib/main.dart` file:

```dart
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lorepin/core/config/firebase_options.dart';
import 'package:lorepin/presentation/routes/app_router.dart';
import 'package:lorepin/core/config/theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Load environment variables
  await dotenv.load();
  
  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  
  runApp(
    const ProviderScope(
      child: LorePinApp(),
    ),
  );
}

class LorePinApp extends ConsumerWidget {
  const LorePinApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    
    return MaterialApp.router(
      title: 'LorePin',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerDelegate: router.routerDelegate,
      routeInformationParser: router.routeInformationParser,
      routeInformationProvider: router.routeInformationProvider,
      debugShowCheckedModeBanner: false,
    );
  }
}
```

### 10.7 Set Up App Router

Create a router file at `lib/presentation/routes/app_router.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lorepin/presentation/screens/auth/login_screen.dart';
import 'package:lorepin/presentation/screens/auth/register_screen.dart';
import 'package:lorepin/presentation/screens/challenges/challenge_detail_screen.dart';
import 'package:lorepin/presentation/screens/challenges/challenges_screen.dart';
import 'package:lorepin/presentation/screens/challenges/create_challenge_screen.dart';
import 'package:lorepin/presentation/screens/challenges/submit_challenge_screen.dart';
import 'package:lorepin/presentation/screens/explore/explore_screen.dart';
import 'package:lorepin/presentation/screens/home/home_screen.dart';
import 'package:lorepin/presentation/screens/lorecoins/lorecoins_screen.dart';
import 'package:lorepin/presentation/screens/profile/profile_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/explore',
        builder: (context, state) => const ExploreScreen(),
      ),
      GoRoute(
        path: '/challenges',
        builder: (context, state) => const ChallengesScreen(),
      ),
      GoRoute(
        path: '/challenges/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return ChallengeDetailScreen(challengeId: id);
        },
      ),
      GoRoute(
        path: '/challenges/create',
        builder: (context, state) => const CreateChallengeScreen(),
      ),
      GoRoute(
        path: '/challenges/:id/submit',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return SubmitChallengeScreen(challengeId: id);
        },
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: '/profile/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return ProfileScreen(userId: id);
        },
      ),
      GoRoute(
        path: '/lorecoins',
        builder: (context, state) => const LoreCoinsScreen(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Text('Page not found: ${state.uri}'),
      ),
    ),
  );
});
```

### 10.8 Set Up Theme

Create a theme file at `lib/core/config/theme.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Colors
  static const primaryColor = Color(0xFF6200EA);
  static const secondaryColor = Color(0xFFFF49DB);
  static const accentColor = Color(0xFF7CFC00);
  static const backgroundDark = Color(0xFF1A1A2E);
  static const backgroundLight = Color(0xFFF5F5F5);
  
  // Light Theme
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.light(
        primary: primaryColor,
        secondary: secondaryColor,
        tertiary: accentColor,
        background: backgroundLight,
      ),
      textTheme: GoogleFonts.spaceGroteskTextTheme(
        ThemeData.light().textTheme,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          foregroundColor: Colors.white,
          backgroundColor: primaryColor,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      cardTheme: CardTheme(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
  
  // Dark Theme
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.dark(
        primary: primaryColor,
        secondary: secondaryColor,
        tertiary: accentColor,
        background: backgroundDark,
      ),
      textTheme: GoogleFonts.spaceGroteskTextTheme(
        ThemeData.dark().textTheme,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: backgroundDark,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          foregroundColor: Colors.white,
          backgroundColor: primaryColor,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      cardTheme: CardTheme(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}
```

### 10.9 Set Up Firebase Services

Create a Firebase service file at `lib/data/datasources/remote/firebase_service.dart`:

```dart
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';

class FirebaseService {
  // Firebase instances
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseStorage _storage = FirebaseStorage.instance;
  
  // Getters
  FirebaseAuth get auth => _auth;
  FirebaseFirestore get firestore => _firestore;
  FirebaseStorage get storage => _storage;
  
  // Current user
  User? get currentUser => _auth.currentUser;
  
  // Collections
  CollectionReference get usersCollection => _firestore.collection('users');
  CollectionReference get challengesCollection => _firestore.collection('challenges');
  CollectionReference get submissionsCollection => _firestore.collection('submissions');
  CollectionReference get lorecoinsCollection => _firestore.collection('lorecoin_transactions');
  
  // Storage references
  Reference get challengeImagesRef => _storage.ref().child('challenges');
  Reference get submissionMediaRef => _storage.ref().child('submissions');
  Reference get userImagesRef => _storage.ref().child('users');
}
```

### 10.10 Set Up Data Models

Create model files for the main entities:

`lib/data/models/user_model.dart`:
```dart
import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  final String id;
  final String email;
  final String displayName;
  final String? photoURL;
  final List<String> skills;
  final List<String> followers;
  final List<String> following;
  final int loreCoins;
  final DateTime createdAt;
  final DateTime updatedAt;
  
  UserModel({
    required this.id,
    required this.email,
    required this.displayName,
    this.photoURL,
    required this.skills,
    required this.followers,
    required this.following,
    required this.loreCoins,
    required this.createdAt,
    required this.updatedAt,
  });
  
  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return UserModel(
      id: doc.id,
      email: data['email'] ?? '',
      displayName: data['displayName'] ?? '',
      photoURL: data['photoURL'],
      skills: List<String>.from(data['skills'] ?? []),
      followers: List<String>.from(data['followers'] ?? []),
      following: List<String>.from(data['following'] ?? []),
      loreCoins: data['loreCoins'] ?? 0,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      updatedAt: (data['updatedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }
  
  Map<String, dynamic> toMap() {
    return {
      'email': email,
      'displayName': displayName,
      'photoURL': photoURL,
      'skills': skills,
      'followers': followers,
      'following': following,
      'loreCoins': loreCoins,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
    };
  }
}
```

### 10.11 Start Development

```bash
# Run the app in development mode
flutter run
```

### 10.12 Building for Production

```bash
# Build for Android
flutter build appbundle

# Build for iOS (Mac only)
flutter build ios
```

## 11. Integrating Web and Mobile

### 11.1 Shared Firebase Configuration

Both the web and mobile applications will use the same Firebase project, ensuring data consistency across platforms.

### 11.2 API Consistency

Ensure that both platforms use consistent API patterns when interacting with Firebase services.

### 11.3 Cross-Platform Testing

Test the application on both web and mobile platforms to ensure a consistent user experience.

## 12. Next Steps

After completing the setup for both web and mobile platforms, you can:

1. **Create Basic UI Components**: Start building the common UI components for both platforms
2. **Set Up Authentication**: Implement Firebase Authentication and user profiles
3. **Implement Challenge System**: Create the challenge creation and submission flows
4. **Add Map Visualization**: Implement the map view with Google Maps
5. **Develop LoreCoins System**: Implement the reward system with transactions

## 13. Troubleshooting

### Common Issues

#### Firebase Emulator Connection Issues
- Ensure ports 4000, 8080, 9000, and 9099 are not in use
- Try running `firebase emulators:start --only functions,firestore,auth,storage` directly

#### Next.js Build Errors
- Check for TypeScript errors with `cd frontend && npm run lint`
- Ensure all required environment variables are set

#### Dependency Conflicts
- If you encounter dependency conflicts, try using `npm install --legacy-peer-deps`

## 14. Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Three.js Documentation](https://threejs.org/docs/) 