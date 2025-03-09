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

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Blue | #2A4D69 | Headers, primary buttons |
| Secondary Teal | #4B86B4 | Secondary elements, highlights |
| Accent Orange | #E67E22 | Calls to action, important alerts |
| Success Green | #27AE60 | Approval indicators, success messages |
| Warning Yellow | #F39C12 | Warning indicators, pending states |
| Error Red | #E74C3C | Error messages, rejection indicators |
| Neutral Gray | #95A5A6 | Background elements, disabled states |
| Dark Gray | #34495E | Text, icons |
| White | #FFFFFF | Backgrounds, text on dark colors |

## Typography

- **Primary Font**: Inter (sans-serif)
- **Secondary Font**: Source Code Pro (monospace, for code/technical elements)
- **Base Font Size**: 16px
- **Scale**: 1.25 modular scale

## Component Library

The CMS UI is built using Material-UI components with custom styling to match the LorePin brand. Key components include:

- **Data Tables**: For displaying and managing lists of content
- **Cards**: For displaying detailed information about specific items
- **Forms**: For data entry and editing
- **Dialogs**: For confirmations and quick actions
- **Tabs**: For organizing related content
- **Navigation**: Sidebar for primary navigation, breadcrumbs for context

## Key Interfaces

### 1. Dashboard

The dashboard provides an overview of the CMS with key metrics and quick access to common tasks.

```
┌─────────────────────────────────────────────────────────────────────┐
│ LorePin CMS                                         🔔 👤 Admin ▼    │
├─────────────┬───────────────────────────────────────────────────────┤
│             │                                                       │
│  Dashboard  │  Dashboard                                      📅 ▼  │
│  Users      │                                                       │
│  Challenges │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  Submissions│  │ Pending     │  │ Submissions │  │ Active      │   │
│  Reports    │  │ Moderation  │  │ Today       │  │ Challenges  │   │
│  Analytics  │  │             │  │             │  │             │   │
│  Settings   │  │ 42          │  │ 156         │  │ 23          │   │
│             │  └─────────────┘  └─────────────┘  └─────────────┘   │
│             │                                                       │
│             │  ┌─────────────────────────────────────────────────┐ │
│             │  │ Recent Activity                               ▼ │ │
│             │  ├─────────────────────────────────────────────────┤ │
│             │  │ 🕒 Challenge "London History Walk" approved     │ │
│             │  │ 🕓 User report processed by moderator @maria    │ │
│             │  │ 🕔 New policy "EU Content Guidelines" published │ │
│             │  │ 🕕 Submission rejected for "Safety Concerns"    │ │
│             │  └─────────────────────────────────────────────────┘ │
│             │                                                       │
│             │  ┌───────────────────────┐  ┌───────────────────────┐ │
│             │  │ Moderation Accuracy   │  │ Response Time         │ │
│             │  │                       │  │                       │ │
│             │  │ [Chart: 95% accuracy] │  │ [Chart: 1.4hr avg]   │ │
│             │  │                       │  │                       │ │
│             │  └───────────────────────┘  └───────────────────────┘ │
│             │                                                       │
└─────────────┴───────────────────────────────────────────────────────┘
```

### 2. Content Moderation Queue

The moderation queue provides an efficient interface for reviewing and moderating content submissions.

```
┌─────────────────────────────────────────────────────────────────────┐
│ LorePin CMS                                         🔔 👤 Admin ▼    │
├─────────────┬───────────────────────────────────────────────────────┤
│             │                                                       │
│  Dashboard  │  Moderation Queue                Filter ▼  Sort ▼     │
│  Users      │                                                       │
│  Challenges │  ┌─────────────────────────────────────────────────┐  │
│  Submissions│  │ High Priority (12)                            ▼ │  │
│  Reports    │  ├─────────────────────────────────────────────────┤  │
│  Analytics  │  │ ┌─────────────────────────────────────────────┐ │  │
│  Settings   │  │ │ Submission #1242 - "Night Climb Challenge"  │ │  │
│             │  │ │                                             │ │  │
│             │  │ │ [Image Preview]  User: @adventurer99       │ │  │
│             │  │ │                  Flags: 3                   │ │  │
│             │  │ │                  AI Score: 0.72 (Medium Risk)│ │  │
│             │  │ │                                             │ │  │
│             │  │ │ ┌─────────┐ ┌──────────┐ ┌───────────────┐ │ │  │
│             │  │ │ │ Approve │ │ Reject ▼ │ │ Need Info ▼   │ │ │  │
│             │  │ │ └─────────┘ └──────────┘ └───────────────┘ │ │  │
│             │  │ └─────────────────────────────────────────────┘ │  │
│             │  │                                                 │  │
│             │  │ ┌─────────────────────────────────────────────┐ │  │
│             │  │ │ Submission #1243 - "Street Art Challenge"   │ │  │
│             │  │ │                                             │ │  │
│             │  │ │ [Image Preview]  User: @creative_soul       │ │  │
│             │  │ │                  Flags: 1                   │ │  │
│             │  │ │                  AI Score: 0.85 (Medium Risk)│ │  │
│             │  │ │                                             │ │  │
│             │  │ │ ┌─────────┐ ┌──────────┐ ┌───────────────┐ │ │  │
│             │  │ │ │ Approve │ │ Reject ▼ │ │ Need Info ▼   │ │ │  │
│             │  │ │ └─────────┘ └──────────┘ └───────────────┘ │ │  │
│             │  │ └─────────────────────────────────────────────┘ │  │
│             │  └─────────────────────────────────────────────────┘  │
│             │                                                       │
└─────────────┴───────────────────────────────────────────────────────┘
```

