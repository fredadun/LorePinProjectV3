# LorePin CI/CD Pipelines

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipelines set up for the LorePin project.

## Overview

The LorePin project uses GitHub Actions for CI/CD. The workflows are defined in the `.github/workflows` directory and are triggered based on specific events, such as pushing to a branch or creating a pull request.

## Workflows

### Development Workflow

**File:** `.github/workflows/development.yml`

**Triggers:**
- Push to the `development` branch
- Pull request to the `development` branch

**Jobs:**
- Build: Installs dependencies, runs linting, type checking, tests, and builds the application

### Test Workflow

**File:** `.github/workflows/test.yml`

**Triggers:**
- Push to the `test` branch
- Pull request to the `test` branch

**Jobs:**
- Build and Deploy: Installs dependencies, runs linting, type checking, tests, builds the application, and deploys to Firebase Staging

### Production Workflow

**File:** `.github/workflows/main.yml`

**Triggers:**
- Push to the `main` branch

**Jobs:**
- Build and Deploy: Installs dependencies, runs linting, type checking, tests, builds the application, and deploys to Firebase Production

### Mobile Workflow

**File:** `.github/workflows/mobile.yml`

**Triggers:**
- Push to the `development`, `test`, or `main` branch with changes in the `mobile` directory
- Pull request to the `development`, `test`, or `main` branch with changes in the `mobile` directory

**Jobs:**
- Build: Installs Flutter dependencies, runs analysis, tests, and builds an APK for release (only on the `main` branch)

### Firebase Functions Workflow

**File:** `.github/workflows/functions.yml`

**Triggers:**
- Push to the `development`, `test`, or `main` branch with changes in the `backend/functions` directory
- Pull request to the `development`, `test`, or `main` branch with changes in the `backend/functions` directory

**Jobs:**
- Build: Installs dependencies, runs linting, tests, builds the functions, and deploys to Firebase Functions (only on the `test` and `main` branches)

## Environment Secrets

The following secrets need to be set up in the GitHub repository:

- `FIREBASE_SERVICE_ACCOUNT_STAGING`: Firebase service account JSON for staging
- `FIREBASE_SERVICE_ACCOUNT_PROD`: Firebase service account JSON for production
- `FIREBASE_TOKEN`: Firebase CLI token for deployment

## Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click on "New repository secret"
4. Add the required secrets

## Deployment Process

### Web Application

1. Changes are pushed to the `development` branch and tested
2. A pull request is created to merge changes from `development` to `test`
3. Once the pull request is approved and merged, the changes are deployed to the staging environment
4. A pull request is created to merge changes from `test` to `main`
5. Once the pull request is approved and merged, the changes are deployed to the production environment

### Mobile Application

1. Changes are pushed to the `development` branch and tested
2. A pull request is created to merge changes from `development` to `test`
3. Once the pull request is approved and merged, the changes are tested in the staging environment
4. A pull request is created to merge changes from `test` to `main`
5. Once the pull request is approved and merged, an APK is built and uploaded as an artifact

### Firebase Functions

1. Changes are pushed to the `development` branch and tested
2. A pull request is created to merge changes from `development` to `test`
3. Once the pull request is approved and merged, the functions are deployed to the staging environment
4. A pull request is created to merge changes from `test` to `main`
5. Once the pull request is approved and merged, the functions are deployed to the production environment