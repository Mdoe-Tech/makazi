import { apiClientInstance } from '../client';
import type { Admin } from './types';
import type { UserFilters, CreateUserDto, UpdateUserDto } from './types';
import type { PaginatedResponse, PaginationParams } from '../types';

class AdminService {
  private readonly baseUrl = '/admin/users';

  async getUsers(params: UserFilters & PaginationParams): Promise<{ data: { data: Admin[], total: number } }> {
    return apiClientInstance.get<{ data: { data: Admin[], total: number } }>(this.baseUrl, { params });
  }

  async getUser(id: string): Promise<Admin> {
    const response = await apiClientInstance.get<{ data: { data: Admin } }>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async createUser(data: CreateUserDto): Promise<Admin> {
    const response = await apiClientInstance.post<{ data: { data: Admin } }>(this.baseUrl, data);
    return response.data.data;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<Admin> {
    const response = await apiClientInstance.patch<{ data: { data: Admin } }>(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  async deleteUser(id: string): Promise<void> {
    await apiClientInstance.delete(`${this.baseUrl}/${id}`);
  }

  async activateUser(id: string): Promise<Admin> {
    const response = await apiClientInstance.post<{ data: { data: Admin } }>(`${this.baseUrl}/${id}/activate`);
    return response.data.data;
  }

  async deactivateUser(id: string): Promise<Admin> {
    const response = await apiClientInstance.post<{ data: { data: Admin } }>(`${this.baseUrl}/${id}/deactivate`);
    return response.data.data;
  }

  async toggleActive(id: string): Promise<Admin> {
    const response = await apiClientInstance.post<{ data: { data: Admin } }>(`${this.baseUrl}/${id}/toggle-active`);
    return response.data.data;
  }
}

export const adminService = new AdminService(); 