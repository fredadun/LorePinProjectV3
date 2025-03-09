const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

console.log('Starting push-project script...');

// Load token from environment variable
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('ERROR: GitHub token not found in environment variables!');
  console.error('Make sure you have a .env file with GITHUB_TOKEN=your_token');
  process.exit(1);
}
console.log('GitHub token found in environment variables.');

// Parse command line arguments
const args = process.argv.slice(2);
console.log('Command line arguments:', args);
const branchArg = args.find(arg => arg.startsWith('--branch='));
const branch = branchArg ? branchArg.split('=')[1] : 'development';
console.log('Using branch:', branch);

// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3',
  branch: branch,
  sourceDir: path.resolve(__dirname, '..'), // Parent directory of scripts
  excludePatterns: [
    // Directories to exclude
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    'coverage',
    'pulled-files',
    
    // Files to exclude
    '.env',
    '.env.local',
    '.env.development',
    '.env.production',
    '.DS_Store',
    'Thumbs.db',
    
    // File patterns to exclude
    '*.log',
    '*.lock',
    '*.tmp',
    '*.temp'
  ]
};

console.log(`Pushing files to ${config.owner}/${config.repo} on branch: ${config.branch}`);
console.log('Source directory:', config.sourceDir);

// Initialize Octokit with GitHub token
console.log('Initializing Octokit...');
const octokit = new Octokit({
  auth: token
});

// Function to check if a file should be excluded
function shouldExclude(filePath) {
  // Always include these specific files
  const alwaysInclude = [
    'firebase.json',
    'firestore.indexes.json',
    'firestore.rules',
    'storage.rules',
    'package.json',
    'README.md',
    'backend/firebase.json',
    'backend/firestore.indexes.json',
    'backend/firestore.rules',
    'backend/storage.rules',
    'backend/functions/package.json',
    'backend/functions/tsconfig.json',
    'frontend/package.json',
    'frontend/tsconfig.json',
    'frontend/next.config.js',
    'frontend/postcss.config.js',
    'frontend/tailwind.config.js'
  ];
  
  if (alwaysInclude.includes(filePath)) {
    return false;
  }
  
  // Check against exclusion patterns
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
  console.log(`Scanning directory: ${dir}`);
  
  try {
    const files = fs.readdirSync(dir);
    console.log(`Found ${files.length} items in ${dir}`);
    
    // Debug: Print all items in the directory
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relativePath = path.relative(config.sourceDir, filePath);
      console.log(`  - ${relativePath} (${fs.statSync(filePath).isDirectory() ? 'directory' : 'file'})`);
    });
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relativePath = path.relative(config.sourceDir, filePath);
      
      if (shouldExclude(relativePath)) {
        console.log(`Excluding: ${relativePath}`);
        return;
      }
      
      try {
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          fileList = getAllFiles(filePath, fileList);
        } else {
          console.log(`Adding file: ${relativePath}`);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            fileList.push({
              path: relativePath,
              content: content
            });
          } catch (error) {
            console.error(`Error reading file ${filePath}:`, error.message);
          }
        }
      } catch (error) {
        console.error(`Error accessing ${filePath}:`, error.message);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
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
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: config.owner,
      repo: config.repo,
      path: file.path.replace(/\\/g, '/'), // Convert Windows backslashes to forward slashes
      message: `Update ${file.path}`,
      content: Buffer.from(file.content).toString('base64'),
      branch: config.branch,
      sha: sha
    });
    
    console.log(`Pushed: ${file.path}`);
    return true;
  } catch (error) {
    console.error(`Error pushing ${file.path}:`, error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Main function to push files
async function pushFiles() {
  try {
    // Get all files
    console.log('Gathering files...');
    const files = getAllFiles(config.sourceDir);
    console.log(`Found ${files.length} files to push`);
    
    // Push all files
    const filesToPush = files; // Push all files
    console.log(`Pushing ${filesToPush.length} files...`);
    
    // Push files in sequence to avoid rate limits
    let successCount = 0;
    for (let i = 0; i < filesToPush.length; i++) {
      const file = filesToPush[i];
      console.log(`[${i+1}/${filesToPush.length}] Pushing: ${file.path}`);
      
      const success = await pushFile(file);
      if (success) successCount++;
      
      // Add a delay to avoid rate limiting
      if (i < filesToPush.length - 1) { // Don't wait after the last file
        console.log('Waiting 3 seconds before next file...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    console.log(`Successfully pushed ${successCount}/${filesToPush.length} files!`);
  } catch (error) {
    console.error('Error pushing files:', error.message);
    process.exit(1);
  }
}

// Execute the push
pushFiles(); 