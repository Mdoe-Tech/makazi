import { BaseEntity } from '../types';
import { User } from '../auth/types';

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  VERIFIER = 'VERIFIER',
  VIEWER = 'VIEWER',
  REGISTRAR = 'REGISTRAR',
  APPROVER = 'APPROVER'
}

export interface Admin extends BaseEntity {
  username: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  last_login?: Date;
  permissions: string[];
  metadata?: Record<string, any>;
}

export interface CreateAdminDto {
  username: string;
  email: string;
  password: string;
  role: AdminRole;
  permissions: string[];
}

export interface UpdateAdminDto extends Partial<Omit<CreateAdminDto, 'password'>> {
  is_active?: boolean;
  password?: string;
}

export interface AdminFilters {
  role?: AdminRole;
  is_active?: boolean;
  search?: string;
}

export interface AdminLoginDto {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  refresh_token: string;
  admin: Admin;
}

export interface UserFilters {
  username?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
  search?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: string;
  is_active: boolean;
  permissions: {
    can_manage_users: boolean;
    can_manage_roles: boolean;
    can_view_audit_logs: boolean;
    can_manage_settings: boolean;
  };
  metadata?: Record<string, any>;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  is_active?: boolean;
} 