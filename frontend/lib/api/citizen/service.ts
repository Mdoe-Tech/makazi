import { apiClientInstance } from '../client';
import type { PaginatedResponse, PaginationParams } from '../types';
import type { Citizen, CitizenFilters, CreateCitizenDto, UpdateCitizenDto } from './types';

interface ApiResponse<T> {
  status: string;
  data: T;
}

class CitizenService {
  async getCitizen(id: string): Promise<Citizen> {
    const response = await apiClientInstance.get<ApiResponse<Citizen>>(`/citizen/${id}`);
    return response.data;
  }

  async getCitizens(params?: PaginationParams): Promise<PaginatedResponse<Citizen>> {
    const response = await apiClientInstance.get<ApiResponse<PaginatedResponse<Citizen>>>('/citizen', { params });
    return response.data;
  }

  async approveCitizen(id: string): Promise<Citizen> {
    const response = await apiClientInstance.post<ApiResponse<Citizen>>(`/citizen/${id}/approve`);
    return response.data;
  }

  async rejectCitizen(id: string, reason: string): Promise<Citizen> {
    const response = await apiClientInstance.post<ApiResponse<Citizen>>(`/citizen/${id}/reject`, { reason });
    return response.data;
  }

  async createCitizen(data: CreateCitizenDto): Promise<Citizen> {
    const response = await apiClientInstance.post<ApiResponse<Citizen>>('/citizen', data);
    return response.data;
  }

  async updateCitizen(id: string, data: UpdateCitizenDto): Promise<Citizen> {
    const response = await apiClientInstance.put<ApiResponse<Citizen>>(`/citizen/${id}`, data);
    return response.data;
  }

  async deleteCitizen(id: string): Promise<void> {
    await apiClientInstance.delete(`/citizen/${id}`);
  }

  async verifyCitizen(id: string): Promise<Citizen> {
    const response = await apiClientInstance.post<ApiResponse<Citizen>>(`/citizen/${id}/verify`);
    return response.data;
  }

  async submitBiometricData(id: string, biometricData: any): Promise<Citizen> {
    const response = await apiClientInstance.post<ApiResponse<Citizen>>(`/citizen/${id}/biometric`, biometricData);
    return response.data;
  }

  async submitDocuments(id: string, documents: any): Promise<Citizen> {
    const response = await apiClientInstance.post<ApiResponse<Citizen>>(`/citizen/${id}/documents`, documents);
    return response.data;
  }

  async uploadBiometricData(id: string, biometricData: FormData): Promise<{ data: Citizen }> {
    return apiClientInstance.post<{ data: Citizen }>(
      `/citizen/${id}/biometric`,
      biometricData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async uploadDocument(id: string, documentData: FormData): Promise<{ data: Citizen }> {
    return apiClientInstance.post<{ data: Citizen }>(
      `/citizen/${id}/documents`,
      documentData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async getCitizenDocuments(id: string): Promise<{ data: any }> {
    return apiClientInstance.get<{ data: any }>(`/citizen/${id}/documents`);
  }

  async getCitizenBiometricData(id: string): Promise<{ data: any }> {
    return apiClientInstance.get<{ data: any }>(`/citizen/${id}/biometric`);
  }

  async getCitizenVerificationHistory(id: string): Promise<{ data: any }> {
    return apiClientInstance.get<{ data: any }>(`/citizen/${id}/verification-history`);
  }

  async getProfile(): Promise<{ data: Citizen }> {
    try {
      const response = await apiClientInstance.get<ApiResponse<{ data: Citizen }>>('/citizen/profile');
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Profile error:', error);
      throw error;
    }
  }

  async updateProfile(data: Partial<Citizen>): Promise<Citizen> {
    const response = await apiClientInstance.post<ApiResponse<Citizen>>('/citizen/profile', data);
    return response.data;
  }
}

export const citizenService = new CitizenService();

export interface NidaVerificationResult {
  exists: boolean;
  hasPassword: boolean;
  citizen?: {
    id: string;
    first_name: string;
    last_name: string;
    nida_number: string;
  };
}

export async function verifyNida(nidaNumber: string): Promise<NidaVerificationResult> {
  const response = await apiClientInstance.get<{ data: NidaVerificationResult }>(`/citizen/verify/${nidaNumber}`);
  return response.data;
}

export async function createCitizen(data: any) {
  return apiClientInstance.post('/citizen', data);
}

export async function updateCitizen(id: string, data: any) {
  return apiClientInstance.put(`/citizen/${id}`, data);
}

export async function getCitizen(id: string) {
  return apiClientInstance.get(`/citizen/${id}`);
}

export async function listCitizens(params?: any) {
  return apiClientInstance.get('/citizen', { params });
}

export async function setCitizenPassword(nidaNumber: string, password: string) {
  return apiClientInstance.post(`/citizen/${nidaNumber}/password`, { password });
} 