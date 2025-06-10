export enum DocumentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum DocumentType {
  RESIDENCE_LETTER = 'RESIDENCE_LETTER',
  GOOD_CONDUCT = 'GOOD_CONDUCT',
  INCOME_VERIFICATION = 'INCOME_VERIFICATION',
  INTRODUCTION_LETTER = 'INTRODUCTION_LETTER',
  SPONSORSHIP_LETTER = 'SPONSORSHIP_LETTER'
}

export interface DocumentRequest {
  id: string;
  citizen_id: string;
  citizen: {
    id: string;
    first_name: string;
    last_name: string;
    nida_number: string;
    email: string;
  };
  document_type: DocumentType;
  purpose: string;
  status: DocumentStatus;
  document_url?: string;
  signature_url?: string;
  stamp_url?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  rejected_at?: string;
}

export interface CreateDocumentRequestDto {
  document_type: DocumentType;
  purpose: string;
  additional_info?: Record<string, any>;
}

export interface DocumentTemplate {
  id: string;
  type: string;
  title: string;
  description: string;
  template_content: string;
  required_fields: string[];
  fee: string;
  processing_time: string;
  created_at: string;
  updated_at: string;
} 