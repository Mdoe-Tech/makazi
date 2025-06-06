import { apiClientInstance } from '../client';
import type { PaginatedResponse, PaginationParams } from '../types';
import type { Citizen, CitizenFilters, CreateCitizenDto, UpdateCitizenDto } from './types';

class CitizenService {
  private readonly baseUrl = '/citizen';

  async getCitizens(params: PaginationParams & CitizenFilters): Promise<PaginatedResponse<Citizen>> {
    return apiClientInstance.get<PaginatedResponse<Citizen>>(this.baseUrl, { params });
  }

  async getCitizenById(id: string): Promise<{ data: Citizen }> {
    return apiClientInstance.get<{ data: Citizen }>(`${this.baseUrl}/${id}`);
  }

  async createCitizen(data: CreateCitizenDto): Promise<{ data: Citizen }> {
    return apiClientInstance.post<{ data: Citizen }>(this.baseUrl, data);
  }

  async updateCitizen(id: string, data: UpdateCitizenDto): Promise<{ data: Citizen }> {
    return apiClientInstance.patch<{ data: Citizen }>(`${this.baseUrl}/${id}`, data);
  }

  async deleteCitizen(id: string): Promise<void> {
    return apiClientInstance.delete(`${this.baseUrl}/${id}`);
  }

  async verifyCitizen(id: string): Promise<{ data: Citizen }> {
    return apiClientInstance.post<{ data: Citizen }>(`${this.baseUrl}/${id}/verify`);
  }

  async rejectCitizen(id: string, reason: string): Promise<{ data: Citizen }> {
    return apiClientInstance.post<{ data: Citizen }>(`${this.baseUrl}/${id}/reject`, { reason });
  }

  async uploadBiometricData(
    id: string,
    biometricData: FormData
  ): Promise<{ data: Citizen }> {
    return apiClientInstance.post<{ data: Citizen }>(
      `${this.baseUrl}/${id}/biometric`,
      biometricData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async uploadDocument(
    id: string,
    documentData: FormData
  ): Promise<{ data: Citizen }> {
    return apiClientInstance.post<{ data: Citizen }>(
      `${this.baseUrl}/${id}/documents`,
      documentData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async getCitizenDocuments(id: string): Promise<{ data: any }> {
    return apiClientInstance.get<{ data: any }>(`${this.baseUrl}/${id}/documents`);
  }

  async getCitizenBiometricData(id: string): Promise<{ data: any }> {
    return apiClientInstance.get<{ data: any }>(`${this.baseUrl}/${id}/biometric`);
  }

  async getCitizenVerificationHistory(
    id: string
  ): Promise<{ data: any }> {
    return apiClientInstance.get<{ data: any }>(
      `${this.baseUrl}/${id}/verification-history`
    );
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