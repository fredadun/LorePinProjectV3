/**
 * Script to push all files from a local directory to a branch
 * Usage: node push-all.js --source=../my-code --branch=development --message="Update all files"
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

const sourceDir = args.source || './source';
const branch = args.branch || 'development';
const commitMessage = args.message || 'Update files';

if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory ${sourceDir} does not exist!`);
  process.exit(1);
}

console.log(`Pushing all files from ${sourceDir} to ${branch} branch...`);

// Get all files recursively
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip .git and node_modules directories
      if (file !== '.git' && file !== 'node_modules') {
        getAllFiles(filePath, fileList);
      }
    } else {
      // Get path relative to source directory
      const relativePath = path.relative(sourceDir, filePath);
      fileList.push({
        path: relativePath.replace(/\\/g, '/'), // Convert Windows paths to Unix
        fullPath: filePath
      });
    }
  });
  
  return fileList;
}

// Push files in batches
async function pushFiles(files) {
  // Maximum number of files to push in a single batch
  const BATCH_SIZE = 10;
  
  // Process files in batches
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const batchFiles = [];
    
    for (const file of batch) {
      try {
        const content = fs.readFileSync(file.fullPath, 'utf8');
        batchFiles.push({
          path: file.path,
          content: content
        });
      } catch (error) {
        console.error(`Error reading file ${file.path}: ${error.message}`);
      }
    }
    
    if (batchFiles.length > 0) {
      try {
        const filesJson = JSON.stringify(batchFiles).replace(/"/g, '\\"');
        const batchMessage = `${commitMessage} (batch ${Math.floor(i / BATCH_SIZE) + 1})`;
        
        const command = `mcp__push_files --owner="fredadun" --repo="LorePinProjectV3" --branch="${branch}" --message="${batchMessage}" --files='${filesJson}'`;
        
        execSync(command);
        console.log(`Pushed batch ${Math.floor(i / BATCH_SIZE) + 1} (${batchFiles.length} files)`);
      } catch (error) {
        console.error(`Error pushing batch: ${error.message}`);
      }
    }
  }
}

// Get all files and push them
const files = getAllFiles(sourceDir);
console.log(`Found ${files.length} files to push`);

pushFiles(files)
  .then(() => console.log('Push complete!'))
  .catch(error => console.error(`Error: ${error.message}`));