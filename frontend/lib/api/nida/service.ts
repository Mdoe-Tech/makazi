import { apiClient } from '../client';
import type { NidaData, NidaFilters, VerifyNidaDto, NidaVerificationResult } from './types';
import { PaginationParams, ApiResponse } from '../types';

class NidaService {
  private baseUrl = '/nida';

  async getNidaData(params: PaginationParams & NidaFilters): Promise<ApiResponse<{ data: NidaData[]; total: number }>> {
    return apiClient.get<ApiResponse<{ data: NidaData[]; total: number }>>(this.baseUrl, { params });
  }

  async getNidaDataById(id: string): Promise<ApiResponse<{ data: NidaData }>> {
    return apiClient.get<ApiResponse<{ data: NidaData }>>(`${this.baseUrl}/${id}`);
  }

  async registerNida(data: Omit<NidaData, 'nida_number'>, citizenId: string): Promise<ApiResponse<{ data: NidaData }>> {
    return apiClient.post<ApiResponse<{ data: NidaData }>>(`${this.baseUrl}/register`, { ...data, citizen_id: citizenId });
  }

  async verifyNida(data: VerifyNidaDto): Promise<ApiResponse<{ data: NidaVerificationResult }>> {
    return apiClient.post<ApiResponse<{ data: NidaVerificationResult }>>(`${this.baseUrl}/verify`, data);
  }

  async getNidaVerificationHistory(id: string): Promise<ApiResponse<{ data: NidaVerificationResult[] }>> {
    return apiClient.get<ApiResponse<{ data: NidaVerificationResult[] }>>(`${this.baseUrl}/${id}/verification-history`);
  }
}

export const nidaService = new NidaService(); 