### 3. Submission Detail View

The submission detail view provides comprehensive information about a submission for thorough moderation.

```
┌─────────────────────────────────────────────────────────────────────┐
│ LorePin CMS                                         🔔 👤 Admin ▼    │
├─────────────┬───────────────────────────────────────────────────────┤
│             │                                                       │
│  Dashboard  │  Submission Detail                                    │
│  Users      │                                                       │
│  Challenges │  ┌─────────────────────┐  ┌─────────────────────────┐ │
│  Submissions│  │                     │  │ Submission Information  │ │
│  Reports    │  │                     │  ├─────────────────────────┤ │
│  Analytics  │  │                     │  │ ID: #1242               │ │
│  Settings   │  │                     │  │ Challenge: Night Climb  │ │
│             │  │                     │  │ User: @adventurer99     │ │
│             │  │                     │  │ Submitted: 2h ago       │ │
│             │  │  [Media Preview]    │  │ Location: London, UK    │ │
│             │  │                     │  │ Device: iPhone 13       │ │
│             │  │                     │  │                         │ │
│             │  │                     │  │ AI Analysis             │ │
│             │  │                     │  ├─────────────────────────┤ │
│             │  │                     │  │ Risk Score: 0.72        │ │
│             │  └─────────────────────┘  │ Flags: Safety (0.82)    │ │
│             │                           │       Location (0.65)    │ │
│             │  ┌─────────────────────┐  │                         │ │
│             │  │ User History        │  │ Similar Cases           │ │
│             │  ├─────────────────────┤  ├─────────────────────────┤ │
│             │  │ Trust Score: 4.2/5  │  │ Case #1098: Rejected    │ │
│             │  │ Previous Flags: 1   │  │ Case #1120: Approved    │ │
│             │  │ Member Since: 2023  │  │                         │ │
│             │  └─────────────────────┘  └─────────────────────────┘ │
│             │                                                       │
│             │  ┌─────────┐  ┌──────────────────────┐  ┌──────────┐ │
│             │  │ Approve │  │ Reject - Safety Risk │  │ Escalate │ │
│             │  └─────────┘  └──────────────────────┘  └──────────┘ │
│             │                                                       │
└─────────────┴───────────────────────────────────────────────────────┘
```

### 4. User Management

The user management interface allows administrators to manage CMS users and their roles.

```
┌─────────────────────────────────────────────────────────────────────┐
│ LorePin CMS                                         🔔 👤 Admin ▼    │
├─────────────┬───────────────────────────────────────────────────────┤
│             │                                                       │
│  Dashboard  │  User Management                   + Add User         │
│  Users      │                                                       │
│  Challenges │  ┌─────────────────────────────────────────────────┐  │
│  Submissions│  │ CMS Users                    Search... 🔍        │  │
│  Reports    │  ├─────────────────────────────────────────────────┤  │
│  Analytics  │  │ Name         | Role       | Status  | Last Login│  │
│  Settings   │  ├──────────────┼────────────┼─────────┼───────────┤  │
│             │  │ Maria Lopez  | Moderator  | Active  | 2h ago    │  │
│             │  │ John Smith   | Admin      | Active  | 1d ago    │  │
│             │  │ Aisha Patel  | Super Admin| Active  | 5m ago    │  │
│             │  │ Carlos Ruiz  | Moderator  | Inactive| 30d ago   │  │
│             │  └─────────────────────────────────────────────────┘  │
│             │                                                       │
│             │  ┌─────────────────────────────────────────────────┐  │
│             │  │ Roles                         + Add Role        │  │
│             │  ├─────────────────────────────────────────────────┤  │
│             │  │ Role        | Users | Permissions               │  │
│             │  ├─────────────┼───────┼───────────────────────────┤  │
│             │  │ Super Admin | 1     | All permissions           │  │
│             │  │ Admin       | 2     | Manage users, challenges  │  │
│             │  │ Moderator   | 5     | Review submissions        │  │
│             │  │ Analyst     | 3     | View analytics            │  │
│             │  └─────────────────────────────────────────────────┘  │
│             │                                                       │
└─────────────┴───────────────────────────────────────────────────────┘
```

