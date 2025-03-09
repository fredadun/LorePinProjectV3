# LorePin Dependency Requirements

This document outlines all dependencies required for the LorePin project, categorized by environment (development, testing, and production) and component (web and mobile).

## Table of Contents
- [Core Dependencies](#core-dependencies)
- [Web Frontend Dependencies](#web-frontend-dependencies)
- [Mobile Frontend Dependencies](#mobile-frontend-dependencies)
- [Backend Dependencies](#backend-dependencies)
- [Testing Dependencies](#testing-dependencies)
- [Development Tools](#development-tools)
- [Deployment Requirements](#deployment-requirements)

## Core Dependencies

These dependencies are essential for both development and production environments.

### Firebase Services
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `firebase` | ^9.22.0 | Core Firebase SDK | Dev & Prod |
| `firebase/app` | ^9.22.0 | Firebase app initialization | Dev & Prod |
| `firebase/auth` | ^9.22.0 | Authentication services | Dev & Prod |
| `firebase/firestore` | ^9.22.0 | Database services | Dev & Prod |
| `firebase/storage` | ^9.22.0 | File storage services | Dev & Prod |
| `firebase/functions` | ^9.22.0 | Cloud functions | Dev & Prod |
| `firebase-admin` | ^11.8.0 | Admin SDK for backend operations | Dev & Prod |
| `firebase-tools` | ^12.4.0 | CLI tools for Firebase | Dev only |

### Environment Configuration
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `dotenv` | ^16.1.4 | Environment variable management | Dev & Prod |
| `cross-env` | ^7.0.3 | Cross-platform environment variables | Dev only |

## Web Frontend Dependencies

### Core React
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `react` | ^18.2.0 | UI library | Dev & Prod |
| `react-dom` | ^18.2.0 | DOM rendering for React | Dev & Prod |
| `react-router-dom` | ^6.12.1 | Routing | Dev & Prod |
| `react-scripts` | ^5.0.1 | Create React App scripts | Dev & Prod |

### State Management
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `redux` | ^4.2.1 | State management | Dev & Prod |
| `react-redux` | ^8.1.0 | React bindings for Redux | Dev & Prod |
| `@reduxjs/toolkit` | ^1.9.5 | Redux utilities | Dev & Prod |
| `redux-thunk` | ^2.4.2 | Async Redux actions | Dev & Prod |
| `redux-persist` | ^6.0.0 | Persist Redux state | Dev & Prod |

### UI Components & Styling
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `@emotion/react` | ^11.11.1 | CSS-in-JS | Dev & Prod |
| `@emotion/styled` | ^11.11.0 | Styled components | Dev & Prod |
| `@mui/material` | ^5.13.5 | Material UI components | Dev & Prod |
| `@mui/icons-material` | ^5.11.16 | Material UI icons | Dev & Prod |
| `framer-motion` | ^10.12.16 | Animations | Dev & Prod |

### Maps & Location
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `@react-google-maps/api` | ^2.18.1 | Google Maps integration | Dev & Prod |
| `use-places-autocomplete` | ^4.0.0 | Google Places autocomplete | Dev & Prod |

### Form Handling
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `formik` | ^2.4.1 | Form management | Dev & Prod |
| `yup` | ^1.2.0 | Form validation | Dev & Prod |

### Utilities
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `uuid` | ^9.0.0 | Generate unique IDs | Dev & Prod |
| `@types/uuid` | ^9.0.2 | TypeScript types for uuid | Dev only |
| `date-fns` | ^2.30.0 | Date manipulation | Dev & Prod |
| `lodash` | ^4.17.21 | Utility functions | Dev & Prod |
| `@types/lodash` | ^4.14.195 | TypeScript types for lodash | Dev only |

### Data Fetching & Caching
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `axios` | ^1.4.0 | HTTP client | Dev & Prod |
| `react-query` | ^3.39.3 | Data fetching & caching | Dev & Prod |
| `swr` | ^2.1.5 | Data fetching with stale-while-revalidate | Dev & Prod |

## Mobile Frontend Dependencies

### Flutter Core
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `flutter` | ^3.10.0 | UI framework | Dev & Prod |
| `dart` | ^3.0.0 | Programming language | Dev & Prod |

### State Management
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `flutter_riverpod` | ^2.3.6 | State management | Dev & Prod |
| `provider` | ^6.0.5 | Dependency injection | Dev & Prod |

### Firebase Integration
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `firebase_core` | ^2.13.1 | Firebase core | Dev & Prod |
| `firebase_auth` | ^4.6.2 | Authentication | Dev & Prod |
| `cloud_firestore` | ^4.8.0 | Firestore database | Dev & Prod |
| `firebase_storage` | ^11.2.2 | Storage | Dev & Prod |
| `firebase_messaging` | ^14.6.2 | Push notifications | Dev & Prod |

### UI Components
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `flutter_material_components` | ^1.0.0 | Material Design components | Dev & Prod |
| `google_fonts` | ^5.0.0 | Custom fonts | Dev & Prod |
| `flutter_svg` | ^2.0.6 | SVG rendering | Dev & Prod |
| `cached_network_image` | ^3.2.3 | Image caching | Dev & Prod |

### Maps & Location
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `google_maps_flutter` | ^2.3.0 | Google Maps integration | Dev & Prod |
| `location` | ^4.4.0 | Location services | Dev & Prod |
| `geolocator` | ^9.0.2 | Geolocation | Dev & Prod |

### Utilities
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `intl` | ^0.18.1 | Internationalization | Dev & Prod |
| `uuid` | ^3.0.7 | Generate unique IDs | Dev & Prod |
| `path_provider` | ^2.0.15 | File system access | Dev & Prod |
| `shared_preferences` | ^2.1.1 | Local storage | Dev & Prod |

## Backend Dependencies

### Firebase Functions
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `firebase-functions` | ^4.4.0 | Cloud Functions framework | Dev & Prod |
| `firebase-admin` | ^11.8.0 | Admin SDK | Dev & Prod |
| `express` | ^4.18.2 | Web framework for APIs | Dev & Prod |
| `cors` | ^2.8.5 | CORS middleware | Dev & Prod |

### Utilities
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `node-fetch` | ^3.3.1 | HTTP requests | Dev & Prod |
| `uuid` | ^9.0.0 | Generate unique IDs | Dev & Prod |
| `moment` | ^2.29.4 | Date manipulation | Dev & Prod |
| `lodash` | ^4.17.21 | Utility functions | Dev & Prod |

### Image Processing
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `sharp` | ^0.32.1 | Image processing | Dev & Prod |
| `image-size` | ^1.0.2 | Get image dimensions | Dev & Prod |

## Testing Dependencies

### Web Testing
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `jest` | ^29.5.0 | Testing framework | Dev only |
| `@testing-library/react` | ^14.0.0 | React testing utilities | Dev only |
| `@testing-library/jest-dom` | ^5.16.5 | DOM testing utilities | Dev only |
| `@testing-library/user-event` | ^14.4.3 | User event simulation | Dev only |
| `msw` | ^1.2.2 | API mocking | Dev only |
| `cypress` | ^12.14.0 | End-to-end testing | Dev only |

### Mobile Testing
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `flutter_test` | from SDK | Flutter testing framework | Dev only |
| `mockito` | ^5.4.0 | Mocking library | Dev only |
| `integration_test` | from SDK | Integration testing | Dev only |
| `flutter_driver` | from SDK | UI testing | Dev only |

### Backend Testing
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `mocha` | ^10.2.0 | Testing framework | Dev only |
| `chai` | ^4.3.7 | Assertion library | Dev only |
| `sinon` | ^15.1.0 | Mocking library | Dev only |
| `firebase-functions-test` | ^3.1.0 | Firebase Functions testing | Dev only |

## Development Tools

### TypeScript & Linting
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `typescript` | ^5.1.3 | TypeScript language | Dev only |
| `@types/react` | ^18.2.12 | React type definitions | Dev only |
| `@types/react-dom` | ^18.2.5 | React DOM type definitions | Dev only |
| `@types/node` | ^20.3.1 | Node.js type definitions | Dev only |
| `eslint` | ^8.42.0 | Linting | Dev only |
| `eslint-plugin-react` | ^7.32.2 | React linting rules | Dev only |
| `eslint-plugin-react-hooks` | ^4.6.0 | React Hooks linting rules | Dev only |
| `prettier` | ^2.8.8 | Code formatting | Dev only |

### Build Tools
| Dependency | Version | Purpose | Environment |
|------------|---------|---------|-------------|
| `webpack` | ^5.86.0 | Module bundler | Dev only |
| `babel` | ^7.22.5 | JavaScript compiler | Dev only |
| `vite` | ^4.3.9 | Build tool | Dev only |

## Deployment Requirements

### Web Hosting
- Firebase Hosting
- Custom domain (optional)
- SSL certificate (provided by Firebase)

### Mobile Deployment
- Apple Developer Account (for iOS)
- Google Play Developer Account (for Android)
- Fastlane for CI/CD

### Backend Deployment
- Firebase project with Blaze plan (pay-as-you-go)
- Cloud Functions enabled
- Firestore database
- Firebase Storage
- Firebase Authentication

### CI/CD
- GitHub Actions
- Codemagic (for Flutter)

## Installation Instructions

### Web Frontend
```bash
# Navigate to web directory
cd lorepin-web

# Install dependencies
npm install

# Install dev dependencies
npm install --save-dev @types/uuid @types/lodash

# Start development server
npm start
```

### Mobile Frontend
```bash
# Navigate to mobile directory
cd lorepin-mobile

# Get Flutter dependencies
flutter pub get

# Run development build
flutter run
```

### Backend
```bash
# Navigate to functions directory
cd functions

# Install dependencies
npm install

# Deploy functions
firebase deploy --only functions
```

## Notes on Environment-Specific Dependencies

1. **Development-Only Dependencies**:
   - TypeScript type definitions (`@types/*`)
   - Testing frameworks and utilities
   - Linting and formatting tools
   - Build tools

2. **Production Dependencies**:
   - All runtime libraries
   - Firebase services
   - UI components
   - State management

3. **Optional Dependencies**:
   - Analytics tools (Google Analytics, Firebase Analytics)
   - Monitoring tools (Sentry, LogRocket)
   - A/B testing frameworks

## Versioning Strategy

- Use semantic versioning (MAJOR.MINOR.PATCH)
- Lock dependencies to specific versions in package.json
- Use `^` for minor version updates (e.g., `^1.2.3` allows updates to `1.3.0` but not `2.0.0`)
- Regularly update dependencies for security patches

## Dependency Maintenance

- Run `npm audit` regularly to check for vulnerabilities
- Update dependencies monthly
- Test thoroughly after dependency updates
- Use GitHub Dependabot for automated security updates

---

This document should be updated whenever new dependencies are added to the project or when version requirements change.

Last updated: [Current Date] 