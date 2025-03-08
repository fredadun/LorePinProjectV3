# LorePin Technical Architecture Document

## 1. Project Overview

LorePin is a location-based storytelling platform that rewards users for participating in challenges. The application will be built with a modern tech stack focusing on performance, user experience, and scalability.

## 2. Technology Stack

### 2.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with server-side rendering, routing, and API routes |
| React | 18.x | UI library for building component-based interfaces |
| TypeScript | 5.x | Static typing for improved developer experience and code quality |
| Tailwind CSS | 3.x | Utility-first CSS framework for rapid UI development |
| Framer Motion | 10.x | Animation library for React components |
| Three.js | 0.158.x | 3D graphics library for web browsers |
| React Three Fiber | 8.x | React renderer for Three.js |
| React Three Drei | 9.x | Useful helpers for React Three Fiber |
| Firebase SDK | 9.x | Client SDK for Firebase services |
| React Query | 5.x | Data fetching and state management library |
| Zustand | 4.x | Lightweight state management |

### 2.2 Mobile Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Flutter | 3.19.x | Cross-platform UI framework |
| Dart | 3.x | Programming language for Flutter |
| Riverpod | 2.x | State management for Flutter |
| Go Router | 12.x | Declarative routing for Flutter |
| Firebase Flutter SDK | Latest | Flutter plugins for Firebase services |
| Google Maps Flutter | Latest | Maps integration for Flutter |
| Flutter Secure Storage | Latest | Secure storage for sensitive data |
| Image Picker | Latest | Media selection from gallery or camera |
| Cached Network Image | Latest | Image caching for performance |
| Flutter DotEnv | Latest | Environment variable management |

### 2.3 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Firebase Authentication | - | User authentication and identity management |
| Firebase Firestore | - | NoSQL database for storing application data |
| Firebase Storage | - | File storage for user-generated content |
| Firebase Cloud Functions | - | Serverless functions for backend logic |
| Firebase Hosting | - | Web application hosting |
| Node.js | 18.x | Runtime for Cloud Functions |
| Express | 4.x | Web framework for API endpoints in Cloud Functions |
| TypeScript | 5.x | Static typing for backend code |

### 2.4 DevOps & Infrastructure

| Technology | Purpose |
|------------|---------|
| GitHub Actions | CI/CD pipeline for automated testing and deployment |
| ESLint | Code linting for JavaScript/TypeScript |
| Prettier | Code formatting |
| Jest | Unit and integration testing |
| Cypress | End-to-end testing for web |
| Flutter Test | Unit and widget testing for mobile |
| Integration Test | Integration testing for Flutter |
| Firebase Emulator Suite | Local development environment |
| Codemagic | CI/CD for Flutter mobile apps |

## 3. Project Structure

### 3.1 Web Application Structure

```
lorepin/
├── frontend/                # Next.js frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Common components (Header, Footer, etc.)
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── challenges/  # Challenge-related components
│   │   │   ├── ui/          # Basic UI components
│   │   │   └── 3d/          # Three.js components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and libraries
│   │   │   ├── firebase.ts  # Firebase client initialization
│   │   │   └── api.ts       # API client functions
│   │   ├── store/           # State management
│   │   └── types/           # TypeScript type definitions
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── next.config.js       # Next.js configuration
│   └── package.json         # Frontend dependencies
│
├── backend/                 # Firebase backend
│   ├── functions/           # Cloud Functions
│   │   ├── src/
│   │   │   ├── auth/        # Authentication functions
│   │   │   ├── challenges/  # Challenge-related functions
│   │   │   ├── users/       # User-related functions
│   │   │   ├── lorecoins/   # LoreCoin transaction functions
│   │   │   └── index.ts     # Function exports
│   │   ├── package.json     # Backend dependencies
│   │   └── tsconfig.json    # TypeScript configuration
│   ├── firestore.rules      # Firestore security rules
│   ├── storage.rules        # Storage security rules
│   └── firebase.json        # Firebase configuration
```

