import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import {
  Letter,
  CreateLetterDto,
  LetterFilters,
  LetterTemplate,
  LetterSchedule
} from './types';

export class LetterService {
  private static instance: LetterService;
  private readonly baseUrl = '/letters';

  private constructor() {}

  public static getInstance(): LetterService {
    if (!LetterService.instance) {
      LetterService.instance = new LetterService();
    }
    return LetterService.instance;
  }

  async getLetters(params: PaginationParams & LetterFilters): Promise<PaginatedResponse<Letter>> {
    return apiClient.get<PaginatedResponse<Letter>>(this.baseUrl, { params });
  }

  async getLetterById(id: string): Promise<ApiResponse<Letter>> {
    return apiClient.get<ApiResponse<Letter>>(`${this.baseUrl}/${id}`);
  }

  async createLetter(data: CreateLetterDto): Promise<ApiResponse<Letter>> {
    return apiClient.post<ApiResponse<Letter>>(this.baseUrl, data);
  }

  async updateLetter(id: string, data: Partial<CreateLetterDto>): Promise<ApiResponse<Letter>> {
    return apiClient.patch<ApiResponse<Letter>>(`${this.baseUrl}/${id}`, data);
  }

  async deleteLetter(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  async sendLetter(id: string): Promise<ApiResponse<Letter>> {
    return apiClient.post<ApiResponse<Letter>>(`${this.baseUrl}/${id}/send`);
  }

  async getLetterTemplates(): Promise<ApiResponse<LetterTemplate[]>> {
    return apiClient.get<ApiResponse<LetterTemplate[]>>(`${this.baseUrl}/templates`);
  }

  async createLetterTemplate(template: Omit<LetterTemplate, 'id'>): Promise<ApiResponse<LetterTemplate>> {
    return apiClient.post<ApiResponse<LetterTemplate>>(`${this.baseUrl}/templates`, template);
  }

  async updateLetterTemplate(id: string, template: Partial<LetterTemplate>): Promise<ApiResponse<LetterTemplate>> {
    return apiClient.patch<ApiResponse<LetterTemplate>>(`${this.baseUrl}/templates/${id}`, template);
  }

  async deleteLetterTemplate(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.baseUrl}/templates/${id}`);
  }

  async getLetterSchedules(): Promise<ApiResponse<LetterSchedule[]>> {
    return apiClient.get<ApiResponse<LetterSchedule[]>>(`${this.baseUrl}/schedules`);
  }

  async createLetterSchedule(schedule: Omit<LetterSchedule, 'id'>): Promise<ApiResponse<LetterSchedule>> {
    return apiClient.post<ApiResponse<LetterSchedule>>(`${this.baseUrl}/schedules`, schedule);
  }

  async updateLetterSchedule(id: string, schedule: Partial<LetterSchedule>): Promise<ApiResponse<LetterSchedule>> {
    return apiClient.patch<ApiResponse<LetterSchedule>>(`${this.baseUrl}/schedules/${id}`, schedule);
  }

  async deleteLetterSchedule(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.baseUrl}/schedules/${id}`);
  }

  async getLetterStats(): Promise<ApiResponse<{
    total_letters: number;
    letters_by_type: Record<string, number>;
    letters_by_status: Record<string, number>;
    delivery_success_rate: number;
  }>> {
    return apiClient.get<ApiResponse<{
      total_letters: number;
      letters_by_type: Record<string, number>;
      letters_by_status: Record<string, number>;
      delivery_success_rate: number;
    }>>(`${this.baseUrl}/stats`);
  }
}

export const letterService = LetterService.getInstance(); 