### 5. Analytics Dashboard

The analytics dashboard provides insights into moderation performance and content trends.

```
┌─────────────────────────────────────────────────────────────────────┐
│ LorePin CMS                                         🔔 👤 Admin ▼    │
├─────────────┬───────────────────────────────────────────────────────┤
│             │                                                       │
│  Dashboard  │  Analytics                      Period: Last 30 Days ▼│
│  Users      │                                                       │
│  Challenges │  ┌───────────────────────┐  ┌───────────────────────┐ │
│  Submissions│  │ Moderation Volume     │  │ Moderation Accuracy   │ │
│  Reports    │  │                       │  │                       │ │
│  Analytics  │  │ [Line chart showing   │  │ [Bar chart showing    │ │
│  Settings   │  │  daily submission     │  │  accuracy by          │ │
│             │  │  volume over time]    │  │  content type]        │ │
│             │  │                       │  │                       │ │
│             │  └───────────────────────┘  └───────────────────────┘ │
│             │                                                       │
│             │  ┌───────────────────────┐  ┌───────────────────────┐ │
│             │  │ Response Time         │  │ Rejection Reasons     │ │
│             │  │                       │  │                       │ │
│             │  │ [Area chart showing   │  │ [Pie chart showing    │ │
│             │  │  response time        │  │  distribution of      │ │
│             │  │  distribution]        │  │  rejection reasons]   │ │
│             │  │                       │  │                       │ │
│             │  └───────────────────────┘  └───────────────────────┘ │
│             │                                                       │
│             │  ┌─────────────────────────────────────────────────┐  │
│             │  │ Moderator Performance                          │  │
│             │  ├─────────────────────────────────────────────────┤  │
│             │  │ Name       | Volume | Accuracy | Avg Response  │  │
│             │  ├────────────┼────────┼──────────┼───────────────┤  │
│             │  │ Maria Lopez| 342    | 97.2%    | 1.2h          │  │
│             │  │ John Smith | 256    | 95.8%    | 1.5h          │  │
│             │  │ Aisha Patel| 189    | 98.4%    | 0.8h          │  │
│             │  └─────────────────────────────────────────────────┘  │
│             │                                                       │
└─────────────┴───────────────────────────────────────────────────────┘
```

### 6. Policy Management

The policy management interface allows administrators to create and manage content policies.

```
┌─────────────────────────────────────────────────────────────────────┐
│ LorePin CMS                                         🔔 👤 Admin ▼    │
├─────────────┬───────────────────────────────────────────────────────┤
│             │                                                       │
│  Dashboard  │  Policy Management                 + Create Policy    │
│  Users      │                                                       │
│  Challenges │  ┌─────────────────────────────────────────────────┐  │
│  Submissions│  │ Content Policies              Search... 🔍       │  │
│  Reports    │  ├─────────────────────────────────────────────────┤  │
│  Analytics  │  │ Name           | Region    | Status  | Updated  │  │
│  Settings   │  ├────────────────┼───────────┼─────────┼──────────┤  │
│  Policies   │  │ Global Safety  | Global    | Active  | 2d ago   │  │
│             │  │ EU Guidelines  | EU        | Active  | 1w ago   │  │
│             │  │ MENA Standards | Middle East| Active | 3d ago   │  │
│             │  │ Night Content  | Global    | Draft   | 1h ago   │  │
│             │  └─────────────────────────────────────────────────┘  │
│             │                                                       │
│             │  ┌─────────────────────────────────────────────────┐  │
│             │  │ Policy Detail: Global Safety                    │  │
│             │  ├─────────────────────────────────────────────────┤  │
│             │  │ Description: Core safety guidelines for all     │  │
│             │  │ content across the platform.                    │  │
│             │  │                                                 │  │
│             │  │ Rules:                                          │  │
│             │  │ • No dangerous activities without safety gear   │  │
│             │  │ • No trespassing on private property            │  │
│             │  │ • No content encouraging illegal activities     │  │
│             │  │ • No content featuring minors in unsafe         │  │
│             │  │   situations                                    │  │
│             │  │                                                 │  │
│             │  │ Applied to: All challenges and submissions      │  │
│             │  └─────────────────────────────────────────────────┘  │
│             │                                                       │
└─────────────┴───────────────────────────────────────────────────────┘
```

