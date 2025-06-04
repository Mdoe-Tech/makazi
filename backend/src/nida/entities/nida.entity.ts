import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('nida')
export class Nida {
  @PrimaryColumn()
  nida_number: string;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  middle_name?: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  other_names?: string;

  @Column()
  date_of_birth: string;

  @Column({ nullable: true })
  birth_certificate_number?: string;

  @Column({ nullable: true })
  phone_number?: string;

  @Column()
  gender: 'M' | 'F';

  @Column()
  marital_status: 'SINGLE' | 'MARRIED' | 'WIDOWED' | 'DIVORCED';

  @Column({ nullable: true })
  occupation?: string;

  @Column({ nullable: true })
  employer_name?: string;

  @Column({ nullable: true })
  dossier_number?: string;

  @Column()
  employment_status: 'SELF_EMPLOYED' | 'EMPLOYED' | 'UNEMPLOYED';

  @Column({ nullable: true })
  father_first_name?: string;

  @Column({ nullable: true })
  father_middle_name?: string;

  @Column({ nullable: true })
  father_last_name?: string;

  @Column({ nullable: true })
  father_birth_country?: string;

  @Column({ nullable: true })
  father_date_of_birth?: string;

  @Column({ nullable: true })
  mother_first_name?: string;

  @Column({ nullable: true })
  mother_middle_name?: string;

  @Column({ nullable: true })
  mother_last_name?: string;

  @Column({ nullable: true })
  mother_birth_country?: string;

  @Column({ nullable: true })
  mother_date_of_birth?: string;

  @Column()
  citizenship_type: 'BIRTH' | 'INHERITANCE' | 'NATURALIZATION';

  @Column({ nullable: true })
  naturalization_certificate_number?: string;

  @Column()
  birth_country: string;

  @Column()
  birth_region: string;

  @Column()
  birth_district: string;

  @Column()
  birth_ward: string;

  @Column({ nullable: true })
  current_residence_house_number?: string;

  @Column()
  current_residence_region: string;

  @Column({ nullable: true })
  current_residence_postal_code?: string;

  @Column()
  current_residence_district: string;

  @Column()
  current_residence_ward: string;

  @Column({ nullable: true })
  current_residence_village?: string;

  @Column({ nullable: true })
  current_residence_street?: string;

  @Column({ nullable: true })
  current_residence_postal_box?: string;

  @Column({ nullable: true })
  permanent_residence_house_number?: string;

  @Column()
  permanent_residence_region: string;

  @Column({ nullable: true })
  permanent_residence_postal_code?: string;

  @Column()
  permanent_residence_district: string;

  @Column()
  permanent_residence_ward: string;

  @Column({ nullable: true })
  permanent_residence_village?: string;

  @Column({ nullable: true })
  permanent_residence_street?: string;

  @Column({ nullable: true })
  permanent_residence_postal_box?: string;

  @Column({ nullable: true })
  passport_number?: string;

  @Column({ nullable: true })
  father_national_id?: string;

  @Column({ nullable: true })
  mother_national_id?: string;

  @Column({ nullable: true })
  driver_license_number?: string;

  @Column({ nullable: true })
  voter_registration_number?: string;

  @Column({ nullable: true })
  health_insurance_number?: string;

  @Column({ nullable: true })
  tax_identification_number?: string;

  @Column({ nullable: true })
  zanzibar_resident_id?: string;

  @Column({ nullable: true })
  social_security_fund_type?: string;

  @Column({ nullable: true })
  social_security_membership_number?: string;

  @Column({ nullable: true })
  secondary_education_certificate_number?: string;

  @Column({ nullable: true })
  higher_secondary_education_certificate_number?: string;

  @Column({ nullable: true })
  applicant_signature?: string;

  @Column({ nullable: true })
  official_use_executive_officer_name?: string;

  @Column({ nullable: true })
  official_use_center_number?: string;

  @Column({ nullable: true })
  official_use_region?: string;

  @Column({ nullable: true })
  official_use_district?: string;

  @Column({ nullable: true })
  official_use_ward?: string;

  @Column({ nullable: true })
  official_use_center_name?: string;

  @Column({ nullable: true })
  application_date?: string;

  @Column({ nullable: true })
  registration_officer_name?: string;

  @Column({ nullable: true })
  immigration_officer_name?: string;

  @Column({ nullable: true })
  rita_rgo_officer_name?: string;

  @Column({ nullable: true })
  weo_employer_name?: string;

  @Column({ nullable: true })
  nida_officer_name?: string;

  @Column({ nullable: true })
  primary_school_name?: string;

  @Column({ nullable: true })
  primary_school_district?: string;

  @Column({ nullable: true })
  primary_school_graduation_year?: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ nullable: true })
  verification_date?: string;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 