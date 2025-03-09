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
├── Doc/                     # Project documentation
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
   - Data sources (remote and local)
   - Data models and mappers

This separation ensures:
- Testability of business logic
- Independence from frameworks
- Flexibility to change implementations

### 5.2 State Management

Riverpod is used for state management, providing:
- Dependency injection
- Reactive state management
- Easy testing
- Fine-grained rebuilds

Key provider types:
- **StateProvider**: Simple state that can be modified from outside
- **StateNotifierProvider**: Complex state with encapsulated logic
- **FutureProvider**: Asynchronous data loading
- **StreamProvider**: Reactive data streams (e.g., Firestore listeners)

### 5.3 Navigation

Go Router provides declarative routing with:
- Deep linking support
- Path parameters
- Query parameters
- Nested routes
- Route guards for authentication

### 5.4 Data Persistence

Multiple strategies for data persistence:
- **Firestore**: Primary remote database with offline persistence
- **SharedPreferences**: Simple key-value storage for app settings
- **Secure Storage**: Encrypted storage for sensitive data (tokens, keys)
- **Local SQLite**: Optional local database for complex offline capabilities

### 5.5 UI Components

The UI follows Material Design 3 principles with:
- Custom theme based on LorePin brand colors
- Responsive layouts for different screen sizes
- Reusable widgets for consistent UI
- Animations for enhanced user experience

### 5.6 Platform Integration

Native platform features are integrated:
- **Camera**: For capturing challenge submissions
- **Location Services**: For challenge discovery and verification
- **Push Notifications**: For engagement and updates
- **Maps**: For visualizing challenges
- **Share**: For social sharing of challenges and achievements

### 5.7 Offline Capabilities

The app works offline with:
- Firestore offline persistence
- Queued operations for when connectivity is restored
- Local caching of images and data
- Optimistic UI updates

### 5.8 Security

Security measures include:
- Secure storage for sensitive data
- Firebase Authentication integration
- Input validation
- Secure communication with HTTPS
- App permissions management

## 6. Performance Considerations

- **Next.js** for optimized loading and rendering:
  - Server-side rendering for initial page load
  - Static generation for marketing pages
  - Incremental Static Regeneration for dynamic content
- Image optimization with next/image
- Code splitting and lazy loading for large components
- Server-side rendering for SEO and initial load performance
- Firestore offline persistence for mobile usage
- Optimistic UI updates for better perceived performance
- Efficient data fetching with React Query:
  - Caching
  - Background refetching
  - Pagination support

### 6.1 Mobile-Specific Performance Considerations

- **Lazy Loading**: Load data and assets only when needed
- **Image Optimization**: Resize and compress images before upload
- **Widget Rebuilding**: Minimize unnecessary widget rebuilds
- **Memory Management**: Dispose resources properly
- **Background Processing**: Handle heavy tasks in isolates
- **Network Efficiency**: Batch network requests and use pagination
- **Startup Time**: Optimize app startup with deferred initialization
- **Battery Usage**: Minimize location and network usage when not needed

## 7. Security Considerations

- Strict Firestore security rules:
  - User data access control
  - Challenge submission validation
  - LoreCoin transaction verification
- Content validation in Cloud Functions
- Rate limiting for API endpoints
- Authentication state management
- Data encryption for sensitive information
- GDPR compliance measures:
  - Data export functionality
  - Right to be forgotten implementation
  - Consent management
- Input sanitization to prevent XSS attacks
- CORS configuration for API endpoints

### 7.1 Mobile-Specific Security Considerations

- **Secure Storage**: Use Flutter Secure Storage for sensitive data
- **Certificate Pinning**: Implement certificate pinning for API requests
- **Jailbreak/Root Detection**: Optional detection of compromised devices
- **App Permissions**: Request only necessary permissions
- **Biometric Authentication**: Optional additional security layer
- **Obfuscation**: Code obfuscation for release builds
- **Secure Deep Links**: Validate deep links before processing

## 8. Scalability Considerations

- Firestore's automatic scaling for database operations
- Stateless Cloud Functions for backend processing
- CDN distribution via Firebase Hosting
- Efficient database queries with proper indexing:
  - Compound indexes for complex queries
  - Denormalization for frequent read patterns
- Pagination for large data sets
- Caching strategies with React Query
- Optimized image and media storage:
  - Resizing on upload
  - Format conversion
  - Compression

### 8.1 Mobile-Specific Scalability Considerations

