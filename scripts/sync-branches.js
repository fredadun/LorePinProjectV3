/**
 * Script to sync all code between branches
 * Usage: node sync-branches.js --source=main --target=development
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = {};
process.argv.slice(2).forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.substring(2).split('=');
    args[key] = value !== undefined ? value : true;
  }
});

const sourceBranch = args.source || 'main';
const targetBranch = args.target || 'development';
const tempDir = path.join(__dirname, 'temp-sync');

console.log(`Syncing all code from ${sourceBranch} to ${targetBranch}...`);

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
} else {
  // Clean temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir);
}

// Step 1: Pull all code from source branch
console.log(`Step 1: Pulling all code from ${sourceBranch}...`);
execSync(`node pull-all.js --branch=${sourceBranch} --output=${tempDir}`);

// Step 2: Push all code to target branch
console.log(`Step 2: Pushing all code to ${targetBranch}...`);
execSync(`node push-all.js --source=${tempDir} --branch=${targetBranch} --message="Sync code from ${sourceBranch}"`);

// Clean up
fs.rmSync(tempDir, { recursive: true, force: true });

console.log(`Successfully synced all code from ${sourceBranch} to ${targetBranch}`);