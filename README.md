# LorePin Project

LorePin is a location-based challenge platform that connects users with sponsors through engaging challenges and rewards.

## Project Structure

The project is organized into the following main directories:

- **frontend**: React-based web application
- **backend**: Firebase serverless backend
  - **functions**: Cloud Functions for Firebase
  - **firestore**: Firestore database configuration
  - **storage**: Firebase Storage rules
  - **cms-ui**: Simple HTML/JS CMS UI
  - **cms-ui-react**: React Admin-based CMS UI
- **mobile**: Flutter-based mobile application
- **docs**: Project documentation
- **docs-new**: Updated project documentation
- **scripts**: Automation scripts for development

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Firebase CLI
- Flutter SDK (for mobile development)
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/fredadun/LorePinProjectV3.git
   cd LorePinProjectV3
   ```

2. Set up environment variables:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration values
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Set up the backend:
   ```bash
   cd backend/functions
   npm install
   firebase emulators:start
   ```

5. Set up the CMS UI:
   ```bash
   cd backend/cms-ui-react
   npm install
   npm start
   ```

6. Set up the mobile app:
   ```bash
   cd mobile
   flutter pub get
   flutter run
   ```

## Development Workflow

1. Follow the [Branching Workflow Guide](docs/BranchingWorkflow.md) for all code changes
2. Always work on feature branches created from the development branch
3. Use pull requests for code review and merging
4. Follow the progression: development → test → main

## CI/CD Pipeline

The project includes a CI/CD pipeline implemented with GitHub Actions:

- **Automated Testing**: All code changes are automatically tested
- **Automated Deployment**: Changes are automatically deployed to the appropriate environment
- **Environment Progression**: Development → Staging → Production

For more details, see the [CI/CD Integration Guide](docs-new/06-deployment/ci-cd-integration.md).

## Automation Scripts

The project includes various automation scripts to help with development. See the [scripts README](scripts/README.md) for details.

## Core Features

- User authentication with multiple providers
- Location-based challenges
- Media submission and validation
- LoreCoin rewards system
- Sponsor management
- User profiles and skills
- Advanced CMS for content moderation and management

## Architecture

- **Frontend**: React with Redux for state management
- **Backend**: Firebase (Auth, Firestore, Functions, Storage)
- **Mobile**: Flutter with Riverpod for state management
- **CMS**: React Admin with Firebase integration

## Documentation

Detailed documentation is available in the `docs` and `docs-new` directories:

- [Project Setup](docs/ProjectSetup.md)
- [Architecture Overview](docs/ArchitectureOverview.md)
- [API Documentation](docs/APIDocumentation.md)
- [Mobile Architecture](docs/MobileArchitecture.md)
- [Improvement Roadmap](docs/ImprovementRoadmap.md)
- [CMS Specifications](docs/CMSSpecifications.md)
- [Environment Variables](docs-new/03-development/environment-variables.md)
- [CI/CD Integration](docs-new/06-deployment/ci-cd-integration.md)

## Security

- All sensitive information (API keys, secrets, etc.) is stored in environment variables
- Environment variables are never committed to version control
- See [Environment Variables](docs-new/03-development/environment-variables.md) for details on our approach

## Contributing

1. Follow the coding standards defined in the project
2. Write clean, modular code with appropriate comments
3. Include tests for new features
4. Update documentation as needed

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Branch Structure

The LorePin project uses a simple branching strategy:

- **development**: Active development branch where new features are implemented
- **test**: Testing branch for QA and verification before production
- **main**: Production-ready code

Contributors should create feature branches from the development branch and submit pull requests back to development when ready.