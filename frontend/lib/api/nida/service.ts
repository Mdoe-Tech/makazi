import { apiClientInstance } from '../client';
import type { NidaData, NidaFilters, VerifyNidaDto, NidaVerificationResult } from './types';
import type { PaginationParams, PaginatedResponse } from '../types';

class NidaService {
  private baseUrl = '/nida';

  async getNidaData(params: PaginationParams & NidaFilters): Promise<PaginatedResponse<NidaData>> {
    return apiClientInstance.get<PaginatedResponse<NidaData>>(this.baseUrl, { params });
  }

  async getNidaDataById(id: string): Promise<{ data: NidaData }> {
    return apiClientInstance.get<{ data: NidaData }>(`${this.baseUrl}/${id}`);
  }

  async registerNida(data: Omit<NidaData, 'nida_number'>): Promise<{ data: NidaData }> {
    const response = await apiClientInstance.post<{ data: NidaData }>(`${this.baseUrl}/register`, data);
    return { data: response.data };
  }

  async verifyNida(data: { nida_number: string; first_name: string; last_name: string; date_of_birth: string }): Promise<{ data: { data: NidaVerificationResult } }> {
    const response = await apiClientInstance.post<{ data: { data: NidaVerificationResult } }>(`${this.baseUrl}/verify`, data);
    return response;
  }

  async getNidaVerificationHistory(id: string): Promise<{ data: NidaVerificationResult[] }> {
    return apiClientInstance.get<{ data: NidaVerificationResult[] }>(`${this.baseUrl}/${id}/verification-history`);
  }
}

export const nidaService = new NidaService(); 