# LorePin CMS UI with React Admin

This is the React Admin implementation of the LorePin CMS UI, which provides a modern and user-friendly interface for managing the LorePin platform.

## Features

- **User Management**: Manage user accounts, roles, and permissions
- **Role Management**: Define and manage roles with specific permissions
- **Moderation Queue**: Review and moderate user-generated content
- **Challenge Management**: Manage challenges submitted by sponsors

## Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher
- Firebase project with Firestore, Authentication, and Functions

## Installation

1. Clone the repository
2. Navigate to the `backend/cms-ui-react` directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file based on the `.env.example` file:

```bash
cp .env.example .env
```

5. Update the `.env` file with your Firebase configuration values.

## Environment Variables

The application uses environment variables to configure Firebase and other settings. These variables are loaded from a `.env` file during the build process.

Required environment variables:

- `REACT_APP_FIREBASE_API_KEY`: Your Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `REACT_APP_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID`: Your Firebase app ID
- `REACT_APP_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID
- `REACT_APP_API_URL`: URL for the CMS API
- `REACT_APP_USE_EMULATORS`: Whether to use Firebase emulators (true/false)

## Development

To start the development server:

```bash
npm start
```

This will start the webpack development server at http://localhost:3002.

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` directory with the compiled application.

## Serving the Production Build

To serve the production build:

```bash
npm run serve
```

This will start an Express server at http://localhost:3002 serving the production build.

## Testing

The application includes a comprehensive test suite using Jest and React Testing Library.

### Running Tests

To run the tests:

```bash
npm test
```

To run the tests in watch mode:

```bash
npm run test:watch
```

To generate a test coverage report:

```bash
npm run test:coverage
```

### Test Structure

- `src/components/__tests__/`: Tests for React components
- `src/providers/__tests__/`: Tests for data and auth providers
- `__mocks__/`: Mock files for testing
- `src/setupTests.js`: Jest setup file

## Linting

The application uses ESLint for code quality and consistency.

### Running Linting

To run the linter:

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npm run lint:fix
```

## Deployment

The application includes a deployment script to automate the deployment process.

### Deployment Environments

- **Development**: The default environment for local development
- **Staging**: A pre-production environment for testing
- **Production**: The live production environment

### Deployment Commands

To deploy to the development environment:

```bash
npm run deploy
```

To deploy to the staging environment:

```bash
npm run deploy:staging
```

To deploy to the production environment:

```bash
npm run deploy:production
```

### Deployment Process

The deployment script performs the following steps:

1. Updates the Firebase configuration based on the environment
2. Builds the application
3. Creates the deployment directory if it doesn't exist
4. Copies the built files to the deployment directory

## CI/CD

The application includes a CI/CD pipeline using GitHub Actions to automate testing and deployment.

### CI/CD Pipeline

The CI/CD pipeline performs the following steps:

1. **Build and Test**: Builds the application and runs tests on every push and pull request
2. **Deploy to Development**: Automatically deploys to the development environment when changes are pushed to the `develop` branch
3. **Deploy to Staging**: Automatically deploys to the staging environment when changes are pushed to the `main` branch
4. **Deploy to Production**: Automatically deploys to the production environment after successful deployment to staging

### GitHub Actions Configuration

The GitHub Actions workflow is defined in `.github/workflows/ci-cd.yml` and includes the following jobs:

- `build-and-test`: Builds the application and runs tests
- `deploy-dev`: Deploys to the development environment
- `deploy-staging`: Deploys to the staging environment
- `deploy-production`: Deploys to the production environment

### Required Secrets

The following secrets need to be configured in the GitHub repository:

- `FIREBASE_SERVICE_ACCOUNT_DEV`: Firebase service account for the development environment
- `FIREBASE_SERVICE_ACCOUNT_STAGING`: Firebase service account for the staging environment
- `FIREBASE_SERVICE_ACCOUNT_PROD`: Firebase service account for the production environment

### Setting Up GitHub Secrets

The CI/CD pipeline requires several GitHub secrets to be configured. To help with this process, a setup script is provided:

```bash
npm run setup:github-secrets
```

This script generates a template file with instructions for creating the required secrets in GitHub. Follow the instructions in the generated file to set up the secrets.

## Versioning

The application follows semantic versioning (SemVer) for version management. A version bumping script is included to automate the versioning process.

### Version Bumping

To bump the version, use one of the following commands:

```bash
# Bump major version (e.g., 1.0.0 -> 2.0.0)
npm run version:major

# Bump minor version (e.g., 1.0.0 -> 1.1.0)
npm run version:minor

# Bump patch version (e.g., 1.0.0 -> 1.0.1)
npm run version:patch
```

You can also include a message to be added to the CHANGELOG.md:

```bash
npm run version:minor "Added new features"
```

The version bumping script performs the following actions:

1. Updates the version in `package.json`
2. Adds a new version entry to `CHANGELOG.md`
3. Creates a git commit with the version bump
4. Creates a git tag for the new version

After running the script, you need to push the changes and tags:

```bash
git push && git push --tags
```

## Firebase Emulators

The application is configured to connect to Firebase emulators when running locally. Make sure the Firebase emulators are running:

```bash
cd backend/functions
firebase emulators:start
```

## Project Structure

- `src/`: Source code
  - `components/`: React components
  - `providers/`: Data providers and auth providers
  - `config/`: Configuration files
  - `theme/`: Custom theme for the application
- `public/`: Static files
- `dist/`: Compiled application (generated)
- `.github/workflows/`: GitHub Actions workflows for CI/CD

## Technologies Used

- React 18.x
- React Admin 4.x
- Firebase 10.x
- Material-UI 5.x
- Jest 29.x
- React Testing Library 14.x
- Webpack 5.x
- Babel 7.x
- Express 4.x
- GitHub Actions for CI/CD

## License

ISC 