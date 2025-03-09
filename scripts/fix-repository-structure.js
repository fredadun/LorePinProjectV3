const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

console.log('Starting fix-repository-structure script...');

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

console.log(`Fixing repository structure for ${config.owner}/${config.repo} on branch: ${config.branch}`);

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
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relativePath = path.relative(config.sourceDir, filePath);
      
      if (shouldExclude(relativePath)) {
        return;
      }
      
      try {
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          fileList = getAllFiles(filePath, fileList);
        } else {
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

// Function to delete a file from the repository
async function deleteFile(filePath) {
  try {
    console.log(`Deleting: ${filePath}`);
    
    // Get the file's SHA
    let sha;
    try {
      const response = await octokit.repos.getContent({
        owner: config.owner,
        repo: config.repo,
        path: filePath,
        ref: config.branch
      });
      
      if (response.data && response.data.sha) {
        sha = response.data.sha;
      }
    } catch (error) {
      console.error(`File not found: ${filePath}`);
      return false;
    }
    
    // Delete the file
    await octokit.repos.deleteFile({
      owner: config.owner,
      repo: config.repo,
      path: filePath,
      message: `Delete ${filePath}`,
      sha: sha,
      branch: config.branch
    });
    
    console.log(`Deleted: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error deleting ${filePath}:`, error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Function to push a single file
async function pushFile(file) {
  try {
    const normalizedPath = file.path.replace(/\\/g, '/');
    console.log(`Pushing: ${normalizedPath}`);
    
    // Check if file exists in the repository
    let sha;
    try {
      const response = await octokit.repos.getContent({
        owner: config.owner,
        repo: config.repo,
        path: normalizedPath,
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
      path: normalizedPath,
      message: `Update ${normalizedPath}`,
      content: Buffer.from(file.content).toString('base64'),
      branch: config.branch,
      sha: sha
    });
    
    console.log(`Pushed: ${normalizedPath}`);
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

// Function to get all files in the repository
async function getRepositoryFiles() {
  try {
    console.log('Getting repository files...');
    
    const files = [];
    
    // Get the repository contents
    async function getContents(path = '') {
      try {
        const response = await octokit.repos.getContent({
          owner: config.owner,
          repo: config.repo,
          path: path,
          ref: config.branch
        });
        
        if (Array.isArray(response.data)) {
          // It's a directory
          for (const item of response.data) {
            if (item.type === 'dir') {
              await getContents(item.path);
            } else if (item.type === 'file') {
              files.push(item.path);
            }
          }
        } else {
          // It's a file
          files.push(response.data.path);
        }
      } catch (error) {
        console.error(`Error getting contents for ${path}:`, error.message);
      }
    }
    
    await getContents();
    
    return files;
  } catch (error) {
    console.error('Error getting repository files:', error.message);
    return [];
  }
}

// Main function to fix the repository structure
async function fixRepositoryStructure() {
  try {
    // Get all files in the repository
    const repositoryFiles = await getRepositoryFiles();
    console.log(`Found ${repositoryFiles.length} files in the repository`);
    
    // Get all files in the local directory
    const localFiles = getAllFiles(config.sourceDir);
    console.log(`Found ${localFiles.length} files locally`);
    
    // Delete files with incorrect paths (containing backslashes)
    const filesToDelete = repositoryFiles.filter(file => file.includes('\\'));
    console.log(`Found ${filesToDelete.length} files with incorrect paths to delete`);
    
    for (const file of filesToDelete) {
      await deleteFile(file);
      // Add a delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Push all local files with correct paths
    console.log(`Pushing ${localFiles.length} files with correct paths...`);
    
    let successCount = 0;
    for (let i = 0; i < localFiles.length; i++) {
      const file = localFiles[i];
      console.log(`[${i+1}/${localFiles.length}] Processing: ${file.path}`);
      
      const success = await pushFile(file);
      if (success) successCount++;
      
      // Add a delay to avoid rate limiting
      if (i < localFiles.length - 1) { // Don't wait after the last file
        console.log('Waiting 1 second before next file...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`Successfully pushed ${successCount}/${localFiles.length} files!`);
  } catch (error) {
    console.error('Error fixing repository structure:', error.message);
    process.exit(1);
  }
}

// Execute the fix
fixRepositoryStructure(); 