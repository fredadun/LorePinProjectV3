# AI Assistant Workflow Process

## Overview

This document outlines the standardized process for the AI Assistant to handle tasks and issues in the LorePin project. Following these guidelines ensures consistent, high-quality contributions while maintaining project integrity.

## Task Management Process

### 1. Task Acquisition

1. **Issue Selection**
   - Use the MCP server tools to retrieve open issues from GitHub
   - Prioritize issues based on:
     - Priority labels (High, Medium, Low)
     - Dependencies (blocked/blocking)
     - Sprint assignments
     - User requests

2. **Issue Analysis**
   - Review the issue description thoroughly
   - Identify acceptance criteria and requirements
   - Determine if the issue is appropriately sized
   - Check for dependencies on other issues

3. **Task Size Assessment**
   - Evaluate complexity and scope
   - If a task is too large (estimated >4 hours of work), break it down:
     - Create sub-tasks with clear boundaries
     - Establish dependencies between sub-tasks
     - Propose the breakdown to the user for approval

### 2. Implementation Process

1. **Planning Phase**
   - Outline the implementation approach
   - Identify files that need to be modified
   - Document potential risks or challenges
   - Share the plan with the user before implementation

2. **Development Phase**
   - Make incremental changes with clear commit messages
   - Follow the project's coding standards and patterns
   - Add appropriate comments and documentation
   - Preserve existing comments unless they're obsolete
   - Test changes after each meaningful modification

3. **Preservation Guidelines**
   - Always assume existing code is working
   - Make minimal necessary changes to achieve requirements
   - Preserve existing functionality unless explicitly instructed otherwise
   - Maintain backward compatibility where possible
   - Document any breaking changes clearly

### 3. Validation and Checkpointing

1. **Self-Validation**
   - Review changes against acceptance criteria
   - Verify that no regressions were introduced
   - Ensure code quality and documentation standards are met
   - Confirm all tests pass (if applicable)

2. **User Validation Request**
   - Present completed work with a summary of changes
   - Highlight how acceptance criteria were met
   - Include instructions for testing the changes
   - Request explicit validation from the user

3. **Checkpoint Creation**
   - Create a checkpoint after significant milestones
   - Document the current state of the implementation
   - List completed and remaining items
   - Identify any blockers or challenges

### 4. Task Completion

1. **Final Review**
   - Ensure all acceptance criteria are met
   - Verify documentation is complete and accurate
   - Check that all tests pass
   - Confirm code quality standards are maintained

2. **Completion Process**
   - Update the issue status to "Completed" using MCP tools
   - Provide a comprehensive summary of changes
   - Document any follow-up tasks or considerations
   - Request final approval from the user

3. **Knowledge Transfer**
   - Document key decisions and implementation details
   - Update relevant project documentation
   - Provide usage examples if applicable
   - Ensure the user understands the changes

## Change Management

### 1. Rollback Procedures

1. **Identifying Rollback Needs**
   - User request for rollback
   - Discovery of critical bugs or issues
   - Unintended side effects
   - Performance degradation

2. **Rollback Execution**
   - For uncommitted changes:
     - Discard changes and restart
   - For committed changes:
     - Use `git revert` to create a new commit that undoes changes
     - Avoid `git reset` to preserve history
   - For merged changes:
     - Create a new PR that reverts the problematic changes
     - Prioritize fixing forward when possible

3. **Post-Rollback Actions**
   - Document the reason for rollback
   - Analyze root causes
   - Develop a plan to address the underlying issues
   - Implement improved testing to prevent similar issues

### 2. Incremental Development

1. **Small, Atomic Commits**
   - Make focused commits that address a single concern
   - Use clear, descriptive commit messages
   - Reference issue numbers in commit messages
   - Facilitate easier review and potential rollback

2. **Feature Flagging**
   - Consider using feature flags for significant changes
   - Allow for gradual rollout and easy disabling
   - Separate deployment from feature activation
   - Enable A/B testing when appropriate

## Best Practices

### 1. Code Preservation

- **Golden Rule**: "First, do no harm"
- Assume all existing code serves a purpose
- Understand code before modifying it
- Preserve existing patterns and conventions
- Document why changes were made, not just what changed

### 2. Communication

- Provide clear reasoning for implementation decisions
- Ask clarifying questions when requirements are ambiguous
- Proactively identify potential issues or trade-offs
- Keep the user informed of progress and challenges

### 3. Documentation

- Update documentation alongside code changes
- Document APIs, key functions, and complex logic
- Include examples for non-obvious functionality
- Ensure README files are kept current

### 4. Testing

- Test changes thoroughly before requesting validation
- Consider edge cases and error conditions
- Verify performance implications of changes
- Test on different environments when relevant

## Process Flowchart

```
┌─────────────────┐
│ Task Acquisition│
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Size Assessment │─Yes─►  Task Breakdown │
└────────┬────────┘     └────────┬────────┘
         │ No                    │
         ▼                       │
┌─────────────────┐              │
│ Implementation  │◄─────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│Self-Validation  │─No──►   Refinement    │
└────────┬────────┘     └────────┬────────┘
         │ Yes                   │
         ▼                       │
┌─────────────────┐              │
│ User Validation │◄─────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Approved?      │─No──►    Rollback     │
└────────┬────────┘     └────────┬────────┘
         │ Yes                   │
         ▼                       │
┌─────────────────┐              │
│Task Completion  │◄─────────────┘
└─────────────────┘
```

## Example Workflow

### Example: Implementing a New Feature

1. **Task Acquisition**
   - Review GitHub issue #123: "Implement user profile image upload"
   - Analyze requirements and acceptance criteria

2. **Size Assessment**
   - Determine this is a medium-sized task that doesn't need breakdown

3. **Implementation Planning**
   - Outline approach: "Will add image upload component, backend storage logic, and UI updates"
   - Identify files to modify: UserProfile.tsx, userService.js, etc.

4. **Development**
   - Make incremental changes with clear commits
   - Add appropriate comments and documentation
   - Test after each significant change

5. **Self-Validation**
   - Verify all acceptance criteria are met
   - Ensure code quality standards are maintained
   - Confirm no regressions were introduced

6. **User Validation Request**
   - Present completed work with summary of changes
   - Provide testing instructions
   - Request explicit validation

7. **Task Completion**
   - Update issue status to "Completed"
   - Document implementation details
   - Request final approval

### Example: Rollback Scenario

1. **Issue Identification**
   - User reports that recent changes to authentication flow broke existing sessions

2. **Rollback Decision**
   - Determine that a quick rollback is needed to restore service

3. **Rollback Execution**
   - Create a revert commit for the problematic changes
   - Deploy the reverted version

4. **Post-Rollback Actions**
   - Document the issue and rollback
   - Analyze root cause (session handling logic error)
   - Develop a plan to fix properly with additional testing

## Related Documentation
- [Agile Framework](./agile-framework.md)
- [Branching Workflow](../03-development/branching-workflow.md)
- [Technical Architecture](../02-architecture/technical-architecture.md)