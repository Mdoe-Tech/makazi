import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Citizen } from '../../citizen/entities/citizen.entity';

export enum LetterType {
  INTRODUCTION = 'INTRODUCTION',
  SPONSORSHIP = 'SPONSORSHIP'
}

export enum LetterStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

@Entity()
export class Letter extends BaseEntity {
  @Column({
    type: 'enum',
    enum: LetterType
  })
  letter_type: LetterType;

  @Column()
  citizen_id: string;

  @Column()
  region_id: string;

  @Column()
  office_id: string;

  @Column({ type: 'jsonb' })
  letter_data: {
    purpose: string;
    destination: string;
    duration?: string;
    additional_info?: string;
  };

  @Column({
    type: 'enum',
    enum: LetterStatus,
    default: LetterStatus.PENDING
  })
  status: LetterStatus;

  @Column({ type: 'jsonb', nullable: true })
  approval_details: {
    approved_by: string;
    approved_at: Date;
    approval_notes: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  rejection_details: {
    rejected_by: string;
    rejected_at: Date;
    rejection_reason: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    generated_at: Date;
    expiry_date: Date;
    digital_signature?: string;
  };

  @ManyToOne(() => Citizen)
  @JoinColumn({ name: 'citizen_id' })
  citizen: Citizen;
} 