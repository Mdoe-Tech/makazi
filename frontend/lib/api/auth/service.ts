import { apiClient } from '../client';
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

  async login(data: LoginDto): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, data);
  }

  async register(data: RegisterDto): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/register`, data);
  }

  async refreshToken(data: RefreshTokenDto): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/refresh-token`, data);
  }

  async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>(`${this.baseUrl}/logout`);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>(`${this.baseUrl}/me`);
  }

  async changePassword(data: ChangePasswordDto): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>(`${this.baseUrl}/change-password`, data);
  }

  async requestPasswordReset(data: ResetPasswordDto): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>(`${this.baseUrl}/reset-password`, data);
  }

  async verifyResetPassword(data: VerifyResetPasswordDto): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>(`${this.baseUrl}/verify-reset-password`, data);
  }

  async updateProfile(data: UpdateProfileDto): Promise<ApiResponse<User>> {
    return apiClient.patch<ApiResponse<User>>(`${this.baseUrl}/profile`, data);
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>(`${this.baseUrl}/verify-email`, { token });
  }

  async resendVerificationEmail(): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>(`${this.baseUrl}/resend-verification`);
  }

  async getPermissions(): Promise<ApiResponse<string[]>> {
    return apiClient.get<ApiResponse<string[]>>(`${this.baseUrl}/permissions`);
  }
}

export const authService = AuthService.getInstance(); 