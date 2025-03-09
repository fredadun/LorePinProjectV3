import { User, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import { UserProfile } from '@/hooks/useAuthContext';

/**
 * User service for handling user-related operations
 */
export const userService = {
  /**
   * Get user profile from Firestore
   * @param userId - The user ID
   * @returns The user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          ...userData,
          userId,
          createdAt: userData.createdAt?.toDate() || new Date(),
        } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  /**
   * Update user profile in Firestore and Firebase Auth
   * @param user - The Firebase Auth user
   * @param profileData - The profile data to update
   * @returns A promise that resolves when the profile is updated
   */
  async updateUserProfile(
    user: User,
    profileData: { username?: string; bio?: string }
  ): Promise<void> {
    try {
      // Update Firebase Auth profile
      if (profileData.username) {
        await updateProfile(user, {
          displayName: profileData.username,
        });
      }
      
      // Update Firestore document
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        ...profileData,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
  
  /**
   * Upload profile image to Firebase Storage and update user profile
   * @param user - The Firebase Auth user
   * @param file - The image file to upload
   * @returns A promise that resolves with the download URL
   */
  async uploadProfileImage(user: User, file: File): Promise<string> {
    try {
      // Create a storage reference
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update user profile
      await updateProfile(user, {
        photoURL: downloadURL,
      });
      
      // Update Firestore document
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        profileImageUrl: downloadURL,
        updatedAt: new Date(),
      });
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },
  
  /**
   * Add a skill to the user's profile
   * @param userId - The user ID
   * @param skill - The skill to add
   * @returns A promise that resolves when the skill is added
   */
  async addSkill(userId: string, skill: string): Promise<void> {
    try {
      // Get current skills
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('User document does not exist');
      }
      
      const userData = userDoc.data();
      const skills = [...(userData.skills || [])];
      
      // Check if skill already exists
      if (skills.includes(skill)) {
        throw new Error('Skill already exists');
      }
      
      // Add new skill
      skills.push(skill);
      
      // Update Firestore document
      await updateDoc(userDocRef, {
        skills,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  },
  
  /**
   * Remove a skill from the user's profile
   * @param userId - The user ID
   * @param skill - The skill to remove
   * @returns A promise that resolves when the skill is removed
   */
  async removeSkill(userId: string, skill: string): Promise<void> {
    try {
      // Get current skills
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('User document does not exist');
      }
      
      const userData = userDoc.data();
      const skills = (userData.skills || []).filter((s: string) => s !== skill);
      
      // Update Firestore document
      await updateDoc(userDocRef, {
        skills,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error removing skill:', error);
      throw error;
    }
  },
  
  /**
   * Follow a user
   * @param userId - The current user ID
   * @param targetUserId - The user ID to follow
   * @returns A promise that resolves when the user is followed
   */
  async followUser(userId: string, targetUserId: string): Promise<void> {
    try {
      // Update current user's following list
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('User document does not exist');
      }
      
      const userData = userDoc.data();
      const following = [...(userData.following || [])];
      
      // Check if already following
      if (following.includes(targetUserId)) {
        throw new Error('Already following this user');
      }
      
      // Add to following list
      following.push(targetUserId);
      
      // Update Firestore document
      await updateDoc(userDocRef, {
        following,
        updatedAt: new Date(),
      });
      
      // Update target user's followers list
      const targetUserDocRef = doc(db, 'users', targetUserId);
      const targetUserDoc = await getDoc(targetUserDocRef);
      
      if (!targetUserDoc.exists()) {
        throw new Error('Target user document does not exist');
      }
      
      const targetUserData = targetUserDoc.data();
      const followers = [...(targetUserData.followers || [])];
      
      // Add to followers list
      followers.push(userId);
      
      // Update Firestore document
      await updateDoc(targetUserDocRef, {
        followers,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  },
  
  /**
   * Unfollow a user
   * @param userId - The current user ID
   * @param targetUserId - The user ID to unfollow
   * @returns A promise that resolves when the user is unfollowed
   */
  async unfollowUser(userId: string, targetUserId: string): Promise<void> {
    try {
      // Update current user's following list
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('User document does not exist');
      }
      
      const userData = userDoc.data();
      const following = (userData.following || []).filter((id: string) => id !== targetUserId);
      
      // Update Firestore document
      await updateDoc(userDocRef, {
        following,
        updatedAt: new Date(),
      });
      
      // Update target user's followers list
      const targetUserDocRef = doc(db, 'users', targetUserId);
      const targetUserDoc = await getDoc(targetUserDocRef);
      
      if (!targetUserDoc.exists()) {
        throw new Error('Target user document does not exist');
      }
      
      const targetUserData = targetUserDoc.data();
      const followers = (targetUserData.followers || []).filter((id: string) => id !== userId);
      
      // Update Firestore document
      await updateDoc(targetUserDocRef, {
        followers,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  },
  
  /**
   * Search for users by username or skills
   * @param searchTerm - The search term
   * @returns A promise that resolves with the search results
   */
  async searchUsers(searchTerm: string): Promise<UserProfile[]> {
    try {
      const usersRef = collection(db, 'users');
      const searchTermLower = searchTerm.toLowerCase();
      
      // Query for users with matching username
      const usernameQuery = query(
        usersRef,
        where('username', '>=', searchTermLower),
        where('username', '<=', searchTermLower + '\uf8ff')
      );
      
      const usernameSnapshot = await getDocs(usernameQuery);
      const usernameResults: UserProfile[] = [];
      
      usernameSnapshot.forEach((doc) => {
        const userData = doc.data();
        usernameResults.push({
          ...userData,
          userId: doc.id,
          createdAt: userData.createdAt?.toDate() || new Date(),
        } as UserProfile);
      });
      
      // Query for users with matching skills
      const skillsQuery = query(
        usersRef,
        where('skills', 'array-contains', searchTermLower)
      );
      
      const skillsSnapshot = await getDocs(skillsQuery);
      const skillsResults: UserProfile[] = [];
      
      skillsSnapshot.forEach((doc) => {
        // Skip if already in username results
        if (usernameResults.some((user) => user.userId === doc.id)) {
          return;
        }
        
        const userData = doc.data();
        skillsResults.push({
          ...userData,
          userId: doc.id,
          createdAt: userData.createdAt?.toDate() || new Date(),
        } as UserProfile);
      });
      
      return [...usernameResults, ...skillsResults];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },
}; 