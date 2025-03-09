# LorePin CMS UI Mockups

## Overview

This document provides UI mockups and design specifications for the LorePin CMS v2.0. These mockups illustrate the key interfaces for content moderation, user management, challenge administration, and analytics dashboards, focusing on usability, efficiency, and ethical considerations.

## Design Principles

The UI design follows these key principles:

1. **Efficiency**: Streamlined workflows that minimize clicks and maximize throughput
2. **Clarity**: Clear presentation of information with intuitive navigation
3. **Consistency**: Uniform design patterns across all interfaces
4. **Accessibility**: WCAG 2.1 AA compliance for all interfaces
5. **Responsiveness**: Adapts to different screen sizes and devices
6. **Ethical Design**: Promotes fair and unbiased decision-making

## Color Palette

The CMS uses a professional color palette that complements the LorePin brand while providing clear visual hierarchy and accessibility:

- **Primary**: `#2A4365` (Dark Blue) - Headers, primary buttons
- **Secondary**: `#4299E1` (Blue) - Secondary actions, highlights
- **Accent**: `#F6AD55` (Orange) - Important notifications, calls to action
- **Success**: `#48BB78` (Green) - Positive actions, approvals
- **Warning**: `#ECC94B` (Yellow) - Cautions, warnings
- **Danger**: `#F56565` (Red) - Destructive actions, rejections
- **Neutral**: `#718096` (Gray) - Secondary text, borders
- **Background**: `#F7FAFC` (Light Gray) - Page backgrounds
- **White**: `#FFFFFF` - Card backgrounds, text on dark backgrounds

All color combinations meet WCAG 2.1 AA contrast requirements.

## Typography

The CMS uses a clean, readable typography system:

- **Headings**: Inter (Sans-serif)
- **Body**: Inter (Sans-serif)
- **Monospace**: Roboto Mono (for code or technical information)

Font sizes follow a modular scale:
- Heading 1: 24px (1.5rem)
- Heading 2: 20px (1.25rem)
- Heading 3: 16px (1rem)
- Body: 14px (0.875rem)
- Small: 12px (0.75rem)

## Layout System

The CMS uses a responsive grid system:
- 12-column grid for desktop
- 6-column grid for tablet
- 4-column grid for mobile

Standard spacing units:
- 4px (0.25rem) - Extra small
- 8px (0.5rem) - Small
- 16px (1rem) - Medium
- 24px (1.5rem) - Large
- 32px (2rem) - Extra large

## Common Components

### Navigation

The CMS uses a sidebar navigation with collapsible sections:

```
┌─────────────────────────────────────┐
│ LOREPIN CMS                         │
├─────────────────────────────────────┤
│ ▼ Dashboard                         │
│   └─ Overview                       │
│   └─ Analytics                      │
│                                     │
│ ▼ Content Moderation                │
│   └─ Moderation Queue               │
│   └─ Reported Content               │
│   └─ Appeals                        │
│   └─ Audit Log                      │
│                                     │
│ ▼ User Management                   │
│   └─ Users                          │
│   └─ Roles & Permissions            │
│   └─ User Notes                     │
│                                     │
│ ▼ Challenge Management              │
│   └─ Challenges                     │
│   └─ Approval Workflows             │
│   └─ Regional Policies              │
│                                     │
│ ▼ Analytics & Reporting             │
│   └─ Moderation Metrics             │
│   └─ User Metrics                   │
│   └─ Challenge Metrics              │
│   └─ Custom Reports                 │
│                                     │
│ ▼ Settings                          │
│   └─ System Settings                │
│   └─ AI Configuration               │
│   └─ Notification Settings          │
│   └─ API Keys                       │
│                                     │
│ ▼ Help & Support                    │
│   └─ Documentation                  │
│   └─ Training                       │
│   └─ Support                        │
└─────────────────────────────────────┘
```

### Header

The header contains user information, notifications, and global actions:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔍 Search...                                    🔔 (3) 💬 (2) 👤 Admin ▼    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cards

Content is organized in cards with consistent styling:

```
┌─────────────────────────────────────┐
│ Card Title                      ⋮   │
├─────────────────────────────────────┤
│                                     │
│ Card content goes here...           │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### Tables

Data is presented in responsive tables:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Column 1     │ Column 2     │ Column 3     │ Column 4     │ Actions        │
├──────────────┼──────────────┼──────────────┼──────────────┼────────────────┤
│ Data 1       │ Data 2       │ Data 3       │ Data 4       │ Edit Delete    │
│ Data 5       │ Data 6       │ Data 7       │ Data 8       │ Edit Delete    │
└──────────────┴──────────────┴──────────────┴──────────────┴────────────────┘
```

### Buttons

Button styles follow a consistent pattern:

