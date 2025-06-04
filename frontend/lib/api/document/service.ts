import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import {
  Document,
  CreateDocumentDto,
  UpdateDocumentDto,
  DocumentFilters
} from './types';

export class DocumentService {
  private static instance: DocumentService;
  private readonly baseUrl = '/documents';

  private constructor() {}

  public static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  async getDocuments(
    params: PaginationParams & DocumentFilters
  ): Promise<PaginatedResponse<Document>> {
    return apiClient.get<PaginatedResponse<Document>>(this.baseUrl, { params });
  }

  async getDocumentById(id: string): Promise<ApiResponse<Document>> {
    return apiClient.get<ApiResponse<Document>>(`${this.baseUrl}/${id}`);
  }

  async createDocument(data: CreateDocumentDto): Promise<ApiResponse<Document>> {
    return apiClient.post<ApiResponse<Document>>(this.baseUrl, data);
  }

  async updateDocument(
    id: string,
    data: UpdateDocumentDto
  ): Promise<ApiResponse<Document>> {
    return apiClient.patch<ApiResponse<Document>>(`${this.baseUrl}/${id}`, data);
  }

  async deleteDocument(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  async uploadDocumentFile(
    id: string,
    file: File
  ): Promise<ApiResponse<Document>> {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post<ApiResponse<Document>>(
      `${this.baseUrl}/${id}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async verifyDocument(
    id: string,
    verificationDetails: {
      verified_by: string;
      verification_notes: string;
    }
  ): Promise<ApiResponse<Document>> {
    return apiClient.post<ApiResponse<Document>>(
      `${this.baseUrl}/${id}/verify`,
      verificationDetails
    );
  }

  async rejectDocument(
    id: string,
    rejectionDetails: {
      verified_by: string;
      verification_notes: string;
    }
  ): Promise<ApiResponse<Document>> {
    return apiClient.post<ApiResponse<Document>>(
      `${this.baseUrl}/${id}/reject`,
      rejectionDetails
    );
  }

  async getDocumentByCitizenId(
    citizenId: string
  ): Promise<ApiResponse<Document[]>> {
    return apiClient.get<ApiResponse<Document[]>>(
      `${this.baseUrl}/citizen/${citizenId}`
    );
  }

  async downloadDocument(id: string): Promise<Blob> {
    const response = await apiClient.get<Blob>(`${this.baseUrl}/${id}/download`, {
      responseType: 'blob',
    });
    return response;
  }
}

export const documentService = DocumentService.getInstance(); 