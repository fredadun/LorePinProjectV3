const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const config = {
  branches: {
    development: 'development',
    test: 'test',
    main: 'main'
  },
  remote: 'origin'
};

// Helper function to execute git commands
function execGitCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return output;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Function to sync branches
function syncBranches(fromBranch, toBranch) {
  console.log(`\nSyncing from ${fromBranch} to ${toBranch}...`);
  
  // Make sure we have the latest changes
  execGitCommand(`git fetch ${config.remote}`);
  
  // Checkout the target branch
  execGitCommand(`git checkout ${toBranch}`);
  
  // Pull the latest changes from the target branch
  execGitCommand(`git pull ${config.remote} ${toBranch}`);
  
  // Merge changes from the source branch
  const mergeResult = execGitCommand(`git merge ${config.remote}/${fromBranch} --no-ff -m "Merge ${fromBranch} into ${toBranch}"`);
  
  if (mergeResult) {
    // Push the changes
    execGitCommand(`git push ${config.remote} ${toBranch}`);
    console.log(`\n✅ Successfully merged ${fromBranch} into ${toBranch} and pushed to remote.`);
  } else {
    console.error(`\n❌ Failed to merge ${fromBranch} into ${toBranch}. Please resolve conflicts manually.`);
    return false;
  }
  
  return true;
}

// Function to create a pull request (requires GitHub CLI or manual creation)
function createPullRequest(fromBranch, toBranch) {
  console.log(`\nTo create a pull request from ${fromBranch} to ${toBranch}, visit:`);
  console.log(`https://github.com/fredadun/LorePinProjectV3/compare/${toBranch}...${fromBranch}?expand=1`);
}

// Function to display help
function showHelp() {
  console.log(`
Branch Management Script
=======================

Usage:
  node branch-management.js <command> [options]

Commands:
  sync-to-test     Sync changes from development to test branch
  sync-to-main     Sync changes from test to main branch
  sync-all         Sync changes through all branches (development -> test -> main)
  create-pr        Create pull requests for branch syncing
  help             Show this help message

Examples:
  node branch-management.js sync-to-test
  node branch-management.js sync-to-main
  node branch-management.js sync-all
  node branch-management.js create-pr
  `);
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === 'help') {
    showHelp();
    return;
  }
  
  switch (command) {
    case 'sync-to-test':
      syncBranches(config.branches.development, config.branches.test);
      break;
    
    case 'sync-to-main':
      syncBranches(config.branches.test, config.branches.main);
      break;
    
    case 'sync-all':
      const testSuccess = syncBranches(config.branches.development, config.branches.test);
      if (testSuccess) {
        syncBranches(config.branches.test, config.branches.main);
      }
      break;
    
    case 'create-pr':
      createPullRequest(config.branches.development, config.branches.test);
      createPullRequest(config.branches.test, config.branches.main);
      break;
    
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      break;
  }
}

// Execute the main function
main(); 