import { BaseEntity } from '../types';
import { Gender, MaritalStatus, EmploymentStatus, RegistrationStatus } from './enums';

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

export enum NidaVerificationStatus {
  NOT_VERIFIED = 'NOT_VERIFIED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
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

export interface NidaVerificationResult {
  exists: boolean;
  hasPassword: boolean;
  isValid: boolean;
  message?: string;
  citizen?: {
    id: string;
    first_name: string;
    last_name: string;
    nida_number: string;
  };
}

export interface Citizen {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  nida_number: string;
  registration_status: string;
  address?: {
    street: string;
    city: string;
    region: string;
    postal_code: string;
  };
  employment_status: string;
  occupation?: string;
  employer_name?: string;
  marital_status: string;
  is_nida_verified: boolean;
  verification_data?: {
    is_valid: boolean;
    match_score: number;
    verification_date: string;
    details: {
      verified_fields: string[];
      mismatches: string[];
    };
  };
  created_at: string;
  updated_at: string;
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