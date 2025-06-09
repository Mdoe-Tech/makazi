import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { NidaVerification } from './nida-verification.entity';

@Entity('nida')
export class Nida {
  @PrimaryColumn()
  @Index({ unique: true })
  nida_number: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  other_names: string;

  @Column({ type: 'timestamp', nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  nationality: string;

  @Column('jsonb', { nullable: true })
  biometric_data: {
    fingerprint: string;
    facial_image: string;
    iris_scan: string;
    quality_score: number;
  };

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  marital_status: string;

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  employer_name: string;

  @Column({ nullable: true })
  dossier_number: string;

  @Column({ nullable: true })
  employment_status: string;

  @Column({ nullable: true })
  birth_certificate_number: string;

  @Column({ nullable: true })
  father_first_name: string;

  @Column({ nullable: true })
  father_middle_name: string;

  @Column({ nullable: true })
  father_last_name: string;

  @Column({ nullable: true })
  father_birth_country: string;

  @Column({ nullable: true })
  father_date_of_birth: string;

  @Column({ nullable: true })
  mother_first_name: string;

  @Column({ nullable: true })
  mother_middle_name: string;

  @Column({ nullable: true })
  mother_last_name: string;

  @Column({ nullable: true })
  mother_birth_country: string;

  @Column({ nullable: true })
  mother_date_of_birth: string;

  @Column({ nullable: true })
  citizenship_type: string;

  @Column({ nullable: true })
  naturalization_certificate_number: string;

  @Column({ nullable: true })
  birth_country: string;

  @Column({ nullable: true })
  birth_region: string;

  @Column({ nullable: true })
  birth_district: string;

  @Column({ nullable: true })
  birth_ward: string;

  @Column({ nullable: true })
  current_residence_house_number: string;

  @Column({ nullable: true })
  current_residence_region: string;

  @Column({ nullable: true })
  current_residence_postal_code: string;

  @Column({ nullable: true })
  current_residence_district: string;

  @Column({ nullable: true })
  current_residence_ward: string;

  @Column({ nullable: true })
  current_residence_village: string;

  @Column({ nullable: true })
  current_residence_street: string;

  @Column({ nullable: true })
  current_residence_postal_box: string;

  @Column({ nullable: true })
  permanent_residence_house_number: string;

  @Column({ nullable: true })
  permanent_residence_region: string;

  @Column({ nullable: true })
  permanent_residence_postal_code: string;

  @Column({ nullable: true })
  permanent_residence_district: string;

  @Column({ nullable: true })
  permanent_residence_ward: string;

  @Column({ nullable: true })
  permanent_residence_village: string;

  @Column({ nullable: true })
  permanent_residence_street: string;

  @Column({ nullable: true })
  permanent_residence_postal_box: string;

  @Column({ nullable: true })
  passport_number: string;

  @Column({ nullable: true })
  father_national_id: string;

  @Column({ nullable: true })
  mother_national_id: string;

  @Column({ nullable: true })
  driver_license_number: string;

  @Column({ nullable: true })
  voter_registration_number: string;

  @Column({ nullable: true })
  health_insurance_number: string;

  @Column({ nullable: true })
  tax_identification_number: string;

  @Column({ nullable: true })
  zanzibar_resident_id: string;

  @Column({ nullable: true })
  social_security_fund_type: string;

  @Column({ nullable: true })
  social_security_membership_number: string;

  @Column({ nullable: true })
  secondary_education_certificate_number: string;

  @Column({ nullable: true })
  higher_secondary_education_certificate_number: string;

  @Column({ nullable: true })
  applicant_signature: string;

  @Column({ nullable: true })
  official_use_executive_officer_name: string;

  @Column({ nullable: true })
  official_use_center_number: string;

  @Column({ nullable: true })
  official_use_region: string;

  @Column({ nullable: true })
  official_use_district: string;

  @Column({ nullable: true })
  official_use_ward: string;

  @Column({ nullable: true })
  official_use_center_name: string;

  @Column({ nullable: true })
  application_date: Date;

  @Column({ nullable: true })
  registration_officer_name: string;

  @Column({ nullable: true })
  immigration_officer_name: string;

  @Column({ nullable: true })
  rita_rgo_officer_name: string;

  @Column({ nullable: true })
  weo_employer_name: string;

  @Column({ nullable: true })
  nida_officer_name: string;

  @Column({ nullable: true })
  primary_school_name: string;

  @Column({ nullable: true })
  primary_school_district: string;

  @Column({ nullable: true })
  primary_school_graduation_year: string;

  @Column({ default: false, nullable: true })
  is_verified: boolean;

  @Column({ nullable: true })
  verification_date: Date;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column('jsonb', { nullable: true })
  address: {
    street: string;
    city: string;
    region: string;
    postal_code: string;
  };

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  place_of_birth: string;

  @Column({ nullable: true })
  mother_name: string;

  @Column({ nullable: true })
  father_name: string;

  @Column({ nullable: true })
  blood_type: string;

  @Column({ nullable: true })
  religion: string;

  @Column({ nullable: true })
  education_level: string;

  @Column({ nullable: true })
  disability_status: string;

  @Column({ nullable: true })
  disability_type: string;

  @Column({ nullable: true })
  emergency_contact_name: string;

  @Column({ nullable: true })
  emergency_contact_phone: string;

  @Column({ nullable: true })
  emergency_contact_relationship: string;

  @Column({ nullable: true })
  photo_url: string;

  @Column({ nullable: true })
  signature_url: string;

  @Column({ nullable: true })
  fingerprint_url: string;

  @Column({ nullable: true })
  document_url: string;

  @Column({ nullable: true })
  verification_status: string;

  @Column({ nullable: true })
  verification_notes: string;

  @Column({ nullable: true })
  registration_date: Date;

  @Column({ nullable: true })
  expiry_date: Date;

  @Column({ nullable: true })
  last_updated: Date;

  @Column({ nullable: true })
  last_updated_by: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => NidaVerification, verification => verification.nida, {
    cascade: true
  })
  verifications: NidaVerification[];
} 