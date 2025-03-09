# GitHub Workflow & Project Management Guide for LorePin

This document provides instructions for setting up and managing the LorePin project using GitHub, MCP server integration, CI/CD pipelines, and Agile methodology.

## Table of Contents

1. [Branch Structure Setup](#branch-structure-setup)
2. [Version Control Workflow](#version-control-workflow)
3. [CI/CD Pipeline Configuration](#cicd-pipeline-configuration)
4. [Project Management Setup](#project-management-setup)
5. [Agile Methodology Implementation](#agile-methodology-implementation)
6. [Code Memory & Context Management](#code-memory--context-management)

## Branch Structure Setup

### Creating the Three-Branch Structure

The LorePin project uses a three-branch structure: Main (Production), Test (Staging), and Development.

**Instructions:**

1. **Access MCP Server CLI**:
   ```bash
   # Log in to MCP server
   mcp login
   ```

2. **Create Main Branch**:
   ```bash
   # Create main branch (if not already existing)
   mcp__create_branch --owner="lorepin-org" --repo="lorepin" --branch="main"
   ```

3. **Create Test Branch**:
   ```bash
   # Create test branch from main
   mcp__create_branch --owner="lorepin-org" --repo="lorepin" --branch="test" --from_branch="main"
   ```

4. **Create Development Branch**:
   ```bash
   # Create development branch from test
   mcp__create_branch --owner="lorepin-org" --repo="lorepin" --branch="development" --from_branch="test"
   ```

### Branch Protection Rules

Set up branch protection rules to ensure code quality and prevent accidental changes.

**Instructions:**

1. Navigate to your GitHub repository
2. Go to Settings > Branches
3. Add branch protection rules for each branch:

   **Main Branch**:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Require signed commits
   - Include administrators
   - Restrict who can push to matching branches (limit to release managers)

   **Test Branch**:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Allow force pushes (for rollbacks if necessary)

   **Development Branch**:
   - Require status checks to pass before merging
   - Allow force pushes

## Version Control Workflow

### Regular Check-ins at Checkpoints

**Instructions:**

1. **Commit Changes Locally**:
   ```bash
   # Stage changes
   git add .
   
   # Commit with descriptive message
   git commit -m "CP-123: Implement feature X with Y improvements"
   ```

2. **Push to Development Branch**:
   ```bash
   git push origin development
   ```

3. **Using MCP Server for Check-ins**:
   ```bash
   # Check in multiple files at once with MCP
   mcp__push_files --owner="lorepin-org" --repo="lorepin" --branch="development" --message="CP-123: Implement feature X" --files='[{"path": "src/components/feature-x.tsx", "content": "..."}, {"path": "src/styles/feature-x.css", "content": "..."}]'
   ```

4. **Create Pull Request for Feature Completion**:
   ```bash
   # Create PR from development to test
   mcp__create_pull_request --owner="lorepin-org" --repo="lorepin" --title="Feature X Implementation" --body="Completes checkpoint CP-123" --head="development" --base="test"
   ```

### Rollback Procedures

**Instructions:**

1. **Identify Commit to Rollback To**:
   ```bash
   # List recent commits
   mcp__list_commits --owner="lorepin-org" --repo="lorepin" --sha="development"
   ```

2. **Perform Rollback**:
   ```bash
   # Option 1: Revert specific commit
   git revert <commit-hash>
   git push origin development
   
   # Option 2: Reset branch to specific commit (force push required)
   git reset --hard <commit-hash>
   git push --force origin development
   
   # Option 3: Using MCP server
   # First get the file content at the desired commit
   old_content=$(mcp__get_file_contents --owner="lorepin-org" --repo="lorepin" --path="path/to/file.tsx" --branch="<commit-hash>")
   
   # Then update the file with the old content
   mcp__create_or_update_file --owner="lorepin-org" --repo="lorepin" --path="path/to/file.tsx" --content="$old_content" --message="Rollback to previous version" --branch="development"
   ```

3. **Document Rollback**:
   ```bash
   # Create issue documenting the rollback
   mcp__create_issue --owner="lorepin-org" --repo="lorepin" --title="Rollback: Feature X (CP-123)" --body="Rolled back due to [reason]. Reverted to commit <commit-hash>."
   ```

## CI/CD Pipeline Configuration

### Setting Up GitHub Actions

**Instructions:**

1. **Create Workflow Directory**:
   ```bash
   mkdir -p .github/workflows
   ```

2. **Create Development Workflow**:
   Create `.github/workflows/development.yml`:
   ```yaml
   name: Development CI

   on:
     push:
       branches: [ development ]
     pull_request:
       branches: [ development ]

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         - name: Install dependencies
           run: npm ci
         - name: Lint
           run: npm run lint
         - name: Type check
           run: npm run type-check
         - name: Test
           run: npm test
         - name: Build
           run: npm run build
   ```

3. **Create Test Workflow**:
   Create `.github/workflows/test.yml`:
   ```yaml
   name: Test CI/CD

   on:
     push:
       branches: [ test ]
     pull_request:
       branches: [ test ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         - name: Install dependencies
           run: npm ci
         - name: Lint
           run: npm run lint
         - name: Type check
           run: npm run type-check
         - name: Test
           run: npm test
         - name: Build
           run: npm run build
         - name: Deploy to Firebase Staging
           uses: FirebaseExtended/action-hosting-deploy@v0
           with:
             repoToken: '${{ secrets.GITHUB_TOKEN }}'
             firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_STAGING }}'
             projectId: lorepin-staging
             channelId: live
   ```

4. **Create Production Workflow**:
   Create `.github/workflows/main.yml`:
   ```yaml
   name: Production CI/CD

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         - name: Install dependencies
           run: npm ci
         - name: Lint
           run: npm run lint
         - name: Type check
           run: npm run type-check
         - name: Test
           run: npm test
         - name: Build
           run: npm run build
         - name: Deploy to Firebase Production
           uses: FirebaseExtended/action-hosting-deploy@v0
           with:
             repoToken: '${{ secrets.GITHUB_TOKEN }}'
             firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_PROD }}'
             projectId: lorepin-prod
             channelId: live
   ```

5. **Push Workflows to Repository**:
   ```bash
   git add .github/workflows
   git commit -m "Add CI/CD workflows"
   git push origin development
   ```

### Setting Up Environment Secrets

**Instructions:**

1. Navigate to your GitHub repository
2. Go to Settings > Secrets and variables > Actions
3. Add the following secrets:
   - `FIREBASE_SERVICE_ACCOUNT_STAGING`: Firebase service account JSON for staging
   - `FIREBASE_SERVICE_ACCOUNT_PROD`: Firebase service account JSON for production

## Project Management Setup

### GitHub Projects Configuration

**Instructions:**

1. **Create Project Board**:
   - Go to your GitHub organization or repository
   - Navigate to Projects tab
   - Click "New project"
   - Select "Board" template
   - Name it "LorePin Development"

2. **Configure Columns**:
   - Backlog
   - Sprint Backlog
   - In Progress
   - Review
   - Testing
   - Done

3. **Enable Automation**:
   - New issues added to Backlog
   - Newly assigned issues moved to Sprint Backlog
   - Pull requests in progress moved to In Progress
   - Pull requests in review moved to Review
   - Closed issues moved to Done

### Issue Templates

**Instructions:**

1. **Create Issue Template Directory**:
   ```bash
   mkdir -p .github/ISSUE_TEMPLATE
   ```

2. **Create Feature Request Template**:
   Create `.github/ISSUE_TEMPLATE/feature_request.md`:
   ```markdown
   ---
   name: Feature request
   about: Suggest a new feature for LorePin
   title: '[FEATURE] '
   labels: enhancement
   assignees: ''
   ---

   ## User Story
   As a [type of user], I want [goal] so that [benefit].

   ## Acceptance Criteria
   - [ ] Criterion 1
   - [ ] Criterion 2
   - [ ] Criterion 3

   ## Technical Notes
   Any technical considerations or implementation details.

   ## Design References
   Links to design files or mockups.

   ## Story Points
   Estimated effort (1, 2, 3, 5, 8, 13)
   ```

3. **Create Bug Report Template**:
   Create `.github/ISSUE_TEMPLATE/bug_report.md`:
   ```markdown
   ---
   name: Bug report
   about: Report a bug in LorePin
   title: '[BUG] '
   labels: bug
   assignees: ''
   ---

   ## Description
   A clear description of the bug.

   ## Steps to Reproduce
   1. Go to '...'
   2. Click on '....'
   3. Scroll down to '....'
   4. See error

   ## Expected Behavior
   What you expected to happen.

   ## Actual Behavior
   What actually happened.

   ## Screenshots
   If applicable, add screenshots.

   ## Environment
   - Device: [e.g. iPhone 13, Desktop]
   - OS: [e.g. iOS 16, Windows 11]
   - Browser: [e.g. Chrome 108]
   - Version: [e.g. 0.1.0]

   ## Possible Solution
   If you have suggestions on how to fix the issue.
   ```

4. **Push Templates to Repository**:
   ```bash
   git add .github/ISSUE_TEMPLATE
   git commit -m "Add issue templates"
   git push origin development
   ```

## Agile Methodology Implementation

### Sprint Planning

**Instructions:**

1. **Create Sprint Milestone**:
   - Go to your GitHub repository
   - Navigate to Issues > Milestones
   - Click "New milestone"
   - Name it "Sprint X" (where X is the sprint number)
   - Set duration (typically 2 weeks)
   - Add description with sprint goals

2. **Sprint Planning Meeting**:
   - Review and prioritize backlog items
   - Assign story points to issues
   - Move selected issues to Sprint Backlog
   - Assign issues to team members
   - Link issues to the sprint milestone

3. **Using MCP Server for Sprint Setup**:
   ```bash
   # Create sprint milestone
   mcp__create_milestone --owner="lorepin-org" --repo="lorepin" --title="Sprint X" --due_on="YYYY-MM-DD"
   
   # Assign issues to milestone (repeat for each issue)
   mcp__update_issue --owner="lorepin-org" --repo="lorepin" --issue_number=123 --milestone=X
   ```

### Daily Stand-ups

**Instructions:**

1. **Update Issue Status**:
   - Move cards on the project board to reflect current status
   - Add comments to issues with progress updates

2. **Using MCP Server for Updates**:
   ```bash
   # Add comment to issue with daily update
   mcp__add_issue_comment --owner="lorepin-org" --repo="lorepin" --issue_number=123 --body="Daily update: Completed X, working on Y, blocked by Z"
   ```

### Sprint Review and Retrospective

**Instructions:**

1. **Close Completed Issues**:
   ```bash
   # Close completed issue
   mcp__update_issue --owner="lorepin-org" --repo="lorepin" --issue_number=123 --state="closed"
   ```

2. **Create Retrospective Issue**:
   ```bash
   # Create retrospective issue
   mcp__create_issue --owner="lorepin-org" --repo="lorepin" --title="Sprint X Retrospective" --body="## What went well\n\n## What could be improved\n\n## Action items"
   ```

3. **Close Sprint Milestone**:
   - Go to your GitHub repository
   - Navigate to Issues > Milestones
   - Find the current sprint milestone
   - Click "Close" when all issues are resolved

## Code Memory & Context Management

### Recommended Practices

1. **Comprehensive Documentation**:
   - Maintain detailed README files in each directory
   - Document architecture decisions in ADRs (Architecture Decision Records)
   - Use JSDoc comments for all functions and components

2. **Consistent Commit Messages**:
   - Use conventional commits format: `type(scope): message`
   - Include issue/ticket references: `feat(auth): implement login form (CP-123)`
   - Write descriptive commit messages that explain why, not just what

3. **Code Reviews with Context**:
   - Use pull request templates that include context
   - Reference design documents and requirements
   - Explain architectural decisions in PR descriptions

4. **Knowledge Base Setup**:
   - Create a `docs` directory in your repository
   - Maintain a wiki for project-wide documentation
   - Use GitHub Discussions for architectural decisions

5. **Codebase Navigation Tools**:
   - Set up GitHub CodeQL for code navigation
   - Use GitHub Copilot for context-aware code completion
   - Implement a consistent file structure and naming convention

### Implementation Instructions

1. **Create Documentation Directory**:
   ```bash
   mkdir -p docs/architecture
   mkdir -p docs/guides
   mkdir -p docs/api
   ```

2. **Create Architecture Decision Record Template**:
   Create `docs/architecture/adr-template.md`:
   ```markdown
   # ADR-XXX: Title

   ## Status
   [Proposed | Accepted | Deprecated | Superseded]

   ## Context
   [Description of the problem and context]

   ## Decision
   [Description of the decision made]

   ## Consequences
   [Description of the consequences of the decision]

   ## Alternatives Considered
   [Description of alternatives considered]

   ## References
   [Links to relevant documents]
   ```

3. **Create Pull Request Template**:
   Create `.github/pull_request_template.md`:
   ```markdown
   ## Description
   [Describe the changes and the purpose]

   ## Related Issues
   Fixes #[issue number]

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## How Has This Been Tested?
   [Describe the tests that you ran]

   ## Checklist
   - [ ] My code follows the style guidelines of this project
   - [ ] I have performed a self-review of my own code
   - [ ] I have commented my code, particularly in hard-to-understand areas
   - [ ] I have made corresponding changes to the documentation
   - [ ] My changes generate no new warnings
   - [ ] I have added tests that prove my fix is effective or that my feature works
   - [ ] New and existing unit tests pass locally with my changes

   ## Screenshots (if applicable)
   [Add screenshots here]
   ```

4. **Push Documentation to Repository**:
   ```bash
   git add docs .github/pull_request_template.md
   git commit -m "Add documentation structure and templates"
   git push origin development
   ```

## Conclusion

By following these instructions, you will establish a robust GitHub workflow for the LorePin project, including branch management with MCP server integration, CI/CD pipelines, and Agile project management. The recommended practices for code memory and context management will help maintain a well-documented and navigable codebase as the project grows.

Remember to regularly review and update these processes as the team and project evolve. Continuous improvement is a key principle of Agile methodology. 