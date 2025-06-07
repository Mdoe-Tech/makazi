import { BaseEntity } from '../types';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  VIEWER = 'VIEWER'
}

export interface User extends BaseEntity {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  last_login?: Date;
  permissions: string[];
  metadata?: Record<string, any>;
  avatar?: string;
  phone_number?: string;
  employment_status?: string;
  employer_name?: string;
  occupation?: string;
  registration_status?: string;
}

export interface LoginDto {
  nida_number?: string;
  username?: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role?: string;
  is_active?: boolean;
  permissions?: {
    can_manage_users: boolean;
    can_manage_roles: boolean;
    can_view_audit_logs: boolean;
    can_manage_settings: boolean;
  };
}

export interface AuthResponse {
  status: string;
  data: {
    data: {
      needsPasswordSetup?: boolean;
      citizen?: {
        id: string;
        nida_number: string;
        first_name: string;
        last_name: string;
        email: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        phone_number?: string;
        employment_status?: string;
        employer_name?: string;
        occupation?: string;
        registration_status?: string;
        address?: {
          city: string;
          postal_code: string;
          region: string;
          street: string;
        };
        birth_certificate_number?: string;
        date_of_birth?: string;
        gender?: string;
        marital_status?: string;
        middle_name?: string;
        nationality?: string;
        other_names?: string;
      };
      access_token?: string;
      refresh_token?: string;
      user?: User;
    };
    status: string;
  };
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