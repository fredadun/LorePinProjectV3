import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Creates a user profile in Firestore when a new user signs up
 * Triggered by Firebase Auth user creation
 */
export const createUserProfile = functions.auth.user().onCreate(async (user: functions.auth.UserRecord) => {
  try {
    const { uid, email, displayName, photoURL } = user;
    
    // Create a user profile document in Firestore
    await admin.firestore().collection('users').doc(uid).set({
      userId: uid,
      email: email || '',
      displayName: displayName || '',
      photoURL: photoURL || '',
      skills: [],
      followers: [],
      following: [],
      loreCoins: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Create initial LoreCoin transaction for new user (welcome bonus)
    await admin.firestore().collection('lorecoin_transactions').add({
      userId: uid,
      amount: 20,
      type: 'earn',
      description: 'Welcome bonus',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Update user's LoreCoin balance
    await admin.firestore().collection('users').doc(uid).update({
      loreCoins: admin.firestore.FieldValue.increment(20)
    });
    
    console.log(`User profile created for ${uid}`);
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error };
  }
}); 