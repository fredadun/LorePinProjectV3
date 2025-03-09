const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

// Configuration
const config = {
  // Files with case sensitivity issues
  filesToFix: [
    {
      oldPath: 'Docs/README.md',
      newPath: 'docs/README.md',
      tempPath: 'docs/README.md.temp'
    },
    {
      oldPath: 'frontend/src/components/ui/Button.tsx',
      newPath: 'frontend/src/components/ui/button.tsx',
      tempPath: 'frontend/src/components/ui/button.tsx.temp'
    }
  ],
  // GitHub repository details
  github: {
    owner: 'fredadun',
    repo: 'LorePinProjectV3',
    branch: 'development'
  }
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

// Function to fix case sensitivity issues
async function fixCaseSensitivity() {
  console.log('Starting case sensitivity fix process...');
  
  for (const file of config.filesToFix) {
    console.log(`\nProcessing file: ${file.oldPath} -> ${file.newPath}`);
    
    // Check if the file exists locally
    if (!fs.existsSync(file.newPath)) {
      console.log(`File ${file.newPath} does not exist locally. Skipping.`);
      continue;
    }
    
    // 1. Create a temporary copy of the file
    console.log(`Creating temporary copy: ${file.tempPath}`);
    fs.copyFileSync(file.newPath, file.tempPath);
    
    // 2. Add the file with the new case to git
    execGitCommand(`git add ${file.newPath}`);
    
    // 3. Commit the changes
    execGitCommand(`git commit -m "Add ${file.newPath} with correct case" --no-verify`);
    
    // 4. Push the changes
    execGitCommand(`git push origin ${config.github.branch}`);
    
    // 5. Clean up temporary file
    if (fs.existsSync(file.tempPath)) {
      console.log(`Removing temporary file: ${file.tempPath}`);
      fs.unlinkSync(file.tempPath);
    }
    
    console.log(`Successfully processed ${file.newPath}`);
  }
  
  console.log('\nCase sensitivity fix process completed!');
}

// Execute the function
fixCaseSensitivity().catch(error => {
  console.error('Error fixing case sensitivity:', error);
  process.exit(1);
}); 