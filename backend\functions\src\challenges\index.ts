import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Processes a new challenge submission
 * - Validates submission data
 * - Updates challenge statistics
 * - Awards LoreCoins to the user
 */
export const processSubmission = functions.firestore
  .document('submissions/{submissionId}')
  .onCreate(async (snapshot, context) => {
    try {
      const submissionData = snapshot.data();
      const submissionId = context.params.submissionId;
      
      if (!submissionData) {
        throw new Error('No submission data found');
      }
      
      const { userId, challengeId, mediaURL } = submissionData;
      
      if (!userId || !challengeId || !mediaURL) {
        throw new Error('Missing required fields in submission');
      }
      
      // Get challenge data
      const challengeRef = admin.firestore().collection('challenges').doc(challengeId);
      const challengeDoc = await challengeRef.get();
      
      if (!challengeDoc.exists) {
        throw new Error(`Challenge ${challengeId} not found`);
      }
      
      const challengeData = challengeDoc.data();
      
      if (!challengeData) {
        throw new Error('No challenge data found');
      }
      
      // Update challenge statistics
      await challengeRef.update({
        submissionCount: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Award LoreCoins to the user (standard 20 coins per submission)
      const loreCoinsAmount = 20;
      
      // Create LoreCoin transaction
      await admin.firestore().collection('lorecoin_transactions').add({
        userId,
        amount: loreCoinsAmount,
        type: 'earn',
        description: `Submission to challenge: ${challengeData.title || challengeId}`,
        submissionId,
        challengeId,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Update user's LoreCoin balance
      await admin.firestore().collection('users').doc(userId).update({
        loreCoins: admin.firestore.FieldValue.increment(loreCoinsAmount),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Update submission with processed status
      await snapshot.ref.update({
        processed: true,
        loreCoinsAwarded: loreCoinsAmount,
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`Processed submission ${submissionId} for challenge ${challengeId}`);
      return { success: true };
    } catch (error) {
      console.error('Error processing submission:', error);
      return { success: false, error };
    }
  }); 