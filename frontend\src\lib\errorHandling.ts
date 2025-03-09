/**
 * Error handling utilities for API calls and Firebase operations
 */

// Firebase authentication error codes and messages
const authErrorMessages: Record<string, string> = {
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-email': 'Invalid email address format.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password is too weak. Use at least 8 characters with a mix of letters, numbers, and symbols.',
  'auth/invalid-credential': 'Invalid login credentials. Please try again.',
  'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled for this project.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed before completing the sign-in process.',
  'auth/network-request-failed': 'A network error occurred. Please check your connection and try again.',
  'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
};

// Firestore error codes and messages
const firestoreErrorMessages: Record<string, string> = {
  'permission-denied': 'You do not have permission to access this resource.',
  'not-found': 'The requested document was not found.',
  'already-exists': 'The document already exists.',
  'failed-precondition': 'Operation failed due to a precondition failure.',
  'resource-exhausted': 'Quota exceeded or rate limit reached.',
  'cancelled': 'The operation was cancelled.',
  'unknown': 'An unknown error occurred.',
  'invalid-argument': 'Invalid argument provided.',
  'deadline-exceeded': 'Operation timed out.',
  'unauthenticated': 'User is not authenticated.',
};

// Storage error codes and messages
const storageErrorMessages: Record<string, string> = {
  'storage/object-not-found': 'The file does not exist.',
  'storage/unauthorized': 'You do not have permission to access this file.',
  'storage/canceled': 'The upload was cancelled.',
  'storage/unknown': 'An unknown error occurred during the upload.',
  'storage/quota-exceeded': 'Storage quota exceeded.',
  'storage/invalid-checksum': 'File on the client does not match the checksum of the file received by the server.',
  'storage/server-file-wrong-size': 'File on the client does not match the size of the file received by the server.',
};

/**
 * Get a user-friendly error message for a Firebase authentication error
 * @param errorCode - The Firebase error code
 * @returns A user-friendly error message
 */
export function getAuthErrorMessage(errorCode: string): string {
  return authErrorMessages[errorCode] || 'An error occurred during authentication. Please try again.';
}

/**
 * Get a user-friendly error message for a Firestore error
 * @param errorCode - The Firestore error code
 * @returns A user-friendly error message
 */
export function getFirestoreErrorMessage(errorCode: string): string {
  return firestoreErrorMessages[errorCode] || 'An error occurred while accessing the database. Please try again.';
}

/**
 * Get a user-friendly error message for a Storage error
 * @param errorCode - The Storage error code
 * @returns A user-friendly error message
 */
export function getStorageErrorMessage(errorCode: string): string {
  return storageErrorMessages[errorCode] || 'An error occurred during file upload. Please try again.';
}

/**
 * Format an error object into a user-friendly message
 * @param error - The error object
 * @returns A user-friendly error message
 */
export function formatError(error: any): string {
  if (!error) {
    return 'An unknown error occurred.';
  }

  // Handle Firebase auth errors
  if (error.code && error.code.startsWith('auth/')) {
    return getAuthErrorMessage(error.code);
  }

  // Handle Firestore errors
  if (error.code && firestoreErrorMessages[error.code]) {
    return getFirestoreErrorMessage(error.code);
  }

  // Handle Storage errors
  if (error.code && error.code.startsWith('storage/')) {
    return getStorageErrorMessage(error.code);
  }

  // Handle network errors
  if (error.message && error.message.includes('network')) {
    return 'A network error occurred. Please check your connection and try again.';
  }

  // Handle other errors with messages
  if (error.message) {
    return error.message;
  }

  // Default error message
  return 'An unexpected error occurred. Please try again.';
} 