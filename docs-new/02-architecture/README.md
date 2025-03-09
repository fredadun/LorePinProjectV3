# Architecture

This section provides detailed information about the LorePin project's architecture, system design, and component interactions.

## Contents

- [Technical Architecture](./technical-architecture.md) - Overview of the entire system architecture
- [Mobile Architecture](./mobile-architecture.md) - Detailed architecture of the mobile application
- [Authentication Flow](./authentication-flow.md) - User authentication and authorization processes
- [Landing Page Specification](./landing-page-specification.md) - Detailed requirements for the landing page v2.1

## System Overview

LorePin is built using a modern, serverless architecture with the following key components:

### Frontend
- React-based web application
- Redux for state management
- Tailwind CSS for styling

### Backend
- Firebase serverless backend
  - Cloud Functions for business logic
  - Firestore for database
  - Firebase Authentication for user management
  - Firebase Storage for media files

### Mobile
- Flutter-based mobile application
- Riverpod for state management
- Firebase SDK for mobile integration

## Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Web Frontend   │     │  Mobile App     │     │  Admin Portal   │
│  (React/Redux)  │     │  (Flutter)      │     │  (React)        │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         └─────────────►│                 │◄─────────────┘
                        │  Firebase APIs  │
                        │                 │
                        └────────┬────────┘
                                 │
                                 │
         ┌─────────────┬─────────┴─────────┬─────────────┐
         │             │                   │             │
         ▼             ▼                   ▼             ▼
┌─────────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│                 │    │             │    │             │    │             │
│  Cloud          │    │  Firestore  │    │  Firebase   │    │  Firebase   │
│  Functions      │    │  Database   │    │  Auth       │    │  Storage    │
│                 │    │             │    │             │    │             │
└─────────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Data Models

The core data models in the LorePin system include:

- **User**: User profiles, skills, and preferences
- **Challenge**: Location-based challenges created by sponsors
- **Submission**: User submissions for challenges
- **LoreCoin**: Virtual currency transactions and balances
- **Sponsor**: Sponsor profiles and challenge management

## Integration Points

The system integrates with several external services:

- Google Maps API for location services
- Social authentication providers (Google, Facebook, etc.)
- Stripe for payment processing (future)
- Push notification services

## Security Architecture

Security is implemented at multiple levels:

- Firebase Authentication for user identity
- Firestore Security Rules for data access control
- Cloud Functions for server-side validation
- HTTPS for all communications
- Content Security Policy for web frontend 