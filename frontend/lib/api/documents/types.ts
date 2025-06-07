export enum DocumentType {
  INTRODUCTION_LETTER = 'INTRODUCTION_LETTER',
  SPONSORSHIP_LETTER = 'SPONSORSHIP_LETTER'
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PROCESSING = 'PROCESSING'
}

export interface DocumentRequest {
  id: string;
  citizen_id: string;
  document_type: DocumentType;
  purpose: string;
  status: DocumentStatus;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  document_url?: string;
}

export interface CreateDocumentRequestDto {
  document_type: DocumentType;
  purpose: string;
}

export interface DocumentTemplate {
  id: string;
  type: DocumentType;
  title: string;
  description: string;
  required_fields: string[];
  processing_time: string;
  fee: number;
} 