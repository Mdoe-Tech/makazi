import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DocumentType } from '../enums/document-type.enum'; 
import { DocumentStatus } from '../enums/document-status.enum';
import { Citizen } from '../../citizen/entities/citizen.entity';

@Entity('document_requests')
export class DocumentRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  citizen_id: string;

  @ManyToOne(() => Citizen, { eager: true })
  @JoinColumn({ name: 'citizen_id' })
  citizen: Citizen;

  @Column({
    type: 'enum',
    enum: DocumentType
  })
  document_type: DocumentType;

  @Column('text')
  purpose: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING
  })
  status: DocumentStatus;

  @Column({ nullable: true })
  document_url: string;

  @Column({ type: 'text', nullable: true })
  signature_url: string;

  @Column({ type: 'text', nullable: true })
  stamp_url: string;

  @Column({ nullable: true })
  rejection_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  approved_at: Date;

  @Column({ nullable: true })
  rejected_at: Date;
} 