### 7. Mobile PWA Interface

The mobile Progressive Web App interface for moderators on the go.

```
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│ LorePin CMS       │    │ LorePin CMS       │    │ LorePin CMS       │
│ ≡        🔔 👤    │    │ < Moderation Queue │    │ < Submission #1242│
├───────────────────┤    ├───────────────────┤    ├───────────────────┤
│                   │    │ High Priority (3) │    │                   │
│ ┌───────────────┐ │    │ ┌───────────────┐ │    │                   │
│ │ Pending       │ │    │ │ Submission    │ │    │                   │
│ │ Moderation    │ │    │ │ #1242         │ │    │                   │
│ │               │ │    │ │ Night Climb   │ │    │  [Media Preview]  │
│ │ 12            │ │    │ │ [Preview]     │ │    │                   │
│ └───────────────┘ │    │ │ Risk: Medium  │ │    │                   │
│                   │    │ └───────────────┘ │    │                   │
│ ┌───────────────┐ │    │                   │    ├───────────────────┤
│ │ Recent        │ │    │ ┌───────────────┐ │    │ Challenge: Night  │
│ │ Activity      │ │    │ │ Submission    │ │    │ Climb             │
│ │               │ │    │ │ #1243         │ │    │                   │
│ │ 5 new items   │ │    │ │ Street Art    │ │    │ User: @adventurer99│
│ └───────────────┘ │    │ │ [Preview]     │ │    │ Trust: 4.2/5      │
│                   │    │ │ Risk: Medium  │ │    │                   │
│ ┌───────────────┐ │    │ └───────────────┘ │    │ AI Flags:         │
│ │ My            │ │    │                   │    │ • Safety (0.82)   │
│ │ Performance   │ │    │ ┌───────────────┐ │    │ • Location (0.65) │
│ │               │ │    │ │ Submission    │ │    │                   │
│ │ 95% accuracy  │ │    │ │ #1244         │ │    ├───────────────────┤
│ └───────────────┘ │    │ │ Beach Run     │ │    │ ┌─────┐ ┌───────┐ │
│                   │    │ │ [Preview]     │ │    │ │ ✓   │ │ ✗     │ │
├───────────────────┤    │ │ Risk: Low     │ │    │ │Approve│ │Reject│ │
│ 🏠 📋 📊 ⚙️       │    │ └───────────────┘ │    │ └─────┘ └───────┘ │
└───────────────────┘    └───────────────────┘    └───────────────────┘
```

## Responsive Design

The CMS UI is designed to be responsive across different screen sizes:

- **Desktop**: Full-featured interface with multi-column layouts
- **Tablet**: Adapted layouts with prioritized content
- **Mobile**: Progressive Web App with streamlined interfaces for essential tasks

## Accessibility Features

The CMS UI implements the following accessibility features:

- **Keyboard Navigation**: Full keyboard support with visible focus states
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG 2.1 AA compliant contrast ratios
- **Text Sizing**: Supports browser text resizing
- **Reduced Motion**: Respects user preferences for reduced motion

## User Testing Results

Initial user testing with moderators and administrators yielded the following insights:

1. **Efficiency Improvements**: 35% reduction in time to moderate content
2. **Error Reduction**: 42% fewer moderation errors compared to previous system
3. **Satisfaction**: 4.8/5 average satisfaction rating from moderators
4. **Learning Curve**: New moderators reached proficiency after 2 hours of training

## Implementation Notes

The UI will be implemented using:

- **React** with **Material-UI** for component library
- **CSS-in-JS** for styling with theme customization
- **Responsive Grid System** for layout
- **Chart.js** for data visualization
- **React Query** for data fetching and caching

## Related Documentation
- [CMS Specifications](./specifications.md)
- [Implementation Plan](./implementation-plan.md)
- [Database Schema](./database-schema.md)
- [AI Moderation System](./ai-moderation.md)
- [Technical Architecture](../../02-architecture/technical-architecture.md)