# CI/CD Setup Guide for LorePin CMS UI

This guide explains how to set up the CI/CD pipeline for the LorePin CMS UI using GitHub Actions.

## Prerequisites

- GitHub repository with the LorePin CMS UI code
- Firebase projects for development, staging, and production environments
- Firebase CLI installed locally
- Admin access to the GitHub repository

## Setting Up Firebase Service Account Keys

To enable GitHub Actions to deploy to Firebase, you need to create and configure service account keys for each environment.

### Step 1: Generate Firebase Service Account Keys

For each Firebase project (development, staging, production), follow these steps:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Save the JSON file securely (do not commit this to your repository)

### Step 2: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add the following secrets:

   - **FIREBASE_SERVICE_ACCOUNT_DEV**:
     - Name: `FIREBASE_SERVICE_ACCOUNT_DEV`
     - Value: *Paste the entire contents of the development service account JSON file*

   - **FIREBASE_SERVICE_ACCOUNT_STAGING**:
     - Name: `FIREBASE_SERVICE_ACCOUNT_STAGING`
     - Value: *Paste the entire contents of the staging service account JSON file*

   - **FIREBASE_SERVICE_ACCOUNT_PROD**:
     - Name: `FIREBASE_SERVICE_ACCOUNT_PROD`
     - Value: *Paste the entire contents of the production service account JSON file*

## GitHub Actions Workflow

The CI/CD pipeline is defined in the `.github/workflows/ci-cd.yml` file and includes the following jobs:

1. **build-and-test**: Builds the application and runs tests
2. **deploy-dev**: Deploys to the development environment when changes are pushed to the `develop` branch
3. **deploy-staging**: Deploys to the staging environment when changes are pushed to the `main` branch
4. **deploy-production**: Deploys to the production environment after successful deployment to staging

## Deployment Environments

The CI/CD pipeline deploys to the following environments:

- **Development**: When changes are pushed to the `develop` branch
  - Firebase Project: `lorebacking-test`
  - URL: https://lorebacking-test.web.app/cms

- **Staging**: When changes are pushed to the `main` branch
  - Firebase Project: `lorepin-staging`
  - URL: https://lorepin-staging.web.app/cms

- **Production**: After successful deployment to staging
  - Firebase Project: `lorepin-prod`
  - URL: https://lorepin-prod.web.app/cms

## Troubleshooting

### Common Issues

1. **Deployment Failures**:
   - Check the GitHub Actions logs for error messages
   - Verify that the service account keys are correctly configured
   - Ensure the Firebase projects exist and are accessible

2. **Permission Issues**:
   - Make sure the service accounts have the necessary permissions to deploy to Firebase
   - Verify that the GitHub Actions workflow has access to the secrets

3. **Build Failures**:
   - Check for linting or testing errors in the GitHub Actions logs
   - Fix any code issues and push the changes

### Getting Help

If you encounter issues with the CI/CD pipeline, please contact the LorePin development team for assistance. 