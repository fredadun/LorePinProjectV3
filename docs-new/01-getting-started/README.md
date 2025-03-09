# Getting Started

This section provides all the information you need to set up and start working with the LorePin project.

## Contents

- [Project Setup](./project-setup.md) - Complete setup guide for the LorePin project
- [Setup Guide](./setup-guide.md) - Detailed installation and configuration instructions
- [Dependency Requirements](./dependency-requirements.md) - List of all project dependencies and requirements

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/fredadun/LorePinProjectV3.git
   cd LorePinProjectV3
   ```

2. **Set up the frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Set up the backend**:
   ```bash
   cd backend/functions
   npm install
   firebase emulators:start
   ```

4. **Set up the mobile app**:
   ```bash
   cd mobile
   flutter pub get
   flutter run
   ```

## Development Environment

For the best development experience, we recommend:

- Visual Studio Code with the following extensions:
  - ESLint
  - Prettier
  - Firebase
  - Flutter
- Node.js 18 or higher
- Firebase CLI
- Flutter SDK (for mobile development)
- Git

## Next Steps

After setting up the project, you should:

1. Read the [Technical Architecture](../02-architecture/technical-architecture.md) documentation
2. Familiarize yourself with the [Branching Workflow](../03-development/branching-workflow.md)
3. Review the [User Journeys](../04-user-journeys/README.md) to understand the application flow 