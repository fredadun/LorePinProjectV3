# GitHub Actions Setup for LorePin Project

This document explains the GitHub Actions workflows set up for the LorePin project and how to troubleshoot common issues.

## Available Workflows

We have set up multiple GitHub Actions workflows to handle different scenarios:

1. **build-and-deploy.yml**: The main workflow that attempts to build and deploy the project
2. **custom-build.yml**: A custom workflow that creates a package-lock.json file before installing dependencies
3. **simple-build.yml**: A minimal workflow that skips dependency installation completely

## Troubleshooting Common Issues

### Dependencies Lock File Not Found

If you encounter this error:
```
Error: Dependencies lock file is not found in /home/runner/work/LorePinProjectV3/LorePinProjectV3. Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
```

This means GitHub Actions is looking for a dependency lock file but can't find one. We've addressed this by:

1. Adding multiple lock files to the repository:
   - package-lock.json
   - yarn.lock
   - npm-shrinkwrap.json

2. Creating custom workflows that either:
   - Generate a lock file before installing dependencies
   - Skip dependency installation completely

### Fixing the Issue

If the issue persists, try one of these solutions:

1. **Use the simple-build.yml workflow**:
   - This workflow skips dependency installation completely
   - It's useful for projects that don't need to build anything yet

2. **Generate a proper lock file locally**:
   - Run `npm install` locally to generate a proper package-lock.json
   - Commit and push the generated package-lock.json

3. **Modify the workflow file**:
   - Remove the cache option from the Node.js setup step
   - Add a step to generate a lock file before installing dependencies

## Setting Up Firebase Deployment

To enable Firebase deployment:

1. Generate a Firebase token:
   ```bash
   firebase login:ci
   ```

2. Add the token to GitHub repository secrets:
   - Go to your repository on GitHub
   - Click on "Settings" > "Secrets and variables" > "Actions"
   - Click "New repository secret"
   - Name: `FIREBASE_TOKEN`
   - Value: Your Firebase CLI token

3. Configure Firebase project:
   - Create a `firebase.json` file in your repository root
   - Set up your Firebase hosting configuration

## Recommended Workflow

For most projects, we recommend using the **custom-build.yml** workflow, which:

1. Creates a package-lock.json file if it doesn't exist
2. Installs dependencies
3. Runs lint, type check, test, and build steps
4. Deploys to Firebase Staging (if on the development branch)

## Manual Trigger

You can manually trigger any workflow from the GitHub Actions tab:

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. Select the workflow you want to run
4. Click "Run workflow"
5. Select the branch and click "Run workflow"