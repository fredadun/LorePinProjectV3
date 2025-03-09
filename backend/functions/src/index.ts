import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();


// Import function modules
import * as authFunctions from './auth';
import * as challengeFunctions from './challenges';
import * as userFunctions from './users';
import * as loreCoinFunctions from './lorecoins';

// Export all functions
export const createUserProfile = authFunctions.createUserProfile;
export const processSubmission = challengeFunctions.processSubmission;
export const getUserProfile = userFunctions.getUserProfile;
export const awardLoreCoins = loreCoinFunctions.awardLoreCoins;