# LorePin Project

## Overview
LorePin is a location-based storytelling platform that rewards users for participating in challenges. The application connects creators, sponsors, audiences, and local communities through interactive location-based content creation and a reward system called LoreCoins.

## Core Features

### 🗺️ Location-Based Challenges
- Discover challenges on an interactive map
- Create and participate in location-specific content challenges
- Three challenge types: Competitive, Collaborative, and Daily Quests

### 💰 LoreCoins Reward System
- Earn LoreCoins through submissions (20 coins per submission)
- Daily voting rewards (5 coins/day)
- Streak bonuses (Day 3: 30 coins, Day 7: 100 coins)
- Redeem for partner discounts and in-app perks

### 👥 User Types
1. **Creators** - Create content at specific locations to earn rewards
2. **Sponsors** - Create challenges to drive engagement with their brand
3. **Audiences** - Discover and interact with authentic local stories
4. **Local Communities** - Use the platform to boost cultural preservation and tourism

### 🔍 Content Discovery
- Interactive 3D map with challenge pins
- Feed with trending and recent content
- Advanced filtering options
- Personalized recommendations

## Technical Architecture

### Technology Stack
- **Frontend Web**: Next.js 14.x, React 18.x, TypeScript 5.x, Tailwind CSS 3.x
- **3D Visualization**: Three.js, React Three Fiber, Framer Motion
- **Mobile**: Flutter 3.19.x, Dart 3.x, Riverpod 2.x (Clean Architecture)
- **Backend**: Firebase (Authentication, Firestore, Storage, Cloud Functions)
- **DevOps**: GitHub Actions, ESLint, Jest, Cypress, Codemagic

### Project Structure
```
lorepin/
├── frontend/                # Next.js frontend application
├── backend/                 # Firebase backend
├── mobile/                  # Mobile application
├── .github/                 # GitHub configuration
│   └── workflows/           # GitHub Actions workflows
├── Docs/                    # Project documentation
├── .gitignore               # Git ignore file
├── package.json             # Root package.json for scripts
└── README.md                # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v18.x or later)
- npm (v9.x or later)
- Git (v2.x or later)
- Firebase CLI (`npm install -g firebase-tools`)
- Flutter SDK (v3.19.0 or later) for mobile development
- Android Studio (latest version) for Android development
- Xcode (latest version, Mac only) for iOS development

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/fredadun/LorePinProjectV3.git
   cd LorePinProjectV3
   ```

2. Set up the frontend
   ```bash
   cd frontend
   npm install
   ```

3. Set up the backend
   ```bash
   cd ../backend
   npm install
   ```

4. Set up the mobile app
   ```bash
   cd ../mobile
   flutter pub get
   ```

5. Configure environment variables
   - Create `.env.local` files based on the provided templates
   - Set up Firebase project and add configuration

6. Start the development servers
   - Frontend: `npm run dev` in the frontend directory
   - Backend: `npm run serve` in the backend directory
   - Mobile: `flutter run` in the mobile directory

## Development Process

### Agile Methodology
- 2-week Scrum sprints with AI integration
- Three-branch structure: Main (Production), Test (Staging), Development
- CI/CD pipelines with GitHub Actions

### Implementation Timeline
1. **Sprint 1**: User Onboarding & Profiles
2. **Sprint 2**: Challenge System (Core)
3. **Sprint 3**: LoreCoins Reward System
4. **Sprint 4**: Content Discovery & Feed
5. **Sprint 5**: Social Features & Sponsor Tools
6. **Sprint 6**: Testing & Launch Prep

## Documentation
Comprehensive documentation is available in the `Docs/` directory:
- Technical Architecture
- Mobile Architecture
- Project Setup Guide
- User Journeys
- Authentication Flow
- Dependency Requirements
- GitHub Workflow
- Agile Framework

## License
[MIT License](LICENSE)

## Contact
For questions or support, please contact the LorePin team.