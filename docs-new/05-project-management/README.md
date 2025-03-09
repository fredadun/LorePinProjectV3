# Project Management

This section documents the project management processes, methodologies, and tools used in the LorePin project.

## Contents

- [Agile Framework](./agile-framework.md) - Agile methodology and practices
- [Development Process Guide](./development-process-guide.md) - Step-by-step development process
- [Sprint Planning Process](./sprint-planning-process.md) - Sprint planning and execution
- [Label System](./label-system.md) - Issue labeling and categorization
- [Milestones Setup](./milestones-setup.md) - Project milestones and timeline
- [Project Board Setup](./project-board-setup.md) - Kanban board configuration

## Sprint Structure

The LorePin project is organized into six main sprints:

1. **Sprint 1**: User Onboarding & Profiles
2. **Sprint 2**: Challenge System (Core)
3. **Sprint 3**: LoreCoins Reward System
4. **Sprint 4**: Content Discovery & Feed
5. **Sprint 5**: Social Features & Sponsor Tools
6. **Sprint 6**: Testing & Launch Prep

Each sprint has detailed user stories and acceptance criteria in the [sprints](./sprints/) directory.

## Agile Methodology

We follow a modified Scrum methodology with:

- 2-week sprint cycles
- Daily standups
- Sprint planning meetings
- Sprint retrospectives
- Backlog grooming sessions

## Project Roles

- **Product Owner**: Defines requirements and priorities
- **Scrum Master**: Facilitates the Agile process
- **Development Team**: Implements features and fixes
- **QA Team**: Tests and verifies implementations
- **Stakeholders**: Provide feedback and direction

## Issue Management

We use GitHub Issues for tracking work with the following structure:

- **User Stories**: Features from a user's perspective
- **Tasks**: Technical implementation details
- **Bugs**: Issues and defects
- **Epics**: Large features that span multiple sprints
- **Checkpoints**: Verification points within sprints

## Project Board

Our Kanban board has the following columns:

- **Backlog**: Planned but not yet scheduled
- **To Do**: Scheduled for the current sprint
- **In Progress**: Currently being worked on
- **Review**: Ready for code review
- **Testing**: In QA testing
- **Done**: Completed and verified

## Estimation

We use story points for estimation with the following scale:

- **1 point**: Very small task (< 2 hours)
- **2 points**: Small task (half day)
- **3 points**: Medium task (1 day)
- **5 points**: Large task (2-3 days)
- **8 points**: Very large task (3-5 days)
- **13 points**: Should be broken down further

## Reporting

We track the following metrics:

- **Velocity**: Story points completed per sprint
- **Burndown**: Progress within a sprint
- **Cycle Time**: Time from start to completion
- **Bug Rate**: Number of bugs per feature
- **Technical Debt**: Accumulated technical issues 