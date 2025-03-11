import * as dotenv from 'dotenv';
import * as path from 'path';
import * as functions from 'firebase-functions';

// Load environment variables from .env file in the backend directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Environment type
export type Environment = 'development' | 'staging' | 'production';

// Get the current environment
export const getEnvironment = (): Environment => {
  return (process.env.NODE_ENV as Environment) || 'development';
};

// Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// API configuration
export const apiConfig = {
  url: process.env.API_URL,
  port: parseInt(process.env.API_PORT || '5001', 10),
  region: process.env.API_REGION || 'europe-west2'
};

// Emulator configuration
export const emulatorConfig = {
  useEmulators: process.env.USE_EMULATORS === 'true',
  firestoreHost: process.env.FIRESTORE_EMULATOR_HOST,
  authHost: process.env.FIREBASE_AUTH_EMULATOR_HOST,
  functionsHost: process.env.FUNCTIONS_EMULATOR_HOST,
  storageHost: process.env.FIREBASE_STORAGE_EMULATOR_HOST
};

// Database configuration
export const databaseConfig = {
  collectionPrefix: process.env.FIRESTORE_COLLECTION_PREFIX || ''
};

// Authentication configuration
export const authConfig = {
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD
};

// Logging configuration
export const loggingConfig = {
  logLevel: process.env.LOG_LEVEL || 'info'
};

// CORS configuration
export const corsConfig = {
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(',')
};

// AI Moderation configuration
export const aiModerationConfig = {
  enabled: process.env.AI_MODERATION_ENABLED === 'true',
  apiKey: process.env.AI_MODERATION_API_KEY
};

// Stripe configuration
export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
};

// Google Maps configuration
export const googleMapsConfig = {
  apiKey: process.env.GOOGLE_MAPS_API_KEY
};

// Get Firebase configuration from environment variables or Firebase config
export const getFirebaseConfig = () => {
  // For Cloud Functions, use the Firebase config
  if (process.env.FUNCTIONS_EMULATOR !== 'true') {
    return {
      projectId: functions.config().project?.id || process.env.FIREBASE_PROJECT_ID,
      storageBucket: functions.config().storage?.bucket || process.env.FIREBASE_STORAGE_BUCKET,
      // Add other Firebase config values as needed
    };
  }
  
  // For local development, use the .env file
  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    // Add other Firebase config values as needed
  };
}; 