# Environment Configuration

This document describes the environment configuration for the LorePin project.


This document provides comprehensive instructions for automating CI/CD processes using the MCP Server for the LorePin project, including pulling, pushing, merging, and implementing rollback capabilities.

## Table of Contents

1. [Introduction to MCP Server](#introduction-to-mcp-server)
2. [Setting Up MCP Server Integration](#setting-up-mcp-server-integration)
3. [Automated Code Management](#automated-code-management)
   - [Pulling Code](#pulling-code)
   - [Pushing Code](#pushing-code)
   - [Merging Branches](#merging-branches)
4. [Implementing Rollback Capabilities](#implementing-rollback-capabilities)
5. [Scheduled Automation](#scheduled-automation)
6. [Monitoring and Notifications](#monitoring-and-notifications)
7. [Troubleshooting](#troubleshooting)

## Introduction to MCP Server

MCP (Managed Code Platform) Server is a powerful tool that enables automation of various Git operations and CI/CD processes. It provides a programmatic interface to interact with GitHub repositories, allowing for streamlined workflows and reduced manual intervention.

## Setting Up MCP Server Integration

### Prerequisites

1. MCP Server access credentials
2. GitHub repository access with appropriate permissions
3. Node.js installed (version 18 or higher)

### Installation and Configuration

1. **Install MCP CLI (if not already installed):**

   ```bash
   npm install -g mcp-cli
   ```

2. **Authenticate with MCP Server:**

   ```bash
   mcp login
   ```

3. **Configure Repository Access:**

   ```bash
   mcp config set default.owner fredadun
   mcp config set default.repo LorePinProjectV3
   ```

4. **Verify Connection:**

   ```bash
   mcp__list_commits --owner="fredadun" --repo="LorePinProjectV3" --sha="main"
   ```

## Automated Code Management

### Pulling Code

#### Pull Latest Changes from a Branch

```javascript
// pull-latest.js
const { execSync } = require('child_process');

async function pullLatestChanges(branch = 'development') {
  try {
    // Use MCP Server to get latest commit
    const result = await execSync(`mcp__list_commits --owner="fredadun" --repo="LorePinProjectV3" --sha="${branch}" --perPage=1`);
    console.log(`Latest commit on ${branch}: ${JSON.parse(result).sha}`);
    
    // You can also use this to update local files if needed
    console.log(`Successfully pulled latest changes from ${branch}`);
  } catch (error) {
    console.error(`Error pulling latest changes: ${error.message}`);
  }
}

// Example usage
pullLatestChanges('development');
```

#### Pull Specific Files

```javascript
// pull-specific-files.js
const { execSync } = require('child_process');

async function pullSpecificFile(path, branch = 'development') {
  try {
    const result = await execSync(`mcp__get_file_contents --owner="fredadun" --repo="LorePinProjectV3" --path="${path}" --branch="${branch}"`);
    const fileContent = JSON.parse(result).content;
    console.log(`Successfully pulled ${path} from ${branch}`);
    return fileContent;
  } catch (error) {
    console.error(`Error pulling file ${path}: ${error.message}`);
  }
}

// Example usage
pullSpecificFile('src/components/App.js', 'development');
```

### Pushing Code

#### Push Single File

```javascript
// push-single-file.js
const { execSync } = require('child_process');

async function pushSingleFile(path, content, message, branch = 'development') {
  try {
    // First check if file exists to get SHA (needed for update)
    let sha = '';
    try {
      const fileInfo = await execSync(`mcp__get_file_contents --owner="fredadun" --repo="LorePinProjectV3" --path="${path}" --branch="${branch}"`);
      sha = JSON.parse(fileInfo).sha;
    } catch (error) {
      // File doesn't exist, will be created
    }
    
    // Create or update file
    const command = `mcp__create_or_update_file --owner="fredadun" --repo="LorePinProjectV3" --path="${path}" --content="${content.replace(/"/g, '\\"')}" --message="${message}" --branch="${branch}"${sha ? ` --sha="${sha}"` : ''}`;
    
    await execSync(command);
    console.log(`Successfully pushed ${path} to ${branch}`);
  } catch (error) {
    console.error(`Error pushing file ${path}: ${error.message}`);
  }
}

// Example usage
pushSingleFile(
  'src/components/Feature.js', 
  'export const Feature = () => <div>New Feature</div>;', 
  'Add new feature component',
  'development'
);
```

#### Push Multiple Files

```javascript
// push-multiple-files.js
const { execSync } = require('child_process');

async function pushMultipleFiles(files, message, branch = 'development') {
  try {
    const filesJson = JSON.stringify(files).replace(/"/g, '\\"');
    
    const command = `mcp__push_files --owner="fredadun" --repo="LorePinProjectV3" --branch="${branch}" --message="${message}" --files='${filesJson}'`;
    
    await execSync(command);
    console.log(`Successfully pushed ${files.length} files to ${branch}`);
  } catch (error) {
    console.error(`Error pushing multiple files: ${error.message}`);
  }
}

// Example usage
pushMultipleFiles(
  [
    { path: 'src/components/Header.js', content: 'export const Header = () => <header>LorePin</header>;' },
    { path: 'src/components/Footer.js', content: 'export const Footer = () => <footer>© 2025 LorePin</footer>;' }
  ],
  'Add header and footer components',
  'development'
);
```

### Merging Branches

#### Create Pull Request

```javascript
// create-pr.js
const { execSync } = require('child_process');

async function createPullRequest(head, base, title, body) {
  try {
    const command = `mcp__create_pull_request --owner="fredadun" --repo="LorePinProjectV3" --title="${title}" --body="${body}" --head="${head}" --base="${base}"`;
    
    const result = await execSync(command);
    const prNumber = JSON.parse(result).number;
    console.log(`Successfully created PR #${prNumber} from ${head} to ${base}`);
    return prNumber;
  } catch (error) {
    console.error(`Error creating pull request: ${error.message}`);
  }
}

// Example usage
createPullRequest(
  'development', 
  'test', 
  'Merge development into test', 
  'This PR includes the latest features from the development branch.'
);
```

#### Automated Branch Merging

```javascript
// automated-merge.js
const { execSync } = require('child_process');

async function automatedMerge(head, base) {
  try {
    // 1. Create pull request
    const prCommand = `mcp__create_pull_request --owner="fredadun" --repo="LorePinProjectV3" --title="Automated merge from ${head} to ${base}" --body="Automated merge as part of CI/CD process" --head="${head}" --base="${base}"`;
    
    const prResult = await execSync(prCommand);
    const prNumber = JSON.parse(prResult).number;
    console.log(`Created PR #${prNumber} from ${head} to ${base}`);
    
    // 2. Merge pull request (in a real scenario, you might want to wait for CI checks)
    const mergeCommand = `mcp__merge_pull_request --owner="fredadun" --repo="LorePinProjectV3" --pull_number=${prNumber} --merge_method="merge"`;
    
    await execSync(mergeCommand);
    console.log(`Successfully merged PR #${prNumber}`);
  } catch (error) {
    console.error(`Error in automated merge: ${error.message}`);
  }
}

// Example usage
automatedMerge('development', 'test');
```

## Implementing Rollback Capabilities

### Identify Previous Stable Commit

```javascript
// identify-stable-commit.js
const { execSync } = require('child_process');

async function identifyStableCommit(branch = 'main', count = 10) {
  try {
    const command = `mcp__list_commits --owner="fredadun" --repo="LorePinProjectV3" --sha="${branch}" --perPage=${count}`;
    
    const result = await execSync(command);
    const commits = JSON.parse(result);
    
    console.log(`Last ${count} commits on ${branch}:`);
    commits.forEach((commit, index) => {
      console.log(`${index + 1}. ${commit.sha.substring(0, 7)} - ${commit.commit.message}`);
    });
    
    return commits;
  } catch (error) {
    console.error(`Error identifying stable commit: ${error.message}`);
  }
}

// Example usage
identifyStableCommit('main', 5);
```

### Rollback to Previous Commit

```javascript
// rollback.js
const { execSync } = require('child_process');

async function rollbackToPreviousCommit(commitSha, branch = 'main') {
  try {
    // 1. Create a new branch from the stable commit
    const rollbackBranch = `rollback-${Date.now()}`;
    const createBranchCommand = `mcp__create_branch --owner="fredadun" --repo="LorePinProjectV3" --branch="${rollbackBranch}" --from_branch="${commitSha}"`;
    
    await execSync(createBranchCommand);
    console.log(`Created rollback branch: ${rollbackBranch}`);
    
    // 2. Create a pull request to merge the rollback branch into the target branch
    const prCommand = `mcp__create_pull_request --owner="fredadun" --repo="LorePinProjectV3" --title="ROLLBACK: Revert to commit ${commitSha.substring(0, 7)}" --body="Rolling back to previous stable version due to issues in current deployment." --head="${rollbackBranch}" --base="${branch}"`;
    
    const prResult = await execSync(prCommand);
    const prNumber = JSON.parse(prResult).number;
    console.log(`Created rollback PR #${prNumber}`);
    
    // 3. Merge the pull request (in a real scenario, you might want manual approval)
    const mergeCommand = `mcp__merge_pull_request --owner="fredadun" --repo="LorePinProjectV3" --pull_number=${prNumber} --merge_method="merge"`;
    
    await execSync(mergeCommand);
    console.log(`Successfully rolled back ${branch} to commit ${commitSha.substring(0, 7)}`);
    
    // 4. Create an issue to document the rollback
    const issueCommand = `mcp__create_issue --owner="fredadun" --repo="LorePinProjectV3" --title="Rollback performed to commit ${commitSha.substring(0, 7)}" --body="A rollback was performed on ${branch} to commit ${commitSha} due to issues in the current deployment. Please investigate and fix the issues before redeploying."`;
    
    await execSync(issueCommand);
    console.log('Created documentation issue for the rollback');
  } catch (error) {
    console.error(`Error rolling back: ${error.message}`);
  }
}

// Example usage
rollbackToPreviousCommit('abc1234567890', 'main');
```

### File-Specific Rollback

```javascript
// file-rollback.js
const { execSync } = require('child_process');

async function rollbackSpecificFile(path, commitSha, branch = 'main') {
  try {
    // 1. Get file content from the specific commit
    const fileCommand = `mcp__get_file_contents --owner="fredadun" --repo="LorePinProjectV3" --path="${path}" --branch="${commitSha}"`;
    
    const fileResult = await execSync(fileCommand);
    const fileContent = JSON.parse(fileResult).content;
    
    // 2. Update the file in the current branch
    const updateCommand = `mcp__create_or_update_file --owner="fredadun" --repo="LorePinProjectV3" --path="${path}" --content="${fileContent.replace(/"/g, '\\"')}" --message="ROLLBACK: Revert ${path} to commit ${commitSha.substring(0, 7)}" --branch="${branch}"`;
    
    await execSync(updateCommand);
    console.log(`Successfully rolled back ${path} to version from commit ${commitSha.substring(0, 7)}`);
  } catch (error) {
    console.error(`Error rolling back file: ${error.message}`);
  }
}

// Example usage
rollbackSpecificFile('src/components/Feature.js', 'abc1234567890', 'main');
```

## Scheduled Automation

### Setting Up Scheduled Merges

```javascript
// scheduled-merge.js
const { execSync } = require('child_process');
const cron = require('node-cron');

function scheduledMerge() {
  // Schedule a task to run at 10:00 PM every day
  cron.schedule('0 22 * * *', async () => {
    try {
      console.log('Running scheduled merge...');
      
      // 1. Pull latest changes
      await execSync(`mcp__list_commits --owner="fredadun" --repo="LorePinProjectV3" --sha="development" --perPage=1`);
      
      // 2. Create and merge PR from development to test
      const prCommand = `mcp__create_pull_request --owner="fredadun" --repo="LorePinProjectV3" --title="Scheduled merge from development to test" --body="Automated nightly merge" --head="development" --base="test"`;
      
      const prResult = await execSync(prCommand);
      const prNumber = JSON.parse(prResult).number;
      
      // 3. Merge the PR
      const mergeCommand = `mcp__merge_pull_request --owner="fredadun" --repo="LorePinProjectV3" --pull_number=${prNumber} --merge_method="merge"`;
      
      await execSync(mergeCommand);
      console.log(`Successfully completed scheduled merge, PR #${prNumber}`);
    } catch (error) {
      console.error(`Error in scheduled merge: ${error.message}`);
    }
  });
  
  console.log('Scheduled merge job set up successfully');
}

// Start the scheduled job
scheduledMerge();
```

### Automated Deployment Verification

```javascript
// verify-deployment.js
const { execSync } = require('child_process');
const axios = require('axios');

async function verifyDeployment(environment = 'staging') {
  try {
    const url = environment === 'staging' 
      ? 'https://lorepin-staging.web.app/api/health'
      : 'https://lorepin-prod.web.app/api/health';
    
    console.log(`Verifying deployment at ${url}...`);
    
    // 1. Check if the deployment is accessible
    const response = await axios.get(url);
    
    if (response.status === 200 && response.data.status === 'ok') {
      console.log(`Deployment verification successful for ${environment}`);
      return true;
    } else {
      console.error(`Deployment verification failed for ${environment}: Unexpected response`);
      
      // 2. Create an issue to alert the team
      const issueCommand = `mcp__create_issue --owner="fredadun" --repo="LorePinProjectV3" --title="Deployment verification failed for ${environment}" --body="The deployment verification check failed. Please investigate immediately."`;
      
      await execSync(issueCommand);
      return false;
    }
  } catch (error) {
    console.error(`Error verifying deployment: ${error.message}`);
    
    // Create an issue to alert the team
    const issueCommand = `mcp__create_issue --owner="fredadun" --repo="LorePinProjectV3" --title="Deployment verification failed for ${environment}" --body="The deployment verification check failed with error: ${error.message}. Please investigate immediately."`;
    
    await execSync(issueCommand);
    return false;
  }
}

// Example usage
verifyDeployment('staging');
```

## Monitoring and Notifications

### Setting Up Deployment Notifications

```javascript
// deployment-notifications.js
const { execSync } = require('child_process');

async function notifyDeployment(environment, success, details = '') {
  try {
    // 1. Create a comment on the latest PR
    const prListCommand = `mcp__list_pull_requests --owner="fredadun" --repo="LorePinProjectV3" --state="closed" --sort="updated" --direction="desc" --perPage=1`;
    
    const prResult = await execSync(prListCommand);
    const prNumber = JSON.parse(prResult)[0].number;
    
    const status = success ? '✅ Successful' : '❌ Failed';
    const commentCommand = `mcp__add_issue_comment --owner="fredadun" --repo="LorePinProjectV3" --issue_number=${prNumber} --body="Deployment to ${environment}: ${status}\\n\\n${details}"`;
    
    await execSync(commentCommand);
    console.log(`Added deployment notification to PR #${prNumber}`);
    
    // 2. Create an issue for failed deployments
    if (!success) {
      const issueCommand = `mcp__create_issue --owner="fredadun" --repo="LorePinProjectV3" --title="Deployment to ${environment} failed" --body="Deployment failed with the following details:\\n\\n${details}"`;
      
      await execSync(issueCommand);
      console.log('Created issue for failed deployment');
    }
  } catch (error) {
    console.error(`Error sending deployment notification: ${error.message}`);
  }
}

// Example usage
notifyDeployment('production', true, 'Deployment completed in 2 minutes and 15 seconds');
```

### Monitoring Branch Status

```javascript
// monitor-branches.js
const { execSync } = require('child_process');

async function monitorBranchStatus() {
  try {
    const branches = ['development', 'test', 'main'];
    const results = {};
    
    for (const branch of branches) {
      // Get latest commit
      const commitCommand = `mcp__list_commits --owner="fredadun" --repo="LorePinProjectV3" --sha="${branch}" --perPage=1`;
      const commitResult = await execSync(commitCommand);
      const latestCommit = JSON.parse(commitResult)[0];
      
      // Get workflow runs
      const runsCommand = `mcp__list_workflow_runs --owner="fredadun" --repo="LorePinProjectV3" --branch="${branch}" --status="completed" --perPage=1`;
      const runsResult = await execSync(runsCommand);
      const latestRun = JSON.parse(runsResult).workflow_runs[0];
      
      results[branch] = {
        latestCommit: {
          sha: latestCommit.sha,
          message: latestCommit.commit.message,
          author: latestCommit.commit.author.name,
          date: latestCommit.commit.author.date
        },
        latestWorkflow: latestRun ? {
          status: latestRun.conclusion,
          name: latestRun.name,
          url: latestRun.html_url
        } : null
      };
    }
    
    console.log('Branch Status Report:');
    console.log(JSON.stringify(results, null, 2));
    
    return results;
  } catch (error) {
    console.error(`Error monitoring branch status: ${error.message}`);
  }
}

// Example usage
monitorBranchStatus();
```

## Troubleshooting

### Common Issues and Solutions

1. **Authentication Failures**
   - Ensure your MCP Server credentials are valid
   - Check that your GitHub token has the necessary permissions
   - Try logging out and logging back in: `mcp logout` followed by `mcp login`

2. **Rate Limiting**
   - GitHub API has rate limits that may affect automation
   - Implement exponential backoff for retries
   - Consider using a GitHub App instead of a personal token for higher rate limits

3. **Failed Merges**
   - Check for merge conflicts before attempting automated merges
   - Implement proper error handling to detect and report merge conflicts
   - Consider implementing a pre-merge validation step

4. **Rollback Failures**
   - Ensure the commit you're rolling back to exists and is valid
   - Verify branch protection rules don't prevent force pushes for rollbacks
   - Keep a log of all rollback operations for auditing purposes

### Logging and Debugging

```javascript
// enhanced-logging.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class MCPLogger {
  constructor(logDir = './logs') {
    this.logDir = logDir;
    
    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    this.logFile = path.join(logDir, `mcp-${new Date().toISOString().split('T')[0]}.log`);
  }
  
  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data
    };
    
    const logString = `${JSON.stringify(logEntry)}\n`;
    fs.appendFileSync(this.logFile, logString);
    
    // Also log to console
    console[level.toLowerCase()](message, data ? data : '');
  }
  
  info(message, data = null) {
    this.log('INFO', message, data);
  }
  
  error(message, data = null) {
    this.log('ERROR', message, data);
  }
  
  warn(message, data = null) {
    this.log('WARN', message, data);
  }
  
  async executeCommand(command) {
    this.info(`Executing command: ${command}`);
    
    try {
      const result = await execSync(command);
      this.info('Command executed successfully');
      return result;
    } catch (error) {
      this.error(`Command failed: ${error.message}`, error);
      throw error;
    }
  }
}

// Example usage
const logger = new MCPLogger();
logger.info('Starting MCP automation');

async function safeExecute() {
  try {
    await logger.executeCommand(`mcp__list_commits --owner="fredadun" --repo="LorePinProjectV3" --sha="main" --perPage=1`);
  } catch (error) {
    logger.error('Failed to list commits', error);
  }
}

safeExecute();
```

## Conclusion

This guide provides a comprehensive set of tools and scripts for automating CI/CD processes using the MCP Server. By implementing these automation scripts, you can streamline your development workflow, reduce manual intervention, and ensure consistent deployments across environments.

Remember to adapt these scripts to your specific needs and to implement proper error handling and logging for production use. Regular testing of your automation scripts, especially rollback capabilities, is essential to ensure they work correctly when needed.

For additional assistance or to report issues with the MCP Server integration, please contact the MCP Server support team or create an issue in the LorePin repository.