### 3.2 Mobile Application Structure

```
mobile/
├── android/                 # Android-specific files
├── ios/                     # iOS-specific files
├── assets/                  # Static assets (images, fonts, etc.)
│   ├── images/              # Image assets
│   └── fonts/               # Font assets
├── lib/
│   ├── core/                # Core functionality
│   │   ├── config/          # Configuration files
│   │   │   ├── firebase_options.dart  # Firebase configuration
│   │   │   ├── app_config.dart        # App configuration
│   │   │   └── theme.dart             # App theme
│   │   ├── constants/       # Constants and enums
│   │   ├── errors/          # Error handling
│   │   ├── utils/           # Utility functions
│   │   └── extensions/      # Extension methods
│   ├── data/                # Data layer
│   │   ├── datasources/     # Data sources (remote, local)
│   │   │   ├── remote/      # Remote data sources (API)
│   │   │   └── local/       # Local data sources (SharedPreferences, SQLite)
│   │   ├── models/          # Data models
│   │   │   ├── user_model.dart
│   │   │   ├── challenge_model.dart
│   │   │   ├── submission_model.dart
│   │   │   └── lorecoin_model.dart
│   │   └── repositories/    # Repository implementations
│   ├── domain/              # Domain layer
│   │   ├── entities/        # Business entities
│   │   ├── repositories/    # Repository interfaces
│   │   └── usecases/        # Business logic
│   ├── presentation/        # Presentation layer
│   │   ├── providers/       # State providers (Riverpod)
│   │   ├── screens/         # App screens
│   │   │   ├── auth/        # Authentication screens
│   │   │   ├── challenges/  # Challenge-related screens
│   │   │   ├── explore/     # Explore/map screens
│   │   │   ├── profile/     # User profile screens
│   │   │   └── lorecoins/   # LoreCoins screens
│   │   ├── widgets/         # Reusable widgets
│   │   │   ├── common/      # Common widgets
│   │   │   ├── challenges/  # Challenge-related widgets
│   │   │   └── map/         # Map-related widgets
│   │   └── routes/          # App routes
│   └── main.dart            # Entry point
├── test/                    # Unit and widget tests
├── integration_test/        # Integration tests
└── pubspec.yaml             # Dependencies
```

### 3.3 Project Root Structure

```
lorepin/
├── frontend/                # Web application
├── backend/                 # Firebase backend
├── mobile/                  # Mobile application
├── .github/                 # GitHub configuration
│   └── workflows/           # GitHub Actions workflows
├── Docs/                    # Project documentation
├── .gitignore               # Git ignore file
├── package.json             # Root package.json for scripts
└── README.md                # Project documentation
```

## 4. Key Features & Implementation

### 4.1 Authentication System

- **Firebase Authentication** for user management
- Social login (Google, Facebook, Instagram)
- Email/password authentication
- Custom user profiles in Firestore
- JWT token management for secure API access
- Role-based access control (users, sponsors, admins)

### 4.2 Challenge System

- Location-based challenges using Google Maps integration
- Challenge creation and management for sponsors
- Submission handling with media upload to Firebase Storage
- Challenge types:
  - Competitive (winner-based rewards)
  - Collaborative (group achievement goals)
  - Daily quests (guaranteed rewards)
- Leaderboards and progress tracking
- Challenge discovery via map and feed interfaces

### 4.3 LoreCoins Reward System

- Transaction tracking in Firestore
- Earning mechanics:
  - 20 coins per submission
  - 5 coins/day for voting
  - Streak bonuses (Day 3: 30 coins, Day 7: 100 coins)
- Redemption system for rewards:
  - Partner promo codes
  - In-app perks and premium features
- Real-time balance updates
- Transaction history and analytics

### 4.4 3D Visualization

