/**
 * Script to push package-lock.json to the repository
 * This helps fix the GitHub Actions build error
 */

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

// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3',
  branch: 'development',
  filePath: 'package-lock.json'
};

console.log(`Pushing ${config.filePath} to ${config.owner}/${config.repo} on branch: ${config.branch}`);

// Initialize Octokit
const octokit = new Octokit({
  auth: token
});

// Function to push the file
async function pushFile() {
  try {
    // Get the file path
    const sourceFilePath = path.resolve(__dirname, '..', config.filePath);
    
    // Check if file exists
    if (!fs.existsSync(sourceFilePath)) {
      console.error(`File not found: ${sourceFilePath}`);
      process.exit(1);
    }
    
    // Read file content
    const content = fs.readFileSync(sourceFilePath, 'utf8');
    console.log(`Read file: ${sourceFilePath} (${content.length} bytes)`);
    
    // Check if file exists in the repository
    let sha;
    try {
      const response = await octokit.repos.getContent({
        owner: config.owner,
        repo: config.repo,
        path: config.filePath,
        ref: config.branch
      });
      
      if (response.data && response.data.sha) {
        sha = response.data.sha;
        console.log(`File exists in repository with SHA: ${sha}`);
      }
    } catch (error) {
      // File doesn't exist, which is fine
      console.log('File does not exist in repository yet');
    }
    
    // Create or update the file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: config.owner,
      repo: config.repo,
      path: config.filePath,
      message: `Add ${config.filePath} to fix GitHub Actions build`,
      content: Buffer.from(content).toString('base64'),
      branch: config.branch,
      sha: sha
    });
    
    console.log(`Successfully pushed ${config.filePath} to the repository!`);
    console.log(`Commit: ${response.data.commit.html_url}`);
    
    return true;
  } catch (error) {
    console.error(`Error pushing file:`, error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Execute the push
pushFile();