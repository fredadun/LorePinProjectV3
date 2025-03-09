const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

// Configuration
const config = {
  // GitHub repository details
  github: {
    owner: 'fredadun',
    repo: 'LorePinProjectV3',
    branch: 'development'
  },
  // Directories to sync with correct case
  directoriesToSync: [
    { oldPath: 'Docs', newPath: 'docs' }
  ]
};

// Helper function to execute git commands
function execGitCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return output;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Function to get all files in a directory recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Function to sync all files with correct case
async function syncAllFiles() {
  console.log('Starting full repository sync process...');
  
  for (const dir of config.directoriesToSync) {
    console.log(`\nProcessing directory: ${dir.oldPath} -> ${dir.newPath}`);
    
    // Check if the directory exists locally
    if (!fs.existsSync(dir.oldPath)) {
      console.log(`Directory ${dir.oldPath} does not exist locally. Skipping.`);
      continue;
    }
    
    // Get all files in the directory
    const allFiles = getAllFiles(dir.oldPath);
    console.log(`Found ${allFiles.length} files in ${dir.oldPath}`);
    
    // Process each file
    for (const filePath of allFiles) {
      // Convert to relative path with forward slashes
      const relativePath = filePath.replace(/\\/g, '/');
      
      // Create the new path with correct case
      const newPath = relativePath.replace(new RegExp(`^${dir.oldPath}/`, 'i'), `${dir.newPath}/`);
      
      console.log(`Processing file: ${relativePath} -> ${newPath}`);
      
      // Ensure the directory exists
      const newDir = path.dirname(newPath);
      if (!fs.existsSync(newDir)) {
        console.log(`Creating directory: ${newDir}`);
        fs.mkdirSync(newDir, { recursive: true });
      }
      
      // Add the file with the correct case
      execGitCommand(`git add "${newPath}"`);
    }
    
    // Commit the changes
    execGitCommand(`git commit -m "Sync files with correct case for ${dir.newPath}" --no-verify`);
    
    // Push the changes
    execGitCommand(`git push origin ${config.github.branch}`);
  }
  
  console.log('\nRepository sync process completed!');
}

// Execute the function
syncAllFiles().catch(error => {
  console.error('Error syncing files:', error);
  process.exit(1);
}); 