- Interactive map using Three.js and React Three Fiber
- Location pins and challenge visualization
- Animated UI elements with Framer Motion:
  - Page transitions
  - Micro-interactions
  - Loading states
  - Scroll-based animations
- Responsive 3D elements that adapt to device capabilities
- Performance optimizations for mobile devices

### 4.5 Content Discovery

- Map view with challenge pins
- Feed with trending and recent content
- Filtering options:
  - Challenge type
  - Reward amount
  - Distance
  - Time remaining
- Search functionality
- Personalized recommendations based on user activity
- Follow system for creators and sponsors

## 5. Mobile App Architecture

### 5.1 Clean Architecture

The mobile app follows Clean Architecture principles with three main layers:

1. **Presentation Layer**
   - UI components (screens, widgets)
   - State management with Riverpod
   - Navigation with Go Router

2. **Domain Layer**
   - Business logic and rules
   - Use cases that orchestrate data flow
   - Repository interfaces

3. **Data Layer**
   - Repository implementations
   - Remote data sources (Firebase)
   - Local data sources (SharedPreferences, Hive)
   - Data models and mappers

### 5.2 State Management

- **Riverpod** for dependency injection and state management
- **StateNotifier** for complex state with business logic
- **StreamProvider** for reactive data from Firestore
- **FutureProvider** for async operations

### 5.3 Navigation

- **Go Router** for declarative routing
- Deep linking support
- Path parameters for dynamic routes
- Nested routes for complex flows
- Authentication guards

## 6. Web App Architecture

### 6.1 Next.js App Router

- File-based routing with App Router
- Server Components for improved performance
- Client Components for interactive UI elements
- Route groups for organization
- Parallel routes for complex layouts

### 6.2 State Management

- **Zustand** for global state
- **React Query** for server state
- **Context API** for component-level state
- **Local state** with useState for component-specific state

### 6.3 Performance Optimization

- Server-side rendering for improved SEO and initial load
- Image optimization with Next.js Image component
- Code splitting for reduced bundle size
- Incremental Static Regeneration for dynamic content
- Edge caching for improved performance

## 7. Backend Architecture

### 7.1 Firebase Services

- **Authentication** for user management
- **Firestore** for database
- **Storage** for file storage
- **Cloud Functions** for serverless backend logic
- **Hosting** for web application deployment

### 7.2 Security Rules

- Role-based access control
- Data validation
- User-based permissions
- Field-level security

### 7.3 Cloud Functions

- HTTP triggers for API endpoints
- Firestore triggers for data changes
- Authentication triggers for user events
- Scheduled functions for recurring tasks
- Callable functions for client-initiated operations

## 8. Deployment Strategy

### 8.1 Environments

- **Development**: For active development
- **Staging**: For testing before production
- **Production**: Live environment

### 8.2 CI/CD Pipeline

- GitHub Actions for automated testing and deployment
- Environment-specific configurations
- Automated testing before deployment
- Rollback capability

## 9. Monitoring & Analytics

### 9.1 Performance Monitoring

- Firebase Performance Monitoring
- Custom metrics for key user flows
- Real-time monitoring dashboards

### 9.2 Error Tracking

- Firebase Crashlytics for mobile
- Error logging and alerting
- User feedback collection

### 9.3 Analytics

- Firebase Analytics for user behavior
- Conversion tracking
- User engagement metrics
- Custom events for business KPIs

## 10. Future Considerations

### 10.1 Scalability

- Firestore sharding for high-volume data
- Caching strategies for improved performance
- Load balancing for Cloud Functions

### 10.2 Internationalization

- Multi-language support
- Localized content
- Region-specific features

### 10.3 Accessibility

- WCAG compliance
- Screen reader support
- Keyboard navigation
- Color contrast and text sizing

### 10.4 Advanced Features

- AR integration for immersive experiences
- Machine learning for content recommendations
- Voice commands for hands-free interaction
- Offline-first approach for improved user experience