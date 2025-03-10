# LorePin Rollback Procedures

This document outlines the procedures for rolling back the LorePin application to a previous stable version in case of issues with a new deployment.

## Version Tags

The project uses Git tags to mark stable versions of the application. The following tags are available:

- `v0.1.0-cms`: CMS implementation with UI and SQLite compatibility

## Automated Rollback

For convenience, rollback scripts are provided in the root directory of the project. These scripts will:

1. Stop any running Node.js processes
2. Check for uncommitted changes
3. Create a backup of the current state
4. Roll back to the tagged version
5. Restore node_modules if needed
6. Build the backend

### Using the Rollback Scripts

To roll back to a specific version, run the corresponding PowerShell script:

```powershell
# To roll back to v0.1.0-cms
.\rollback-to-v0.1.0-cms.ps1
```

## Manual Rollback

If the automated rollback script doesn't work for any reason, you can manually roll back using Git:

1. Stop any running Node.js processes:
   ```powershell
   Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

2. Commit or stash any uncommitted changes:
   ```bash
   git stash
   ```

3. Check out the desired tag:
   ```bash
   git checkout v0.1.0-cms
   ```

4. Restore dependencies:
   ```bash
   cd backend/functions
   npm install
   cd ../cms-ui
   npm install
   ```

5. Build the backend:
   ```bash
   cd ../functions
   npm run build
   ```

6. Start the CMS UI server:
   ```bash
   cd ../cms-ui
   node server.js
   ```

## Backups

In addition to Git tags, manual backups of the backend are stored in the `backups` directory:

- `backend-v0.1.0-cms.zip`: Backup of the backend at v0.1.0-cms

To restore from a backup:

1. Stop any running Node.js processes
2. Extract the backup ZIP file to a temporary location
3. Copy the contents to the appropriate directory

## Database Rollback

If you need to roll back the database:

1. For SQLite (development):
   - Replace the SQLite database file in `backend/functions/data/lorepin_cms.sqlite` with a backup

2. For PostgreSQL (production):
   - Use the PostgreSQL backup and restore procedures

## Monitoring After Rollback

After rolling back, monitor the application for:

1. Successful server startup
2. Ability to log in and access protected resources
3. Proper functioning of all features

## Reporting Issues

If you encounter issues during or after rollback, please document them in the project issue tracker with:

1. The version you rolled back from
2. The version you rolled back to
3. Any error messages or unexpected behavior
4. Steps to reproduce the issue 