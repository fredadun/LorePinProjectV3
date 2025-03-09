# Development

This section provides guidelines, workflows, and best practices for development on the LorePin project.

## Contents

- [Branching Workflow](./branching-workflow.md) - Git branching strategy and workflow
- [GitHub Workflow](./github-workflow.md) - GitHub-specific processes and tools
- [Implementation Process](./implementation-process.md) - Step-by-step guide for implementing features

## Development Workflow

The LorePin project follows a structured development workflow:

1. **Feature Planning**: Define requirements and acceptance criteria
2. **Branch Creation**: Create a feature branch from `development`
3. **Implementation**: Develop the feature with appropriate tests
4. **Code Review**: Submit a pull request for review
5. **Testing**: Merge to `test` branch for QA
6. **Deployment**: Merge to `main` branch for production

## Branching Strategy

We use a three-branch strategy:

- **development**: Active development branch where new features are implemented
- **test**: Testing branch for QA and verification before production
- **main**: Production-ready code

Feature branches should be created from and merged back to the `development` branch.

## Coding Standards

### General

- Write clean, simple, readable code
- Keep files small and focused (<200 lines)
- Use clear, consistent naming
- Add helpful comments

### Frontend (React)

- Use functional components with hooks
- Follow the container/presentational component pattern
- Use TypeScript for type safety
- Follow the Redux toolkit pattern for state management

### Backend (Firebase)

- Implement proper error handling and validation
- Use TypeScript for Cloud Functions
- Follow the repository pattern for data access
- Implement proper security rules

### Mobile (Flutter)

- Follow the Clean Architecture pattern
- Use Riverpod for state management
- Implement proper error handling
- Follow the Material Design guidelines

## Testing Guidelines

- Write unit tests for business logic
- Write integration tests for critical flows
- Test on multiple devices and browsers
- Follow the AAA pattern (Arrange, Act, Assert)

## Pull Request Process

1. Create a pull request from your feature branch to `development`
2. Ensure all tests pass
3. Request reviews from at least one team member
4. Address all review comments
5. Merge only after approval

## Continuous Integration

The project uses GitHub Actions for continuous integration:

- Automated testing on pull requests
- Linting and type checking
- Build verification

## Useful Scripts

The project includes several automation scripts in the `scripts` directory:

- `branch-management.js`: Manage branch workflows
- `fix-repository-structure.js`: Fix repository structure issues
- Various other utility scripts

For more details, see the [Scripts README](../../scripts/README.md). 