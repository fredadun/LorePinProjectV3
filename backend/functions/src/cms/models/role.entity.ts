import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './permission.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  // Helper method to check if role has a specific permission
  hasPermission(permissionName: string): boolean {
    return this.permissions?.some(permission => permission.name === permissionName) || false;
  }

  // Helper method to check if role has any of the specified permissions
  hasAnyPermission(permissionNames: string[]): boolean {
    return this.permissions?.some(permission => permissionNames.includes(permission.name)) || false;
  }
} 