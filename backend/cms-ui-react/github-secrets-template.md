# GitHub Secrets Template for LorePin CMS UI CI/CD

This file contains a template for the GitHub repository secrets required for the CI/CD pipeline.

## Required Secrets

### FIREBASE_SERVICE_ACCOUNT_DEV

**Description**: Firebase service account key for the development environment

**Instructions**: Generate a service account key for the lorebacking-test Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Save the JSON file securely (do not commit this to your repository)
6. Copy the entire contents of the JSON file and paste it as the value for this secret

---

### FIREBASE_SERVICE_ACCOUNT_STAGING

**Description**: Firebase service account key for the staging environment

**Instructions**: Generate a service account key for the lorepin-staging Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Save the JSON file securely (do not commit this to your repository)
6. Copy the entire contents of the JSON file and paste it as the value for this secret

---

### FIREBASE_SERVICE_ACCOUNT_PROD

**Description**: Firebase service account key for the production environment

**Instructions**: Generate a service account key for the lorepin-prod Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Save the JSON file securely (do not commit this to your repository)
6. Copy the entire contents of the JSON file and paste it as the value for this secret

---

## Setting Up Secrets in GitHub

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
