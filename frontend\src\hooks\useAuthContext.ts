'use client';

import { useContext } from 'react';
import { User } from 'firebase/auth';
import { createContext } from 'react';

// Define the user profile interface
export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  createdAt: Date;
  skills: string[];
  followers: string[];
  following: string[];
  loreCoins: number;
  profileImageUrl: string;
  bio: string;
}

// Define the auth context interface
export interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

// Create a default context
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
});

/**
 * Custom hook to access the auth context
 * @returns The auth context value
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
} 