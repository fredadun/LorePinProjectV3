# LorePin Web & Mobile UI Framework Setup Guide

This document provides a comprehensive guide for setting up the LorePin web application and mobile UI framework, including layout structure, page organization, theme design, and core components.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Brand Identity](#brand-identity)
3. [Web Application Setup](#web-application-setup)
4. [Mobile UI Framework Setup](#mobile-ui-framework-setup)
5. [Theme Design System](#theme-design-system)
6. [Core Components](#core-components)
7. [Page Structure](#page-structure)
8. [Development Workflow](#development-workflow)

## Project Overview

LorePin is a location-based challenge platform that connects users with challenges created by brands and other users. The platform allows users to discover, complete, and create location-based challenges while earning rewards (LoreCoins) that can be redeemed for exclusive discounts, merchandise, and experiences.

### Core Vision

> "Every city has stories. We turn explorers into storytellers, and storytellers into legends."

The platform embodies a futuristic, culturally rich, and adventurous tone, transforming urban exploration into a gamified experience with real-world rewards.

## Brand Identity

### Color Palette

- **Primary Gradient:** "Solar Flare" (Vivid magenta `#FF00FF` → Electric cyan `#00FFFF`)
  - Represents energy (magenta) + technology/trust (cyan)
  - Feels digital-native yet human

- **Accents:**
  - "Neon Moss" (`#7CFC00`) for CTAs
  - "Midnight Velvet" (`#0A001A`) for backgrounds

- **Dynamic Overlays:** Subtle animated noise/grain for texture (adds retro-futuristic grit)

### Typography

- **Headings:** Space Grotesk (geometric, techy)
- **Body:** Satoshi (clean, global appeal)

### Logo

A morphing pin (📍) that transforms into a shooting star 🌠 on hover.

## Web Application Setup

### Technology Stack

- **Framework:** Next.js with TypeScript
- **Styling:** Tailwind CSS + Emotion (CSS-in-JS)
- **Animation:** Framer Motion
- **3D Elements:** Three.js
- **State Management:** React Context API + React Query
- **Backend:** Firebase (Authentication, Firestore, Storage, Functions)

### Project Structure

```
frontend/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable components
│   │   ├── auth/      # Authentication components
│   │   ├── challenges/ # Challenge-related components
│   │   ├── layout/    # Layout components (Header, Footer, etc.)
│   │   ├── map/       # Map and location components
│   │   ├── rewards/   # Reward-related components
│   │   └── ui/        # UI components (buttons, inputs, etc.)
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and libraries
│   │   ├── firebase.ts # Firebase initialization
│   │   └── theme.ts   # Theme configuration
│   ├── models/        # TypeScript interfaces and types
│   ├── pages/         # Next.js pages
│   ├── services/      # API services
│   └── styles/        # Global styles
├── .env.local.example # Example environment variables
├── next.config.js     # Next.js configuration
├── postcss.config.js  # PostCSS configuration
├── tailwind.config.js # Tailwind CSS configuration
└── tsconfig.json      # TypeScript configuration
```

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/lorepin.git
   cd lorepin/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the frontend directory:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update the `.env.local` file with your Firebase configuration.

5. Run the development server:
   ```bash
   npm run dev
   ```

## Mobile UI Framework Setup

### Technology Stack

- **Framework:** Flutter
- **State Management:** Riverpod
- **Architecture:** Clean Architecture
- **Navigation:** Go Router
- **Backend Integration:** Firebase SDK for Flutter

### Project Structure

```
mobile/
├── android/           # Android-specific files
├── ios/               # iOS-specific files
├── lib/
│   ├── core/          # Core utilities and constants
│   │   ├── theme/     # Theme configuration
│   │   └── utils/     # Utility functions
│   ├── data/          # Data layer
│   │   ├── models/    # Data models
│   │   ├── repositories/ # Repository implementations
│   │   └── sources/   # Data sources (remote, local)
│   ├── domain/        # Domain layer
│   │   ├── entities/  # Business entities
│   │   ├── repositories/ # Repository interfaces
│   │   └── usecases/  # Business logic
│   ├── presentation/  # Presentation layer
│   │   ├── pages/     # App screens
│   │   ├── providers/ # State providers
│   │   └── widgets/   # Reusable widgets
│   └── main.dart      # Entry point
├── pubspec.yaml       # Dependencies
└── README.md          # Documentation
```

### Installation Steps

1. Install Flutter SDK (if not already installed):
   ```bash
   # Follow instructions at https://flutter.dev/docs/get-started/install
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/your-username/lorepin.git
   cd lorepin/mobile
   ```

3. Install dependencies:
   ```bash
   flutter pub get
   ```

4. Create a `firebase_options.dart` file with your Firebase configuration.

5. Run the app:
   ```bash
   flutter run
   ```

## Theme Design System

### Web Theme Implementation

The web application uses a combination of Tailwind CSS and Emotion for styling. The theme is defined in `src/lib/theme.ts` and includes:

```typescript
// Theme configuration
export const theme = {
  colors: {
    primary: {
      // Gradient from magenta to cyan
      start: '#FF00FF',
      end: '#00FFFF',
      // Individual shades for components
      50: '#f0f9ff',
      100: '#e0f2fe',
      // ... other shades
      900: '#0c4a6e',
    },
    accent: {
      // Neon Moss
      default: '#7CFC00',
      // ... shades
    },
    background: {
      // Midnight Velvet
      default: '#0A001A',
      // ... other background colors
    },
    // ... other color definitions
  },
  
  fonts: {
    heading: 'Space Grotesk, sans-serif',
    body: 'Satoshi, system-ui, sans-serif',
  },
  
  // ... other theme properties
};
```

### Mobile Theme Implementation

The mobile app uses Flutter's ThemeData for styling. The theme is defined in `lib/core/theme/app_theme.dart`:

```dart
// App theme configuration
class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      primaryColor: const Color(0xFF00FFFF),
      colorScheme: ColorScheme.light(
        primary: const Color(0xFF00FFFF),
        secondary: const Color(0xFFFF00FF),
        tertiary: const Color(0xFF7CFC00),
        background: Colors.white,
        surface: Colors.white,
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.spaceGrotesk(
          fontSize: 32,
          fontWeight: FontWeight.bold,
        ),
        // ... other text styles
        bodyMedium: GoogleFonts.satoshi(
          fontSize: 16,
        ),
      ),
      // ... other theme properties
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      primaryColor: const Color(0xFF00FFFF),
      colorScheme: ColorScheme.dark(
        primary: const Color(0xFF00FFFF),
        secondary: const Color(0xFFFF00FF),
        tertiary: const Color(0xFF7CFC00),
        background: const Color(0xFF0A001A),
        surface: const Color(0xFF1A1A2E),
      ),
      // ... other theme properties
    );
  }
}
```

## Core Components

### Web Components

#### Header Component

The header component (`src/components/layout/Header.tsx`) includes:

- Logo with morphing animation (pin to star)
- Navigation links
- Authentication state (login/signup or user profile)
- Mobile-responsive menu

```tsx
// Header component implementation
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // ... scroll effect logic
  
  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background-default shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative w-10 h-10">
            {/* Morphing logo animation */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              className="absolute inset-0"
            >
              {/* Pin icon that morphs to star */}
            </motion.div>
          </div>
          <span className="ml-2 text-2xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-start to-primary-end">
            LorePin
          </span>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* Navigation links */}
        </nav>
        
        {/* Auth buttons or user profile */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Auth state */}
        </div>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {/* Menu icon */}
        </button>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background-default"
          >
            {/* Mobile navigation */}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
```

#### Footer Component

The footer component (`src/components/layout/Footer.tsx`) includes:

- Logo and brief description
- Navigation links grouped by category
- Social media links
- Copyright information

```tsx
// Footer component implementation
const Footer = () => {
  return (
    <footer className="bg-background-default text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and description */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              {/* Logo */}
              <span className="ml-2 text-2xl font-heading font-bold">
                LorePin
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              Every city has stories. We turn explorers into storytellers, and storytellers into legends.
            </p>
            {/* Social links */}
          </div>
          
          {/* Navigation link groups */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              {/* Links */}
            </ul>
          </div>
          
          {/* More link groups */}
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
          &copy; {new Date().getFullYear()} LorePin. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
```

#### Layout Component

The layout component (`src/components/layout/Layout.tsx`) wraps all pages and includes:

- Header
- Main content area with page transitions
- Footer

```tsx
// Layout component implementation
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};
```

### Mobile Components

#### App Bar

The app bar widget (`lib/presentation/widgets/app_bar.dart`) includes:

- Logo
- Navigation actions
- User profile icon

```dart
// App bar implementation
class LorePinAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final List<Widget>? actions;
  final bool showBackButton;
  
  const LorePinAppBar({
    Key? key,
    this.title = 'LorePin',
    this.actions,
    this.showBackButton = false,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(
        title,
        style: GoogleFonts.spaceGrotesk(
          fontWeight: FontWeight.bold,
        ),
      ),
      leading: showBackButton
          ? IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => Navigator.of(context).pop(),
            )
          : const LorePinLogo(),
      actions: actions,
      backgroundColor: Theme.of(context).colorScheme.background,
      elevation: 0,
    );
  }
  
  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

// Logo widget
class LorePinLogo extends StatelessWidget {
  const LorePinLogo({Key? key}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Image.asset('assets/images/logo.png'),
    );
  }
}
```

#### Bottom Navigation

The bottom navigation bar (`lib/presentation/widgets/bottom_nav.dart`) includes:

- Home/Map tab
- Challenges tab
- Rewards tab
- Profile tab

```dart
// Bottom navigation implementation
class LorePinBottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;
  
  const LorePinBottomNav({
    Key? key,
    required this.currentIndex,
    required this.onTap,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: onTap,
        backgroundColor: Theme.of(context).colorScheme.surface,
        selectedItemColor: Theme.of(context).colorScheme.primary,
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.map),
            label: 'Explore',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.emoji_events),
            label: 'Challenges',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.card_giftcard),
            label: 'Rewards',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
```

## Page Structure

### Web Pages

#### Home Page

The home page (`src/pages/index.tsx`) includes:

1. **Hero Section**
   - Dynamic 3D grid of city names
   - Headline and subheadline
   - CTA button

2. **Value Proposition**
   - 3D floating cards with parallax tilt
   - Features: City as Canvas, Algorithm for Adventure, Economy of Curiosity

3. **Interactive Global Map**
   - 3D globe centered on London
   - Story pulses radiating out
   - Clickable locations to reveal challenges

4. **Creator Spotlight**
   - Kinetic collage of user-generated content
   - Dynamic stats
   - Testimonials

5. **LoreCoins Redemption**
   - Animated showcase of rewards
   - Live counter of redemptions

6. **Global Call-to-Action**
   - Starfield background with city skyline constellations
   - Final CTA button

#### Challenges Page

The challenges page (`src/pages/challenges/index.tsx`) includes:

1. **Map View**
   - Interactive map showing nearby challenges
   - Filters for challenge types, rewards, difficulty

2. **List View**
   - Grid/list of challenge cards
   - Sorting options
   - Pagination

#### Challenge Detail Page

The challenge detail page (`src/pages/challenges/[id].tsx`) includes:

1. **Challenge Information**
   - Title, description, rewards
   - Location details
   - Time constraints

2. **Submission Form**
   - File upload for proof
   - Text input for description
   - Submit button

#### Profile Page

The profile page (`src/pages/profile/index.tsx`) includes:

1. **User Information**
   - Profile picture, name, bio
   - Stats (challenges completed, LoreCoins earned)

2. **Activity Feed**
   - Recent challenges completed
   - Rewards earned

3. **Settings**
   - Account settings
   - Notification preferences

### Mobile Screens

#### Home Screen

The home screen (`lib/presentation/pages/home/home_page.dart`) includes:

1. **Map View**
   - Current location
   - Nearby challenges
   - Search bar

2. **Featured Challenges**
   - Horizontal scrolling list of featured challenges
   - Quick access to trending challenges

#### Challenges Screen

The challenges screen (`lib/presentation/pages/challenges/challenges_page.dart`) includes:

1. **Challenge Categories**
   - Grid of challenge categories
   - Filter options

2. **Challenge List**
   - Vertical list of challenges
   - Pull-to-refresh functionality

#### Rewards Screen

The rewards screen (`lib/presentation/pages/rewards/rewards_page.dart`) includes:

1. **LoreCoins Balance**
   - Current balance
   - Recent transactions

2. **Available Rewards**
   - Grid of reward cards
   - Redemption options

#### Profile Screen

The profile screen (`lib/presentation/pages/profile/profile_page.dart`) includes:

1. **User Profile**
   - Profile information
   - Achievement badges

2. **Completed Challenges**
   - List of completed challenges
   - Submission history

## Development Workflow

### Web Development

1. **Setup Environment**
   - Install Node.js and npm
   - Clone repository
   - Install dependencies
   - Configure environment variables

2. **Development Process**
   - Run development server (`npm run dev`)
   - Make changes to code
   - Test changes locally
   - Commit changes to version control

3. **Build and Deployment**
   - Build production version (`npm run build`)
   - Test production build locally (`npm start`)
   - Deploy to hosting platform (Firebase Hosting)

### Mobile Development

1. **Setup Environment**
   - Install Flutter SDK
   - Configure IDE (VS Code or Android Studio)
   - Clone repository
   - Install dependencies

2. **Development Process**
   - Run app in debug mode (`flutter run`)
   - Make changes to code
   - Hot reload to see changes
   - Test on multiple device sizes

3. **Build and Deployment**
   - Build release version (`flutter build apk` or `flutter build ios`)
   - Test on physical devices
   - Deploy to app stores (Google Play Store, Apple App Store)

## Conclusion

This setup guide provides a comprehensive overview of the LorePin web and mobile UI framework. By following these guidelines, developers can ensure a consistent and cohesive user experience across all platforms while adhering to the brand identity and design principles.

The modular architecture and component-based approach allow for scalable development and easy maintenance as the platform grows from its initial London launch to a global presence. 