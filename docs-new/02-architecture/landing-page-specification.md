# LorePin Landing Page Specification

This document outlines the requirements and design specifications for the LorePin landing page version 2.1, which introduces live active challenges to drive immediate user engagement.

## Core Vision

> **"Every city has stories. We turn explorers into storytellers, and storytellers into legends."**

The landing page serves as the primary entry point for new users and returning visitors, showcasing the platform's core value proposition while highlighting real-time activity to create urgency and excitement.

## New Feature Overview

The primary enhancement in version 2.1 is the integration of **Live Active Challenges** directly into the landing page. This feature is designed to:

- Drive immediate engagement by showcasing real-time activity
- Create a sense of urgency through countdown timers and participant counts
- Provide a seamless path to participation for new visitors
- Reinforce the platform's dynamic, community-driven nature

## Detailed Section Specifications

### 1. Hero Section (Updated)

The hero section maintains its prominent position but now includes interactive elements that highlight current platform activity.

#### Live Counter Overlay
- **Floating badge** positioned on the "London" city grid element
- **Content:** "124 Active Challenges Right Now 🔥"
- **Visual Style:** Semi-transparent background with pulsing animation
- **Interaction:** On hover, displays a tooltip with example challenges
  - Example 1: "Film the Thames at Golden Hour – £500 Prize"
  - Example 2: "Capture Camden's Best Street Art – Mint as NFT"

#### Technical Requirements
- Badge should update in real-time based on the actual number of active challenges
- Tooltip examples should be dynamically populated from the top 2-3 trending challenges

### 2. New Section: Live Active Challenges

This entirely new section is positioned between the Hero and Value Proposition sections to capitalize on initial visitor interest.

#### 2.1 Section Header
- **Title:** "Trending in London Right Now"
- **Subtitle:** "Join the action. Earn rewards. Own the story."
- **View All Link:** "Explore All Challenges →" (links to `/challenges?location=london`)
- **Visual Style:** Bold typography with subtle animated underline effect

#### 2.2 Challenge Carousel
A dynamic, scrollable carousel showcasing currently active challenges.

##### Layout Specifications
- **Desktop:** Horizontal scroll with 3-4 cards visible simultaneously
- **Mobile:** Vertical swipe with 3 cards visible
- **Scroll Controls:** Subtle arrow indicators and drag functionality

##### Card Design
- **Dimensions:** 320px × 420px (desktop), 100% width × 380px (mobile)
- **Background:** Animated gradient (magenta → cyan) with noise overlay
- **Border:** 1px with 70% opacity, 12px border radius
- **Shadow:** Subtle drop shadow with blue glow on hover

##### Card Content
- **Challenge Title:** "Time-Lapse the Tower Bridge" (24px, bold)
- **Reward:** "£200 + Limited-Edition NFT" (18px, medium)
- **Deadline:** "23h 59m left" with live countdown timer (16px)
- **Participants:** "86 creators joined" with avatar stack + progress bar
- **CTA Button:** "Join Now" with pulsing "Neon Moss" outline
- **Optional Tag:** "Beginner-Friendly" or "Trending" based on challenge metadata

##### Interactive Elements
- **Hover Effect:** Card tilts with 3D parallax effect (5° maximum rotation)
- **Backface Reveal:** On hover, card flips to reveal submission examples
- **Video Indicator:** Play button overlay for video-based challenges
- **Click Action:** Entire card is clickable, leading to challenge detail page

#### 2.3 Technical Implementation

##### Data Source
```javascript
// Firestore query to fetch active challenges
db.collection("challenges")
  .where("status", "==", "active")
  .where("location.city", "==", "London")
  .orderBy("deadline")
  .limit(6);
```

##### Animation Specifications
- **Carousel Behavior:** Auto-scrolls with 5-second interval, pauses on hover
- **Card Loading:** Staggered slide-up animation using Framer Motion
- **Countdown Timer:** Updates in real-time without page refresh
- **Avatar Stack:** New participants fade in with subtle animation

