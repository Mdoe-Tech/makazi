import { BaseEntity } from '../types';

export interface Biometric extends BaseEntity {
  fingerprint_data: string;
  metadata: {
    quality_score: number;
    capture_device: string;
    capture_date: Date;
    template_version: string;
  };
  citizen_id: string;
  is_active: boolean;
  verification_status?: {
    is_verified: boolean;
    verified_at: Date;
    verified_by: string;
    verification_notes: string;
  };
}

export interface CreateBiometricDto {
  fingerprint_data: string;
  metadata: {
    quality_score: number;
    capture_device: string;
    template_version: string;
  };
  citizen_id: string;
}

export interface UpdateBiometricDto extends Partial<CreateBiometricDto> {
  is_active?: boolean;
  verification_status?: {
    is_verified: boolean;
    verified_by: string;
    verification_notes: string;
  };
}

export interface BiometricFilters {
  citizen_id?: string;
  is_active?: boolean;
  is_verified?: boolean;
  capture_device?: string;
  template_version?: string;
}

export interface BiometricVerificationResult {
  match_score: number;
  is_match: boolean;
  confidence_level: number;
  verification_details: {
    algorithm_used: string;
    verification_date: Date;
    quality_metrics: {
      fingerprint_quality: number;
      facial_quality: number;
      iris_quality: number;
    };
  };
} 