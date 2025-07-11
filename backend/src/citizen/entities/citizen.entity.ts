import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Gender, MaritalStatus, EmploymentStatus } from '../enums/citizen.enum';
import { RegistrationStatus } from '../enums/registration-status.enum';

@Entity('citizen')
export class Citizen extends BaseEntity {
  @Column({ unique: true })
  nida_number: string;

  @Column({ default: false, nullable: true })
  is_nida_verified: boolean;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
    nullable: true
  })
  gender: Gender;

  @Column({ default: 'Tanzania', nullable: true })
  nationality: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column('jsonb', { nullable: true })
  address: {
    street: string;
    city: string;
    region: string;
    postal_code: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  biometric_data: {
    fingerprint: string;
    facial_image: string;
    iris_scan: string;
    quality_score: number;
  };

  @Column({ default: true, nullable: true })
  is_active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  verification_status: {
    is_verified: boolean;
    verified_at: Date;
    verified_by: string;
  };

  @Column({ nullable: true })
  other_names: string;

  @Column({
    type: 'enum',
    enum: MaritalStatus,
    nullable: true
  })
  marital_status: MaritalStatus;

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  employer_name: string;

  @Column({ nullable: true })
  dossier_number: string;

  @Column({
    type: 'enum',
    enum: EmploymentStatus,
    nullable: true
  })
  employment_status: EmploymentStatus;

  @Column({ type: 'jsonb', nullable: true })
  contact_details: any;

  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.PENDING,
    nullable: true
  })
  registration_status: RegistrationStatus;

  @Column({ type: 'jsonb', nullable: true })
  documents: any;

  @Column({ nullable: true })
  rejection_reason: string;

  @Column({ type: 'jsonb', nullable: true })
  verification_data: any;

  @Column({ nullable: true })
  birth_certificate_number: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false, nullable: true })
  has_password: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ type: 'jsonb', nullable: true })
  verification_status_history: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 
 