# LorePin CMS User Journey Maps

## Admin User Journey

### 1. Authentication & Login
- **Entry Point**: Admin navigates to `https://cms.lorepin.com`
- **Login Screen**: 
  - Presented with a branded login form
  - Options to login with email/password or SSO (Google, Microsoft) buttons
  - "Remember me" checkbox and "Forgot password" link
- **Authentication Process**:
  - Firebase Authentication verifies credentials
  - System checks for admin role permissions
  - If valid, generates JWT token with admin claims
  - If invalid, displays appropriate error message

### 2. Post-Login Landing
- **Dashboard Redirect**: 
  - Automatically redirected to the Admin Dashboard
  - System loads personalized admin dashboard
- **Navigation Elements**:
  - Left sidebar with clearly labeled navigation menu
  - Top header with profile dropdown, notifications bell, and help icon
- **Welcome Elements**:
  - Personalized greeting ("Welcome back, [Admin Name]")
  - Summary cards showing pending actions requiring attention
  - Key metrics overview (content pending review, active users, etc.)
  - Recent system activity log

### 3. Core Admin Functions
- **User Management**:
  - Click "Users" in the left sidebar navigation menu
  - UI displays a data table of all platform users
  - Action buttons for each user: "Edit", "Suspend", "Reset Password"
  - "Create User" button in the top-right corner
  - Filter/search controls above the table

- **Role Management**:
  - Click "Roles & Permissions" in the left sidebar navigation menu
  - UI displays a list of existing roles with permission counts
  - "Create Role" button in the top-right corner
  - Click on any role to expand and view/edit permissions
  - Drag-and-drop interface for assigning permissions to roles

- **System Configuration**:
  - Click "Settings" in the left sidebar navigation menu
  - Tab-based interface with sections for:
    - "General Settings"
    - "AI Configuration" 
    - "Notifications"
    - "Regional Policies"
    - "API Integrations"
  - "Save Changes" button at the bottom of each settings page

- **Analytics & Reporting**:
  - Click "Analytics" in the left sidebar navigation menu
  - Dashboard with visualization cards and charts
  - Date range selector in the top-right corner
  - "Export" button for generating reports
  - Tabs for different analytics categories:
    - "Content Moderation"
    - "User Activity"
    - "Moderator Performance"
    - "Challenge Metrics"

- **Challenge Management**:
  - Click "Challenges" in the left sidebar navigation menu
  - Data table showing all platform challenges
  - Status badges (Active, Pending, Rejected)
  - Filter controls for status, region, date
  - "Create Challenge" button in the top-right corner
  - Action buttons for each challenge: "View", "Edit", "Approve/Reject"

### 4. Moderation Oversight
- **Moderation Queue Access**:
  - Click "Moderation" in the left sidebar navigation menu
  - Overview dashboard with queue statistics
  - "View Queue" button to access the actual moderation queue
  - "Assign Tasks" button for distributing work to moderators
  - "Settings" button for moderation workflow configuration

- **Audit Logs**:
  - Click "Audit Logs" in the left sidebar navigation menu
  - Data table showing all system actions with timestamps
  - Advanced filter panel with user, action type, date range filters
  - "Export Logs" button in the top-right corner
  - Click on any log entry to view full details in a modal

### 5. Logout Process
- **Logout Action**:
  - Click on profile icon/avatar in the top-right corner of the header
  - Select "Logout" from the dropdown menu
- **Session Termination**:
  - JWT token is invalidated
  - Session data is cleared
  - User is redirected to login screen
  - "You have been logged out successfully" message appears

## Moderator User Journey

### 1. Authentication & Login
- **Entry Point**: Moderator navigates to `https://cms.lorepin.com`
- **Login Screen**: 
  - Same branded login form as admin
  - Options to login with email/password or SSO buttons
- **Authentication Process**:
  - Firebase Authentication verifies credentials
  - System checks for moderator role permissions
  - If valid, generates JWT token with moderator claims
  - If invalid, displays appropriate error message

### 2. Post-Login Landing
- **Moderation Queue Redirect**: 
  - Automatically redirected to the Moderation Queue
  - System loads personalized moderator dashboard
- **Navigation Elements**:
  - Simplified left sidebar with moderator-specific options
  - Top header with profile dropdown, notifications bell, and help icon
- **Welcome Elements**:
  - Personalized greeting ("Welcome back, [Moderator Name]")
  - Queue status card (items awaiting review, estimated completion time)
  - Personal performance metrics card (items reviewed today, accuracy rate)
  - Recent activity log of their moderation decisions

### 3. Core Moderation Functions
- **Content Review Process**:
  - Click "Moderation Queue" in the left sidebar (or already there after login)
  - UI displays content items in a card-based interface
  - Each card shows:
    - Content preview (text snippet, thumbnail for images/videos)
    - Risk score badge (color-coded)
    - AI analysis summary
  - Click on a card to expand and review full content
  - Decision buttons clearly visible: "Approve", "Reject", "Escalate"
  - Notes field for adding comments
  - "Submit & Next" button to process and advance to next item

