import { BaseEntity } from '../types';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  VIEWER = 'VIEWER'
}

export interface User extends BaseEntity {
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  last_login?: Date;
  permissions: string[];
  metadata?: Record<string, any>;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshTokenDto {
  refresh_token: string;
}

export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ResetPasswordDto {
  email: string;
}

export interface VerifyResetPasswordDto {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface UpdateProfileDto {
  username?: string;
  email?: string;
  current_password?: string;
} 