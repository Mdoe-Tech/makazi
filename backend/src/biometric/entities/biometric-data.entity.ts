import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('biometric_data')
export class BiometricData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  citizen_id: number;

  @Column()
  fingerprint_data: string;

  @Column()
  facial_data: string;

  @Column()
  iris_data: string;

  @Column({ default: 'PENDING' })
  verification_status: string;

  @Column({ nullable: true })
  verified_by: number;

  @Column({ nullable: true })
  verified_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 