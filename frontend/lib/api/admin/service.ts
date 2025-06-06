import { apiClientInstance } from '../client';
import type { User } from '../auth/types';
import type { UserFilters, CreateUserDto, UpdateUserDto } from './types';
import type { PaginatedResponse, PaginationParams } from '../types';

class AdminService {
  private readonly baseUrl = '/admin/users';

  async getUsers(params: UserFilters & PaginationParams): Promise<PaginatedResponse<User>> {
    return apiClientInstance.get<PaginatedResponse<User>>(this.baseUrl, { params });
  }

  async getUserById(id: string): Promise<{ data: User }> {
    return apiClientInstance.get<{ data: User }>(`${this.baseUrl}/${id}`);
  }

  async createUser(data: CreateUserDto): Promise<{ data: User }> {
    return apiClientInstance.post<{ data: User }>(this.baseUrl, data);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<{ data: User }> {
    return apiClientInstance.patch<{ data: User }>(`${this.baseUrl}/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    return apiClientInstance.delete(`${this.baseUrl}/${id}`);
  }

  async activateUser(id: string): Promise<{ data: User }> {
    return apiClientInstance.post<{ data: User }>(`${this.baseUrl}/${id}/activate`);
  }

  async deactivateUser(id: string): Promise<{ data: User }> {
    return apiClientInstance.post<{ data: User }>(`${this.baseUrl}/${id}/deactivate`);
  }
}

export const adminService = new AdminService(); 