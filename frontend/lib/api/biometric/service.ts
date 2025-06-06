import { apiClientInstance } from '../client';
import type { PaginatedResponse, PaginationParams } from '../types';
import type { Biometric, BiometricFilters, CreateBiometricDto, UpdateBiometricDto } from './types';

class BiometricService {
  private readonly baseUrl = '/biometric';

  async getBiometricData(params: PaginationParams & BiometricFilters): Promise<PaginatedResponse<Biometric>> {
    return apiClientInstance.get<PaginatedResponse<Biometric>>(this.baseUrl, { params });
  }

  async getBiometricDataById(id: string): Promise<{ data: Biometric }> {
    return apiClientInstance.get<{ data: Biometric }>(`${this.baseUrl}/${id}`);
  }

  async createBiometric(data: CreateBiometricDto): Promise<{ data: Biometric }> {
    return apiClientInstance.post<{ data: Biometric }>(this.baseUrl, data);
  }

  async updateBiometric(id: string, data: UpdateBiometricDto): Promise<{ data: Biometric }> {
    return apiClientInstance.patch<{ data: Biometric }>(`${this.baseUrl}/${id}`, data);
  }

  async deleteBiometric(id: string): Promise<void> {
    return apiClientInstance.delete(`${this.baseUrl}/${id}`);
  }

  async verifyBiometric(id: string): Promise<{ data: Biometric }> {
    return apiClientInstance.post<{ data: Biometric }>(`${this.baseUrl}/${id}/verify`);
  }

  async rejectBiometric(id: string, reason: string): Promise<{ data: Biometric }> {
    return apiClientInstance.post<{ data: Biometric }>(`${this.baseUrl}/${id}/reject`, { reason });
  }
}

export const biometricService = new BiometricService(); 