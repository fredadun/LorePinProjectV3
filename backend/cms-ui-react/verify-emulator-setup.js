/**
 * verify-emulator-setup.js
 * 
 * This script verifies that all necessary Firebase emulator configuration files
 * are present and properly set up. It checks for the existence of required files
 * and validates their basic structure.
 * 
 * Usage: node verify-emulator-setup.js
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Define required files for Firebase emulators
const requiredFiles = [
  { path: 'firebase.json', type: 'config' },
  { path: '.firebaserc', type: 'config' },
  { path: 'firestore.rules', type: 'rules' },
  { path: 'firestore.indexes.json', type: 'config' },
  { path: 'storage.rules', type: 'rules' },
  { path: 'emulator-data/auth_export/accounts.json', type: 'data' },
  { path: 'emulator-data/firestore_export/firestore_export.overall_export_metadata', type: 'data' },
  { path: 'emulator-data/storage_export/buckets.json', type: 'data' }
];

// Define required emulator services
const requiredEmulators = [
  'auth',
  'firestore',
  'storage',
  'functions'
];

console.log(chalk.blue('🔍 Verifying Firebase Emulator Setup...'));
console.log(chalk.gray('Checking for required files and configurations...'));

let allFilesPresent = true;
let configValid = true;

// Check if all required files exist
for (const file of requiredFiles) {
  const filePath = path.resolve(__dirname, file.path);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log(chalk.green(`✓ Found ${file.path}`));
  } else {
    console.log(chalk.red(`✗ Missing ${file.path}`));
    allFilesPresent = false;
    
    // Provide guidance based on file type
    if (file.type === 'config') {
      console.log(chalk.yellow(`  Hint: Run 'firebase init' to generate ${file.path}`));
    } else if (file.type === 'rules') {
      console.log(chalk.yellow(`  Hint: Create ${file.path} with basic rules or run 'firebase init' to generate it`));
    } else if (file.type === 'data') {
      console.log(chalk.yellow(`  Hint: Start emulators once with 'firebase emulators:start' to generate data directories`));
    }
  }
}

// Validate firebase.json structure
const firebaseJsonPath = path.resolve(__dirname, 'firebase.json');
if (fs.existsSync(firebaseJsonPath)) {
  try {
    const firebaseJson = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
    
    // Check for emulators configuration
    if (!firebaseJson.emulators) {
      console.log(chalk.red('✗ firebase.json is missing emulators configuration'));
      configValid = false;
    } else {
      console.log(chalk.green('✓ firebase.json has emulators configuration'));
      
      // Check for required emulators
      for (const emulator of requiredEmulators) {
        if (!firebaseJson.emulators[emulator]) {
          console.log(chalk.red(`✗ firebase.json is missing ${emulator} emulator configuration`));
          configValid = false;
        } else {
          console.log(chalk.green(`✓ firebase.json has ${emulator} emulator configuration`));
          
          // Check for port configuration
          if (!firebaseJson.emulators[emulator].port) {
            console.log(chalk.yellow(`⚠ firebase.json ${emulator} emulator is missing port configuration`));
          }
        }
      }
    }
  } catch (error) {
    console.log(chalk.red(`✗ Error parsing firebase.json: ${error.message}`));
    configValid = false;
  }
}

// Final status
console.log('\n' + chalk.blue('📊 Verification Summary:'));
if (allFilesPresent && configValid) {
  console.log(chalk.green('✅ All Firebase emulator files and configurations are present and valid!'));
  console.log(chalk.blue('🚀 You can start the emulators with:'));
  console.log(chalk.gray('   npm run start-with-emulators'));
  console.log(chalk.gray('   or'));
  console.log(chalk.gray('   firebase emulators:start'));
} else {
  console.log(chalk.red('❌ Some Firebase emulator files or configurations are missing or invalid.'));
  console.log(chalk.yellow('Please address the issues above before starting the emulators.'));
  
  if (!allFilesPresent) {
    console.log(chalk.blue('\nQuick Setup:'));
    console.log(chalk.gray('1. Run: firebase init'));
    console.log(chalk.gray('2. Select: Firestore, Functions, Storage, Emulators'));
    console.log(chalk.gray('3. Follow the prompts to complete setup'));
    console.log(chalk.gray('4. Run this verification script again'));
  }
}

// Exit with appropriate code
process.exit(allFilesPresent && configValid ? 0 : 1); 