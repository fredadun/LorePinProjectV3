# LorePin

LorePin is a location-based challenge platform that connects users with sponsors through engaging challenges and rewards.

## Project Structure

- `/frontend` - Next.js web application
- `/backend` - Firebase Cloud Functions
- `/Docs` - Project documentation

## Deployment Setup

### Prerequisites

1. Firebase project with Firestore, Storage, and Hosting enabled
2. GitHub repository with Actions enabled
3. Node.js 18+ installed

### GitHub Secrets Setup

For the GitHub Actions workflows to deploy successfully, you need to set up the following secrets in your repository:

1. `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON (base64 encoded)
2. `FIREBASE_API_KEY` - Firebase API key
3. `FIREBASE_AUTH_DOMAIN` - Firebase auth domain
4. `FIREBASE_PROJECT_ID` - Firebase project ID
5. `FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
6. `FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
7. `FIREBASE_APP_ID` - Firebase app ID
8. `FIREBASE_MEASUREMENT_ID` - Firebase measurement ID (optional)
9. `GOOGLE_MAPS_API_KEY` - Google Maps API key (if using location features)

### Setting up Firebase Service Account

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Base64 encode the file content:
   ```
   cat path/to/service-account.json | base64
   ```
5. Add the encoded string as the `FIREBASE_SERVICE_ACCOUNT` secret in GitHub

### Manual Deployment

If you need to deploy manually:

1. Install Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Build the web app:
   ```
   cd frontend
   npm install
   npm run build
   ```

4. Deploy to Firebase:
   ```
   firebase deploy
   ```

## Development

### Web Application

```
cd frontend
npm install
npm run dev
```

### Cloud Functions

```
cd backend/functions
npm install
npm run serve
```

### Firebase Emulators

```
firebase emulators:start
```

## Troubleshooting Deployment Issues

If you encounter deployment failures:

1. Check GitHub Actions logs for specific error messages
2. Verify all required secrets are set correctly
3. Ensure your Firebase project has the necessary services enabled
4. Check that your service account has the required permissions
5. Verify your project structure matches the paths in firebase.json