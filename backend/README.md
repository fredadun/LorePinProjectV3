# LorePin Backend

This is the backend for the LorePin platform, which includes Firebase Functions, CMS UI, and CMS UI React.

## Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher
- Firebase CLI 11.x or higher
- Firebase project with Firestore, Authentication, and Functions

## Setup

1. Clone the repository
2. Navigate to the `backend` directory
3. Create a `.env` file based on the `.env.example` file:

```bash
cp .env.example .env
```

4. Update the `.env` file with your Firebase configuration values.
5. Install dependencies for each component:

```bash
# Install dependencies for Firebase Functions
cd functions
npm install

# Install dependencies for CMS UI
cd ../cms-ui
npm install

# Install dependencies for CMS UI React
cd ../cms-ui-react
npm install
```

## Environment Variables

The backend uses a unified set of environment variables for all components. These variables are loaded from a `.env` file in the `backend` directory.

Required environment variables:

- `FIREBASE_API_KEY`: Your Firebase API key
- `FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `FIREBASE_APP_ID`: Your Firebase app ID
- `FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID

Additional environment variables:

- `NODE_ENV`: The environment (development, staging, production)
- `API_URL`: The URL for the CMS API
- `API_PORT`: The port for the CMS API
- `API_REGION`: The region for the CMS API
- `USE_EMULATORS`: Whether to use Firebase emulators (true/false)
- `FIRESTORE_EMULATOR_HOST`: The host for the Firestore emulator
- `FIREBASE_AUTH_EMULATOR_HOST`: The host for the Firebase Auth emulator
- `FUNCTIONS_EMULATOR_HOST`: The host for the Firebase Functions emulator
- `FIREBASE_STORAGE_EMULATOR_HOST`: The host for the Firebase Storage emulator
- `CMS_UI_PORT`: The port for the CMS UI
- `CMS_UI_REACT_PORT`: The port for the CMS UI React
- `FIRESTORE_COLLECTION_PREFIX`: The prefix for Firestore collections
- `ADMIN_EMAIL`: The email for the admin user
- `ADMIN_PASSWORD`: The password for the admin user
- `LOG_LEVEL`: The log level (info, debug, error)
- `ALLOWED_ORIGINS`: The allowed origins for CORS
- `AI_MODERATION_ENABLED`: Whether to enable AI moderation (true/false)
- `AI_MODERATION_API_KEY`: The API key for AI moderation
- `STRIPE_SECRET_KEY`: The Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: The Stripe webhook secret
- `GOOGLE_MAPS_API_KEY`: The Google Maps API key

## Development

### Firebase Functions

To start the Firebase emulators:

```bash
cd functions
npm run serve
```

### CMS UI

To start the CMS UI development server:

```bash
cd cms-ui
npm start
```

### CMS UI React

To start the CMS UI React development server:

```bash
cd cms-ui-react
npm start
```

## Building

### Firebase Functions

To build the Firebase Functions:

```bash
cd functions
npm run build
```

### CMS UI

To build the CMS UI:

```bash
cd cms-ui
npm run build
```

### CMS UI React

To build the CMS UI React:

```bash
cd cms-ui-react
npm run build
```

## Deployment

### Firebase Functions

To deploy the Firebase Functions:

```bash
cd functions
npm run deploy
```

### CMS UI

To deploy the CMS UI:

```bash
cd cms-ui
npm run deploy
```

### CMS UI React

To deploy the CMS UI React:

```bash
cd cms-ui-react
npm run deploy
```

## Firebase Emulators

When running locally, the application will automatically connect to Firebase emulators if they are running:

- Auth emulator: http://localhost:9099
- Firestore emulator: http://localhost:8080
- Functions emulator: http://localhost:5001
- Storage emulator: http://localhost:9199

To start the Firebase emulators:

```bash
cd functions
firebase emulators:start
``` 