# LorePin Project Scripts

This directory contains automation scripts for the LorePin project to help with GitHub repository management.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the `scripts` directory with your GitHub token:
   ```
   GITHUB_TOKEN=your_github_token_here
   ```

## Available Scripts

### Push Scripts

- **push-project.js**: Push the entire project structure to GitHub
  ```bash
  npm run push-project -- --branch=development
  ```

- **push-all.js**: Push all files in a specified directory
  ```bash
  npm run push-all
  ```

- **push-single-file.js**: Push a single file to GitHub
  ```bash
  node push-single-file.js path/to/file.js
  ```

### Pull Scripts

- **pull-all.js**: Pull all files from the repository
  ```bash
  npm run pull-all -- --branch=development
  ```

- **pull-example.js**: Pull specific example files
  ```bash
  npm run pull-example
  ```

### Repository Management

- **check-repo-structure.js**: Check the repository structure for issues
  ```bash
  npm run check-repo
  ```

- **sync-branches.js**: Synchronize branches (e.g., development to main)
  ```bash
  npm run sync-branches
  ```

### Shell Scripts

- **check-sensitive-files.sh**: Check for sensitive files before committing
- **checkout-dev.sh**: Checkout the development branch
- **commit-changes.sh**: Commit changes with a message
- **feature-branch.sh**: Create a new feature branch
- **git-aliases.sh**: Set up Git aliases
- **init-repo.sh**: Initialize the repository
- **setup-scripts.sh**: Set up the scripts environment
- **update-code.sh**: Update code from the remote repository

## Path Handling

All scripts have been updated to handle Windows backslashes correctly by converting them to forward slashes when pushing to GitHub:

```javascript
path: filePath.replace(/\\\\/g, '/') // Convert Windows backslashes to forward slashes
```

## Security

- Never hardcode GitHub tokens in scripts
- Always use environment variables for sensitive information
- The `.env` file is excluded from being pushed to GitHub

## Troubleshooting

If you encounter GitHub API rate limits:
1. Make sure you're using a personal access token with appropriate permissions
2. Add delays between API calls (most scripts already include this)
3. Consider using conditional requests with ETags

For authentication issues:
1. Check that your `.env` file exists and contains a valid token
2. Ensure the token has the necessary permissions (repo scope)
3. Verify the token hasn't expired

## Contributing

When adding new scripts:
1. Follow the existing pattern for error handling and logging
2. Add documentation in this README
3. Update the package.json scripts section if needed