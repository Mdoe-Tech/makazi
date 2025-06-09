import { BaseEntity } from '../types';
import { User } from '../auth/types';

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  REGIONAL_ADMIN = 'REGIONAL_ADMIN',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  WARD_ADMIN = 'WARD_ADMIN',
  OFFICE_ADMIN = 'OFFICE_ADMIN',
  REGISTRAR = 'REGISTRAR',
  VERIFIER = 'VERIFIER',
  APPROVER = 'APPROVER',
  VIEWER = 'VIEWER'
}

export interface Admin extends BaseEntity {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: AdminRole; // Primary role for backward compatibility
  roles: AdminRole[]; // All roles
  is_active: boolean;
  permissions: {
    can_manage_users: boolean;
    can_manage_roles: boolean;
    can_view_audit_logs: boolean;
    can_manage_settings: boolean;
  };
  metadata?: Record<string, any>;
  last_login?: {
    timestamp: Date;
    ip_address: string;
    user_agent: string;
  };
}

export interface CreateAdminDto {
  username: string;
  email: string;
  password: string;
  role: AdminRole; // Primary role for backward compatibility
  roles: AdminRole[]; // All roles
  permissions: string[];
}

export interface UpdateAdminDto {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role?: AdminRole; // Primary role for backward compatibility
  roles?: AdminRole[]; // All roles
  is_active?: boolean;
  permissions?: {
    can_manage_users: boolean;
    can_manage_roles: boolean;
    can_view_audit_logs: boolean;
    can_manage_settings: boolean;
  };
  metadata?: Record<string, any>;
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
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  roles: AdminRole[];
  is_active: boolean;
  permissions: {
    can_manage_users: boolean;
    can_manage_roles: boolean;
    can_view_audit_logs: boolean;
    can_manage_settings: boolean;
  };
  metadata?: {
    region?: string;
    district?: string;
    ward?: string;
  };
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  is_active?: boolean;
} 