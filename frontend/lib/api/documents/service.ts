import { apiClientInstance } from '../client';
import type { 
  DocumentRequest, 
  CreateDocumentRequestDto, 
  DocumentTemplate,
  DocumentType 
} from './types';

class DocumentService {
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    const response = await apiClientInstance.get('/documents/templates');
    return response.data.data;
  }

  async getDocumentTemplate(type: DocumentType): Promise<DocumentTemplate> {
    const response = await apiClientInstance.get(`/documents/templates/${type}`);
    return response.data.data;
  }

  async requestDocument(data: CreateDocumentRequestDto): Promise<DocumentRequest> {
    const response = await apiClientInstance.post('/documents/request', data);
    return response.data.data;
  }

  async getDocumentRequests(): Promise<DocumentRequest[]> {
    const response = await apiClientInstance.get('/documents/requests');
    return response.data.data;
  }

  async getDocumentRequest(id: string): Promise<DocumentRequest> {
    const response = await apiClientInstance.get(`/documents/requests/${id}`);
    return response.data.data;
  }

  async downloadDocument(id: string): Promise<Blob> {
    const response = await apiClientInstance.get(`/documents/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const documentService = new DocumentService(); 