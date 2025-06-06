import { apiClientInstance } from '../client';
import type { PaginatedResponse, PaginationParams } from '../types';
import type { Document, DocumentFilters, CreateDocumentDto, UpdateDocumentDto } from './types';

class DocumentService {
  private readonly baseUrl = '/document';

  async getDocuments(params: PaginationParams & DocumentFilters): Promise<PaginatedResponse<Document>> {
    return apiClientInstance.get<PaginatedResponse<Document>>(this.baseUrl, { params });
  }

  async getDocumentById(id: string): Promise<{ data: Document }> {
    return apiClientInstance.get<{ data: Document }>(`${this.baseUrl}/${id}`);
  }

  async createDocument(data: CreateDocumentDto): Promise<{ data: Document }> {
    return apiClientInstance.post<{ data: Document }>(this.baseUrl, data);
  }

  async updateDocument(id: string, data: UpdateDocumentDto): Promise<{ data: Document }> {
    return apiClientInstance.patch<{ data: Document }>(`${this.baseUrl}/${id}`, data);
  }

  async deleteDocument(id: string): Promise<void> {
    return apiClientInstance.delete(`${this.baseUrl}/${id}`);
  }

  async uploadDocument(file: File): Promise<{ data: Document }> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClientInstance.post<{ data: Document }>(`${this.baseUrl}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async downloadDocument(id: string): Promise<Blob> {
    const response = await apiClientInstance.get(`${this.baseUrl}/${id}/download`, {
      responseType: 'blob'
    });
    return response as unknown as Blob;
  }

  async verifyDocument(id: string): Promise<{ data: Document }> {
    return apiClientInstance.post<{ data: Document }>(`${this.baseUrl}/${id}/verify`);
  }

  async rejectDocument(id: string, reason: string): Promise<{ data: Document }> {
    return apiClientInstance.post<{ data: Document }>(`${this.baseUrl}/${id}/reject`, { reason });
  }

  async getDocumentStats(): Promise<{
    total_documents: number;
    documents_by_type: Record<string, number>;
    documents_by_status: Record<string, number>;
    storage_usage: number;
  }> {
    return apiClientInstance.get<{
      total_documents: number;
      documents_by_type: Record<string, number>;
      documents_by_status: Record<string, number>;
      storage_usage: number;
    }>(`${this.baseUrl}/stats`);
  }
}

export const documentService = new DocumentService(); 