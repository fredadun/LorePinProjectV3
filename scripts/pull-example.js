/**
 * Example script demonstrating how to pull files from GitHub using MCP Server
 * Usage: node pull-example.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3',
  branch: 'development',
  outputDir: path.join(__dirname, 'pulled-files'),
  filesToPull: [
    'frontend/src/components/ui/button.tsx',
    'backend/functions/src/index.ts'
  ]
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

console.log(`Pulling files from ${config.branch} branch...`);

// Pull a specific file
async function pullFile(filePath) {
  try {
    console.log(`Pulling ${filePath}...`);
    
    const command = `mcp__get_file_contents --owner="${config.owner}" --repo="${config.repo}" --path="${filePath}" --branch="${config.branch}"`;
    
    const result = execSync(command).toString();
    const fileData = JSON.parse(result);
    const fileContent = fileData.content;
    
    // Create directory structure if needed
    const outputPath = path.join(config.outputDir, filePath);
    const dirName = path.dirname(outputPath);
    
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(outputPath, fileContent);
    console.log(`Successfully pulled ${filePath} to ${outputPath}`);
    
    return fileContent;
  } catch (error) {
    console.error(`Error pulling file ${filePath}: ${error.message}`);
    return null;
  }
}

// Pull all files
async function pullAllFiles() {
  for (const filePath of config.filesToPull) {
    await pullFile(filePath);
  }
  console.log('All files pulled successfully!');
}

// Run the script
pullAllFiles();