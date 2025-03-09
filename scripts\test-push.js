const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

// Load token from environment variable
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('ERROR: GitHub token not found in environment variables!');
  console.error('Make sure you have a .env file with GITHUB_TOKEN=your_token');
  process.exit(1);
}

console.log('Starting test script...');
console.log(`Token found in environment variables.`);

// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3',
  branch: 'development'
};

// Initialize Octokit with GitHub token
console.log('Initializing Octokit...');
const octokit = new Octokit({
  auth: token
});

// Function to push a single file
async function pushFile() {
  try {
    const filePath = 'test-file.md';
    const content = '# Test File\n\nThis is a test file created by the push script.';
    
    console.log(`Pushing file: ${filePath}`);
    
    // Create or update the file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: config.owner,
      repo: config.repo,
      path: filePath,
      message: 'Add test file',
      content: Buffer.from(content).toString('base64'),
      branch: config.branch
    });
    
    console.log('File pushed successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error pushing file:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Execute the push
pushFile(); 