# LorePin MCP Server Automation Scripts

This directory contains scripts for automating CI/CD processes using the MCP Server for the LorePin project. These scripts provide functionality for pulling, pushing, merging, and implementing rollback capabilities.

## Setup

1. Install dependencies:

```bash
cd scripts
npm install
```

2. Ensure you have MCP Server access and are authenticated:

```bash
npm install -g mcp-cli
mcp login
```

## Available Commands

### Basic Operations

#### Pull Latest Changes

Pull the latest changes from a branch:

```bash
npm run pull -- --branch=development
```

#### Push Changes

Push changes to a file:

```bash
npm run push -- --path=src/components/Feature.js --content="export default () => <div>Feature</div>" --message="Add feature component" --branch=development
```

#### Create and Merge Pull Requests

Create a pull request:

```bash
npm run merge -- --head=development --base=test --title="Merge development to test" --body="Regular merge"
```

To automatically merge the pull request after creation:

```bash
npm run merge -- --head=development --base=test --title="Merge development to test" --body="Regular merge" --autoMerge=true
```

#### Rollback Capabilities

Rollback an entire branch to a previous commit:

```bash
npm run rollback -- --commit=abc1234 --branch=main --reason="Performance issues in latest deployment"
```

Rollback a specific file to a previous version:

```bash
npm run rollback-file -- --path=src/components/Feature.js --commit=abc1234 --branch=main
```

#### Monitoring

Monitor the status of branches:

```bash
npm run monitor
```

Monitor specific branches:

```bash
npm run monitor -- --branches=development,test,main
```

#### Deployment Verification

Verify a deployment:

```bash
npm run verify -- --env=staging
```

### Bulk Operations

#### Pull All Files

Pull all files from a branch to a local directory:

```bash
npm run pull-all -- --branch=development --output=../local-copy
```

#### Push All Files

Push all files from a local directory to a branch:

```bash
npm run push-all -- --source=../my-code --branch=development --message="Update all project files"
```

#### Sync Branches

Sync all code from one branch to another:

```bash
npm run sync-branches -- --source=main --target=development
```

## Scheduled Automation

For scheduled automation, you can set up cron jobs or use a CI/CD platform to run these scripts at specific intervals.

Example crontab entry to merge development to test every night at 10 PM:

```
0 22 * * * cd /path/to/LorePinProjectV3/scripts && npm run merge -- --head=development --base=test --title="Nightly merge" --body="Automated nightly merge" --autoMerge=true
```

## Logging

All operations are logged to the `logs` directory. Each day gets its own log file in JSON format.

## Advanced Usage

For more advanced usage and customization, you can modify the `mcp-automation.js` script or create new scripts that import its functionality.

## Documentation

For more detailed information about MCP Server automation, refer to the [MCPServerAutomation.md](../Docs/MCPServerAutomation.md) document in the Docs directory.

## Troubleshooting

If you encounter issues:

1. Check the log files in the `logs` directory
2. Ensure you're properly authenticated with MCP Server
3. Verify that your GitHub token has the necessary permissions
4. Check for rate limiting issues with the GitHub API

## Security Considerations

- Never commit MCP Server credentials or GitHub tokens to the repository
- Use environment variables or secure credential storage for sensitive information
- Implement proper access controls for automated scripts that can modify the repository