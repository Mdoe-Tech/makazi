import { BaseEntity } from '../types';

export enum DocumentType {
  PASSPORT = 'PASSPORT',
  NATIONAL_ID = 'NATIONAL_ID',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
  EDUCATION_CERTIFICATE = 'EDUCATION_CERTIFICATE',
  EMPLOYMENT_CERTIFICATE = 'EMPLOYMENT_CERTIFICATE'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export interface Document extends BaseEntity {
  document_type: DocumentType;
  document_number: string;
  issue_date: Date;
  expiry_date?: Date;
  issuing_authority: string;
  document_data: Record<string, any>;
  verification_status: VerificationStatus;
  verification_details?: {
    verified_by: string;
    verified_at: Date;
    verification_notes: string;
  };
  citizen_id: string;
  metadata: {
    file_path: string;
    file_type: string;
    file_size: number;
    upload_date: Date;
  };
}

export interface CreateDocumentDto {
  document_type: DocumentType;
  document_number: string;
  issue_date: Date;
  expiry_date?: Date;
  issuing_authority: string;
  document_data: Record<string, any>;
  citizen_id: string;
}

export interface UpdateDocumentDto extends Partial<CreateDocumentDto> {
  verification_status?: VerificationStatus;
  verification_details?: {
    verified_by: string;
    verified_at: Date;
    verification_notes: string;
  };
}

export interface DocumentFilters {
  document_type?: DocumentType;
  verification_status?: VerificationStatus;
  citizen_id?: string;
  issuing_authority?: string;
  search?: string;
} 