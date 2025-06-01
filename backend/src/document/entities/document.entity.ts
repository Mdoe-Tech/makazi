import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Citizen } from '../../citizen/entities/citizen.entity';
import { VerificationStatus } from '../enums/verification-status.enum';

export enum DocumentType {
  PASSPORT = 'PASSPORT',
  NATIONAL_ID = 'NATIONAL_ID',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
  EDUCATION_CERTIFICATE = 'EDUCATION_CERTIFICATE',
  EMPLOYMENT_CERTIFICATE = 'EMPLOYMENT_CERTIFICATE'
}

export enum DocumentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

@Entity()
export class Document extends BaseEntity {
  @Column()
  document_type: string;

  @Column()
  document_number: string;

  @Column()
  issue_date: Date;

  @Column({ nullable: true })
  expiry_date: Date;

  @Column()
  issuing_authority: string;

  @Column({ type: 'jsonb' })
  document_data: {
    [key: string]: any;
  };

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING
  })
  verification_status: VerificationStatus;

  @Column({ type: 'jsonb', nullable: true })
  verification_details: {
    verified_by: string;
    verified_at: Date;
    verification_notes: string;
  };

  @ManyToOne(() => Citizen)
  @JoinColumn({ name: 'citizen_id' })
  citizen: Citizen;

  @Column()
  citizen_id: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    file_path: string;
    file_type: string;
    file_size: number;
    upload_date: Date;
  };
} 