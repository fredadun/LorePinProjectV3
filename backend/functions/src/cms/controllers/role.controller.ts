import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';
import { Role } from '../models/role.entity';
import { Permission } from '../models/permission.entity';

const roleService = new RoleService();

/**
 * Role controller with endpoints for role management
 */
export class RoleController {
  /**
   * Get all roles
   */
  async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await roleService.getAllRoles();
      
      res.status(200).json({
        roles: roles.map((role: Role) => ({
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions.map((permission: Permission) => ({
            id: permission.id,
            name: permission.name,
            resource: permission.resource,
            action: permission.action
          }))
        }))
      });
    } catch (error) {
      console.error('Error getting roles:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get a role by ID
   */
  async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ message: 'Role ID is required' });
        return;
      }
      
      const role = await roleService.getRoleById(id);
      
      if (!role) {
        res.status(404).json({ message: 'Role not found' });
        return;
      }
      
      res.status(200).json({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions.map((permission: Permission) => ({
          id: permission.id,
          name: permission.name,
          resource: permission.resource,
          action: permission.action
        }))
      });
    } catch (error) {
      console.error('Error getting role by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Create a new role
   */
  async createRole(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        res.status(400).json({ message: 'Role name is required' });
        return;
      }
      
      try {
        const role = await roleService.createRole({ name, description });
        
        res.status(201).json({
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: []
        });
      } catch (error) {
        if (error instanceof Error && error.message === 'Role already exists') {
          res.status(409).json({ message: 'Role already exists' });
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error creating role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Update a role
   */
  async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      if (!id) {
        res.status(400).json({ message: 'Role ID is required' });
        return;
      }
      
      if (!name && !description) {
        res.status(400).json({ message: 'At least one field to update is required' });
        return;
      }
      
      try {
        const role = await roleService.updateRole(id, { name, description });
        
        res.status(200).json({
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions.map((permission: Permission) => ({
            id: permission.id,
            name: permission.name,
            resource: permission.resource,
            action: permission.action
          }))
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Role not found') {
            res.status(404).json({ message: 'Role not found' });
            return;
          } else if (error.message === 'Cannot change super_admin role name') {
            res.status(403).json({ message: 'Cannot change super_admin role name' });
            return;
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('Error updating role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Delete a role
   */
  async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ message: 'Role ID is required' });
        return;
      }
      
      try {
        const result = await roleService.deleteRole(id);
        
        if (result) {
          res.status(200).json({ message: 'Role deleted successfully' });
        } else {
          res.status(404).json({ message: 'Role not found' });
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Role not found') {
            res.status(404).json({ message: 'Role not found' });
            return;
          } else if (error.message === 'Cannot delete super_admin role') {
            res.status(403).json({ message: 'Cannot delete super_admin role' });
            return;
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Assign permissions to a role
   */
  async assignPermissions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { permissionIds } = req.body;
      
      if (!id) {
        res.status(400).json({ message: 'Role ID is required' });
        return;
      }
      
      if (!permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
        res.status(400).json({ message: 'Permission IDs array is required' });
        return;
      }
      
      try {
        const role = await roleService.assignPermissionsToRole(id, permissionIds);
        
        res.status(200).json({
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions.map((permission: Permission) => ({
            id: permission.id,
            name: permission.name,
            resource: permission.resource,
            action: permission.action
          }))
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Role not found') {
            res.status(404).json({ message: 'Role not found' });
            return;
          } else if (error.message === 'One or more permissions not found') {
            res.status(404).json({ message: 'One or more permissions not found' });
            return;
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('Error assigning permissions to role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Get all permissions
   */
  async getAllPermissions(req: Request, res: Response): Promise<void> {
    try {
      const permissions = await roleService.getAllPermissions();
      
      res.status(200).json({
        permissions: permissions.map((permission: Permission) => ({
          id: permission.id,
          name: permission.name,
          resource: permission.resource,
          action: permission.action,
          description: permission.description
        }))
      });
    } catch (error) {
      console.error('Error getting permissions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Create a new permission
   */
  async createPermission(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, resource, action } = req.body;
      
      if (!name || !resource || !action) {
        res.status(400).json({ message: 'Permission name, resource, and action are required' });
        return;
      }
      
      try {
        const permission = await roleService.createPermission({ name, description, resource, action });
        
        res.status(201).json({
          id: permission.id,
          name: permission.name,
          description: permission.description,
          resource: permission.resource,
          action: permission.action
        });
      } catch (error) {
        if (error instanceof Error && error.message === 'Permission already exists') {
          res.status(409).json({ message: 'Permission already exists' });
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error creating permission:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
