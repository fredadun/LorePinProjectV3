# LorePin CMS Deployment Guide

This guide outlines the process for deploying the LorePin CMS to different environments.

## Prerequisites

- Node.js 18 or higher
- Firebase CLI installed and configured
- Git
- Access to the Firebase project

## Deployment Environments

The LorePin CMS can be deployed to the following environments:

- **Development**: Local development environment using SQLite
- **Staging**: Firebase project with test data
- **Production**: Firebase project with production data

## Local Development Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/fredadun/LorePinProjectV3.git
   cd LorePinProjectV3
   ```

2. Install dependencies:
   ```bash
   cd backend/functions
   npm install
   cd ../cms-ui
   npm install
   ```

3. Build the backend:
   ```bash
   cd ../functions
   npm run build
   ```

4. Start the CMS UI server:
   ```bash
   cd ../cms-ui
   node server.js
   ```

5. Access the CMS UI at http://localhost:3001

## Firebase Deployment

### Deploying Functions

1. Build the functions:
   ```bash
   cd backend/functions
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy --only functions
   ```

   To deploy a specific function:
   ```bash
   firebase deploy --only functions:cms
   ```

### Deploying the CMS UI

1. Build the CMS UI:
   ```bash
   cd backend/cms-ui
   # If using a build step (e.g., with React)
   npm run build
   ```

2. Deploy to Firebase Hosting:
   ```bash
   firebase deploy --only hosting:cms
   ```

## Version Control and Rollback

The project uses Git tags to mark stable versions of the application. See the [Rollback Procedures](./rollback-procedures.md) document for details on how to roll back to a previous version.

## Database Configuration

### SQLite (Development)

The SQLite database is configured in `backend/functions/src/cms/utils/database.config.ts`. The database file is stored in `backend/functions/data/lorepin_cms.sqlite`.

### PostgreSQL (Production)

To configure PostgreSQL for production:

1. Set up the Firebase Functions configuration:
   ```bash
   firebase functions:config:set postgres.host="your-postgres-host" postgres.port="5432" postgres.user="postgres" postgres.password="your-postgres-password" postgres.database="lorepin_cms"
   ```

2. Update the database configuration in `backend/functions/src/cms/utils/database.config.ts` to use PostgreSQL.

3. Deploy the functions:
   ```bash
   firebase deploy --only functions
   ```

## Monitoring and Logs

### Firebase Functions Logs

To view the Firebase Functions logs:

```bash
firebase functions:log
```

### CMS UI Logs

The CMS UI logs are output to the console when running the server.

## Troubleshooting

### Common Issues

1. **Firebase Functions Deployment Fails**:
   - Check the Firebase Functions logs for errors
   - Ensure the Firebase CLI is properly configured
   - Verify that the Firebase project exists and you have access to it

2. **Database Connection Issues**:
   - Check the database configuration
   - Verify that the database server is running
   - Ensure the database credentials are correct

3. **CMS UI Connection Issues**:
   - Check the Firebase configuration in `backend/cms-ui/app.js`
   - Verify that the Firebase project exists and you have access to it
   - Ensure the API key is correct

### Getting Help

If you encounter issues that are not covered in this guide, please:

1. Check the Firebase documentation
2. Search the project issue tracker
3. Create a new issue with detailed information about the problem 