const { Octokit } = require('@octokit/rest');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3',
  branch: 'development',
  outputDir: path.resolve(__dirname, '..', 'pulled-files'),
  filesToPull: [
    'frontend/src/components/ui/button.tsx',
    'backend/functions/src/index.ts'
  ]
};

console.log(`Pulling specific files from ${config.owner}/${config.repo} on branch: ${config.branch}`);

// Initialize Octokit with GitHub token from environment
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Ensure output directory exists
fs.ensureDirSync(config.outputDir);

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
    console.log(`Downloaded: ${filePath} to ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error downloading ${filePath}:`, error.message);
    return false;
  }
}

// Main function to pull specified files
async function pullFiles() {
  try {
    console.log('Starting to pull files...');
    
    let successCount = 0;
    for (const filePath of config.filesToPull) {
      const success = await downloadFile(filePath);
      if (success) successCount++;
    }
    
    console.log(`Pulled ${successCount}/${config.filesToPull.length} files successfully to: ${config.outputDir}`);
  } catch (error) {
    console.error('Error pulling files:', error.message);
    process.exit(1);
  }
}

// Execute the pull
pullFiles(); 