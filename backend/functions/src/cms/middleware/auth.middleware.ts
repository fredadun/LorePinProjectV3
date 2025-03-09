import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { UserService } from '../services/user.service';

const userService = new UserService();

/**
 * Middleware to verify Firebase authentication token
 */
export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      
      // Sync user with database
      const firebaseUser = await admin.auth().getUser(decodedToken.uid);
      const dbUser = await userService.syncUserFromFirebase(firebaseUser);
      req.dbUser = dbUser;
      
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Middleware to check if user has required roles
 * @param roles The roles required to access the resource
 */
export const hasRoles = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const dbUser = req.dbUser;
      
      if (!dbUser) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
      }
      
      // Check if user has any of the required roles
      if (dbUser.hasAnyRole(roles)) {
        next();
      } else {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
    } catch (error) {
      console.error('Role check middleware error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

/**
 * Middleware to check if user has super admin role
 */
export const isSuperAdmin = hasRoles(['super_admin']);

/**
 * Middleware to check if user has content admin role
 */
export const isContentAdmin = hasRoles(['super_admin', 'content_admin']);

/**
 * Middleware to check if user has moderator role
 */
export const isModerator = hasRoles(['super_admin', 'content_admin', 'moderator', 'regional_moderator']); 