const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from parent .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

// Define the environment (development, staging, production)
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`Building for environment: ${NODE_ENV}`);

// Define the build directory
const BUILD_DIR = path.join(__dirname, 'dist');

// Create the build directory if it doesn't exist
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// Copy HTML file to build directory
fs.copyFileSync(
  path.join(__dirname, 'index.html'),
  path.join(BUILD_DIR, 'index.html')
);

// Read the app.js file
let appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

// Read the config.js file
let configJs = fs.readFileSync(path.join(__dirname, 'config.js'), 'utf8');

// Replace placeholders with actual environment variables
configJs = configJs.replace('FIREBASE_API_KEY_PLACEHOLDER', process.env.FIREBASE_API_KEY || '');
configJs = configJs.replace('FIREBASE_AUTH_DOMAIN_PLACEHOLDER', process.env.FIREBASE_AUTH_DOMAIN || '');
configJs = configJs.replace('FIREBASE_PROJECT_ID_PLACEHOLDER', process.env.FIREBASE_PROJECT_ID || '');
configJs = configJs.replace('FIREBASE_STORAGE_BUCKET_PLACEHOLDER', process.env.FIREBASE_STORAGE_BUCKET || '');
configJs = configJs.replace('FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER', process.env.FIREBASE_MESSAGING_SENDER_ID || '');
configJs = configJs.replace('FIREBASE_APP_ID_PLACEHOLDER', process.env.FIREBASE_APP_ID || '');
configJs = configJs.replace('FIREBASE_MEASUREMENT_ID_PLACEHOLDER', process.env.FIREBASE_MEASUREMENT_ID || '');

// Set the project ID based on the environment
let projectId = process.env.FIREBASE_PROJECT_ID || '';
if (NODE_ENV === 'staging') {
  projectId = 'lorepin-staging';
} else if (NODE_ENV === 'production') {
  projectId = 'lorepin-prod';
}

// Replace the project ID placeholder
configJs = configJs.replace('FIREBASE_PROJECT_ID_PLACEHOLDER', projectId);

// Write the processed config.js file to the build directory
fs.writeFileSync(path.join(BUILD_DIR, 'config.js'), configJs);

// Write the processed app.js file to the build directory
fs.writeFileSync(path.join(BUILD_DIR, 'app.js'), appJs);

// Copy any other necessary files (CSS, images, etc.)
fs.copyFileSync(
  path.join(__dirname, 'styles.css'),
  path.join(BUILD_DIR, 'styles.css')
);

console.log('Build completed successfully!'); 