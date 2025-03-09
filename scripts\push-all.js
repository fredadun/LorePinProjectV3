const { Octokit } = require('@octokit/rest');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

// Parse command line arguments
const args = process.argv.slice(2);
const branchArg = args.find(arg => arg.startsWith('--branch='));
const branch = branchArg ? branchArg.split('=')[1] : 'development';
const dirArg = args.find(arg => arg.startsWith('--dir='));
const sourceDir = dirArg ? dirArg.split('=')[1] : path.resolve(__dirname, '..');

// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3',
  branch: branch,
  sourceDir: sourceDir,
  excludePatterns: [
    'node_modules',
    '.git',
    '.env',
    '.env.local',
    '.DS_Store',
    'build',
    'dist',
    'coverage',
    '*.log',
    '*.lock',
    'pulled-files'
  ]
};

console.log(`Pushing files from ${config.sourceDir} to ${config.owner}/${config.repo} on branch: ${config.branch}`);

// Initialize Octokit with GitHub token from environment
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Function to check if a file should be excluded
function shouldExclude(filePath) {
  return config.excludePatterns.some(pattern => {
    if (pattern.includes('*')) {
      const regexPattern = pattern.replace(/\*/g, '.*');
      return new RegExp(regexPattern).test(filePath);
    }
    return filePath.includes(pattern);
  });
}

// Function to recursively get all files in a directory
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const relativePath = path.relative(config.sourceDir, filePath);
    
    if (shouldExclude(relativePath)) {
      return;
    }
    
    if (fs.statSync(filePath).isDirectory()) {
      fileList = getAllFiles(filePath, fileList);
    } else {
      fileList.push({
        path: relativePath,
        content: fs.readFileSync(filePath, 'utf8')
      });
    }
  });
  
  return fileList;
}

// Function to push a single file
async function pushFile(file) {
  try {
    console.log(`Pushing: ${file.path}`);
    
    // Check if file exists in the repository
    let sha;
    try {
      const response = await octokit.repos.getContent({
        owner: config.owner,
        repo: config.repo,
        path: file.path,
        ref: config.branch
      });
      
      if (response.data && response.data.sha) {
        sha = response.data.sha;
      }
    } catch (error) {
      // File doesn't exist, which is fine
    }
    
    // Create or update the file
    await octokit.repos.createOrUpdateFileContents({
      owner: config.owner,
      repo: config.repo,
      path: file.path,
      message: `Update ${file.path}`,
      content: Buffer.from(file.content).toString('base64'),
      branch: config.branch,
      sha: sha
    });
    
    console.log(`Pushed: ${file.path}`);
  } catch (error) {
    console.error(`Error pushing ${file.path}:`, error.message);
  }
}

// Main function to push all files
async function pushAllFiles() {
  try {
    console.log('Gathering files...');
    const files = getAllFiles(config.sourceDir);
    console.log(`Found ${files.length} files to push`);
    
    // Push files in sequence to avoid rate limits
    for (const file of files) {
      await pushFile(file);
    }
    
    console.log('All files pushed successfully!');
  } catch (error) {
    console.error('Error pushing files:', error.message);
    process.exit(1);
  }
}

// Execute the push
pushAllFiles(); 