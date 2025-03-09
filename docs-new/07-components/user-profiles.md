# User Profiles Component

This document describes the User Profiles component of the LorePin system.

## Overview

The User Profiles component manages user profile information, skills, and social connections within the LorePin platform.

## Features

- User profile creation and management
- User skills and interests
- Profile customization
- Social connections (following/followers)
- Activity history
- Achievement tracking

## Architecture

The User Profiles component follows a layered architecture:

- **UI Layer**: React components for profile display and editing
- **Service Layer**: Business logic for profile operations
- **Repository Layer**: Data access for profile storage
- **Model Layer**: Data structures for user profiles

## Data Model

```typescript
interface UserProfile {
  userId: string;
  displayName: string;
  bio: string;
  profileImageUrl: string;
  skills: string[];
  interests: string[];
  location: {
    latitude: number;
    longitude: number;
    displayName: string;
  };
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  stats: {
    challengesCompleted: number;
    loreCoinsEarned: number;
    followersCount: number;
    followingCount: number;
  };
  preferences: {
    notificationsEnabled: boolean;
    privacySettings: {
      profileVisibility: 'public' | 'followers' | 'private';
      locationVisibility: 'public' | 'followers' | 'private';
      activityVisibility: 'public' | 'followers' | 'private';
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## API Reference

### Profile Management

- `createUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile>`
- `getUserProfile(userId: string): Promise<UserProfile>`
- `updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>`
- `deleteUserProfile(userId: string): Promise<void>`

### Social Connections

- `followUser(followerId: string, followeeId: string): Promise<void>`
- `unfollowUser(followerId: string, followeeId: string): Promise<void>`
- `getFollowers(userId: string, limit: number, startAfter?: string): Promise<UserProfile[]>`
- `getFollowing(userId: string, limit: number, startAfter?: string): Promise<UserProfile[]>`

### Profile Search

- `searchProfiles(query: string, limit: number): Promise<UserProfile[]>`
- `searchProfilesBySkill(skill: string, limit: number): Promise<UserProfile[]>`
- `searchProfilesByLocation(latitude: number, longitude: number, radiusKm: number): Promise<UserProfile[]>`

## Dependencies

- Authentication Component: For user identity and permissions
- Storage Component: For profile images
- Notification Component: For social interaction notifications

## Security Considerations

- Profile data is protected by Firestore security rules
- Users can only edit their own profiles
- Profile visibility is controlled by privacy settings
- Sensitive information is not exposed in public profiles

## Implementation Details

### Frontend Implementation

The User Profiles component is implemented in the frontend using:

- React components for profile display and editing
- Redux for state management
- Firebase SDK for data access

### Backend Implementation

The backend implementation uses:

- Firestore for profile data storage
- Cloud Functions for profile-related operations
- Firebase Authentication for user identity

## Testing

The User Profiles component is tested using:

- Unit tests for business logic
- Integration tests for API endpoints
- UI tests for profile components

## Future Enhancements

- Enhanced profile customization options
- Profile verification badges
- Advanced privacy controls
- Integration with external social platforms 