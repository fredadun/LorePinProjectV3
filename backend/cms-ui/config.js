// Load environment variables from the parent .env file
// This script will be processed by the build.js script to replace placeholders with actual values

// Get the environment
const getEnvironment = () => {
  return window.ENV || 'development';
};

// Load environment-specific configuration
const loadEnvironmentConfig = () => {
  const env = getEnvironment();
  
  // Default configuration with placeholders
  // These will be replaced during the build process
  const configs = {
    development: {
      apiKey: "FIREBASE_API_KEY_PLACEHOLDER",
      authDomain: "FIREBASE_AUTH_DOMAIN_PLACEHOLDER",
      projectId: "FIREBASE_PROJECT_ID_PLACEHOLDER",
      storageBucket: "FIREBASE_STORAGE_BUCKET_PLACEHOLDER",
      messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER",
      appId: "FIREBASE_APP_ID_PLACEHOLDER",
      measurementId: "FIREBASE_MEASUREMENT_ID_PLACEHOLDER"
    },
    staging: {
      apiKey: "FIREBASE_API_KEY_PLACEHOLDER",
      authDomain: "lorepin-staging.firebaseapp.com",
      projectId: "lorepin-staging",
      storageBucket: "lorepin-staging.firebasestorage.app",
      messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER",
      appId: "FIREBASE_APP_ID_PLACEHOLDER",
      measurementId: "FIREBASE_MEASUREMENT_ID_PLACEHOLDER"
    },
    production: {
      apiKey: "FIREBASE_API_KEY_PLACEHOLDER",
      authDomain: "lorepin-prod.firebaseapp.com",
      projectId: "lorepin-prod",
      storageBucket: "lorepin-prod.firebasestorage.app",
      messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER",
      appId: "FIREBASE_APP_ID_PLACEHOLDER",
      measurementId: "FIREBASE_MEASUREMENT_ID_PLACEHOLDER"
    }
  };
  
  return configs[env] || configs.development;
};

// Export the configuration
const firebaseConfig = loadEnvironmentConfig();

// API URL configuration
const getApiUrl = () => {
  const env = getEnvironment();
  const projectId = firebaseConfig.projectId;
  
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return `http://localhost:5001/${projectId}/europe-west2/cms`;
  }
  
  return `https://europe-west2-${projectId}.cloudfunctions.net/cms`;
};

// Emulator configuration
const useEmulators = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"; 