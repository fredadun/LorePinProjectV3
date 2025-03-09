# LorePin Branching Workflow Guide

This document outlines the branching strategy and workflow for the LorePin project.

## Branch Structure

The LorePin project uses a simple three-branch strategy:

- **development**: Active development branch where new features are implemented
- **test**: Testing branch for QA and verification before production
- **main**: Production-ready code

## Workflow Overview

```
feature/branch → development → test → main
     ↑              ↓           ↓      ↓
  Development    Integration   QA    Production
```

## Detailed Workflow

### 1. Feature Development

1. **Create a feature branch** from `development`:
   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** in your feature branch:
   ```bash
   # Make your changes
   git add .
   git commit -m "Descriptive commit message"
   ```

3. **Push your feature branch** to the remote repository:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a pull request** from your feature branch to `development` on GitHub.

5. After review and approval, **merge the pull request** into `development`.

### 2. Development to Test

Once features are ready for testing:

1. **Create a pull request** from `development` to `test` on GitHub.
   - Or use the branch management script:
   ```bash
   node scripts/branch-management.js create-pr
   ```

2. **Review the changes** in the pull request.

3. **Merge the pull request** into `test`.
   - Or use the branch management script:
   ```bash
   node scripts/branch-management.js sync-to-test
   ```

4. **Perform QA testing** on the `test` branch.

### 3. Test to Main

After successful testing:

1. **Create a pull request** from `test` to `main` on GitHub.
   - Or use the branch management script:
   ```bash
   node scripts/branch-management.js create-pr
   ```

2. **Review the changes** in the pull request.

3. **Merge the pull request** into `main`.
   - Or use the branch management script:
   ```bash
   node scripts/branch-management.js sync-to-main
   ```

4. **Tag the release** with a version number:
   ```bash
   git checkout main
   git pull origin main
   git tag -a v1.0.0 -m "Version 1.0.0"
   git push origin v1.0.0
   ```

## Using the Branch Management Script

The LorePin project includes a branch management script to automate common workflows.

### Prerequisites

- Node.js installed
- Git installed and configured
- Repository cloned locally

### Installation

```bash
cd scripts
npm install
```

### Available Commands

- `sync-to-test`: Sync changes from development to test branch
- `sync-to-main`: Sync changes from test to main branch
- `sync-all`: Sync changes through all branches (development → test → main)
- `create-pr`: Create pull requests for branch syncing
- `help`: Show help message

### Examples

```bash
# Show help
node scripts/branch-management.js help

# Sync development to test
node scripts/branch-management.js sync-to-test

# Sync test to main
node scripts/branch-management.js sync-to-main

# Sync through all branches
node scripts/branch-management.js sync-all

# Create pull requests
node scripts/branch-management.js create-pr
```

## Handling Conflicts

If conflicts occur during merging:

1. **Checkout the target branch**:
   ```bash
   git checkout test  # or main
   ```

2. **Merge the source branch**:
   ```bash
   git merge development  # or test
   ```

3. **Resolve conflicts** in the conflicting files.

4. **Complete the merge**:
   ```bash
   git add .
   git commit -m "Merge development into test with conflict resolution"
   git push origin test
   ```

## Best Practices

1. **Pull before pushing**:
   ```bash
   git pull origin your-branch-name
   ```

2. **Keep commits focused** on a single task or fix.

3. **Write descriptive commit messages** that explain what and why (not how).

4. **Regularly sync your feature branch** with the development branch:
   ```bash
   git checkout feature/your-feature-name
   git pull origin development
   git push origin feature/your-feature-name
   ```

5. **Delete feature branches** after they are merged:
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

6. **Never commit directly to main** - always follow the workflow.

7. **Use pull requests** for code review and documentation.

## Rollback Procedures

If you need to rollback changes:

### Rollback a commit

```bash
git revert <commit-hash>
git push origin your-branch-name
```

### Rollback to a specific tag

```bash
git checkout main
git reset --hard v1.0.0
git push -f origin main
```

**Note**: Force pushing to shared branches should be avoided when possible.

## Workflow Diagram

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Development   │  Pull   │      Test       │  Pull   │      Main       │
│     Branch      │ Request │     Branch      │ Request │     Branch      │
│                 │ ───────>│                 │ ───────>│                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        ▲                            │                           │
        │                            │                           │
        │                            │                           │
┌─────────────────┐                  │                           │
│                 │                  │                           │
│    Feature      │                  │                           │
│    Branches     │                  │                           │
│                 │                  │                           │
└─────────────────┘                  ▼                           ▼
                             ┌─────────────────┐         ┌─────────────────┐
                             │                 │         │                 │
                             │  QA & Testing   │         │   Production    │
                             │  Environment    │         │   Environment   │
                             │                 │         │                 │
                             └─────────────────┘         └─────────────────┘
```

## Troubleshooting

### Unable to push to remote

```bash
git pull origin your-branch-name
# Resolve any conflicts
git push origin your-branch-name
```

### Accidentally committed to wrong branch

```bash
# Save your changes
git stash

# Switch to the correct branch
git checkout correct-branch

# Apply your changes
git stash pop

# Commit to the correct branch
git add .
git commit -m "Your commit message"
git push origin correct-branch
```

### Need to undo a merge

```bash
# If the merge is the most recent commit
git reset --hard HEAD~1

# If you need to undo a specific merge commit
git revert -m 1 <merge-commit-hash>
```

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [LorePin Project Scripts README](../scripts/README.md) 