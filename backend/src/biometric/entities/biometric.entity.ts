import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Citizen } from '../../citizen/entities/citizen.entity';

@Entity()
export class Biometric extends BaseEntity {
  @Column()
  fingerprint_data: string;

  @Column({ type: 'jsonb' })
  metadata: {
    quality_score: number;
    capture_device: string;
    capture_date: Date;
    template_version: string;
  };

  @ManyToOne(() => Citizen)
  @JoinColumn({ name: 'citizen_id' })
  citizen: Citizen;

  @Column()
  citizen_id: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  verification_status: {
    is_verified: boolean;
    verified_at: Date;
    verified_by: string;
    verification_notes: string;
  };
} 