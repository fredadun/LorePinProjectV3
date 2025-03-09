# LorePin Project Management Scripts

This directory contains scripts for setting up and managing the project management infrastructure for the LorePin project in GitHub.

## Overview

These scripts automate the setup of:
- GitHub Milestones for sprints
- GitHub Labels for categorizing issues
- GitHub Project Board for tracking progress
- GitHub Issues for user stories and checkpoints

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- GitHub Personal Access Token with repo scope

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in this directory with your GitHub token:
   ```
   GITHUB_TOKEN=your_github_token_here
   ```

## Usage

### Complete Setup

To run the complete setup process:

```bash
npm run setup
```

This will:
1. Create milestones for all sprints
2. Create labels for categorizing issues
3. Create a project board with columns
4. Create issues for all user stories and checkpoints

### Individual Scripts

You can also run each script individually:

```bash
# Create milestones
npm run create-milestones

# Create labels
npm run create-labels

# Create project board
npm run create-project-board

# Create issues
npm run create-issues
```

## Script Details

### create-milestones.js

Creates six milestones representing the sprints for the LorePin project:
- Sprint 1: User Onboarding & Profiles
- Sprint 2: Challenge System (Core)
- Sprint 3: LoreCoins Reward System
- Sprint 4: Content Discovery & Feed
- Sprint 5: Social Features & Sponsor Tools
- Sprint 6: Testing & Launch Prep

### create-labels.js

Creates labels for categorizing issues:
- Priority labels (high, medium, low)
- Type labels (feature, bug, documentation, etc.)
- Component labels (frontend, backend, mobile, etc.)
- Status labels (blocked, in-progress, review, etc.)
- Sprint labels (sprint:1, sprint:2, etc.)

### create-project-board.js

Creates a Kanban-style project board with columns:
- Backlog
- To Do
- In Progress
- Review
- Done

### create-issues.js

Creates GitHub issues for all user stories and checkpoints defined in the Sprint1-UserStories.md through Sprint6-UserStories.md files.

## Customization

You can customize the scripts by modifying the configuration at the top of each file:

```javascript
// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3',
  // Other configuration options...
};
```

## Troubleshooting

### Rate Limiting

If you encounter rate limiting issues, the scripts will output error messages. Wait for the rate limit to reset and try again.

### Authentication Issues

If you see authentication errors, check that:
- Your GitHub token is correct
- Your token has the necessary permissions (repo scope)
- The token is properly set in the .env file

### File Path Issues

If the scripts can't find the user story files, check that the paths in the configuration are correct.

## Next Steps After Setup

After running the setup scripts:

1. **Assign Team Members**: Assign issues to team members based on their roles and expertise.

2. **Schedule Sprints**: Set specific dates for each sprint and update the milestones accordingly.

3. **Conduct Sprint Planning**: Use the SprintPlanningProcess.md guide to conduct the first sprint planning meeting.

4. **Start Development**: Begin working on the issues in the first sprint.

## Maintenance

As the project progresses, you may need to:

- Create new labels for emerging categories
- Adjust milestone dates as schedules change
- Create new issues for additional requirements
- Update the project board structure based on team feedback

# LorePin Project Scripts

This directory contains utility scripts for managing the LorePin project.

## Branch Management Script

The `branch-management.js` script helps manage the workflow between branches (development, test, and main).

### Prerequisites

- Node.js installed
- Git installed and configured
- Repository cloned locally

### Installation

```bash
cd scripts
npm install
```

### Usage

```bash
node branch-management.js <command>
```

### Available Commands

- `sync-to-test`: Sync changes from development to test branch
- `sync-to-main`: Sync changes from test to main branch
- `sync-all`: Sync changes through all branches (development -> test -> main)
- `create-pr`: Create pull requests for branch syncing
- `help`: Show help message

### Examples

```bash
# Sync development to test
node branch-management.js sync-to-test

# Sync test to main
node branch-management.js sync-to-main

# Sync through all branches
node branch-management.js sync-all

# Create pull requests
node branch-management.js create-pr
```

## Workflow Process

The LorePin project uses a simple branching strategy:

1. **Development Branch**: Active development happens here
2. **Test Branch**: For testing and QA
3. **Main Branch**: Production-ready code

The typical workflow is:

1. Make changes in the development branch
2. Create a pull request from development to test
3. After testing and verification, create a pull request from test to main
4. Merge to main for production release

The branch management script helps automate this process.