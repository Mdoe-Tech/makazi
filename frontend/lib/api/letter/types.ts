import { BaseEntity } from '../types';

export enum LetterType {
  REGISTRATION_CONFIRMATION = 'REGISTRATION_CONFIRMATION',
  DOCUMENT_VERIFICATION = 'DOCUMENT_VERIFICATION',
  BIOMETRIC_VERIFICATION = 'BIOMETRIC_VERIFICATION',
  REJECTION_NOTICE = 'REJECTION_NOTICE',
  CUSTOM = 'CUSTOM'
}

export enum LetterStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED'
}

export interface Letter extends BaseEntity {
  type: LetterType;
  title: string;
  content: string;
  recipient_id: string;
  recipient_type: string;
  status: LetterStatus;
  sent_at?: Date;
  delivered_at?: Date;
  metadata?: Record<string, any>;
  template_id?: string;
  variables?: Record<string, any>;
}

export interface CreateLetterDto {
  type: LetterType;
  title: string;
  content: string;
  recipient_id: string;
  recipient_type: string;
  template_id?: string;
  variables?: Record<string, any>;
}

export interface LetterFilters {
  type?: LetterType;
  status?: LetterStatus;
  recipient_id?: string;
  start_date?: Date;
  end_date?: Date;
}

export interface LetterTemplate {
  id: string;
  name: string;
  type: LetterType;
  content: string;
  variables: string[];
  created_by: string;
  is_public: boolean;
}

export interface LetterSchedule {
  id: string;
  template_id: string;
  schedule: string; // Cron expression
  recipients: string[];
  variables: Record<string, any>;
  is_active: boolean;
  last_sent?: Date;
  next_send?: Date;
} 