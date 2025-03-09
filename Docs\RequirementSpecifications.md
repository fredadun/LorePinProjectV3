# LorePin Requirement Specification Document

**Version:** 1.0  
**Date:** [Insert Date]  

## 1. Introduction
### 1.1 Purpose
This document outlines the functional and technical requirements for the LorePin platform, a location-based storytelling app that rewards users (creators, audiences, and sponsors) for participating in challenges. The MVP will focus on London, with future scalability to other cities.

### 1.2 Scope
**Platforms:**
- **Web:** Responsive React app.
- **Mobile:** iOS/Android app built with Flutter.

**Core Features:**
- User onboarding, challenge creation/participation, LoreCoins rewards, content discovery, sponsor tools.

**Exclusions:**
- NFT integration, advanced AI recommendations, and AR features (planned for Phase 2+).

## 2. Functional Requirements
### 2.1 User Onboarding & Profiles
#### 2.1.1 User Registration
**Description:** Users can sign up via email, Google, or Instagram.

**User Story:**  
_As a new user, I want to sign up quickly to start earning rewards._

**Acceptance Criteria:**
- Social login (Google/Instagram) with Firebase Auth.
- Email/password sign-up with verification link.
- Post-sign-up tutorial explaining LoreCoins and challenges.

**Technical Notes:**
- Store user data in Firestore `users` collection (`userId`, `email`, `skills[]`, `loreCoinsBalance`).

#### 2.1.2 Profile Management
**Description:** Users can create and edit profiles with skills and interests.

**User Story:**  
_As a creator, I want to showcase my skills to attract sponsors._

**Acceptance Criteria:**
- Profile page with bio (150 characters), skill tags (e.g., "Foodie"), and submission history.
- Follow/unfollow other users with real-time updates.

**Technical Notes:**
- Firestore collections: `users`, `followers`.

### 2.2 Challenge System
#### 2.2.1 Challenge Types
- **Competitive:** Sponsor-funded prizes (e.g., "Best Photo of Tower Bridge – £50").
- **Collaborative:** Group goals (e.g., "100 Submissions → Unlock £1,000 Prize Pool").
- **Daily Quests:** Guaranteed rewards (e.g., "Post a Café Photo → 10 LoreCoins").

#### 2.2.2 Challenge Creation (Sponsors)
**Description:** Sponsors can create challenges with location, rules, and rewards.

**User Story:**  
_As a sponsor, I want to launch a challenge to promote my café._

**Acceptance Criteria:**
- Form fields: Title, description, prize, type, location (Google Maps pin).
- Submission guidelines (e.g., video <60s, mandatory location tag).

**Technical Notes:**
- Firestore collection: `challenges`.

#### 2.2.3 Challenge Participation
**Description:** Users submit media (photo/video) and stories tied to challenges.

**User Story:**  
_As a user, I want to submit a video to a challenge and track my progress._

**Acceptance Criteria:**
- Media upload (max 60s video, 10MB image).
- Location tagging via Google Maps autocomplete.
- Real-time leaderboards (competitive) or progress bars (collaborative).

**Technical Notes:**
- Firebase Storage for media; Firestore collection: `submissions`.

### 2.3 LoreCoins Reward System
#### 2.3.1 Earning Mechanics
**Description:** Users earn LoreCoins for submissions, voting, and streaks.

**User Story:**  
_As a user, I want to earn coins even if I don’t win a challenge._

**Acceptance Criteria:**
- 20 coins per submission, 5 coins/day for voting, streak bonuses (Day 3: 30 coins).

**Technical Notes:**
- Firestore collection: `lorecoin_transactions`.

#### 2.3.2 Redemption Mechanics
**Description:** Redeem coins for discounts or premium features.

**User Story:**  
_As a user, I want to spend coins at local businesses._

**Acceptance Criteria:**
- Partner promo codes (e.g., 100 coins = £5 off at a café).
- In-app perks (e.g., 500 coins = Pro membership).

**Technical Notes:**
- Static promo codes stored in Firestore `redemptions` collection.

### 2.4 Content Discovery
#### 2.4.1 Map View
**Description:** Discover challenges and stories via an interactive map.

**User Story:**  
_As a user, I want to find challenges near me._

**Acceptance Criteria:**
- Google Maps integration with challenge pins and filters (competitive/collaborative).

**Technical Notes:**
- Use Google Maps JavaScript API (web) and Flutter Google Maps (mobile).

#### 2.4.2 Feed
**Description:** Browse trending, recent, and followed content.

**User Story:**  
_As a user, I want to see popular submissions in my feed._

**Acceptance Criteria:**
- Sort by likes, timestamp, or followed users.
- Infinite scroll with pagination.

**Technical Notes:**
- Firestore queries with composite indexes.

## 3. Non-Functional Requirements
- **Performance:** Web <2s page load time; Mobile <1s response time.
- **Security:** Firebase Auth, AES-256 encryption, GDPR compliance.
- **Scalability:** Firestore auto-scaling; supports 1,000 concurrent users.

## 4. Technical Specifications
| Component  | Web (React)  | Mobile (Flutter) |
|------------|-------------|------------------|
| Auth       | Firebase SDK | Firebase SDK |
| Maps       | Google Maps JavaScript API | Flutter Google Maps Plugin |
| State Mgmt | Redux | Provider |
| Styling    | CSS-in-JS (Emotion) | Flutter Material Design |

## 5. Data Models
- **Users:** `{ userId, email, skills[], followers[], loreCoins }`
- **Challenges:** `{ challengeId, title, type, prize, location (GeoPoint) }`
- **Submissions:** `{ submissionId, challengeId, userId, mediaURL, likes[] }`
- **LoreCoins:** `{ userId, balance, transactions[] }`

## 6. Testing Requirements
- **Unit Testing:** 80% Firebase Cloud Functions coverage (Jest).
- **Integration Testing:** User flows (e.g., sign-up → challenge submission).
- **Load Testing:** JMeter/Postman, 500 concurrent users.

## 7. Development Timeline
| Milestone | Timeline | Deliverables |
|-----------|----------|-------------|
| User Auth & Profiles | Weeks 1-2 | Social login, profile setup, follow. |
| Challenge System | Weeks 3-4 | Creation, submission, leaderboards. |
| LoreCoins | Weeks 5-6 | Earning, redemption, balance tracking. |
| Content Discovery | Weeks 7-8 | Map view, feed, filters. |
| Sponsor Tools | Weeks 9-10 | Dashboard, heatmaps. |
| Testing & Launch | Weeks 11-12 | Beta release to 500 users. |

## 8. Risks & Mitigations
- **Low user retention:** Daily quests, streak bonuses.
- **Sponsor hesitation:** Free pilot challenges with analytics dashboards.
- **Firestore quota limits:** Monitor usage; upgrade to Blaze plan.

This structured format makes it easy to navigate and implement within a development environment. Let me know if you need further refinements!
