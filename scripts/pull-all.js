const { Octokit } = require('@octokit/rest');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

// Parse command line arguments
const args = process.argv.slice(2);
const branchArg = args.find(arg => arg.startsWith('--branch='));
const branch = branchArg ? branchArg.split('=')[1] : 'development';

// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3',
  branch: branch,
  outputDir: path.resolve(__dirname, '..', 'pulled-files')
};

console.log(`Pulling files from ${config.owner}/${config.repo} on branch: ${config.branch}`);

// Initialize Octokit with GitHub token from environment
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Ensure output directory exists
fs.ensureDirSync(config.outputDir);

// Function to get repository contents recursively
async function getRepoContents(path = '') {
  try {
    const response = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: path,
      ref: config.branch
    });

    if (Array.isArray(response.data)) {
      // It's a directory, process each item
      const promises = response.data.map(async item => {
        if (item.type === 'dir') {
          // Recursively get contents of subdirectory
          return getRepoContents(item.path);
        } else if (item.type === 'file') {
          // Download file
          return downloadFile(item.path);
        }
      });

      await Promise.all(promises);
    } else {
      // It's a single file
      await downloadFile(path);
    }
  } catch (error) {
    console.error(`Error getting contents for ${path}:`, error.message);
  }
}

// Function to download a file
async function downloadFile(filePath) {
  try {
    console.log(`Downloading: ${filePath}`);
    
    const response = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: filePath,
      ref: config.branch
    });

    const content = Buffer.from(response.data.content, 'base64').toString('utf8');
    const outputPath = path.join(config.outputDir, filePath);
    
    // Ensure directory exists
    fs.ensureDirSync(path.dirname(outputPath));
    
    // Write file
    fs.writeFileSync(outputPath, content);
    console.log(`Downloaded: ${filePath}`);
  } catch (error) {
    console.error(`Error downloading ${filePath}:`, error.message);
  }
}

// Main function to pull all files
async function pullAllFiles() {
  try {
    console.log('Starting to pull all files...');
    await getRepoContents();
    console.log(`All files pulled successfully to: ${config.outputDir}`);
  } catch (error) {
    console.error('Error pulling files:', error.message);
    process.exit(1);
  }
}

// Execute the pull
pullAllFiles(); 