```
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│  PRIMARY   │  │ SECONDARY  │  │   DANGER   │  │   GHOST    │
└────────────┘  └────────────┘  └────────────┘  └────────────┘
```

## Key Interfaces

### 1. Dashboard

The dashboard provides an overview of the system status and key metrics:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ DASHBOARD                                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Pending Review  │  │ Appeals Pending │  │ Avg. Resolution │  │ AI Accuracy     │
│                 │  │                 │  │                 │  │                 │
│      42         │  │       7         │  │    1.2 hrs      │  │     94.5%       │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
│ Moderation Activity                 │  │ Content Distribution                │
│                                     │  │                                     │
│ [Line chart showing activity over   │  │ [Pie chart showing distribution of  │
│  time with approval/rejection rate] │  │  content types in moderation queue] │
│                                     │  │                                     │
└─────────────────────────────────────┘  └─────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Recent Activity                                                             │
│                                                                             │
│ • John approved 5 challenge submissions (2 minutes ago)                     │
│ • AI flagged content from user @traveler123 for review (15 minutes ago)     │
│ • Sarah rejected a submission for violating community guidelines (1 hour ago)│
│ • New appeal submitted for rejected challenge #45692 (3 hours ago)          │
│                                                                             │
│                                                 View All Activity →         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2. Content Moderation Queue

The moderation queue is the primary interface for reviewing content:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MODERATION QUEUE                                       Filter ▼   Sort ▼    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Queue: High Priority (12) | Standard (30) | AI Flagged (8) | Reported (4)   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ SUBMISSION #45721                                    HIGH RISK (87/100)     │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────┐  User: @mountain_climber                      │
│ │                           │  Submitted: Today, 10:23 AM                   │
│ │                           │  Challenge: "Urban Exploration"               │
│ │      [Content Preview]    │  Location: Downtown Chicago, IL               │
│ │                           │  Previous Violations: 1                       │
│ │                           │                                               │
│ └───────────────────────────┘                                               │
│                                                                             │
│ AI Analysis:                                                                │
│ • Unsafe Activity (92% confidence) - Climbing restricted building           │
│ • Trespassing (87% confidence) - Private property                           │
│ • Similar to previously rejected content (3 similar submissions)            │
│                                                                             │
│ Context Factors:                                                            │
│ • Nighttime urban activity                                                  │
│ • Location tagged as restricted area                                        │
│ • Challenge rules prohibit illegal activities                               │
│                                                                             │
│ Recommended Action: Reject - Unsafe Activity & Trespassing                  │
│                                                                             │
│ ┌──────────┐  ┌──────────────────────────────────────┐  ┌──────────────────┐│
│ │ APPROVE  │  │ REJECT ▼                             │  │ ESCALATE         ││
│ └──────────┘  └──────────────────────────────────────┘  └──────────────────┘│
│                                                                             │
│ Notes: _____________________________________________________________        │
│                                                                             │
│ ┌──────────┐  ┌──────────┐                                                  │
│ │   SAVE   │  │   SKIP   │                                                  │
│ └──────────┘  └──────────┘                                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ SUBMISSION #45720                                    MEDIUM RISK (54/100)   │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Preview of next item in queue]                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3. User Management

The user management interface allows administrators to manage CMS users:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ USER MANAGEMENT                                     Search   + Add User     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ USERS                                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ Name          │ Email           │ Role(s)         │ Status    │ Actions    │
├───────────────┼─────────────────┼─────────────────┼───────────┼────────────┤
│ John Smith    │ john@email.com  │ Content Admin   │ Active    │ Edit Block │
│ Sarah Johnson │ sarah@email.com │ Moderator       │ Active    │ Edit Block │
│ Ahmed Hassan  │ ahmed@email.com │ Regional Mod    │ Active    │ Edit Block │
│ Maria Garcia  │ maria@email.com │ Super Admin     │ Active    │ Edit Block │
│ Li Wei        │ li@email.com    │ Moderator       │ Inactive  │ Edit Unblock│
└───────────────┴─────────────────┴─────────────────┴───────────┴────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ USER DETAILS: John Smith                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ General Information                                                         │
│ ┌───────────────────────────┐  Name: John Smith                             │
│ │                           │  Email: john@email.com                        │
│ │                           │  Role: Content Admin                          │
│ │         [Avatar]          │  Status: Active                               │
│ │                           │  Last Login: Today, 9:15 AM                   │
│ │                           │  Created: 2024-12-15                          │
│ └───────────────────────────┘                                               │
│                                                                             │
│ Permissions                                                                 │
│ ☑ Manage Users              ☑ Approve Content           ☑ Edit Challenges  │
│ ☐ Manage Roles              ☑ Reject Content            ☑ Delete Challenges│
│ ☐ System Settings           ☑ View Reports              ☐ Manage API Keys  │
│                                                                             │
│ Activity Log                                                                │
│ • Approved challenge submission #45719 (1 hour ago)                         │
│ • Rejected challenge submission #45718 (2 hours ago)                        │
│ • Updated regional policy for Europe (Yesterday, 3:45 PM)                   │
│                                                                             │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐                                    │
│ │   SAVE   │  │  BLOCK   │  │  DELETE  │                                    │
│ └──────────┘  └──────────┘  └──────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4. Challenge Management

