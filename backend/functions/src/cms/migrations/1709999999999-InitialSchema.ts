import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1709999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        firebase_uid VARCHAR(128) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        display_name VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_login_at TIMESTAMPTZ,
        is_active BOOLEAN NOT NULL DEFAULT TRUE
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
    `);

    // Create roles table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Create permissions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        resource VARCHAR(50) NOT NULL,
        action VARCHAR(50) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(resource, action)
      );
      
      CREATE INDEX IF NOT EXISTS idx_permissions_resource_action ON permissions(resource, action);
    `);

    // Create role_permissions table (many-to-many)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (role_id, permission_id)
      );
    `);

    // Create user_roles table (many-to-many)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by UUID REFERENCES users(id),
        PRIMARY KEY (user_id, role_id)
      );
    `);

    // Insert default roles
    await queryRunner.query(`
      INSERT INTO roles (name, description) VALUES
        ('super_admin', 'Full system access, audit logs, disaster recovery'),
        ('content_admin', 'Manages challenges, sponsors, and featured content'),
        ('moderator', 'Reviews reported content, handles appeals'),
        ('regional_moderator', 'Manages location-specific policies')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Insert default permissions
    await queryRunner.query(`
      -- User management permissions
      INSERT INTO permissions (name, resource, action, description) VALUES
        ('view_users', 'users', 'view', 'View user information'),
        ('create_users', 'users', 'create', 'Create new users'),
        ('update_users', 'users', 'update', 'Update user information'),
        ('delete_users', 'users', 'delete', 'Delete users'),
        ('assign_roles', 'users', 'assign_roles', 'Assign roles to users'),
        
        -- Role management permissions
        ('view_roles', 'roles', 'view', 'View roles'),
        ('create_roles', 'roles', 'create', 'Create new roles'),
        ('update_roles', 'roles', 'update', 'Update roles'),
        ('delete_roles', 'roles', 'delete', 'Delete roles'),
        ('assign_permissions', 'roles', 'assign_permissions', 'Assign permissions to roles'),
        
        -- Content moderation permissions
        ('view_moderation_queue', 'moderation', 'view_queue', 'View moderation queue'),
        ('approve_content', 'moderation', 'approve', 'Approve content'),
        ('reject_content', 'moderation', 'reject', 'Reject content'),
        ('escalate_content', 'moderation', 'escalate', 'Escalate content for review'),
        
        -- Challenge management permissions
        ('view_challenges', 'challenges', 'view', 'View challenges'),
        ('create_challenges', 'challenges', 'create', 'Create new challenges'),
        ('update_challenges', 'challenges', 'update', 'Update challenges'),
        ('delete_challenges', 'challenges', 'delete', 'Delete challenges'),
        ('feature_challenges', 'challenges', 'feature', 'Feature challenges'),
        
        -- Analytics permissions
        ('view_analytics', 'analytics', 'view', 'View analytics dashboards'),
        ('export_reports', 'analytics', 'export', 'Export analytics reports'),
        ('configure_reports', 'analytics', 'configure', 'Configure custom reports')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Assign permissions to roles
    await queryRunner.query(`
      -- Super Admin gets all permissions
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT 
        (SELECT id FROM roles WHERE name = 'super_admin'),
        id
      FROM permissions
      ON CONFLICT (role_id, permission_id) DO NOTHING;
      
      -- Content Admin permissions
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT 
        (SELECT id FROM roles WHERE name = 'content_admin'),
        id
      FROM permissions
      WHERE 
        resource IN ('challenges', 'analytics') OR
        name IN ('view_users', 'view_moderation_queue', 'approve_content', 'reject_content')
      ON CONFLICT (role_id, permission_id) DO NOTHING;
      
      -- Moderator permissions
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT 
        (SELECT id FROM roles WHERE name = 'moderator'),
        id
      FROM permissions
      WHERE 
        resource = 'moderation' OR
        name IN ('view_users', 'view_challenges')
      ON CONFLICT (role_id, permission_id) DO NOTHING;
      
      -- Regional Moderator permissions
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT 
        (SELECT id FROM roles WHERE name = 'regional_moderator'),
        id
      FROM permissions
      WHERE 
        resource = 'moderation' OR
        name IN ('view_users', 'view_challenges')
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS user_roles;`);
    await queryRunner.query(`DROP TABLE IF EXISTS role_permissions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS permissions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
} 