const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

console.log('Starting push-single-file script...');

// Load token from environment variable
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('ERROR: GitHub token not found in environment variables!');
  console.error('Make sure you have a .env file with GITHUB_TOKEN=your_token');
  process.exit(1);
}
console.log('GitHub token found in environment variables.');

// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3',
  branch: 'development',
  filePath: 'scripts/push-project.js',
  sourceFile: path.resolve(__dirname, 'push-project.js')
};

console.log(`Pushing file ${config.filePath} to ${config.owner}/${config.repo} on branch: ${config.branch}`);

// Initialize Octokit with GitHub token
console.log('Initializing Octokit...');
const octokit = new Octokit({
  auth: token
});

// Function to push a single file
async function pushFile() {
  try {
    console.log(`Pushing: ${config.filePath}`);
    
    // Check if file exists in the repository
    let sha;
    try {
      const response = await octokit.repos.getContent({
        owner: config.owner,
        repo: config.repo,
        path: config.filePath.replace(/\\/g, '/'), // Convert Windows backslashes to forward slashes
        ref: config.branch
      });
      
      if (response.data && response.data.sha) {
        sha = response.data.sha;
      }
    } catch (error) {
      // File doesn't exist, which is fine
    }
    
    // Read the file content
    const content = fs.readFileSync(config.sourceFile, 'utf8');
    
    // Create or update the file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: config.owner,
      repo: config.repo,
      path: config.filePath.replace(/\\/g, '/'), // Convert Windows backslashes to forward slashes
      message: `Update ${config.filePath}`,
      content: Buffer.from(content).toString('base64'),
      branch: config.branch,
      sha: sha
    });
    
    console.log(`Pushed: ${config.filePath}`);
    return true;
  } catch (error) {
    console.error(`Error pushing ${config.filePath}:`, error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Execute the push
pushFile(); 