# Environment Variables in LorePin

This document outlines the standardized approach to environment variables in the LorePin project.

## Overview

LorePin uses a unified environment variable system to ensure consistency across all components of the application. This approach centralizes the management of sensitive information and configuration values, making it easier to maintain and deploy the application.

## Directory Structure

```
LorePinProjectV3/
├── backend/
│   ├── .env                 # Actual environment variables (not committed to Git)
│   ├── .env.example         # Example environment variables (committed to Git)
│   ├── cms-ui/              # Original CMS UI
│   ├── cms-ui-react/        # React-based CMS UI
│   └── functions/           # Firebase Functions
├── frontend/                # Web frontend
└── mobile/                  # Mobile app
```

## Backend Environment Variables

The backend uses a unified set of environment variables for all components (Functions, CMS UI, CMS UI React). These variables are loaded from a single `.env` file in the `backend` directory.

### Setup

1. Create a `.env` file in the `backend` directory based on the `.env.example` file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your actual configuration values.

### Loading Environment Variables

Each component loads environment variables from the parent `.env` file:

- **Firebase Functions**: Uses `dotenv` to load variables from the parent `.env` file in `src/config/environment.ts`.
- **CMS UI**: Uses a build script that replaces placeholders with values from the parent `.env` file.
- **CMS UI React**: Uses Create React App's built-in support for environment variables with the `REACT_APP_` prefix.

### Required Environment Variables

- `FIREBASE_API_KEY`: Your Firebase API key
- `FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `FIREBASE_APP_ID`: Your Firebase app ID
- `FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID

### Additional Environment Variables

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

## Frontend Environment Variables

The frontend uses Create React App's built-in support for environment variables with the `REACT_APP_` prefix.

### Setup

1. Create a `.env` file in the `frontend` directory based on the `.env.example` file.
2. Update the `.env` file with your actual configuration values.

### Required Environment Variables

- `REACT_APP_FIREBASE_API_KEY`: Your Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `REACT_APP_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID`: Your Firebase app ID
- `REACT_APP_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID

## Mobile Environment Variables

The mobile app uses Flutter's built-in support for environment variables.

### Setup

1. Create a `.env` file in the `mobile` directory based on the `.env.example` file.
2. Update the `.env` file with your actual configuration values.

### Required Environment Variables

- `FIREBASE_API_KEY`: Your Firebase API key
- `FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `FIREBASE_APP_ID`: Your Firebase app ID
- `FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID

## Environment-Specific Configuration

LorePin supports different environments:

- **Development**: The default environment for local development
- **Staging**: A pre-production environment for testing
- **Production**: The live production environment

Each environment can have its own configuration values. The `NODE_ENV` environment variable determines which environment is used.

## Security Considerations

- **Never commit `.env` files to version control**. They contain sensitive information.
- **Always use `.env.example` files** as templates with placeholder values.
- **Use different values for different environments** to isolate development, staging, and production.
- **Rotate API keys and secrets regularly** to minimize the impact of potential leaks.
- **Limit access to production environment variables** to authorized personnel only.

## Best Practices

1. **Use environment variables for all sensitive information**, including API keys, secrets, and credentials.
2. **Use environment variables for configuration values** that change between environments.
3. **Document all environment variables** in the `.env.example` file.
4. **Validate environment variables** at application startup to ensure all required variables are present.
5. **Use a consistent naming convention** for environment variables across all components.
6. **Keep environment variables organized** by grouping related variables together.
7. **Minimize the number of environment variables** by using sensible defaults where appropriate. 