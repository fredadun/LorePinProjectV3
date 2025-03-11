# LorePin Mobile App

A Flutter-based mobile application for the LorePin platform, allowing users to discover and complete location-based challenges, earn LoreCoins, and redeem rewards.

## Project Status

This project is currently in active development. The following components have been implemented:

- [x] Project structure following Clean Architecture principles
- [x] Environment configuration
- [x] Firebase integration
- [x] Authentication screens (login, register)
- [x] User repository implementation
- [x] Challenge repository implementation
- [x] Basic UI screens (splash, home, challenges, profile)
- [ ] Challenge submission functionality
- [ ] LoreCoins management
- [ ] User profile management
- [ ] Maps integration
- [ ] Offline support
- [ ] Push notifications

## Architecture

The app follows Clean Architecture principles with the following layers:

1. **Presentation Layer**: UI components, screens, and state management
2. **Domain Layer**: Business logic, entities, and repository interfaces
3. **Data Layer**: Repository implementations, data sources, and external services

### Key Technologies

- **Flutter**: UI framework
- **Riverpod**: State management
- **Go Router**: Navigation
- **Firebase**: Backend services (Auth, Firestore, Storage)
- **Clean Architecture**: Project structure

## Getting Started

### Prerequisites

- Flutter SDK 3.0.0 or higher
- Dart 3.0.0 or higher
- Firebase project

### Setup

1. Clone the repository
2. Create a `.env` file in the `mobile` directory with the following variables:
   ```
   # Firebase Configuration
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   # API Configuration
   API_URL=your_api_url
   
   # Environment
   ENVIRONMENT=development
   
   # Feature Flags
   ENABLE_CHALLENGES=true
   ENABLE_REWARDS=true
   ENABLE_SOCIAL=true
   ENABLE_ANALYTICS=true
   
   # Maps Configuration
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```
3. Run `flutter pub get` to install dependencies
4. Run `flutter run` to start the app

## Project Structure

```
mobile/
├── lib/
│   ├── core/                # Core functionality
│   │   ├── config/          # Configuration files
│   │   ├── constants/       # Constants and enums
│   │   ├── errors/          # Error handling
│   │   ├── utils/           # Utility functions
│   │   └── extensions/      # Extension methods
│   ├── data/                # Data layer
│   │   ├── datasources/     # Data sources (remote, local)
│   │   ├── models/          # Data models
│   │   └── repositories/    # Repository implementations
│   ├── domain/              # Domain layer
│   │   ├── entities/        # Business entities
│   │   ├── repositories/    # Repository interfaces
│   │   ├── providers/       # Riverpod providers
│   │   └── usecases/        # Business logic
│   ├── presentation/        # Presentation layer
│   │   ├── providers/       # State providers (Riverpod)
│   │   ├── screens/         # App screens
│   │   ├── widgets/         # Reusable widgets
│   │   └── routes/          # App routes
│   └── main.dart            # Entry point
├── test/                    # Unit and widget tests
└── integration_test/        # Integration tests
```

## Features

### Authentication
- Email/password authentication
- Social login (Google)
- User profile management

### Challenges
- Discover challenges on a map
- View challenge details
- Submit challenge completions
- Earn LoreCoins

### Rewards
- View and redeem rewards
- Track LoreCoin balance
- View transaction history

### Social
- Follow other users
- View user profiles
- Share challenges and achievements

## Development Guidelines

### Code Style
- Follow the [Dart Style Guide](https://dart.dev/guides/language/effective-dart/style)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Architecture
- Follow Clean Architecture principles
- Use Riverpod for state management
- Create unit tests for business logic
- Use repository pattern for data access

### Git Workflow
- Create feature branches from `development`
- Submit pull requests for review
- Merge to `development` after approval
- Periodically merge `development` to `main` for releases

## Testing

### Unit Tests
```bash
flutter test
```

### Widget Tests
```bash
flutter test --tags=widget
```

### Integration Tests
```bash
flutter test integration_test
```

## Building for Production

### Android
```bash
flutter build appbundle --release
```

### iOS
```bash
flutter build ipa --release
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited. 