import { getConnection } from '../utils/database.config';
import { Role } from '../models/role.entity';
import { Permission } from '../models/permission.entity';

export class RoleService {
  /**
   * Get a role by ID
   * @param id The ID of the role
   * @returns The role or null if not found
   */
  async getRoleById(id: string): Promise<Role | null> {
    const connection = await getConnection();
    const roleRepository = connection.getRepository(Role);
    return roleRepository.findOne({ where: { id } });
  }

  /**
   * Get a role by name
   * @param name The name of the role
   * @returns The role or null if not found
   */
  async getRoleByName(name: string): Promise<Role | null> {
    const connection = await getConnection();
    const roleRepository = connection.getRepository(Role);
    return roleRepository.findOne({ where: { name } });
  }

  /**
   * Get all roles
   * @returns All roles
   */
  async getAllRoles(): Promise<Role[]> {
    const connection = await getConnection();
    const roleRepository = connection.getRepository(Role);
    return roleRepository.find({ order: { name: 'ASC' } });
  }

  /**
   * Create a new role
   * @param roleData The role data
   * @returns The created role
   */
  async createRole(roleData: { name: string; description?: string }): Promise<Role> {
    const connection = await getConnection();
    const roleRepository = connection.getRepository(Role);
    
    // Check if role already exists
    const existingRole = await roleRepository.findOne({ where: { name: roleData.name } });
    if (existingRole) {
      throw new Error('Role already exists');
    }
    
    // Create new role
    const role = roleRepository.create(roleData);
    return roleRepository.save(role);
  }

  /**
   * Update a role
   * @param id The ID of the role
   * @param roleData The role data to update
   * @returns The updated role
   */
  async updateRole(id: string, roleData: Partial<Role>): Promise<Role> {
    const connection = await getConnection();
    const roleRepository = connection.getRepository(Role);
    
    // Check if role exists
    const role = await roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new Error('Role not found');
    }
    
    // Prevent updating super_admin role name
    if (role.name === 'super_admin' && roleData.name && roleData.name !== 'super_admin') {
      throw new Error('Cannot change super_admin role name');
    }
    
    // Update role
    roleRepository.merge(role, roleData);
    return roleRepository.save(role);
  }

  /**
   * Delete a role
   * @param id The ID of the role
   * @returns True if the role was deleted
   */
  async deleteRole(id: string): Promise<boolean> {
    const connection = await getConnection();
    const roleRepository = connection.getRepository(Role);
    
    // Check if role exists
    const role = await roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new Error('Role not found');
    }
    
    // Prevent deleting super_admin role
    if (role.name === 'super_admin') {
      throw new Error('Cannot delete super_admin role');
    }
    
    const result = await roleRepository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }

  /**
   * Assign permissions to a role
   * @param roleId The ID of the role
   * @param permissionIds The IDs of the permissions to assign
   * @returns The updated role
   */
  async assignPermissionsToRole(roleId: string, permissionIds: string[]): Promise<Role> {
    const connection = await getConnection();
    const roleRepository = connection.getRepository(Role);
    const permissionRepository = connection.getRepository(Permission);
    
    // Check if role exists
    const role = await roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new Error('Role not found');
    }
    
    // Get permissions
    const permissions = await permissionRepository.findByIds(permissionIds);
    if (permissions.length !== permissionIds.length) {
      throw new Error('One or more permissions not found');
    }
    
    // Assign permissions
    role.permissions = permissions;
    return roleRepository.save(role);
  }

  /**
   * Get all permissions
   * @returns All permissions
   */
  async getAllPermissions(): Promise<Permission[]> {
    const connection = await getConnection();
    const permissionRepository = connection.getRepository(Permission);
    return permissionRepository.find({ order: { resource: 'ASC', action: 'ASC' } });
  }

  /**
   * Create a new permission
   * @param permissionData The permission data
   * @returns The created permission
   */
  async createPermission(permissionData: {
    name: string;
    description?: string;
    resource: string;
    action: string;
  }): Promise<Permission> {
    const connection = await getConnection();
    const permissionRepository = connection.getRepository(Permission);
    
    // Check if permission already exists
    const existingPermission = await permissionRepository.findOne({
      where: [
        { name: permissionData.name },
        { resource: permissionData.resource, action: permissionData.action }
      ]
    });
    
    if (existingPermission) {
      throw new Error('Permission already exists');
    }
    
    // Create new permission
    const permission = permissionRepository.create(permissionData);
    return permissionRepository.save(permission);
  }
} 