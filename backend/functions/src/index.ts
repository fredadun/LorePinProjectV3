import * as admin from 'firebase-admin';

admin.initializeApp();

// Import function modules
import * as authFunctions from './auth';
import * as challengeFunctions from './challenges';
import * as userFunctions from './users';
import * as loreCoinFunctions from './lorecoins';
import * as cmsFunctions from './cms';

// Export all functions
export const createUserProfile = authFunctions.createUserProfile;
export const processSubmission = challengeFunctions.processSubmission;
export const getUserProfile = userFunctions.getUserProfile;
export const awardLoreCoins = loreCoinFunctions.awardLoreCoins;

// Export CMS API
export const cms = cmsFunctions.cms; 