#!/usr/bin/env node

/**
 * Version bumping script for LorePin CMS UI
 * 
 * This script bumps the version in package.json and updates the CHANGELOG.md file
 * with a new version entry.
 * 
 * Usage:
 *   node scripts/bump-version.js <version-type> [version-message]
 * 
 * Where:
 *   <version-type> is one of: major, minor, patch
 *   [version-message] is an optional message to include in the CHANGELOG
 * 
 * Example:
 *   node scripts/bump-version.js minor "Added new features"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the version type from the command line arguments
const versionType = process.argv[2];
const versionMessage = process.argv.slice(3).join(' ');

// Validate the version type
if (!['major', 'minor', 'patch'].includes(versionType)) {
  console.error('Error: Version type must be one of: major, minor, patch');
  process.exit(1);
}

// Get the current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

// Read the package.json file
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get the current version
const currentVersion = packageJson.version;
console.log(`Current version: ${currentVersion}`);

// Split the version into major, minor, and patch
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Calculate the new version
let newVersion;
switch (versionType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

console.log(`New version: ${newVersion}`);

// Update the package.json file
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

// Read the CHANGELOG.md file
const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
const changelog = fs.readFileSync(changelogPath, 'utf8');

// Create a new version entry
const newVersionEntry = `## [${newVersion}] - ${currentDate}

### Added

- ${versionMessage || 'New version'}

`;

// Insert the new version entry after the header
const updatedChangelog = changelog.replace(
  '# Changelog\n\nAll notable changes to the LorePin CMS UI will be documented in this file.\n\n',
  `# Changelog\n\nAll notable changes to the LorePin CMS UI will be documented in this file.\n\n${newVersionEntry}`
);

// Write the updated CHANGELOG.md file
fs.writeFileSync(changelogPath, updatedChangelog);

console.log(`Updated CHANGELOG.md with version ${newVersion}`);

// Create a git commit with the version bump
try {
  execSync(`git add package.json CHANGELOG.md`);
  execSync(`git commit -m "Bump version to ${newVersion}"`);
  console.log(`Created git commit for version ${newVersion}`);
} catch (error) {
  console.error('Error creating git commit:', error.message);
}

// Create a git tag for the new version
try {
  execSync(`git tag -a v${newVersion} -m "Version ${newVersion}"`);
  console.log(`Created git tag v${newVersion}`);
} catch (error) {
  console.error('Error creating git tag:', error.message);
}

console.log(`Version bumped to ${newVersion}`);
console.log('To push the changes and tag, run:');
console.log(`  git push && git push --tags`); 