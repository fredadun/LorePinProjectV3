/**
 * Script to commit and push the new component documentation files
 * 
 * This script:
 * 1. Adds the new component documentation files
 * 2. Commits them with a descriptive message
 * 3. Pushes the changes to the development branch
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BRANCH = 'development';
const COMMIT_MESSAGE = 'Add detailed component documentation files';
const DOCS_DIR = path.join(__dirname, '..', 'docs-new', '07-components');

// Files to check
const componentFiles = [
  'authentication.md',
  'challenges.md',
  'location-services.md',
  'lorecoins.md',
  'media-handling.md',
  'notifications.md',
  'user-profiles.md'
];

/**
 * Execute a command and return its output
 * @param {string} command - Command to execute
 * @returns {string} Command output
 */
function executeCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    const output = execSync(command, { encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * Check if all component files exist
 * @returns {boolean} True if all files exist
 */
function checkFilesExist() {
  console.log('Checking if all component files exist...');
  
  const missingFiles = componentFiles.filter(file => {
    const filePath = path.join(DOCS_DIR, file);
    return !fs.existsSync(filePath);
  });
  
  if (missingFiles.length > 0) {
    console.error('The following component files are missing:');
    missingFiles.forEach(file => console.error(`- ${file}`));
    return false;
  }
  
  console.log('All component files exist.');
  return true;
}

/**
 * Main function to commit and push component documentation
 */
async function commitAndPushDocs() {
  try {
    // Check if we're on the correct branch
    const currentBranch = executeCommand('git branch --show-current');
    if (currentBranch !== BRANCH) {
      console.error(`Not on ${BRANCH} branch. Current branch: ${currentBranch}`);
      console.log(`Please switch to ${BRANCH} branch first.`);
      process.exit(1);
    }
    
    // Check if all files exist
    if (!checkFilesExist()) {
      process.exit(1);
    }
    
    // Check git status
    console.log('Checking git status...');
    const gitStatus = executeCommand('git status --porcelain');
    
    if (!gitStatus) {
      console.log('No changes to commit.');
      process.exit(0);
    }
    
    // Add the files
    console.log('Adding component documentation files...');
    executeCommand(`git add ${DOCS_DIR}`);
    
    // Commit the changes
    console.log('Committing changes...');
    executeCommand(`git commit -m "${COMMIT_MESSAGE}"`);
    
    // Push to remote
    console.log('Pushing to remote...');
    executeCommand(`git push origin ${BRANCH}`);
    
    console.log('Successfully committed and pushed component documentation files.');
  } catch (error) {
    console.error('Error committing and pushing documentation:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the script
commitAndPushDocs(); 