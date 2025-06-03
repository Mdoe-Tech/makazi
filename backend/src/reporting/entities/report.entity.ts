import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum ReportType {
  CITIZEN_REGISTRATION = 'CITIZEN_REGISTRATION',
  DOCUMENT_VERIFICATION = 'DOCUMENT_VERIFICATION',
  LETTER_ISSUANCE = 'LETTER_ISSUANCE',
  SYSTEM_ACTIVITY = 'SYSTEM_ACTIVITY',
  COMPLIANCE = 'COMPLIANCE'
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON'
}

export enum ReportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@Entity('reports')
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ReportType
  })
  type: ReportType;

  @Column({
    type: 'enum',
    enum: ReportFormat,
    default: ReportFormat.PDF
  })
  format: ReportFormat;

  @Column({ type: 'jsonb' })
  parameters: Record<string, any>;

  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  @Column()
  generated_by: string;

  @Column({ nullable: true })
  file_path: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_archived: boolean;

  @Column({ nullable: true })
  archived_at: Date;
} 