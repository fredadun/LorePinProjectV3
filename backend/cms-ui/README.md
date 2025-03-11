# LorePin CMS UI

A simple UI for the LorePin Content Management System.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the `.env.example` file:
   ```
   cp .env.example .env
   ```
4. Update the `.env` file with your Firebase configuration values.

## Environment Variables

The application uses environment variables to configure Firebase. These variables are loaded from a `.env` file during the build process.

Required environment variables:

- `FIREBASE_API_KEY`: Your Firebase API key
- `FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `FIREBASE_APP_ID`: Your Firebase app ID
- `FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID

## Development

To start the development server:

```
npm start
```

This will start a local server at http://localhost:8000.

## Building

To build the application for different environments:

- Development:
  ```
  npm run build
  ```

- Staging:
  ```
  npm run build:staging
  ```

- Production:
  ```
  npm run build:production
  ```

The build output will be in the `dist` directory.

## Deployment

To deploy the application to Firebase Hosting:

- Development:
  ```
  npm run deploy
  ```

- Staging:
  ```
  npm run deploy:staging
  ```

- Production:
  ```
  npm run deploy:production
  ```

## Firebase Emulators

When running locally, the application will automatically connect to Firebase emulators if they are running:

- Auth emulator: http://localhost:9099
- Firestore emulator: http://localhost:8080
- Functions emulator: http://localhost:5001

To start the Firebase emulators:

```
firebase emulators:start
``` 