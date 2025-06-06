import { apiClientInstance } from '../client';
import { ApiResponse } from '../types';
import {
  User,
  LoginDto,
  RegisterDto,
  AuthResponse,
  RefreshTokenDto,
  ChangePasswordDto,
  ResetPasswordDto,
  VerifyResetPasswordDto,
  UpdateProfileDto
} from './types';

export class AuthService {
  private static instance: AuthService;
  private readonly baseUrl = '/auth';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClientInstance.post<AuthResponse>(`${this.baseUrl}/login`, data);
    console.log('Auth service login response:', response); // Debug log
    return response;
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    return apiClientInstance.post<AuthResponse>('/admin/users/first-admin', data);
  }

  async refreshToken(): Promise<AuthResponse> {
    return apiClientInstance.post<AuthResponse>(`${this.baseUrl}/refresh`);
  }

  async logout(): Promise<void> {
    return apiClientInstance.post(`${this.baseUrl}/logout`);
  }

  async getProfile(): Promise<{ data: User }> {
    return apiClientInstance.get<{ data: User }>(`${this.baseUrl}/profile`);
  }

  async updateProfile(data: Partial<User>): Promise<{ data: User }> {
    return apiClientInstance.patch<{ data: User }>(`${this.baseUrl}/profile`, data);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return apiClientInstance.post(`${this.baseUrl}/change-password`, {
      oldPassword,
      newPassword
    });
  }

  async requestPasswordReset(data: ResetPasswordDto): Promise<ApiResponse<void>> {
    return apiClientInstance.post<ApiResponse<void>>(`${this.baseUrl}/reset-password`, data);
  }

  async verifyResetPassword(data: VerifyResetPasswordDto): Promise<ApiResponse<void>> {
    return apiClientInstance.post<ApiResponse<void>>(`${this.baseUrl}/verify-reset-password`, data);
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClientInstance.post<ApiResponse<void>>(`${this.baseUrl}/verify-email`, { token });
  }

  async resendVerificationEmail(): Promise<ApiResponse<void>> {
    return apiClientInstance.post<ApiResponse<void>>(`${this.baseUrl}/resend-verification`);
  }

  async getPermissions(): Promise<ApiResponse<string[]>> {
    return apiClientInstance.get<ApiResponse<string[]>>(`${this.baseUrl}/permissions`);
  }
}

export const authService = AuthService.getInstance(); 