- **Batch Processing**:
  - Checkbox in the corner of each content card
  - "Select All" option at the top of the queue
  - "Batch Actions" dropdown appears when multiple items selected
  - Options: "Approve All", "Reject All", "Escalate All"
  - Modal for adding a common note to all selected items

- **Filter & Search**:
  - Filter panel accessible via "Filter" button above the queue
  - Dropdown selectors for content type, risk score range
  - Search box for finding specific user or challenge content
  - "Sort By" dropdown with options for priority, time, risk score
  - "Apply Filters" and "Clear Filters" buttons

- **Escalation Workflow**:
  - Click "Escalate" button on any content item
  - Modal appears requesting escalation reason
  - Dropdown to select specific admin (optional)
  - "Submit Escalation" button to complete the process

### 4. Challenge Moderation
- **Challenge Review**:
  - Click "Challenges" in the left sidebar navigation menu
  - Tab interface with "Pending", "Approved", "Rejected" tabs
  - Click on any challenge card to review details
  - Expandable sections for rules, location restrictions
  - Regional policy guide accessible via "Policy Reference" button
  - Decision buttons: "Approve", "Reject", "Request Changes"
  - Notes field for feedback to challenge creators

### 5. Performance & Learning
- **Personal Dashboard**:
  - Click "My Performance" in the left sidebar navigation menu
  - Performance metrics cards with visual indicators
  - Charts showing historical performance trends
  - Comparison metrics against AI predictions and team averages
  - "View History" button to access decision history

- **Knowledge Base**:
  - Click "Resources" in the left sidebar navigation menu
  - Searchable knowledge base with categorized articles
  - "Quick Reference" section for common scenarios
  - "Latest Updates" section highlighting recent policy changes
  - "Training" section with required and optional modules
  - Progress indicators for training completion

### 6. Mobile Experience (PWA)
- **Mobile-Optimized Navigation**:
  - Bottom navigation bar instead of left sidebar
  - Icons for: Queue, Challenges, Performance, Resources, Profile
  - Pull-to-refresh to update queue
  - Swipe gestures for approve/reject decisions
  - Notification center accessible via bell icon

### 7. Logout Process
- **Logout Action**:
  - Click on profile icon/avatar in the top-right corner of the header
  - Select "Logout" from the dropdown menu
- **Session Termination**:
  - JWT token is invalidated
  - Session data is cleared
  - User is redirected to login screen
  - "You have been logged out successfully" message appears

## Key Interaction Points Between Admin and Moderator Journeys

1. **Escalation Pathway**:
   - Moderator clicks "Escalate" on content → Admin receives notification → Admin clicks notification to review → Admin makes decision and adds feedback → Moderator receives notification with feedback

2. **Performance Review**:
   - Admin clicks "Moderator Performance" under Analytics → Reviews metrics → Identifies training needs → Assigns training via "Assign Training" button → Moderator sees training assignment notification → Moderator clicks "Resources" to complete training

3. **Policy Updates**:
   - Admin updates policies in Settings → Clicks "Publish & Notify" → System sends notification to all moderators → Moderators see notification → Moderators click to review changes → New policies applied to future decisions

4. **Queue Management**:
   - Admin monitors queue via Moderation dashboard → Adjusts assignments via "Assign Tasks" button → Moderators receive notification of new assignments → Moderators see updated work queue

## UI Design Principles

1. **Consistent Navigation**:
   - Left sidebar for main navigation (collapsible on smaller screens)
   - Top header for user-related actions and notifications
   - Breadcrumb navigation for deep pages
   - "Back" buttons where appropriate

2. **Clear Visual Hierarchy**:
   - Primary actions as prominent buttons with brand colors
   - Secondary actions as outlined buttons or text links
   - Destructive actions (delete, reject) in red with confirmation
   - Important information highlighted with appropriate visual weight

3. **Responsive Adaptations**:
   - Desktop: Full sidebar, expanded tables and cards
   - Tablet: Collapsible sidebar, slightly condensed layouts
   - Mobile: Bottom navigation, stacked card layouts, simplified controls
   - PWA: Optimized for touch with larger tap targets

4. **Accessibility Considerations**:
   - High contrast mode toggle in settings
   - Keyboard navigation support throughout
   - Screen reader compatible elements
   - Text size adjustment controls

## Technical Implementation Notes

1. **Authentication Flow**:
   - Implement Firebase Authentication with custom claims for role-based access
   - Use JWT tokens with appropriate expiration (8 hours for standard sessions)
   - Implement refresh token mechanism for "Remember me" functionality

2. **Navigation Implementation**:
   - Use React Router for web navigation
   - Implement role-based route guards
   - Maintain navigation state in Redux/Context
   - Use animated transitions between routes for better UX

3. **Security Measures**:
   - Implement session timeout after 30 minutes of inactivity
   - Require re-authentication for sensitive operations
   - Log all authentication events and admin actions
   - Implement IP-based access restrictions for admin accounts

4. **Performance Optimization**:
   - Implement caching for frequently accessed data
   - Use pagination for large data sets
   - Implement real-time updates using Firebase Realtime Database
   - Optimize image and video loading for moderation queue 