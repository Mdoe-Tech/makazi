import { BaseEntity } from '../types';

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  CITIZEN = 'CITIZEN'
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  roles: UserRole[];
  functional_roles: string[];
  is_active: boolean;
  permissions: string[] | Record<string, boolean>;
  created_at: string;
  updated_at: string;
  citizen_id: string | null;
  phone_number?: string;
}

export interface LoginDto {
  username?: string;
  nida_number?: string;
  password: string;
}

export interface RegisterDto {
  username?: string;
  nida_number?: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface AuthResponse {
  data: {
    data: {
      access_token: string;
      refresh_token: string;
      user: User;
      citizen?: any;
    };
    status: string;
  };
  status: string;
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