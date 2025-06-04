import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import {
  Biometric,
  CreateBiometricDto,
  UpdateBiometricDto,
  BiometricFilters,
  BiometricVerificationResult
} from './types';

export class BiometricService {
  private static instance: BiometricService;
  private readonly baseUrl = '/biometrics';

  private constructor() {}

  public static getInstance(): BiometricService {
    if (!BiometricService.instance) {
      BiometricService.instance = new BiometricService();
    }
    return BiometricService.instance;
  }

  async getBiometrics(
    params: PaginationParams & BiometricFilters
  ): Promise<PaginatedResponse<Biometric>> {
    return apiClient.get<PaginatedResponse<Biometric>>(this.baseUrl, { params });
  }

  async getBiometricById(id: string): Promise<ApiResponse<Biometric>> {
    return apiClient.get<ApiResponse<Biometric>>(`${this.baseUrl}/${id}`);
  }

  async createBiometric(data: CreateBiometricDto): Promise<ApiResponse<Biometric>> {
    return apiClient.post<ApiResponse<Biometric>>(this.baseUrl, data);
  }

  async updateBiometric(
    id: string,
    data: UpdateBiometricDto
  ): Promise<ApiResponse<Biometric>> {
    return apiClient.patch<ApiResponse<Biometric>>(`${this.baseUrl}/${id}`, data);
  }

  async deleteBiometric(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  async uploadBiometricData(
    id: string,
    biometricData: FormData
  ): Promise<ApiResponse<Biometric>> {
    return apiClient.post<ApiResponse<Biometric>>(
      `${this.baseUrl}/${id}/upload`,
      biometricData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async verifyBiometric(
    id: string,
    verificationData: {
      verified_by: string;
      verification_notes: string;
    }
  ): Promise<ApiResponse<Biometric>> {
    return apiClient.post<ApiResponse<Biometric>>(
      `${this.baseUrl}/${id}/verify`,
      verificationData
    );
  }

  async getBiometricByCitizenId(
    citizenId: string
  ): Promise<ApiResponse<Biometric>> {
    return apiClient.get<ApiResponse<Biometric>>(
      `${this.baseUrl}/citizen/${citizenId}`
    );
  }

  async verifyBiometricMatch(
    id: string,
    comparisonData: FormData
  ): Promise<ApiResponse<BiometricVerificationResult>> {
    return apiClient.post<ApiResponse<BiometricVerificationResult>>(
      `${this.baseUrl}/${id}/match`,
      comparisonData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async getBiometricQualityMetrics(
    id: string
  ): Promise<ApiResponse<{
    fingerprint_quality: number;
    facial_quality: number;
    iris_quality: number;
  }>> {
    return apiClient.get<ApiResponse<{
      fingerprint_quality: number;
      facial_quality: number;
      iris_quality: number;
    }>>(`${this.baseUrl}/${id}/quality-metrics`);
  }
}

export const biometricService = BiometricService.getInstance(); 