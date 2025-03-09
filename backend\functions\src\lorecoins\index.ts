import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Awards LoreCoins to a user
 * - Can be triggered by various actions (voting, streaks, etc.)
 * - Creates a transaction record
 * - Updates user's LoreCoin balance
 */
export const awardLoreCoins = functions.https.onCall(async (data, context) => {
  try {
    // Ensure the request is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }
    
    // Validate required data
    const { userId, amount, type, description } = data;
    
    if (!userId || !amount || !type || !description) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields: userId, amount, type, description'
      );
    }
    
    // Only admins can award coins to other users
    if (userId !== context.auth.uid && !context.auth.token.isAdmin) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only admins can award coins to other users.'
      );
    }
    
    // Start a batch write
    const batch = admin.firestore().batch();
    
    // Create transaction record
    const transactionRef = admin.firestore().collection('lorecoin_transactions').doc();
    batch.set(transactionRef, {
      userId,
      amount,
      type,
      description,
      awardedBy: context.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Update user's LoreCoin balance
    const userRef = admin.firestore().collection('users').doc(userId);
    batch.update(userRef, {
      loreCoins: admin.firestore.FieldValue.increment(amount),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log(`Awarded ${amount} LoreCoins to user ${userId} for ${description}`);
    return { success: true, transactionId: transactionRef.id };
  } catch (error) {
    console.error('Error awarding LoreCoins:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error awarding LoreCoins.',
      error
    );
  }
}); 