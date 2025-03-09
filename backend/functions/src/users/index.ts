import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Retrieves a user's profile data
 * - Includes basic profile information
 * - Includes follower and following counts
 * - Includes LoreCoin balance
 */
export const getUserProfile = functions.https.onCall(async (data, context) => {
  try {
    // Ensure the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }
    
    const userId = data.userId || context.auth.uid;
    
    // Get user profile data
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        `User profile for ${userId} not found.`
      );
    }
    
    const userData = userDoc.data();
    
    if (!userData) {
      throw new functions.https.HttpsError(
        'internal',
        'User data is undefined.'
      );
    }
    
    // Get submission count
    const submissionsSnapshot = await admin.firestore()
      .collection('submissions')
      .where('userId', '==', userId)
      .count()
      .get();
    
    const submissionCount = submissionsSnapshot.data().count;
    
    // Get recent submissions
    const recentSubmissionsSnapshot = await admin.firestore()
      .collection('submissions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();
    
    const recentSubmissions = recentSubmissionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Return combined profile data
    return {
      ...userData,
      followerCount: userData.followers ? userData.followers.length : 0,
      followingCount: userData.following ? userData.following.length : 0,
      submissionCount,
      recentSubmissions
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error retrieving user profile.',
      error
    );
  }
}); 