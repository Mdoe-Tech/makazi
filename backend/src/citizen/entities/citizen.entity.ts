import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Gender, MaritalStatus, EmploymentStatus } from '../enums/citizen.enum';
import { RegistrationStatus } from '../enums/registration-status.enum';

@Entity()
export class Citizen extends BaseEntity {
  @Column({ unique: true })
  nida_number: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column()
  date_of_birth: Date;

  @Column()
  gender: string;

  @Column()
  nationality: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ type: 'jsonb' })
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

  @Column({ default: true })
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
    enum: MaritalStatus
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
    default: RegistrationStatus.PENDING
  })
  registration_status: RegistrationStatus;

  @Column({ type: 'jsonb', nullable: true })
  documents: any;

  @Column({ nullable: true })
  rejection_reason: string;

  @Column({ type: 'jsonb', nullable: true })
  verification_data: any;

  @Column({ unique: true })
  birth_certificate_number: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ type: 'jsonb', nullable: true })
  verification_status_history: any;
} 
 