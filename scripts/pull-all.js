/**
 * Script to pull all files from a branch
 * Usage: node pull-all.js --branch=development --output=../local-copy
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

const branch = args.branch || 'development';
const outputDir = args.output || './output';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Pulling all files from ${branch} branch to ${outputDir}...`);

// Get repository contents
function getContents(path = '') {
  try {
    const command = `mcp__get_contents --owner="fredadun" --repo="LorePinProjectV3" --path="${path}" --branch="${branch}"`;
    const result = execSync(command).toString();
    return JSON.parse(result);
  } catch (error) {
    console.error(`Error getting contents for ${path}: ${error.message}`);
    return [];
  }
}

// Download a file
function downloadFile(filePath) {
  try {
    const command = `mcp__get_file_contents --owner="fredadun" --repo="LorePinProjectV3" --path="${filePath}" --branch="${branch}"`;
    const result = execSync(command).toString();
    const fileContent = JSON.parse(result).content;
    
    // Create directory structure if needed
    const fullPath = path.join(outputDir, filePath);
    const dirName = path.dirname(fullPath);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(fullPath, fileContent);
    console.log(`Downloaded: ${filePath}`);
  } catch (error) {
    console.error(`Error downloading ${filePath}: ${error.message}`);
  }
}

// Process directory recursively
function processDirectory(dirPath = '') {
  const contents = getContents(dirPath);
  
  for (const item of contents) {
    const itemPath = item.path;
    
    if (item.type === 'file') {
      downloadFile(itemPath);
    } else if (item.type === 'dir') {
      processDirectory(itemPath);
    }
  }
}

// Start processing from root
processDirectory();
console.log('Pull complete!');