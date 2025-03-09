# GitHub Labels System for LorePin

This document outlines the labeling system used for issues and pull requests in the LorePin project.

## Label Categories

Our labeling system is organized into five main categories:

1. **Priority**: Indicates the urgency and importance of an issue
2. **Type**: Describes the nature of the work
3. **Component**: Identifies which part of the system is affected
4. **Status**: Indicates the current state of the issue
5. **Sprint**: Identifies which sprint the issue belongs to

## Priority Labels

| Label | Color | Description |
|-------|-------|-------------|
| `priority:high` | `#FF0000` (Red) | Critical issues that must be addressed immediately |
| `priority:medium` | `#FFA500` (Orange) | Important issues that should be addressed soon |
| `priority:low` | `#FFFF00` (Yellow) | Issues that can be addressed when time permits |

## Type Labels

| Label | Color | Description |
|-------|-------|-------------|
| `type:feature` | `#0075CA` (Blue) | New functionality or enhancements |
| `type:bug` | `#D73A4A` (Red) | Something isn't working as expected |
| `type:documentation` | `#0075CA` (Blue) | Improvements or additions to documentation |
| `type:refactor` | `#A2EEEF` (Light Blue) | Code changes that neither fix a bug nor add a feature |
| `type:test` | `#BFDADC` (Light Teal) | Adding or modifying tests |
| `type:design` | `#CC99FF` (Purple) | UI/UX design work |
| `type:security` | `#D93F0B` (Dark Orange) | Security-related issues |
| `type:performance` | `#0E8A16` (Green) | Performance improvements |

## Component Labels

| Label | Color | Description |
|-------|-------|-------------|
| `component:frontend` | `#1D76DB` (Blue) | Related to the web frontend |
| `component:backend` | `#0E8A16` (Green) | Related to the Firebase backend |
| `component:mobile` | `#5319E7` (Purple) | Related to the Flutter mobile app |
| `component:auth` | `#FEF2C0` (Light Yellow) | Authentication-related |
| `component:challenges` | `#FBCA04` (Yellow) | Challenge system-related |
| `component:lorecoins` | `#C5DEF5` (Light Blue) | LoreCoins system-related |
| `component:map` | `#BFD4F2` (Light Blue) | Map and location features |
| `component:media` | `#D4C5F9` (Light Purple) | Media handling (photos/videos) |

## Status Labels

| Label | Color | Description |
|-------|-------|-------------|
| `status:blocked` | `#D93F0B` (Dark Orange) | Blocked by another issue or external factor |
| `status:in-progress` | `#0E8A16` (Green) | Currently being worked on |
| `status:review` | `#FBCA04` (Yellow) | Ready for review |
| `status:ready` | `#0075CA` (Blue) | Ready to be worked on |
| `status:wontfix` | `#E4E669` (Light Yellow) | This will not be worked on |
| `status:duplicate` | `#CFD3D7` (Gray) | This issue already exists |

## Sprint Labels

| Label | Color | Description |
|-------|-------|-------------|
| `sprint:1` | `#C2E0C6` (Light Green) | Sprint 1: User Onboarding & Profiles |
| `sprint:2` | `#C2E0C6` (Light Green) | Sprint 2: Challenge System (Core) |
| `sprint:3` | `#C2E0C6` (Light Green) | Sprint 3: LoreCoins Reward System |
| `sprint:4` | `#C2E0C6` (Light Green) | Sprint 4: Content Discovery & Feed |
| `sprint:5` | `#C2E0C6` (Light Green) | Sprint 5: Social Features & Sponsor Tools |
| `sprint:6` | `#C2E0C6` (Light Green) | Sprint 6: Testing & Launch Prep |

## How to Use Labels

1. **Every issue should have at least one label from each category**:
   - One priority label
   - One type label
   - One or more component labels
   - One status label
   - One sprint label

2. **Update labels as the issue progresses**:
   - Change the status label as the issue moves through the workflow
   - Add additional labels if the scope changes

3. **Use labels for filtering**:
   - Filter the issue board by sprint to see all issues in a specific sprint
   - Filter by component to see all issues related to a specific part of the system
   - Combine filters to create custom views

## Creating Labels in GitHub

To create these labels in GitHub:

1. Go to the repository on GitHub
2. Click on "Issues"
3. Click on "Labels"
4. Click on "New Label"
5. Enter the label name, select a color, and add a description
6. Click "Create Label"
7. Repeat for all labels

Alternatively, you can use the GitHub API or tools like `github-label-sync` to create labels programmatically.

## Label Automation

Consider setting up GitHub Actions to automatically apply labels based on:

- The title or content of the issue (e.g., adding `type:bug` if the title contains "bug" or "fix")
- The files changed in a pull request (e.g., adding `component:frontend` if changes are in the frontend directory)
- The branch name (e.g., adding `sprint:1` if the branch name contains "sprint-1")

This can be done using GitHub Actions workflows with the `actions/labeler` action.