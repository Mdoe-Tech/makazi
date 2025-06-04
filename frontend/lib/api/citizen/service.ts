import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import {
  Citizen,
  CreateCitizenDto,
  UpdateCitizenDto,
  CitizenFilters
} from './types';

export class CitizenService {
  private static instance: CitizenService;
  private readonly baseUrl = '/citizens';

  private constructor() {}

  public static getInstance(): CitizenService {
    if (!CitizenService.instance) {
      CitizenService.instance = new CitizenService();
    }
    return CitizenService.instance;
  }

  async getCitizens(
    params: PaginationParams & CitizenFilters
  ): Promise<PaginatedResponse<Citizen>> {
    return apiClient.get<PaginatedResponse<Citizen>>(this.baseUrl, { params });
  }

  async getCitizenById(id: string): Promise<ApiResponse<Citizen>> {
    return apiClient.get<ApiResponse<Citizen>>(`${this.baseUrl}/${id}`);
  }

  async createCitizen(data: CreateCitizenDto): Promise<ApiResponse<Citizen>> {
    return apiClient.post<ApiResponse<Citizen>>(this.baseUrl, data);
  }

  async updateCitizen(
    id: string,
    data: UpdateCitizenDto
  ): Promise<ApiResponse<Citizen>> {
    return apiClient.patch<ApiResponse<Citizen>>(`${this.baseUrl}/${id}`, data);
  }

  async deleteCitizen(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  async verifyCitizen(id: string): Promise<ApiResponse<Citizen>> {
    return apiClient.post<ApiResponse<Citizen>>(`${this.baseUrl}/${id}/verify`);
  }

  async rejectCitizen(
    id: string,
    reason: string
  ): Promise<ApiResponse<Citizen>> {
    return apiClient.post<ApiResponse<Citizen>>(`${this.baseUrl}/${id}/reject`, {
      reason,
    });
  }

  async uploadBiometricData(
    id: string,
    biometricData: FormData
  ): Promise<ApiResponse<Citizen>> {
    return apiClient.post<ApiResponse<Citizen>>(
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
  ): Promise<ApiResponse<Citizen>> {
    return apiClient.post<ApiResponse<Citizen>>(
      `${this.baseUrl}/${id}/documents`,
      documentData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async getCitizenDocuments(id: string): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(`${this.baseUrl}/${id}/documents`);
  }

  async getCitizenBiometricData(id: string): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(`${this.baseUrl}/${id}/biometric`);
  }

  async getCitizenVerificationHistory(
    id: string
  ): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(
      `${this.baseUrl}/${id}/verification-history`
    );
  }
}

export const citizenService = CitizenService.getInstance(); 