The challenge management interface allows administrators to manage challenges:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CHALLENGE MANAGEMENT                                Search   + Add Challenge │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ CHALLENGES                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Title         │ Sponsor        │ Status         │ Submissions │ Actions     │
├───────────────┼────────────────┼────────────────┼─────────────┼─────────────┤
│ Urban Photo   │ CityLens       │ Active         │ 342         │ Edit Pause  │
│ Beach Cleanup │ OceanGuard     │ Pending        │ 0           │ Edit Approve│
│ Mountain Trek │ HikePro        │ Active         │ 127         │ Edit Pause  │
│ Street Art    │ ArtCollective  │ Paused         │ 89          │ Edit Resume │
└───────────────┴────────────────┴────────────────┴─────────────┴─────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ CHALLENGE DETAILS: Beach Cleanup                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ General Information                                                         │
│ ┌───────────────────────────┐  Title: Beach Cleanup Challenge               │
│ │                           │  Sponsor: OceanGuard                          │
│ │                           │  Status: Pending Approval                     │
│ │    [Challenge Image]      │  Start Date: 2025-04-01                       │
│ │                           │  End Date: 2025-04-30                         │
│ │                           │  Location: Miami Beach, FL                    │
│ └───────────────────────────┘  Reward: 500 LoreCoins                        │
│                                                                             │
│ Description:                                                                │
│ Join our beach cleanup challenge! Submit before and after photos of your    │
│ beach cleanup efforts. Help protect our oceans and earn rewards!            │
│                                                                             │
│ Rules:                                                                      │
│ • Must show before and after photos                                         │
│ • Must be at a public beach                                                 │
│ • Must properly dispose of collected trash                                  │
│ • No dangerous items (needles, etc.) should be handled                      │
│                                                                             │
│ Approval Status:                                                            │
│ • Content Review: ✓ Approved by John Smith (Yesterday)                      │
│ • Legal Review: ✓ Approved by Sarah Johnson (Today)                         │
│ • Final Approval: ⟳ Pending                                                 │
│                                                                             │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│ │ APPROVE  │  │  REJECT  │  │   EDIT   │  │  DELETE  │                      │
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5. Analytics Dashboard

The analytics dashboard provides insights into moderation activities:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ANALYTICS DASHBOARD                                 Export ▼   Date Range ▼ │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ MODERATION METRICS                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐│
│ │ Moderation Volume                   │  │ Decision Distribution           ││
│ │                                     │  │                                 ││
│ │ [Line chart showing daily           │  │ [Pie chart showing approved,    ││
│ │  moderation volume over time]       │  │  rejected, escalated]           ││
│ │                                     │  │                                 ││
│ └─────────────────────────────────────┘  └─────────────────────────────────┘│
│                                                                             │
│ ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐│
│ │ Processing Time                     │  │ AI Accuracy                     ││
│ │                                     │  │                                 ││
│ │ [Bar chart showing average          │  │ [Line chart showing AI accuracy ││
│ │  processing time by content type]   │  │  over time with trend line]     ││
│ │                                     │  │                                 ││
│ └─────────────────────────────────────┘  └─────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ MODERATOR PERFORMANCE                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ Moderator      │ Items Processed │ Avg. Time │ Accuracy │ Appeal Rate      │
├────────────────┼─────────────────┼───────────┼──────────┼──────────────────┤
│ John Smith     │ 342             │ 45s       │ 97.2%    │ 2.1%             │
│ Sarah Johnson  │ 289             │ 52s       │ 96.8%    │ 2.5%             │
│ Ahmed Hassan   │ 156             │ 63s       │ 95.4%    │ 3.2%             │
│ Maria Garcia   │ 203             │ 48s       │ 98.1%    │ 1.8%             │
└────────────────┴─────────────────┴───────────┴──────────┴──────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ CONTENT INSIGHTS                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐│
│ │ Violation Types                     │  │ Geographic Distribution         ││
│ │                                     │  │                                 ││
│ │ [Bar chart showing frequency        │  │ [World map with heat overlay    ││
│ │  of different violation types]      │  │  showing violation density]     ││
│ │                                     │  │                                 ││
│ └─────────────────────────────────────┘  └─────────────────────────────────┘│
│                                                                             │
│ Trending Keywords in Rejected Content:                                      │
│ #urbanexploration (↑42%)  #challenge (↑12%)  #extreme (↑28%)  #party (↑15%)│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6. Mobile PWA Interface

