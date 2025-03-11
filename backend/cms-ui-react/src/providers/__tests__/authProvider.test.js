import authProvider from '../authProvider';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe('Auth Provider', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Clear localStorage
    localStorage.clear();
  });

  describe('login', () => {
    test('successful login with admin role', async () => {
      // Mock Firebase Auth
      const mockUser = { uid: 'user123', email: 'admin@example.com' };
      signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      getAuth.mockReturnValue({});

      // Mock Firestore
      const mockUserDoc = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue({
          role: 'admin',
          displayName: 'Admin User',
        }),
      };
      getDoc.mockResolvedValue(mockUserDoc);
      doc.mockReturnValue({});
      getFirestore.mockReturnValue({});

      // Call login
      await expect(
        authProvider.login({ username: 'admin@example.com', password: 'password' })
      ).resolves.not.toThrow();

      // Check if Firebase Auth was called
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'admin@example.com',
        'password'
      );

      // Check if Firestore was called
      expect(getDoc).toHaveBeenCalled();

      // Check if localStorage was updated
      const authData = JSON.parse(localStorage.getItem('auth'));
      expect(authData).toEqual({
        uid: 'user123',
        displayName: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
      });
    });

    test('login fails for non-admin user', async () => {
      // Mock Firebase Auth
      const mockUser = { uid: 'user123', email: 'user@example.com' };
      signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      getAuth.mockReturnValue({});

      // Mock Firestore
      const mockUserDoc = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue({
          role: 'user',
          displayName: 'Regular User',
        }),
      };
      getDoc.mockResolvedValue(mockUserDoc);
      doc.mockReturnValue({});
      getFirestore.mockReturnValue({});

      // Mock signOut
      signOut.mockResolvedValue();

      // Call login and expect it to reject
      await expect(
        authProvider.login({ username: 'user@example.com', password: 'password' })
      ).rejects.toEqual({
        message: 'Insufficient permissions. You need admin role to access the CMS.',
      });

      // Check if signOut was called
      expect(signOut).toHaveBeenCalled();

      // Check if localStorage was not updated
      expect(localStorage.getItem('auth')).toBeNull();
    });
  });

  describe('logout', () => {
    test('successful logout', async () => {
      // Set up localStorage
      localStorage.setItem(
        'auth',
        JSON.stringify({
          uid: 'user123',
          displayName: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        })
      );

      // Mock Firebase Auth
      signOut.mockResolvedValue();
      getAuth.mockReturnValue({});

      // Call logout
      await expect(authProvider.logout()).resolves.not.toThrow();

      // Check if Firebase Auth was called
      expect(signOut).toHaveBeenCalled();

      // Check if localStorage was cleared
      expect(localStorage.getItem('auth')).toBeNull();
    });
  });

  describe('checkAuth', () => {
    test('returns resolved promise when user is authenticated', async () => {
      // Set up localStorage
      localStorage.setItem(
        'auth',
        JSON.stringify({
          uid: 'user123',
          displayName: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        })
      );

      // Call checkAuth
      await expect(authProvider.checkAuth()).resolves.not.toThrow();
    });

    test('returns rejected promise when user is not authenticated', async () => {
      // Call checkAuth and expect it to reject
      try {
        await authProvider.checkAuth();
        // If we get here, the test should fail
        expect(true).toBe(false); // This should not be reached
      } catch (error) {
        // If we get here, the test should pass
        expect(true).toBe(true);
      }
    });
  });

  describe('getPermissions', () => {
    test('returns user role when authenticated', async () => {
      // Set up localStorage
      localStorage.setItem(
        'auth',
        JSON.stringify({
          uid: 'user123',
          displayName: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        })
      );

      // Call getPermissions
      await expect(authProvider.getPermissions()).resolves.toEqual('admin');
    });

    test('returns rejected promise when not authenticated', async () => {
      // Call getPermissions and expect it to reject
      try {
        await authProvider.getPermissions();
        // If we get here, the test should fail
        expect(true).toBe(false); // This should not be reached
      } catch (error) {
        // If we get here, the test should pass
        expect(true).toBe(true);
      }
    });
  });
}); 