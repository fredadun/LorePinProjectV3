import { useState, useEffect, createContext, useContext } from 'react';
import {
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Define the User type that extends FirebaseUser with our custom fields
export interface User extends FirebaseUser {
  loreCoins?: number;
  skills?: string[];
  followers?: string[];
  following?: string[];
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component that wraps the application and provides auth context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        // Get additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            // Combine Firebase user with Firestore data
            const userData = userDoc.data();
            setUser({
              ...firebaseUser,
              loreCoins: userData.loreCoins || 0,
              skills: userData.skills || [],
              followers: userData.followers || [],
              following: userData.following || [],
            });
          } else {
            // If no Firestore document exists, just use the Firebase user
            setUser(firebaseUser as User);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUser(firebaseUser as User);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      
      if (isNewUser) {
        // Create a new user document in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          userId: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          skills: [],
          followers: [],
          following: [],
          loreCoins: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Error signing in with Google:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Error signing in with email:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create a new user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        userId: result.user.uid,
        email: result.user.email,
        displayName: result.user.email?.split('@')[0], // Use part of email as display name
        photoURL: null,
        skills: [],
        followers: [],
        following: [],
        loreCoins: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Error signing up with email:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Error resetting password:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auth context value
  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook for using the auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 