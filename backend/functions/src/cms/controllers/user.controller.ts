import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { Role } from '../models/role.entity';

// Extend the Express Request interface to include our custom properties
declare global {
  namespace Express {
    interface Request {
      dbUser?: any;
      user?: any;
    }
  }
}

const userService = new UserService();

/**
 * User controller with endpoints for user management
 */
export class UserController {
  /**
   * Get all users
   */
  async getUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const { users, count } = await userService.getUsers(page, limit);
      
      return res.status(200).json({
        users: users.map(user => ({
          id: user.id,
          firebase_uid: user.firebase_uid,
          email: user.email,
          display_name: user.display_name,
          avatar_url: user.avatar_url,
          created_at: user.created_at,
          updated_at: user.updated_at,
          last_login_at: user.last_login_at,
          is_active: user.is_active,
          roles: user.roles.map((role: Role) => ({
            id: role.id,
            name: role.name,
            description: role.description
          }))
        })),
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error getting users:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get a user by ID
   */
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({
        id: user.id,
        firebase_uid: user.firebase_uid,
        email: user.email,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login_at: user.last_login_at,
        is_active: user.is_active,
        roles: user.roles.map((role: Role) => ({
          id: role.id,
          name: role.name,
          description: role.description
        }))
      });
    } catch (error) {
      console.error('Error getting user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Update a user
   */
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { display_name, avatar_url, is_active } = req.body;
      
      // Validate input
      if (!display_name && avatar_url === undefined && is_active === undefined) {
        return res.status(400).json({ message: 'No valid fields to update' });
      }
      
      // Update user
      const userData: any = {};
      if (display_name) userData.display_name = display_name;
      if (avatar_url !== undefined) userData.avatar_url = avatar_url;
      if (is_active !== undefined) userData.is_active = is_active;
      
      const updatedUser = await userService.updateUser(id, userData);
      
      return res.status(200).json({
        id: updatedUser.id,
        firebase_uid: updatedUser.firebase_uid,
        email: updatedUser.email,
        display_name: updatedUser.display_name,
        avatar_url: updatedUser.avatar_url,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
        last_login_at: updatedUser.last_login_at,
        is_active: updatedUser.is_active,
        roles: updatedUser.roles.map((role: Role) => ({
          id: role.id,
          name: role.name,
          description: role.description
        }))
      });
    } catch (error: any) {
      console.error('Error updating user:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Assign roles to a user
   */
  async assignRoles(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { roleIds } = req.body;
      
      // Validate input
      if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
        return res.status(400).json({ message: 'Role IDs are required' });
      }
      
      // Assign roles
      const updatedUser = await userService.assignRolesToUser(id, roleIds);
      
      return res.status(200).json({
        id: updatedUser.id,
        firebase_uid: updatedUser.firebase_uid,
        email: updatedUser.email,
        display_name: updatedUser.display_name,
        roles: updatedUser.roles.map((role: Role) => ({
          id: role.id,
          name: role.name,
          description: role.description
        }))
      });
    } catch (error: any) {
      console.error('Error assigning roles:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (error.message === 'One or more roles not found') {
        return res.status(400).json({ message: 'One or more roles not found' });
      }
      
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(req: Request, res: Response) {
    try {
      const dbUser = req.dbUser;
      
      if (!dbUser) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
      }
      
      return res.status(200).json({
        id: dbUser.id,
        firebase_uid: dbUser.firebase_uid,
        email: dbUser.email,
        display_name: dbUser.display_name,
        avatar_url: dbUser.avatar_url,
        created_at: dbUser.created_at,
        updated_at: dbUser.updated_at,
        last_login_at: dbUser.last_login_at,
        is_active: dbUser.is_active,
        roles: dbUser.roles.map((role: Role) => ({
          id: role.id,
          name: role.name,
          description: role.description
        }))
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}