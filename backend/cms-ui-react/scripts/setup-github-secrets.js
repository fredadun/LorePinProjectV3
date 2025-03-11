#!/usr/bin/env node

/**
 * GitHub Secrets Setup Script for LorePin CMS UI CI/CD
 * 
 * This script helps with setting up the GitHub repository secrets for the CI/CD pipeline.
 * It generates a template for the GitHub secrets and provides instructions for setting them up.
 * 
 * Usage:
 *   node scripts/setup-github-secrets.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the secrets template
const secretsTemplate = {
  FIREBASE_SERVICE_ACCOUNT_DEV: {
    description: 'Firebase service account key for the development environment',
    instructions: 'Generate a service account key for the lorebacking-test Firebase project'
  },
  FIREBASE_SERVICE_ACCOUNT_STAGING: {
    description: 'Firebase service account key for the staging environment',
    instructions: 'Generate a service account key for the lorepin-staging Firebase project'
  },
  FIREBASE_SERVICE_ACCOUNT_PROD: {
    description: 'Firebase service account key for the production environment',
    instructions: 'Generate a service account key for the lorepin-prod Firebase project'
  }
};

// Generate the secrets template file
const outputFile = path.join(__dirname, '..', 'github-secrets-template.md');

let content = `# GitHub Secrets Template for LorePin CMS UI CI/CD

This file contains a template for the GitHub repository secrets required for the CI/CD pipeline.

## Required Secrets

`;

// Add each secret to the template
Object.entries(secretsTemplate).forEach(([key, value]) => {
  content += `### ${key}

**Description**: ${value.description}

**Instructions**: ${value.instructions}

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Save the JSON file securely (do not commit this to your repository)
6. Copy the entire contents of the JSON file and paste it as the value for this secret

---

`;
});

// Add instructions for setting up the secrets in GitHub
content += `## Setting Up Secrets in GitHub

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each of the secrets listed above with the appropriate values

## Verifying the Secrets

After setting up the secrets, you can verify that they are correctly configured by:

1. Going to the GitHub Actions tab in your repository
2. Checking the logs of the most recent workflow run
3. Verifying that the workflow is able to access the secrets and deploy to Firebase

## Troubleshooting

If you encounter issues with the secrets:

1. Make sure the service account keys are correctly formatted JSON
2. Verify that the service accounts have the necessary permissions to deploy to Firebase
3. Check the GitHub Actions logs for error messages related to the secrets

For more information, see the [CI/CD Setup Guide](../docs/ci-cd-setup.md).
`;

// Write the template to a file
fs.writeFileSync(outputFile, content);

console.log(`GitHub secrets template generated at: ${outputFile}`);
console.log('Follow the instructions in the template to set up the GitHub repository secrets.');

// Try to open the file in the default editor
try {
  if (process.platform === 'win32') {
    execSync(`start ${outputFile}`);
  } else if (process.platform === 'darwin') {
    execSync(`open ${outputFile}`);
  } else {
    execSync(`xdg-open ${outputFile}`);
  }
} catch (error) {
  console.log(`Could not open the file automatically. Please open it manually.`);
} 