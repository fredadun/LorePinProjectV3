# LorePin Project Scripts

This directory contains automation scripts for the LorePin project.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your GitHub token:
   ```
   GITHUB_TOKEN=your_github_token_here
   ```

## Available Scripts

### push-project.js

Pushes the entire project to GitHub.

```bash
npm run push-project -- --branch=development
```

### pull-all.js

Pulls all files from a GitHub branch.

```bash
npm run pull-all -- --branch=development
```

### push-all.js

Pushes files from a specified directory to GitHub.

```bash
npm run push-all -- --branch=development --dir=./some-directory
```

### pull-example.js

Pulls specific example files from GitHub.

```bash
npm run pull-example
```

## Notes

- These scripts use the GitHub API via Octokit.
- Make sure your GitHub token has the necessary permissions.
- Files are pulled to a `pulled-files` directory in the project root.
- Large binary files and sensitive information should be excluded from pushes. 