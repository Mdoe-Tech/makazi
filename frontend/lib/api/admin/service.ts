import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import { User } from '../auth/types';
import { CreateUserDto, UpdateUserDto, UserFilters } from './types';

export class AdminService {
  private static instance: AdminService;
  private readonly baseUrl = '/admin/users';

  private constructor() {}

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  async getUsers(params: PaginationParams & UserFilters): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>(this.baseUrl, { params });
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>(`${this.baseUrl}/${id}`);
  }

  async createUser(data: CreateUserDto): Promise<ApiResponse<User>> {
    return apiClient.post<ApiResponse<User>>(this.baseUrl, data);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<ApiResponse<User>> {
    return apiClient.patch<ApiResponse<User>>(`${this.baseUrl}/${id}`, data);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  async activateUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.post<ApiResponse<User>>(`${this.baseUrl}/${id}/activate`);
  }

  async deactivateUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.post<ApiResponse<User>>(`${this.baseUrl}/${id}/deactivate`);
  }
}

export const adminService = AdminService.getInstance(); 