/**
 * Repository Structure Checker
 * 
 * This script checks the repository structure for common issues:
 * - Files with backslashes in paths
 * - Files in the wrong directories
 * - Missing key files
 */

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
  expectedDirectories: [
    'backend',
    'backend/functions',
    'backend/functions/src',
    'docs',
    'frontend',
    'frontend/src',
    'frontend/src/components',
    'mobile',
    'scripts'
  ],
  expectedFiles: [
    'README.md',
    'backend/functions/src/index.ts',
    'scripts/package.json'
  ]
};

// Initialize Octokit
const octokit = new Octokit({
  auth: token
});

// Function to get all files in the repository
async function getAllFiles(path = '') {
  try {
    const response = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: path,
      ref: config.branch
    });

    let files = [];

    if (Array.isArray(response.data)) {
      // It's a directory
      for (const item of response.data) {
        if (item.type === 'dir') {
          // Recursively get files from subdirectory
          const subFiles = await getAllFiles(item.path);
          files = [...files, ...subFiles];
        } else if (item.type === 'file') {
          // Add file to the list
          files.push(item.path);
        }
      }
    } else {
      // It's a single file
      files.push(response.data.path);
    }

    return files;
  } catch (error) {
    console.error(`Error getting contents for ${path}:`, error.message);
    return [];
  }
}

// Function to check if a directory exists
async function directoryExists(path) {
  try {
    const response = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: path,
      ref: config.branch
    });

    return Array.isArray(response.data);
  } catch (error) {
    return false;
  }
}

// Function to check if a file exists
async function fileExists(path) {
  try {
    const response = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: path,
      ref: config.branch
    });

    return !Array.isArray(response.data);
  } catch (error) {
    return false;
  }
}

// Main function to check repository structure
async function checkRepoStructure() {
  console.log('Checking repository structure...');
  
  // Get all files
  const files = await getAllFiles();
  console.log(`Found ${files.length} files in the repository.`);
  
  // Check for backslashes in paths
  const filesWithBackslashes = files.filter(file => file.includes('\\'));
  if (filesWithBackslashes.length > 0) {
    console.error('ERROR: Found files with backslashes in paths:');
    filesWithBackslashes.forEach(file => console.error(`  - ${file}`));
  } else {
    console.log('✓ No files with backslashes in paths.');
  }
  
  // Check for expected directories
  console.log('\nChecking expected directories:');
  let missingDirectories = [];
  for (const dir of config.expectedDirectories) {
    const exists = await directoryExists(dir);
    if (exists) {
      console.log(`✓ Directory exists: ${dir}`);
    } else {
      console.error(`✗ Missing directory: ${dir}`);
      missingDirectories.push(dir);
    }
  }
  
  // Check for expected files
  console.log('\nChecking expected files:');
  let missingFiles = [];
  for (const file of config.expectedFiles) {
    const exists = await fileExists(file);
    if (exists) {
      console.log(`✓ File exists: ${file}`);
    } else {
      console.error(`✗ Missing file: ${file}`);
      missingFiles.push(file);
    }
  }
  
  // Summary
  console.log('\nRepository Structure Check Summary:');
  console.log(`Total files: ${files.length}`);
  console.log(`Files with backslashes: ${filesWithBackslashes.length}`);
  console.log(`Missing directories: ${missingDirectories.length}`);
  console.log(`Missing files: ${missingFiles.length}`);
  
  if (filesWithBackslashes.length === 0 && missingDirectories.length === 0 && missingFiles.length === 0) {
    console.log('\n✅ Repository structure looks good!');
  } else {
    console.error('\n❌ Repository structure has issues that need to be fixed.');
  }
}

// Run the check
checkRepoStructure();