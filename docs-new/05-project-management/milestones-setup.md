# GitHub Milestones Setup Guide for LorePin

This document provides instructions for setting up GitHub Milestones for the LorePin project to track progress across sprints.

## What are GitHub Milestones?

GitHub Milestones are a way to track progress on groups of issues or pull requests in a repository. They are useful for:

- Organizing issues into sprints or releases
- Tracking progress toward a deadline
- Filtering issues and pull requests by milestone
- Visualizing completion percentage

## Milestone Structure for LorePin

The LorePin project uses milestones to represent sprints. Each sprint has a specific focus and set of deliverables:

1. **Sprint 1: User Onboarding & Profiles**
   - Duration: 2 weeks
   - Focus: Authentication, user profiles, and basic social connections

2. **Sprint 2: Challenge System (Core)**
   - Duration: 2 weeks
   - Focus: Challenge creation, submission, and leaderboards

3. **Sprint 3: LoreCoins Reward System**
   - Duration: 2 weeks
   - Focus: Earning, tracking, and redeeming LoreCoins

4. **Sprint 4: Content Discovery & Feed**
   - Duration: 2 weeks
   - Focus: Personalized feed, location-based discovery, and search

5. **Sprint 5: Social Features & Sponsor Tools**
   - Duration: 2 weeks
   - Focus: Comments, sharing, notifications, and sponsor analytics

6. **Sprint 6: Testing & Launch Prep**
   - Duration: 2 weeks
   - Focus: Performance optimization, testing, and launch preparation

## Creating Milestones in GitHub

### Step-by-Step Instructions

1. Go to the [LorePin repository](https://github.com/fredadun/LorePinProjectV3)
2. Click on the "Issues" tab
3. Click on "Milestones"
4. Click "New milestone"
5. Fill in the milestone details:
   - **Title**: Sprint X: [Focus Area]
   - **Due date**: End date of the sprint
   - **Description**: Brief description of the sprint goals and deliverables
6. Click "Create milestone"
7. Repeat for all six sprints

### Example Milestone Details

#### Sprint 1: User Onboarding & Profiles

- **Title**: Sprint 1: User Onboarding & Profiles
- **Due date**: [Start Date + 2 weeks]
- **Description**:
  ```
  Focus: Authentication, user profiles, and basic social connections

  Goals:
  - Implement social login (Google, Instagram)
  - Create user profile functionality
  - Implement follow/unfollow system
  - Set up basic user discovery

  Key Deliverables:
  - Functional authentication system
  - User profile creation and editing
  - Follow/unfollow functionality
  - User search and discovery
  ```

#### Sprint 2: Challenge System (Core)

- **Title**: Sprint 2: Challenge System (Core)
- **Due date**: [Sprint 1 End Date + 2 weeks]
- **Description**:
  ```
  Focus: Challenge creation, submission, and leaderboards

  Goals:
  - Implement challenge creation for sponsors
  - Create submission system for users
  - Implement challenge leaderboards
  - Set up location-based challenge discovery

  Key Deliverables:
  - Challenge creation interface for sponsors
  - Media upload and submission system
  - Challenge leaderboards
  - Map-based challenge discovery
  ```

[Continue with similar details for Sprints 3-6]

## Assigning Issues to Milestones

### During Issue Creation

1. When creating a new issue, use the sidebar to assign it to a milestone
2. Select the appropriate sprint milestone from the dropdown

### For Existing Issues

1. Open the issue
2. Click on the gear icon next to "Milestone" in the sidebar
3. Select the appropriate sprint milestone from the dropdown

### Bulk Assignment

1. Go to the "Issues" tab
2. Use filters to select multiple issues
3. Click on "Milestone" at the top of the issue list
4. Select the appropriate sprint milestone from the dropdown

## Tracking Progress

### Milestone Progress Page

1. Go to the "Issues" tab
2. Click on "Milestones"
3. Click on a specific milestone to view its progress
4. The progress bar shows the percentage of closed issues
5. The page lists all open and closed issues in the milestone

### Filtering Issues by Milestone

1. Go to the "Issues" tab
2. Click on the "Milestone" dropdown
3. Select a milestone to filter the issue list

## Closing Milestones

When a sprint is completed:

1. Ensure all issues are either closed or moved to the next sprint
2. Go to the "Milestones" page
3. Click "Close" next to the completed milestone
4. Document the sprint retrospective in the milestone description

## Best Practices

1. **Create milestones before sprint planning**: Have milestones ready before assigning issues
2. **Set realistic due dates**: Consider team capacity and velocity
3. **Update milestone descriptions**: Add notes about changes or decisions
4. **Review milestone progress regularly**: Use in daily standups and sprint reviews
5. **Close milestones promptly**: Don't leave completed milestones open
6. **Document learnings**: Add retrospective notes to closed milestones

## Integration with Project Board

Milestones can be used in conjunction with the project board:

1. Filter the project board by milestone to see sprint-specific views
2. Use milestone due dates to set deadlines for columns or automation
3. Include milestone information in project board notes

## Reporting

Use milestones for reporting:

1. **Sprint Progress**: Percentage of completed issues in the current milestone
2. **Velocity**: Number of issues/story points completed per milestone
3. **Burndown**: Rate of issue completion over the sprint duration

## Conclusion

GitHub Milestones provide a structured way to organize and track the LorePin development process. By following this guide, you can set up and manage milestones effectively, ensuring clear visibility into sprint progress and goals.