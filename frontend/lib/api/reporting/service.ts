import { apiClientInstance } from '../client';
import type { PaginatedResponse, PaginationParams } from '../types';
import type { Report, ReportFilters, CreateReportDto, UpdateReportDto } from './types';

class ReportingService {
  private readonly baseUrl = '/reporting';

  async getReports(params: PaginationParams & ReportFilters): Promise<PaginatedResponse<Report>> {
    return apiClientInstance.get<PaginatedResponse<Report>>(this.baseUrl, { params });
  }

  async getReportById(id: string): Promise<{ data: Report }> {
    return apiClientInstance.get<{ data: Report }>(`${this.baseUrl}/${id}`);
  }

  async createReport(data: CreateReportDto): Promise<{ data: Report }> {
    return apiClientInstance.post<{ data: Report }>(this.baseUrl, data);
  }

  async updateReport(id: string, data: UpdateReportDto): Promise<{ data: Report }> {
    return apiClientInstance.patch<{ data: Report }>(`${this.baseUrl}/${id}`, data);
  }

  async deleteReport(id: string): Promise<void> {
    return apiClientInstance.delete(`${this.baseUrl}/${id}`);
  }

  async generateReport(id: string): Promise<Blob> {
    const response = await apiClientInstance.get(`${this.baseUrl}/${id}/generate`, {
      responseType: 'blob'
    });
    return response as unknown as Blob;
  }

  async getReportStats(): Promise<{
    total_reports: number;
    reports_by_type: Record<string, number>;
    reports_by_status: Record<string, number>;
    generation_success_rate: number;
  }> {
    return apiClientInstance.get<{
      total_reports: number;
      reports_by_type: Record<string, number>;
      reports_by_status: Record<string, number>;
      generation_success_rate: number;
    }>(`${this.baseUrl}/stats`);
  }
}

export const reportingService = new ReportingService(); 