# LorePin CI/CD Pipelines

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) pipelines set up for the LorePin project.

## Overview

The LorePin project uses GitHub Actions for automating the build, test, and deployment processes. We have separate workflows for:

1. Development environment (development branch)
2. Test environment (test branch)
3. Production environment (main branch)
4. Mobile application (Flutter)
5. Firebase Cloud Functions

## Workflow Descriptions

### Development Workflow

**File:** `.github/workflows/development.yml`

This workflow runs on pushes and pull requests to the development branch. It:
- Sets up Node.js
- Installs dependencies
- Runs linting
- Performs type checking
- Runs tests
- Builds the project

This workflow does not deploy to any environment but ensures code quality before merging to the test branch.

### Test Workflow

**File:** `.github/workflows/test.yml`

This workflow runs on pushes to the test branch. It:
- Performs all the steps in the development workflow
- Deploys to Firebase Staging environment

This allows for testing in a staging environment that mirrors production.

### Production Workflow

**File:** `.github/workflows/main.yml`

This workflow runs on pushes to the main branch. It:
- Performs all the steps in the development workflow
- Deploys to Firebase Production environment

This is the final step in the deployment process, making changes live to end users.

### Mobile Workflow

**File:** `.github/workflows/mobile.yml`

This workflow runs on pushes and pull requests to any branch when changes are made to the mobile directory. It:
- Sets up Flutter
- Installs dependencies
- Analyzes the project
- Runs tests
- Builds an APK
- Uploads the APK as an artifact

Future enhancements will include iOS builds and deployment to app stores.

### Firebase Functions Workflow

**File:** `.github/workflows/functions.yml`

This workflow runs on pushes and pull requests to any branch when changes are made to the functions directory. It:
- Sets up Node.js
- Installs dependencies
- Runs linting
- Runs tests
- Builds the functions
- Deploys to Firebase Staging (for test branch)
- Deploys to Firebase Production (for main branch)

## Environment Secrets

The following secrets need to be set up in the GitHub repository:

1. `FIREBASE_SERVICE_ACCOUNT_STAGING`: Firebase service account JSON for staging
2. `FIREBASE_SERVICE_ACCOUNT_PROD`: Firebase service account JSON for production
3. `FIREBASE_TOKEN`: Firebase CLI token for deployment

## Deployment Process

### Web Application

The web application is deployed to Firebase Hosting:
- Staging: `lorepin-staging.web.app`
- Production: `lorepin-prod.web.app`

### Mobile Application

The mobile application builds are currently available as artifacts in GitHub Actions. Future enhancements will include:
- Deployment to Google Play Store
- Deployment to Apple App Store
- Beta distribution via Firebase App Distribution

### Firebase Functions

Firebase Functions are deployed to:
- Staging: `lorepin-staging` project
- Production: `lorepin-prod` project

## Adding New Workflows

When adding new workflows:
1. Create a new YAML file in the `.github/workflows` directory
2. Define the trigger events (push, pull_request, etc.)
3. Define the jobs and steps
4. Test the workflow by pushing to the appropriate branch

## Troubleshooting

If a workflow fails:
1. Check the GitHub Actions logs for error messages
2. Verify that all required secrets are set up
3. Ensure that the Firebase projects are properly configured
4. Check that the correct Node.js and Flutter versions are being used