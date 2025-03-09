/**
 * Master script for setting up project management in GitHub
 * 
 * This script runs all the setup scripts in the correct order:
 * 1. Create milestones
 * 2. Create labels
 * 3. Create project board
 * 4. Create issues from user stories
 * 
 * Usage:
 * 1. Make sure you have a GITHUB_TOKEN environment variable set
 * 2. Run: node setup-project-management.js
 */

require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

// Check for GitHub token
if (!process.env.GITHUB_TOKEN) {
  console.error('ERROR: GitHub token not found in environment variables!');
  console.error('Please set the GITHUB_TOKEN environment variable and try again.');
  process.exit(1);
}

// Configuration
const config = {
  scripts: [
    { name: 'Create Milestones', file: 'create-milestones.js' },
    { name: 'Create Labels', file: 'create-labels.js' },
    { name: 'Create Project Board', file: 'create-project-board.js' },
    { name: 'Create Issues', file: 'create-issues.js' }
  ]
};

/**
 * Run a script
 * @param {Object} script - The script to run
 * @returns {Promise} - Promise resolving when the script completes
 */
function runScript(script) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`\n=== Running ${script.name} ===\n`);
      
      const scriptPath = path.join(__dirname, script.file);
      execSync(`node ${scriptPath}`, { stdio: 'inherit' });
      
      console.log(`\n=== Completed ${script.name} ===\n`);
      resolve();
    } catch (error) {
      console.error(`\n❌ Error running ${script.name}:`, error.message);
      reject(error);
    }
  });
}

/**
 * Run all scripts in sequence
 */
async function runAllScripts() {
  console.log('Starting project management setup for LorePin project...');
  console.log('-------------------------------------------');
  
  try {
    for (const script of config.scripts) {
      await runScript(script);
    }
    
    console.log('-------------------------------------------');
    console.log('✅ Project management setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Assign team members to issues');
    console.log('2. Set specific dates for sprints');
    console.log('3. Conduct sprint planning meeting');
  } catch (error) {
    console.error('❌ Project management setup failed');
    process.exit(1);
  }
}

// Execute the script
runAllScripts();