- **Feature Flags**: Control feature rollout
- **A/B Testing**: Test different implementations
- **Analytics**: Track user behavior and app performance
- **Crash Reporting**: Monitor and fix issues quickly
- **Remote Config**: Update app behavior without releasing new versions
- **Dynamic Links**: Share content with deep links
- **App Distribution**: Beta testing and staged rollouts

## 9. Development Workflow

1. **Local Development**:
   - Firebase Emulator Suite for backend services
   - Next.js development server for frontend
   - Hot module replacement for rapid iteration

2. **Version Control**:
   - Feature branches with descriptive names
   - Pull requests with code reviews
   - Conventional commit messages

3. **Continuous Integration**:
   - Automated testing via GitHub Actions
   - Linting and type checking
   - Build verification

4. **Deployment Pipeline**:
   - Development environment for feature testing
   - Staging environment for QA and integration testing
   - Production environment for end users
   - Rollback capabilities for failed deployments

5. **Quality Assurance**:
   - Unit tests for business logic
   - Integration tests for API endpoints
   - End-to-end tests for critical user flows
   - Accessibility testing

### 9.1 Mobile Development Workflow

1. **Local Development**:
   - Flutter development with hot reload
   - Firebase Emulator Suite for backend services
   - Mock data for offline development

2. **Version Control**:
   - Feature branches with descriptive names
   - Pull requests with code reviews
   - Conventional commit messages

3. **Continuous Integration**:
   - Automated testing via GitHub Actions or Codemagic
   - Static code analysis
   - Build verification

4. **Continuous Deployment**:
   - Automated deployment to Firebase App Distribution
   - Beta testing with TestFlight (iOS) and Google Play Beta (Android)
   - Staged rollout to production

5. **Monitoring**:
   - Firebase Crashlytics for crash reporting
   - Firebase Performance Monitoring
   - Firebase Analytics for user behavior

## 10. Cross-Platform Consistency

### 10.1 Shared Backend

Both web and mobile applications use the same Firebase backend, ensuring:
- Consistent data models
- Shared business logic
- Unified security rules
- Centralized user management

### 10.2 Design System

A consistent design system across platforms:
- Shared color palette
- Typography guidelines
- Component patterns
- Interaction patterns

### 10.3 Feature Parity

Core features are implemented on both platforms:
- Authentication
- Challenge discovery and participation
- LoreCoin management
- User profiles
- Social features

### 10.4 Platform-Specific Optimizations

While maintaining consistency, each platform leverages its strengths:
- **Web**: 3D visualizations with Three.js, SEO optimization
- **Mobile**: Native camera integration, push notifications, offline support

## 11. Testing Strategy

### 11.1 Web Testing

- Unit tests with Jest
- Component tests with React Testing Library
- End-to-end tests with Cypress

### 11.2 Mobile Testing

- Unit tests with Flutter Test
- Widget tests for UI components
- Integration tests for feature flows
- Golden tests for visual regression

### 11.3 Backend Testing

- Unit tests for Cloud Functions
- Security rules tests
- Integration tests for API endpoints

### 11.4 Manual Testing

- User acceptance testing
- Cross-device testing
- Performance testing
- Accessibility testing

## 12. Deployment Strategy

### 12.1 Web Deployment

- Firebase Hosting for static assets
- Cloud Functions for dynamic content
- CDN distribution

### 12.2 Mobile Deployment

- Google Play Store for Android
- Apple App Store for iOS
- Firebase App Distribution for beta testing
- CI/CD with Codemagic or GitHub Actions

### 12.3 Backend Deployment

- Firebase Cloud Functions
- Firestore database
- Firebase Storage
- Firebase Authentication

## 13. Monitoring and Analytics

### 13.1 Performance Monitoring

- Firebase Performance Monitoring
- Custom performance traces
- Network request monitoring
- Render time tracking

### 13.2 Error Tracking

- Firebase Crashlytics
- Error logging
- Exception handling
- Crash reporting

### 13.3 User Analytics

- Firebase Analytics
- User engagement metrics
- Conversion tracking
- Feature usage analysis

## 14. Conclusion

The LorePin application is designed with a modern, scalable architecture that leverages the strengths of both web and mobile platforms. By using Firebase as a unified backend and implementing clean architecture principles, the application ensures consistency, performance, and maintainability across platforms.

The combination of Next.js for web and Flutter for mobile provides a powerful foundation for building a feature-rich, cross-platform experience that meets the needs of users regardless of their device preference. 