##### Performance Considerations
- Implement lazy loading for carousel images (50% viewport threshold)
- Use image compression and next-gen formats (WebP)
- Implement skeleton loading state while data is being fetched

### 3. Updated Interactive Global Map

The existing global map component is enhanced to reflect live challenge activity.

#### Live Challenge Pulses
- **Visual Update:** London's pulse now displays specific count: "124 Active"
- **Other Cities:** Display actual counts instead of generic "Active Challenges" text
- **Pulse Animation:** Intensity varies based on number of active challenges

#### Interaction Behavior
- **Click Interaction:** Clicking on London now zooms in and automatically scrolls to the Live Active Challenges section
- **Responsive Behavior:** On mobile, tapping a city opens a modal with challenge preview

### 4. Integration with Existing Sections

Updates to ensure the new Live Challenges section integrates seamlessly with existing content.

#### Value Proposition Cards
- **"Economy of Curiosity" Card:** Now includes a real-time feed of recent redemptions
  - Example: "@UrbanExplorer redeemed 500 coins for a Tate Modern tour."
- **Feed Style:** Ticker-tape style animation with 3-5 recent redemptions

#### Creator Spotlight
- **Dynamic Stats Overlay:** Updated to show "£23,450 Earned This Week via Active Challenges"
- **Visual Style:** Consistent with the challenge cards' gradient and typography

### 5. Performance & Analytics

Specifications for ensuring optimal performance and tracking user engagement.

#### Lazy Loading Implementation
- Challenge carousel images load on scroll (50% viewport threshold)
- Implement progressive image loading (low-res placeholder → full image)
- Preload next/previous carousel items for smooth scrolling

#### Analytics Integration
- **Google Analytics 4 (GA4) Events:**
  - `challenge_impression`: Fired when a challenge card enters viewport
    - Parameters: `challenge_id`, `position_in_carousel`
  - `challenge_click`: Logged when a user clicks on a challenge
    - Parameters: `challenge_id`, `user_type` (guest/logged-in), `time_to_click`
  - `section_view`: Tracks which sections users are engaging with
    - Parameters: `section_name`, `time_spent`

## Design Principles & Rationale

### Why This Update Works
1. **Urgency & FOMO:** Live countdown timers and participant statistics create a sense of urgency that encourages immediate action.
2. **Seamless Flow:** Positioning challenges before the value proposition leverages visitor curiosity and provides immediate context.
3. **Brand Consistency:** The card gradients, parallax effects, and animations align with LorePin's established cyberpunk-retro aesthetic.
4. **Social Proof:** Participant counts and avatar stacks demonstrate active community engagement.

### Accessibility Considerations
- All interactive elements must be keyboard navigable
- Color contrast ratios must meet WCAG AA standards
- Animation effects should respect user preferences (prefers-reduced-motion)
- Alternative text for all images and meaningful icons

## Implementation Timeline

| Phase | Description | Duration |
|-------|-------------|----------|
| Design | Create high-fidelity mockups and interactive prototypes | 1 week |
| Frontend Development | Implement HTML/CSS/JS components | 2 weeks |
| Backend Integration | Connect to live data sources | 1 week |
| Testing | Cross-browser, performance, and accessibility testing | 1 week |
| Deployment | Staged rollout to production | 2 days |

## Success Metrics

The landing page update will be evaluated based on the following KPIs:

- **Conversion Rate:** Increase in visitor-to-signup conversion (target: +15%)
- **Engagement:** Percentage of visitors who click on a challenge (target: 40%)
- **Time on Page:** Average time spent on landing page (target: 2:30 minutes)
- **Bounce Rate:** Decrease in immediate exits (target: -10%)
- **Challenge Participation:** Number of new users who join a challenge within 24 hours of signup (target: 25%)

## Appendix: Design Assets

All design assets should be created according to the LorePin Design System, with particular attention to:

- Typography: Montserrat (headings) and Inter (body text)
- Color Palette: Primary gradient (#FF3366 → #33CCFF), Neon Moss accent (#AAFF00)
- Animation Library: Framer Motion for React components
- Icon Set: Custom LorePin icon library + Phosphor Icons as fallback 