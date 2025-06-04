import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import {
  Report,
  CreateReportDto,
  ReportFilters,
  ReportTemplate,
  ReportSchedule
} from './types';

export class ReportingService {
  private static instance: ReportingService;
  private readonly baseUrl = '/reports';

  private constructor() {}

  public static getInstance(): ReportingService {
    if (!ReportingService.instance) {
      ReportingService.instance = new ReportingService();
    }
    return ReportingService.instance;
  }

  async getReports(params: PaginationParams & ReportFilters): Promise<PaginatedResponse<Report>> {
    return apiClient.get<PaginatedResponse<Report>>(this.baseUrl, { params });
  }

  async getReportById(id: string): Promise<ApiResponse<Report>> {
    return apiClient.get<ApiResponse<Report>>(`${this.baseUrl}/${id}`);
  }

  async createReport(data: CreateReportDto): Promise<ApiResponse<Report>> {
    return apiClient.post<ApiResponse<Report>>(this.baseUrl, data);
  }

  async downloadReport(id: string): Promise<Blob> {
    const response = await apiClient.get<Blob>(`${this.baseUrl}/${id}/download`, {
      responseType: 'blob'
    });
    return response;
  }

  async getReportTemplates(): Promise<ApiResponse<ReportTemplate[]>> {
    return apiClient.get<ApiResponse<ReportTemplate[]>>(`${this.baseUrl}/templates`);
  }

  async createReportTemplate(template: Omit<ReportTemplate, 'id'>): Promise<ApiResponse<ReportTemplate>> {
    return apiClient.post<ApiResponse<ReportTemplate>>(`${this.baseUrl}/templates`, template);
  }

  async updateReportTemplate(id: string, template: Partial<ReportTemplate>): Promise<ApiResponse<ReportTemplate>> {
    return apiClient.patch<ApiResponse<ReportTemplate>>(`${this.baseUrl}/templates/${id}`, template);
  }

  async deleteReportTemplate(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.baseUrl}/templates/${id}`);
  }

  async getReportSchedules(): Promise<ApiResponse<ReportSchedule[]>> {
    return apiClient.get<ApiResponse<ReportSchedule[]>>(`${this.baseUrl}/schedules`);
  }

  async createReportSchedule(schedule: Omit<ReportSchedule, 'id'>): Promise<ApiResponse<ReportSchedule>> {
    return apiClient.post<ApiResponse<ReportSchedule>>(`${this.baseUrl}/schedules`, schedule);
  }

  async updateReportSchedule(id: string, schedule: Partial<ReportSchedule>): Promise<ApiResponse<ReportSchedule>> {
    return apiClient.patch<ApiResponse<ReportSchedule>>(`${this.baseUrl}/schedules/${id}`, schedule);
  }

  async deleteReportSchedule(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.baseUrl}/schedules/${id}`);
  }

  async getReportStats(): Promise<ApiResponse<{
    total_reports: number;
    reports_by_type: Record<string, number>;
    reports_by_status: Record<string, number>;
    average_generation_time: number;
  }>> {
    return apiClient.get<ApiResponse<{
      total_reports: number;
      reports_by_type: Record<string, number>;
      reports_by_status: Record<string, number>;
      average_generation_time: number;
    }>>(`${this.baseUrl}/stats`);
  }
}

export const reportingService = ReportingService.getInstance(); 