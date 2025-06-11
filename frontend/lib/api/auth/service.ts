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
    // Use different endpoints for admin and citizen login
    const endpoint = 'username' in data ? '/auth/admin/login' : '/auth/login';
    const response = await apiClientInstance.post<AuthResponse>(endpoint, data);
    console.log('Login response:', response);
    return response;
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClientInstance.post<AuthResponse>('/auth/register', data);
    return response;
  }

  async verifyNida(data: { nida_number: string }): Promise<AuthResponse> {
    const response = await apiClientInstance.post<AuthResponse>('/auth/verify-nida', data);
    return response;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClientInstance.post<AuthResponse>('/auth/refresh');
    return response;
  }

  async logout(): Promise<void> {
    await apiClientInstance.post('/auth/logout');
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