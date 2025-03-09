/**
 * Script to push LorePin project files to GitHub
 * Usage: node push-project.js --branch=development
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
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3',
  branch: branch,
  directories: [
    { path: 'frontend/src', message: 'Add frontend source code' },
    { path: 'frontend/public', message: 'Add frontend public assets' },
    { path: 'frontend/*.js', message: 'Add frontend configuration files' },
    { path: 'frontend/*.json', message: 'Add frontend package files' },
    { path: 'backend/functions', message: 'Add backend functions' },
    { path: 'backend/*.json', message: 'Add backend configuration files' },
    { path: 'backend/*.rules', message: 'Add backend rules files' }
  ],
  excludeDirs: ['node_modules', '.git', '.next', 'dist', 'build'],
  excludeFiles: ['.env', '.env.local', '*.log']
};

console.log(`Pushing LorePin project files to ${config.branch} branch...`);

// Helper function to check if a path should be excluded
function shouldExclude(filePath) {
  // Check excluded directories
  for (const dir of config.excludeDirs) {
    if (filePath.includes(`/${dir}/`) || filePath.endsWith(`/${dir}`)) {
      return true;
    }
  }
  
  // Check excluded files
  for (const pattern of config.excludeFiles) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('.', '\\.').replace('*', '.*'));
      if (regex.test(path.basename(filePath))) {
        return true;
      }
    } else if (filePath.endsWith(pattern)) {
      return true;
    }
  }
  
  return false;
}

// Get all files matching a pattern
function getFiles(pattern) {
  const files = [];
  
  if (pattern.includes('*')) {
    // Handle glob patterns
    const dirPath = path.dirname(pattern);
    const filePattern = path.basename(pattern);
    const fullDirPath = path.join(projectRoot, dirPath);
    
    if (fs.existsSync(fullDirPath)) {
      const dirFiles = fs.readdirSync(fullDirPath);
      for (const file of dirFiles) {
        if (filePattern === '*' || filePattern === '*.*' || 
            (filePattern.startsWith('*.') && file.endsWith(filePattern.substring(1)))) {
          const filePath = path.join(dirPath, file);
          const fullPath = path.join(projectRoot, filePath);
          
          if (fs.statSync(fullPath).isFile() && !shouldExclude(filePath)) {
            files.push({
              path: filePath.replace(/\\/g, '/'),
              fullPath: fullPath
            });
          }
        }
      }
    }
  } else {
    // Handle directory paths
    const fullPath = path.join(projectRoot, pattern);
    if (fs.existsSync(fullPath)) {
      const isDirectory = fs.statSync(fullPath).isDirectory();
      
      if (isDirectory) {
        // Get all files in directory recursively
        function traverseDir(dir, baseDir) {
          const entries = fs.readdirSync(dir);
          
          for (const entry of entries) {
            const entryPath = path.join(dir, entry);
            const relativePath = path.relative(projectRoot, entryPath);
            
            if (shouldExclude(relativePath)) {
              continue;
            }
            
            const stat = fs.statSync(entryPath);
            
            if (stat.isDirectory()) {
              traverseDir(entryPath, baseDir);
            } else if (stat.isFile()) {
              files.push({
                path: relativePath.replace(/\\/g, '/'),
                fullPath: entryPath
              });
            }
          }
        }
        
        traverseDir(fullPath, pattern);
      } else {
        // Single file
        const relativePath = path.relative(projectRoot, fullPath);
        if (!shouldExclude(relativePath)) {
          files.push({
            path: relativePath.replace(/\\/g, '/'),
            fullPath: fullPath
          });
        }
      }
    }
  }
  
  return files;
}

// Push files in batches
async function pushFiles(files, message) {
  // Maximum number of files to push in a single batch
  const BATCH_SIZE = 5;
  
  // Process files in batches
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const batchFiles = [];
    
    for (const file of batch) {
      try {
        // Read file content
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
        const batchMessage = `${message} (batch ${Math.floor(i / BATCH_SIZE) + 1})`;
        
        const command = `mcp__push_files --owner="${config.owner}" --repo="${config.repo}" --branch="${config.branch}" --message="${batchMessage}" --files='${filesJson}'`;
        
        execSync(command);
        console.log(`Pushed batch ${Math.floor(i / BATCH_SIZE) + 1} (${batchFiles.length} files)`);
      } catch (error) {
        console.error(`Error pushing batch: ${error.message}`);
      }
    }
  }
}

// Process each directory/pattern
async function processDirectories() {
  for (const dir of config.directories) {
    console.log(`Processing ${dir.path}...`);
    const files = getFiles(dir.path);
    console.log(`Found ${files.length} files in ${dir.path}`);
    
    if (files.length > 0) {
      await pushFiles(files, dir.message);
    }
  }
}

// Run the script
processDirectories()
  .then(() => console.log('Push complete!'))
  .catch(error => console.error(`Error: ${error.message}`));