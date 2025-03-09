import { User } from 'firebase/auth';
import { UserProfile } from '@/components/auth/AuthProvider';

declare module '@/components/auth/AuthProvider' {
  export interface AuthContextType {
    currentUser: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
  }

  export function useAuth(): AuthContextType;
} 