import { BaseEntity } from '../types';
import { User } from '../auth/types';

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  VIEWER = 'VIEWER'
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
  role: string;
  permissions: string[];
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  is_active?: boolean;
} 