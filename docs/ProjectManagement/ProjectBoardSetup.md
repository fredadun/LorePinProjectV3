# LorePin Project Board Setup Guide

This document provides instructions for setting up and managing the GitHub Project Board for the LorePin project.

## Project Board Overview

The LorePin project uses a Kanban-style project board to visualize and manage workflow. The board helps track the progress of issues and pull requests from the backlog to completion.

## Board Structure

Our project board consists of the following columns:

1. **Backlog**: All issues that have been created but not yet scheduled for the current sprint
2. **To Do**: Issues scheduled for the current sprint but not yet started
3. **In Progress**: Issues currently being worked on
4. **Review**: Issues with pull requests that need review
5. **Done**: Completed issues

## Setting Up the Project Board

### Creating a New Project Board

1. Go to the [LorePin repository](https://github.com/fredadun/LorePinProjectV3)
2. Click on the "Projects" tab
3. Click "New project"
4. Select "Board" as the template
5. Name the project "LorePin Development"
6. Add a description: "Kanban board for tracking LorePin development tasks"
7. Click "Create"

### Customizing the Board

1. By default, the board will have "Todo", "In Progress", and "Done" columns
2. Add the "Backlog" column:
   - Click "+ Add column" on the left side of the board
   - Name it "Backlog"
   - Set position to "First"
   - Click "Create"
3. Add the "Review" column:
   - Click "+ Add column" 
   - Name it "Review"
   - Position it between "In Progress" and "Done"
   - Click "Create"
4. Configure column automation:
   - For "To Do": No automation
   - For "In Progress": Move issues here when they are assigned
   - For "Review": Move pull requests here when they are created
   - For "Done": Move issues here when they are closed

## Using the Project Board

### Adding Issues to the Board

1. Create issues in the repository as usual
2. Add them to the project:
   - From the issue view, click the "Projects" section on the right sidebar
   - Select "LorePin Development"
   - The issue will be added to the "Backlog" column by default

### Moving Issues Between Columns

1. Drag and drop issues between columns as they progress
2. Alternatively, from an issue view:
   - Click the "Projects" section
   - Click the status dropdown
   - Select the new status

### Sprint Planning with the Board

1. During sprint planning:
   - Review all issues in the "Backlog"
   - Prioritize and select issues for the current sprint
   - Move selected issues to the "To Do" column
   - Assign team members to issues

2. During the sprint:
   - Team members move their assigned issues to "In Progress" when they start working
   - When creating a pull request, the issue automatically moves to "Review"
   - After merging and closing, the issue automatically moves to "Done"

### Using Filters and Views

1. Use filters to focus on specific aspects:
   - Filter by label (e.g., show only `sprint:1` issues)
   - Filter by assignee (e.g., show only issues assigned to a specific team member)
   - Filter by milestone (e.g., show only issues in the current milestone)

2. Create saved views for common filters:
   - "Current Sprint" view: Shows all issues in the current sprint
   - "My Tasks" view: Shows issues assigned to the current user
   - "High Priority" view: Shows issues with the `priority:high` label

## Board Maintenance

### Regular Cleanup

1. Weekly board review:
   - Ensure all issues are in the correct columns
   - Update status labels to match column positions
   - Check for blocked issues and address blockers

2. End of sprint:
   - Move incomplete issues back to "Backlog" or forward to the next sprint's "To Do"
   - Archive completed issues
   - Create a new sprint view for the upcoming sprint

### Reporting

Use the project board for reporting:
1. Sprint progress: Count of issues in each column
2. Velocity: Number of issues completed per sprint
3. Bottlenecks: Issues that stay too long in a particular column

## Integration with Milestones

Link the project board with GitHub Milestones:
1. Create milestones for each sprint with due dates
2. Assign issues to the appropriate milestone
3. Filter the project board by milestone to see sprint-specific views

## Best Practices

1. **Keep the board updated**: Move cards as work progresses
2. **Use labels consistently**: Apply the labeling system to all issues
3. **Add notes to cards**: Use card notes for additional context
4. **Review the board daily**: Use it for daily standups
5. **Limit Work in Progress**: Try to limit the number of issues in the "In Progress" column
6. **Use issue templates**: Create templates for common issue types

## Automation Opportunities

Consider setting up GitHub Actions to automate board management:
1. Automatically move issues to "In Progress" when a branch is created
2. Automatically move issues to "Review" when a PR is created
3. Automatically add labels based on which column an issue is in

## Conclusion

The project board is a central tool for visualizing and managing the LorePin development workflow. When used consistently, it provides transparency into the project's progress and helps identify bottlenecks or issues that need attention.