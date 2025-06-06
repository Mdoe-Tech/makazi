import { BaseEntity } from '../types';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed'
}

export enum EmploymentStatus {
  EMPLOYED = 'employed',
  UNEMPLOYED = 'unemployed',
  SELF_EMPLOYED = 'self_employed',
  STUDENT = 'student',
  RETIRED = 'retired'
}

export enum RegistrationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

export interface Address {
  street: string;
  city: string;
  region: string;
  postal_code: string;
}

export interface BiometricData {
  fingerprint: string;
  facial_image: string;
  iris_scan: string;
  quality_score: number;
}

export interface VerificationStatus {
  is_verified: boolean;
  verified_at: Date;
  verified_by: string;
}

export interface NidaVerificationStatus {
  is_nida_verified: boolean;
  nida_number?: string;
  nida_verification_date?: Date;
  nida_verification_score?: number;
}

export interface Citizen extends BaseEntity {
  nida_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: Date;
  gender: Gender;
  nationality: string;
  email?: string;
  phone_number?: string;
  address: Address;
  biometric_data?: BiometricData;
  is_active: boolean;
  verification_status?: VerificationStatus;
  nida_verification_status?: NidaVerificationStatus;
  other_names?: string;
  marital_status: MaritalStatus;
  occupation?: string;
  employer_name?: string;
  dossier_number?: string;
  employment_status?: EmploymentStatus;
  contact_details?: Record<string, any>;
  registration_status: RegistrationStatus;
  documents?: Record<string, any>;
  rejection_reason?: string;
  verification_data?: Record<string, any>;
  birth_certificate_number: string;
  metadata?: Record<string, any>;
  verification_status_history?: Record<string, any>;
}

export interface CreateCitizenDto {
  nida_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: Date;
  gender: Gender;
  nationality: string;
  email?: string;
  phone_number?: string;
  address: Address;
  other_names?: string;
  marital_status: MaritalStatus;
  occupation?: string;
  employer_name?: string;
  employment_status?: EmploymentStatus;
  birth_certificate_number: string;
}

export interface UpdateCitizenDto extends Partial<CreateCitizenDto> {
  is_active?: boolean;
  registration_status?: RegistrationStatus;
  rejection_reason?: string;
  nida_verification_status?: Partial<NidaVerificationStatus>;
}

export interface CitizenFilters {
  search?: string;
  registration_status?: RegistrationStatus;
  is_active?: boolean;
  gender?: Gender;
  marital_status?: MaritalStatus;
  employment_status?: EmploymentStatus;
  region?: string;
  city?: string;
  is_nida_verified?: boolean;
} 