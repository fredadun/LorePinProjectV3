/**
 * Deployment script for LorePin CMS UI
 * 
 * This script automates the deployment process for the LorePin CMS UI.
 * It builds the application, copies the files to the deployment directory,
 * and updates the Firebase configuration if needed.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  // Source directory (where the application is built)
  sourceDir: path.join(__dirname, 'dist'),
  
  // Deployment directory (where the application will be deployed)
  deployDir: path.join(__dirname, '..', '..', 'frontend', 'public', 'cms'),
  
  // Firebase configuration file
  firebaseConfigFile: path.join(__dirname, 'src', 'config', 'firebase.js'),
  
  // Environment (development, staging, production)
  environment: process.env.NODE_ENV || 'development',
};

/**
 * Build the application
 */
function buildApplication() {
  console.log('Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Application built successfully.');
}

/**
 * Create the deployment directory if it doesn't exist
 */
function createDeploymentDirectory() {
  console.log(`Creating deployment directory: ${config.deployDir}`);
  
  if (!fs.existsSync(config.deployDir)) {
    fs.mkdirSync(config.deployDir, { recursive: true });
  }
}

/**
 * Copy files from the source directory to the deployment directory
 */
function copyFiles() {
  console.log(`Copying files from ${config.sourceDir} to ${config.deployDir}`);
  
  // Get all files in the source directory
  const files = fs.readdirSync(config.sourceDir);
  
  // Copy each file to the deployment directory
  files.forEach(file => {
    const sourcePath = path.join(config.sourceDir, file);
    const deployPath = path.join(config.deployDir, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      // If it's a directory, copy it recursively
      copyDirectory(sourcePath, deployPath);
    } else {
      // If it's a file, copy it
      fs.copyFileSync(sourcePath, deployPath);
    }
  });
  
  console.log('Files copied successfully.');
}

/**
 * Copy a directory recursively
 */
function copyDirectory(source, destination) {
  // Create the destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  // Get all files in the source directory
  const files = fs.readdirSync(source);
  
  // Copy each file to the destination directory
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      // If it's a directory, copy it recursively
      copyDirectory(sourcePath, destinationPath);
    } else {
      // If it's a file, copy it
      fs.copyFileSync(sourcePath, destinationPath);
    }
  });
}

/**
 * Update the Firebase configuration based on the environment
 */
function updateFirebaseConfig() {
  console.log(`Updating Firebase configuration for ${config.environment} environment...`);
  
  // Read the Firebase configuration file
  const firebaseConfigPath = config.firebaseConfigFile;
  const firebaseConfig = fs.readFileSync(firebaseConfigPath, 'utf8');
  
  // Update the configuration based on the environment
  let updatedConfig = firebaseConfig;
  
  if (config.environment === 'production') {
    // Update the configuration for production
    updatedConfig = firebaseConfig.replace(
      /projectId: "lorebacking-test"/g,
      'projectId: "lorepin-prod"'
    );
  } else if (config.environment === 'staging') {
    // Update the configuration for staging
    updatedConfig = firebaseConfig.replace(
      /projectId: "lorebacking-test"/g,
      'projectId: "lorepin-staging"'
    );
  }
  
  // Write the updated configuration back to the file
  fs.writeFileSync(firebaseConfigPath, updatedConfig);
  
  console.log('Firebase configuration updated successfully.');
}

/**
 * Main function
 */
function main() {
  console.log(`Deploying LorePin CMS UI to ${config.environment} environment...`);
  
  try {
    // Update Firebase configuration
    updateFirebaseConfig();
    
    // Build the application
    buildApplication();
    
    // Create the deployment directory
    createDeploymentDirectory();
    
    // Copy files to the deployment directory
    copyFiles();
    
    console.log('Deployment completed successfully!');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 