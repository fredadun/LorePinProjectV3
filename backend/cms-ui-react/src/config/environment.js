// Load environment variables from the parent .env file
// Note: React applications can only access environment variables prefixed with REACT_APP_
// The build process will handle this automatically

// Environment type
export const getEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

// Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// API configuration
export const apiConfig = {
  url: process.env.REACT_APP_API_URL || 'http://localhost:5001/lorebacking-test/europe-west2/cms'
};

// Emulator configuration
export const emulatorConfig = {
  useEmulators: process.env.REACT_APP_USE_EMULATORS === 'true',
  firestoreHost: 'localhost:8080',
  authHost: 'localhost:9099',
  functionsHost: 'localhost:5001',
  storageHost: 'localhost:9199'
};

// Determine if we should use emulators
export const shouldUseEmulators = () => {
  return emulatorConfig.useEmulators && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1');
}; 