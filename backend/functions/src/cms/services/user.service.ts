import { getConnection } from '../utils/database.config';
import { User } from '../models/user.entity';
import { Role } from '../models/role.entity';
import * as admin from 'firebase-admin';

export class UserService {
  /**
   * Get a user by Firebase UID
   * @param firebaseUid The Firebase UID of the user
   * @returns The user or null if not found
   */
  async getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User);
    return userRepository.findOne({ where: { firebase_uid: firebaseUid } });
  }

  /**
   * Get a user by ID
   * @param id The ID of the user
   * @returns The user or null if not found
   */
  async getUserById(id: string): Promise<User | null> {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User);
    return userRepository.findOne({ where: { id } });
  }

  /**
   * Get all users
   * @param page The page number (1-based)
   * @param limit The number of users per page
   * @returns The users and count
   */
  async getUsers(page: number = 1, limit: number = 10): Promise<{ users: User[], count: number }> {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User);
    
    const [users, count] = await userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });
    
    return { users, count };
  }

  /**
   * Create a new user
   * @param userData The user data
   * @returns The created user
   */
  async createUser(userData: {
    firebase_uid: string;
    email: string;
    display_name: string;
    avatar_url?: string;
  }): Promise<User> {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User);
    
    // Check if user already exists
    const existingUser = await userRepository.findOne({ 
      where: [
        { firebase_uid: userData.firebase_uid },
        { email: userData.email }
      ]
    });
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const user = userRepository.create(userData);
    return userRepository.save(user);
  }

  /**
   * Update a user
   * @param id The ID of the user
   * @param userData The user data to update
   * @returns The updated user
   */
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User);
    
    // Check if user exists
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user
    userRepository.merge(user, userData);
    return userRepository.save(user);
  }

  /**
   * Delete a user
   * @param id The ID of the user
   * @returns True if the user was deleted
   */
  async deleteUser(id: string): Promise<boolean> {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User);
    
    const result = await userRepository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }

  /**
   * Assign roles to a user
   * @param userId The ID of the user
   * @param roleIds The IDs of the roles to assign
   * @returns The updated user
   */
  async assignRolesToUser(userId: string, roleIds: string[]): Promise<User> {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User);
    const roleRepository = connection.getRepository(Role);
    
    // Check if user exists
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    
    // Get roles
    const roles = await roleRepository.findByIds(roleIds);
    if (roles.length !== roleIds.length) {
      throw new Error('One or more roles not found');
    }
    
    // Assign roles
    user.roles = roles;
    return userRepository.save(user);
  }

  /**
   * Create a user from Firebase Auth user
   * @param firebaseUser The Firebase Auth user
   * @returns The created user
   */
  async createUserFromFirebase(firebaseUser: admin.auth.UserRecord): Promise<User> {
    if (!firebaseUser.email) {
      throw new Error('Firebase user email is required');
    }
    
    return this.createUser({
      firebase_uid: firebaseUser.uid,
      email: firebaseUser.email,
      display_name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      avatar_url: firebaseUser.photoURL,
    });
  }

  /**
   * Sync a user from Firebase Auth
   * @param firebaseUser The Firebase Auth user
   * @returns The synced user
   */
  async syncUserFromFirebase(firebaseUser: admin.auth.UserRecord): Promise<User> {
    if (!firebaseUser.email) {
      throw new Error('Firebase user email is required');
    }
    
    const user = await this.getUserByFirebaseUid(firebaseUser.uid);
    
    if (user) {
      // Update existing user
      return this.updateUser(user.id, {
        email: firebaseUser.email,
        display_name: firebaseUser.displayName || user.display_name,
        avatar_url: firebaseUser.photoURL || user.avatar_url,
        last_login_at: new Date(),
      });
    } else {
      // Create new user
      return this.createUserFromFirebase(firebaseUser);
    }
  }
} 