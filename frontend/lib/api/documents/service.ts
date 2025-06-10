import { apiClientInstance } from '../client';
import type { DocumentRequest, DocumentTemplate, CreateDocumentRequestDto, Document } from './types';
import type { DocumentType, DocumentStatus } from './types';
import type { ApiResponse } from '../types';

class DocumentService {
  async getDocumentRequests(): Promise<DocumentRequest[]> {
    const response = await apiClientInstance.get<ApiResponse<DocumentRequest[]>>('/documents/requests');
    return response.data.data;
  }

  async getDocumentRequest(id: string): Promise<DocumentRequest> {
    const response = await apiClientInstance.get<ApiResponse<DocumentRequest>>(`/documents/requests/${id}`);
    return response.data.data;
  }

  async getDocumentTemplate(type: DocumentType): Promise<DocumentTemplate> {
    const response = await apiClientInstance.get<ApiResponse<DocumentTemplate>>(`/documents/templates/${type}`);
    return response.data.data;
  }

  async approveDocumentRequest(id: string, data: { signature: string; stamp: string }): Promise<void> {
    await apiClientInstance.post(`/documents/requests/${id}/approve`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async rejectDocumentRequest(id: string, reason: string): Promise<void> {
    await apiClientInstance.post(`/documents/requests/${id}/reject`, { reason });
  }

  async getDocument(id: string): Promise<Document> {
    const response = await apiClientInstance.get<ApiResponse<Document>>(`/documents/${id}`);
    return response.data.data;
  }

  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    const response = await apiClientInstance.get<ApiResponse<DocumentTemplate[]>>('/documents/templates');
    return response.data.data;
  }

  async downloadDocument(id: string): Promise<void> {
    const response = await apiClientInstance.get(`/documents/requests/${id}/download`);
    
    // Convert the Buffer data to a Uint8Array
    const uint8Array = new Uint8Array(response.data.data);
    
    // Create a blob from the Uint8Array
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `document-${id}.pdf`;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    window.URL.revokeObjectURL(url);
  }
}

export const documentService = new DocumentService(); 