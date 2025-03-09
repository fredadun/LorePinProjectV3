# LorePin CMS UI Testing Guide

## Overview

This document provides guidance for testing the LorePin CMS v2.0 user interface. It outlines the key user journeys to test, expected behaviors, and how to report issues.

## Prerequisites

Before beginning UI testing, ensure you have:

1. **Access Credentials**
   - Admin user account
   - Moderator user account
   - Content manager user account
   - Regular user account

2. **Test Environment**
   - Access to the CMS test environment
   - Sample content for testing (challenges, submissions, user profiles)
   - Test data for AI moderation

3. **Testing Tools**
   - Browser developer tools
   - Screen recording software (optional)
   - Issue tracking access

## Key User Journeys to Test

### 1. Authentication and Authorization

#### 1.1 User Login

- **Steps:**
  1. Navigate to the CMS login page
  2. Enter valid credentials
  3. Click "Login"

- **Expected Behavior:**
  - User should be authenticated
  - User should be redirected to the dashboard
  - Navigation menu should reflect user's role permissions

- **Variations to Test:**
  - Login with different user roles
  - Login with invalid credentials
  - Password reset flow

#### 1.2 Role-Based Access Control

- **Steps:**
  1. Login with different user roles
  2. Attempt to access various sections of the CMS

- **Expected Behavior:**
  - Users should only see navigation items they have permission to access
  - Attempting to access unauthorized pages directly via URL should redirect to an access denied page
  - Admin users should see all sections

### 2. User Management

#### 2.1 User Listing and Filtering

- **Steps:**
  1. Navigate to the User Management section
  2. Test various filters (role, status, date joined)
  3. Test sorting by different columns

- **Expected Behavior:**
  - Users should be displayed in a paginated list
  - Filters should correctly narrow down the user list
  - Sorting should work correctly for all columns

#### 2.2 User Creation and Editing

- **Steps:**
  1. Click "Create User" button
  2. Fill in user details
  3. Assign roles
  4. Save the user
  5. Edit the user to modify details

- **Expected Behavior:**
  - User should be created with the specified details
  - Validation should prevent invalid data
  - Edited user details should be saved correctly

#### 2.3 Role Assignment

- **Steps:**
  1. Select a user
  2. Navigate to the Roles tab
  3. Assign/remove roles
  4. Save changes

- **Expected Behavior:**
  - User's roles should be updated
  - User's permissions should reflect the new roles
  - Changes should be visible in the user list

### 3. Role Management

#### 3.1 Role Listing

- **Steps:**
  1. Navigate to the Role Management section
  2. View the list of roles

- **Expected Behavior:**
  - Roles should be displayed with their descriptions and permission counts
  - Default roles should be present

#### 3.2 Role Creation and Editing

- **Steps:**
  1. Click "Create Role" button
  2. Enter role name and description
  3. Assign permissions
  4. Save the role
  5. Edit the role to modify permissions

- **Expected Behavior:**
  - Role should be created with the specified details
  - Permissions should be correctly assigned
  - Edited role should reflect the changes

#### 3.3 Permission Management

- **Steps:**
  1. Select a role
  2. Navigate to the Permissions tab
  3. Assign/remove permissions
  4. Save changes

- **Expected Behavior:**
  - Role's permissions should be updated
  - Changes should be reflected immediately for new user sessions

### 4. Moderation Queue

#### 4.1 Queue Listing and Filtering

- **Steps:**
  1. Navigate to the Moderation Queue section
  2. Test various filters (content type, status, risk score)
  3. Test sorting by different columns

- **Expected Behavior:**
  - Queue items should be displayed in a paginated list
  - Filters should correctly narrow down the queue
  - Sorting should work correctly for all columns

#### 4.2 Content Review

- **Steps:**
  1. Select a queue item
  2. Review the content details
  3. View AI analysis results
  4. Make a moderation decision (approve/reject)
  5. Add notes if rejecting

- **Expected Behavior:**
  - Content should be displayed correctly
  - AI analysis should show risk factors
  - Decision should be recorded
  - Content status should be updated in the source system

#### 4.3 Batch Actions

- **Steps:**
  1. Select multiple queue items
  2. Apply a batch action (approve/reject)
  3. Confirm the action

- **Expected Behavior:**
  - Action should be applied to all selected items
  - Queue should be updated to reflect the changes
  - Batch operation should be recorded in the audit log

### 5. Challenge Management

#### 5.1 Challenge Listing and Filtering

- **Steps:**
  1. Navigate to the Challenge Management section
  2. Test various filters (status, location, date)
  3. Test sorting by different columns

- **Expected Behavior:**
  - Challenges should be displayed in a paginated list
  - Filters should correctly narrow down the challenges
  - Sorting should work correctly for all columns

#### 5.2 Challenge Review and Approval

- **Steps:**
  1. Select a challenge
  2. Review the challenge details
  3. Check regional policy compliance
  4. Make an approval decision
  5. Add notes if rejecting

- **Expected Behavior:**
  - Challenge details should be displayed correctly
  - Regional policy checks should be highlighted
  - Decision should be recorded
  - Challenge status should be updated in Firestore

#### 5.3 Regional Policy Management

- **Steps:**
  1. Navigate to the Regional Policies section
  2. Create a new policy for a region
  3. Set restrictions and rules
  4. Apply the policy

- **Expected Behavior:**
  - Policy should be created with the specified rules
  - Policy should be applied to challenges in that region
  - Existing challenges should be flagged if they violate the new policy

### 6. Analytics and Reporting

#### 6.1 Dashboard Overview

- **Steps:**
  1. Navigate to the Dashboard
  2. Review the key metrics and charts

- **Expected Behavior:**
  - Dashboard should load quickly
  - Metrics should be accurate
  - Charts should be interactive

#### 6.2 Custom Reports

- **Steps:**
  1. Navigate to the Reports section
  2. Create a custom report
  3. Set filters and parameters
  4. Generate the report

- **Expected Behavior:**
  - Report should be generated with the specified parameters
  - Data should be accurate
  - Export options should work correctly

## Responsive Design Testing

Test the CMS interface on various screen sizes:

- Desktop (1920x1080, 1366x768)
- Tablet (iPad: 768x1024)
- Mobile (iPhone: 375x667)

Verify that:
- Layout adjusts appropriately
- All features are accessible
- Touch interactions work correctly on mobile devices

## Accessibility Testing

Verify that the CMS meets accessibility standards:

- Test keyboard navigation
- Check screen reader compatibility
- Verify color contrast meets WCAG standards
- Ensure all interactive elements have appropriate ARIA labels

## Performance Testing

While using the UI, pay attention to:

- Page load times
- Responsiveness of interactions
- Behavior with large data sets
- Memory usage over time

## Issue Reporting

When reporting issues, include:

1. **Environment Details**
   - Browser and version
   - Operating system
   - Screen resolution
   - User role used for testing

2. **Issue Description**
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots or screen recordings

3. **Severity Assessment**
   - Critical: System unusable
   - Major: Significant feature broken
   - Minor: Non-critical issue
   - Cosmetic: Visual or UX issue

## Test Data Management

- Use the provided test data for consistent testing
- Do not use real user data or PII
- Reset the test environment after destructive tests
- Document any test data you create for future reference

## Conclusion

This UI testing guide provides a structured approach to testing the LorePin CMS v2.0 interface. By following these guidelines, you can help ensure that the CMS functions correctly and provides a good user experience.

Remember that thorough testing is essential for identifying issues before they reach production. Take your time to explore edge cases and unusual scenarios, as these are often where bugs hide. 