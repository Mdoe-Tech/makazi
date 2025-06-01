import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum ReportType {
  REGISTRATION_STATS = 'registration_stats',
  PROCESSING_TIMES = 'processing_times',
  SUCCESS_RATES = 'success_rates',
  USER_ACTIVITY = 'user_activity',
  DOCUMENT_VERIFICATION = 'document_verification',
  BIOMETRIC_VALIDATION = 'biometric_validation'
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json'
}

export enum ReportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@Entity()
export class Report extends BaseEntity {
  @Column()
  report_type: string;

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  parameters: {
    [key: string]: any;
  };

  @Column({ type: 'jsonb' })
  data: {
    [key: string]: any;
  };

  @Column()
  generated_by: string;

  @Column({ type: 'jsonb' })
  metadata: {
    format: string;
    size: number;
    generation_time: number;
    filters: any[];
  };

  @Column({ default: false })
  is_archived: boolean;

  @Column({ nullable: true })
  archived_at: Date;
} 