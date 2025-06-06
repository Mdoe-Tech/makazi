import { BaseEntity } from '../types';

export enum ReportType {
  CITIZEN_REGISTRATION = 'CITIZEN_REGISTRATION',
  DOCUMENT_VERIFICATION = 'DOCUMENT_VERIFICATION',
  BIOMETRIC_VERIFICATION = 'BIOMETRIC_VERIFICATION',
  SYSTEM_ACTIVITY = 'SYSTEM_ACTIVITY',
  AUDIT_LOG = 'AUDIT_LOG'
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV'
}

export interface Report extends BaseEntity {
  type: ReportType;
  name: string;
  description: string;
  parameters: Record<string, any>;
  created_by: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  file_url?: string;
  error_message?: string;
  metadata?: Record<string, any>;
}

export interface CreateReportDto {
  title: string;
  type: string;
  parameters: Record<string, any>;
}

export interface UpdateReportDto {
  title?: string;
  type?: string;
  parameters?: Record<string, any>;
  status?: string;
}

export interface ReportFilters {
  type?: ReportType;
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  created_by?: string;
  start_date?: Date;
  end_date?: Date;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  default_parameters: Record<string, any>;
  created_by: string;
  is_public: boolean;
}

export interface ReportSchedule {
  id: string;
  template_id: string;
  schedule: string; // Cron expression
  parameters: Record<string, any>;
  recipients: string[];
  is_active: boolean;
  last_run?: Date;
  next_run?: Date;
} 