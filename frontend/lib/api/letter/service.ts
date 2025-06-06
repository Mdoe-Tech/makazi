import { apiClientInstance } from '../client';
import type { PaginatedResponse, PaginationParams } from '../types';
import type { Letter, LetterFilters, CreateLetterDto, UpdateLetterDto } from './types';

class LetterService {
  private readonly baseUrl = '/letter';

  async getLetters(params: PaginationParams & LetterFilters): Promise<PaginatedResponse<Letter>> {
    return apiClientInstance.get<PaginatedResponse<Letter>>(this.baseUrl, { params });
  }

  async getLetterById(id: string): Promise<{ data: Letter }> {
    return apiClientInstance.get<{ data: Letter }>(`${this.baseUrl}/${id}`);
  }

  async createLetter(data: CreateLetterDto): Promise<{ data: Letter }> {
    return apiClientInstance.post<{ data: Letter }>(this.baseUrl, data);
  }

  async updateLetter(id: string, data: UpdateLetterDto): Promise<{ data: Letter }> {
    return apiClientInstance.patch<{ data: Letter }>(`${this.baseUrl}/${id}`, data);
  }

  async deleteLetter(id: string): Promise<void> {
    return apiClientInstance.delete(`${this.baseUrl}/${id}`);
  }

  async approveLetter(id: string): Promise<{ data: Letter }> {
    return apiClientInstance.post<{ data: Letter }>(`${this.baseUrl}/${id}/approve`);
  }

  async rejectLetter(id: string, reason: string): Promise<{ data: Letter }> {
    return apiClientInstance.post<{ data: Letter }>(`${this.baseUrl}/${id}/reject`, { reason });
  }

  async generateLetter(id: string): Promise<Blob> {
    const response = await apiClientInstance.get(`${this.baseUrl}/${id}/generate`, {
      responseType: 'blob'
    });
    return response as unknown as Blob;
  }
}

export const letterService = new LetterService(); 