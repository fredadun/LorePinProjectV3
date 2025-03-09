# Agile Development Framework for LorePin

## Methodology: Scrum (2-week sprints)
- **AI Integration:** Use AI tools (e.g., GitHub Copilot, ChatGPT for code generation, AI-powered testing) to accelerate development.
- **Checkpoint Goals:** Validate functionality, ensure alignment with specs, and gather user feedback.

---

## Iteration 1: Sprint 1 – User Onboarding & Profiles
**Duration:** 2 weeks  
**Objective:** Build core user authentication and profile management.

### User Stories
- As a user, I can sign up via Google/Instagram/email.
- As a user, I can create a profile with skills and interests.

### AI Tasks
- **Code Generation:** Use GitHub Copilot to scaffold Firebase Auth flows.
- **Testing:** AI-powered tools like Testim.io to automate login/registration tests.

### Checkpoints
- **Checkpoint 1 (Day 3):**
  - Verify social login (Google/Instagram) works.
  - AI-generated code review for security vulnerabilities.
- **Checkpoint 2 (Day 7):**
  - Validate profile creation with skill tags.
  - Test Firestore data structure for user profiles.
- **Checkpoint 3 (Day 10):**
  - Demo follow/unfollow functionality.
  - AI-generated test report for edge cases (e.g., duplicate emails).

### Deliverables
- Functional sign-up/login flows.
- Profile pages with skill tags and follower counts.

---

## Iteration 2: Sprint 2 – Challenge System (Core)
**Duration:** 2 weeks  
**Objective:** Implement challenge creation, submission, and leaderboards.

### User Stories
- As a sponsor, I can create a challenge with a prize and location.
- As a user, I can submit a photo/video to a challenge.

### AI Tasks
- **Code Generation:** ChatGPT to draft Google Maps API integration.
- **Moderation:** Google Vision API for auto-flagging NSFW content.

### Checkpoints
- **Checkpoint 1 (Day 3):**
  - Validate challenge creation form (title, description, location).
  - AI-generated test cases for invalid inputs.
- **Checkpoint 2 (Day 7):**
  - Test media upload (video/photo) to Firebase Storage.
  - AI-powered load test for 50 concurrent submissions.
- **Checkpoint 3 (Day 10):**
  - Demo real-time leaderboards (competitive challenges).
  - Validate moderation API flags explicit content.

### Deliverables
- Challenge creation and submission workflows.
- Basic leaderboards and content moderation.

---

## Iteration 3: Sprint 3 – LoreCoins Reward System
**Duration:** 2 weeks  
**Objective:** Build earning/redemption mechanics for LoreCoins.

### User Stories
- As a user, I earn coins for submissions and voting.
- As a user, I can redeem coins for partner discounts.

### AI Tasks
- **Code Generation:** GitHub Copilot for transaction logic.
- **Testing:** AI-generated edge cases (e.g., negative coin balances).

### Checkpoints
- **Checkpoint 1 (Day 3):**
  - Verify LoreCoins are awarded per submission/vote.
  - Test Firestore transaction logs.
- **Checkpoint 2 (Day 7):**
  - Validate promo code redemption (e.g., "LONDON10").
  - AI audit of coin balance calculations.
- **Checkpoint 3 (Day 10):**
  - Demo streak bonuses (Day 3: +30 coins).
  - Test concurrency (e.g., 100 users redeeming codes).

### Deliverables
- Functional LoreCoins earning/redemption system.
- Partner promo code integration.

---

## Iteration 4: Sprint 4 – Content Discovery & Feed
**Duration:** 2 weeks  
**Objective:** Enable users to discover challenges and stories via map/feed.

### User Stories
- As a user, I can browse challenges on a map.
- As a user, I can see trending content in my feed.

### AI Tasks
- **Code Generation:** ChatGPT for Google Maps API queries.
- **Performance:** AI-powered optimization of Firestore queries.

### Checkpoints
- **Checkpoint 1 (Day 3):**
  - Validate map pins for challenges (lat/long).
  - Test autocomplete for location tagging.
- **Checkpoint 2 (Day 7):**
  - Demo feed sorting (trending vs. recent).
  - AI-generated performance report for slow queries.
- **Checkpoint 3 (Day 10):**
  - Test infinite scroll and pagination.
  - Validate Firestore composite indexes.

### Deliverables
- Interactive map view and feed.
- Optimized Firestore queries for scalability.

---

## Iteration 5: Sprint 5 – Social Features & Sponsor Tools
**Duration:** 2 weeks  
**Objective:** Add social interactions and sponsor dashboards.

### User Stories
- As a user, I can like/comment on submissions.
- As a sponsor, I can view challenge analytics.

### AI Tasks
- **Code Generation:** GitHub Copilot for Firebase Realtime Database chat.
- **Analytics:** AI-generated heatmaps for sponsor dashboards.

### Checkpoints
- **Checkpoint 1 (Day 3):**
  - Validate like/comment functionality.
  - Test Firestore security rules for social actions.
- **Checkpoint 2 (Day 7):**
  - Demo sponsor heatmap (submission density).
  - AI audit of data privacy (anonymized locations).
- **Checkpoint 3 (Day 10):**
  - Test CSV export for challenge metrics.
  - Validate role-based access for sponsors.

### Deliverables
- Social interactions (likes, comments).
- Sponsor dashboard with heatmaps and metrics.

---

## Iteration 6: Sprint 6 – Testing & Launch Prep
**Duration:** 2 weeks  
**Objective:** Finalize testing, fix bugs, and prepare for beta launch.

### AI Tasks
- **Testing:** AI-powered tools (e.g., Mabl) for end-to-end testing.
- **Optimization:** ChatGPT for performance tweaks.

### Checkpoints
- **Checkpoint 1 (Day 5):**
  - Load test with 500 concurrent users.
  - AI-generated performance report.
- **Checkpoint 2 (Day 10):**
  - Validate GDPR compliance (data deletion).
  - Final security audit with AI tools (Snyk).

### Deliverables
- Beta-ready app (web + mobile).
- Automated test suites for regression testing.

---

## AI Monitoring & Validation Workflow
### Daily Standups:
- Use AI tools (e.g., Jira with AI plugins) to track progress against user stories.

### Checkpoint Reviews:
- AI-generated reports on code quality, test coverage, and alignment with specs.

### User Feedback:
- Deploy AI sentiment analysis on beta-user feedback (e.g., MonkeyLearn).

---

## Tools for AI-Driven Development
| Task | AI Tool | Purpose |
|------|--------|---------|
| Code Generation | GitHub Copilot, ChatGPT | Scaffold Firebase/auth flows, APIs. |
| Testing | Testim.io, Mabl | Automate E2E and load testing. |
| Security | Snyk, DeepCode | Audit code for vulnerabilities. |
| Analytics | Mixpanel, Amplitude | Track user retention/engagement. |

### Key Success Metrics
- **AI Code Contribution:** 30–40% of boilerplate code generated by AI.
- **Defect Rate:** <5% critical bugs post-checkpoint.
- **User Retention:** 40% Day 7 retention in beta testing.
