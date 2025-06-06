import { apiClientInstance } from '../client';
import type { PaginatedResponse, PaginationParams } from '../types';
import type { AuditLog, AuditFilters } from './types';

export class AuditService {
  private static instance: AuditService;
  private readonly baseUrl = '/audit';

  private constructor() {}

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  async getAuditLogs(params: PaginationParams & AuditFilters): Promise<PaginatedResponse<AuditLog>> {
    return apiClientInstance.get<PaginatedResponse<AuditLog>>(this.baseUrl, { params });
  }

  async getAuditLogById(id: string): Promise<{ data: AuditLog }> {
    return apiClientInstance.get<{ data: AuditLog }>(`${this.baseUrl}/${id}`);
  }

  async getAuditLogsByUser(userId: string, params: PaginationParams): Promise<PaginatedResponse<AuditLog>> {
    return apiClientInstance.get<PaginatedResponse<AuditLog>>(`${this.baseUrl}/user/${userId}`, { params });
  }

  async getAuditLogsByResource(resourceId: string, params: PaginationParams): Promise<PaginatedResponse<AuditLog>> {
    return apiClientInstance.get<PaginatedResponse<AuditLog>>(`${this.baseUrl}/resource/${resourceId}`, { params });
  }

  async exportAuditLogs(params: AuditFilters): Promise<Blob> {
    const response = await apiClientInstance.get<Blob>(`${this.baseUrl}/export`, {
      params,
      responseType: 'blob'
    });
    return response as unknown as Blob;
  }

  async getAuditStats(params: AuditFilters): Promise<{
    total_actions: number;
    success_count: number;
    failure_count: number;
    actions_by_module: Record<string, number>;
    actions_by_type: Record<string, number>;
  }> {
    return apiClientInstance.get<{
      total_actions: number;
      success_count: number;
      failure_count: number;
      actions_by_module: Record<string, number>;
      actions_by_type: Record<string, number>;
    }>(`${this.baseUrl}/stats`, { params });
  }
}

export const auditService = AuditService.getInstance(); 