The mobile PWA provides a streamlined interface for moderators on the go:

```
┌─────────────────────────┐
│ LorePin CMS             │
│ ≡                    🔔 │
├─────────────────────────┤
│ MODERATION QUEUE (15)   │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ [Content Preview]   │ │
│ │                     │ │
│ │ HIGH RISK (87/100)  │ │
│ │                     │ │
│ │ @mountain_climber   │ │
│ │ 10:23 AM            │ │
│ └─────────────────────┘ │
│                         │
│ AI Analysis:            │
│ • Unsafe Activity (92%) │
│ • Trespassing (87%)     │
│                         │
│ ┌─────────┐ ┌─────────┐ │
│ │ APPROVE │ │ REJECT  │ │
│ └─────────┘ └─────────┘ │
│                         │
│ ┌─────────┐ ┌─────────┐ │
│ │ ESCALATE│ │  SKIP   │ │
│ └─────────┘ └─────────┘ │
│                         │
│ Notes:                  │
│ ┌─────────────────────┐ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │        SAVE         │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## User Flows

### Content Moderation Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Login to CMS│────▶│ Navigate to │────▶│ Review Item │────▶│Make Decision│
└─────────────┘     │ Moderation  │     │ Details     │     │(Approve/    │
                    │ Queue       │     │             │     │Reject/      │
                    └─────────────┘     └─────────────┘     │Escalate)    │
                                                            └──────┬──────┘
                                                                   │
                    ┌─────────────┐     ┌─────────────┐           │
                    │ View Next   │◀────│ Add Notes   │◀──────────┘
                    │ Item        │     │ (Optional)  │
                    └─────────────┘     └─────────────┘
```

### User Management Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Login to CMS│────▶│ Navigate to │────▶│ Search/     │────▶│ View User   │
└─────────────┘     │ User        │     │ Filter Users│     │ Details     │
                    │ Management  │     │             │     │             │
                    └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                   │
                    ┌─────────────┐     ┌─────────────┐           │
                    │ Save Changes│◀────│ Edit User   │◀──────────┘
                    │             │     │ Details     │
                    └─────────────┘     └─────────────┘
```

### Challenge Approval Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Login to CMS│────▶│ Navigate to │────▶│ View Pending│────▶│ Review      │
└─────────────┘     │ Challenge   │     │ Challenges  │     │ Challenge   │
                    │ Management  │     │             │     │ Details     │
                    └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                   │
                    ┌─────────────┐     ┌─────────────┐           │
                    │ Notify      │◀────│ Make        │◀──────────┘
                    │ Sponsor     │     │ Decision    │
                    └─────────────┘     └─────────────┘
```

## Accessibility Considerations

The CMS UI is designed with accessibility in mind:

1. **Keyboard Navigation**: All interfaces are fully navigable using keyboard only
2. **Screen Reader Support**: Proper ARIA labels and semantic HTML
3. **Color Contrast**: All text meets WCAG 2.1 AA contrast requirements
4. **Text Sizing**: All text can be resized up to 200% without loss of functionality
5. **Focus Indicators**: Clear visual indicators for keyboard focus
6. **Alternative Text**: All images have appropriate alternative text
7. **Error Identification**: Form errors are clearly identified and described

## Responsive Design

The CMS adapts to different screen sizes:

1. **Desktop** (1200px+): Full layout with sidebar navigation
2. **Tablet** (768px - 1199px): Collapsible sidebar, adjusted card layouts
3. **Mobile** (320px - 767px): Bottom navigation, stacked cards, simplified tables

## Implementation Notes

The UI will be implemented using:

1. **React Admin**: Core framework for admin interface
2. **Material-UI**: Component library for consistent design
3. **Chart.js**: Data visualization for analytics
4. **React Query**: Data fetching and state management
5. **React Hook Form**: Form handling and validation

Custom components will be created for specialized moderation interfaces.

## Next Steps

1. **Prototype Development**: Create interactive prototypes in Figma
2. **User Testing**: Conduct usability testing with moderators
3. **Accessibility Audit**: Verify WCAG 2.1 AA compliance
4. **Component Development**: Build reusable UI components
5. **Integration**: Connect UI to backend services

## Conclusion

These UI mockups provide a foundation for the LorePin CMS v2.0 interface design. The focus on efficiency, clarity, and ethical considerations will ensure that moderators can make fair and accurate decisions while maintaining high throughput. The responsive design and accessibility features ensure that the CMS can be used effectively by all team members, regardless of device or ability.

The next phase will involve creating interactive prototypes and conducting user testing to refine the design before implementation.