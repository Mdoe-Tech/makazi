export interface NidaData {
  nida_number: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  other_names?: string;
  date_of_birth: string;
  birth_certificate_number?: string;
  phone_number?: string;
  gender: 'M' | 'F';
  marital_status: 'SINGLE' | 'MARRIED' | 'WIDOWED' | 'DIVORCED';
  occupation?: string;
  employer_name?: string;
  dossier_number?: string;
  employment_status: 'SELF_EMPLOYED' | 'EMPLOYED' | 'UNEMPLOYED';
  father_first_name?: string;
  father_middle_name?: string;
  father_last_name?: string;
  father_birth_country?: string;
  father_date_of_birth?: string;
  mother_first_name?: string;
  mother_middle_name?: string;
  mother_last_name?: string;
  mother_birth_country?: string;
  mother_date_of_birth?: string;
  citizenship_type: 'BIRTH' | 'INHERITANCE' | 'NATURALIZATION';
  naturalization_certificate_number?: string;
  birth_country: string;
  birth_region: string;
  birth_district: string;
  birth_ward: string;
  current_residence_house_number?: string;
  current_residence_region: string;
  current_residence_postal_code?: string;
  current_residence_district: string;
  current_residence_ward: string;
  current_residence_village?: string;
  current_residence_street?: string;
  current_residence_postal_box?: string;
  permanent_residence_house_number?: string;
  permanent_residence_region: string;
  permanent_residence_postal_code?: string;
  permanent_residence_district: string;
  permanent_residence_ward: string;
  permanent_residence_village?: string;
  permanent_residence_street?: string;
  permanent_residence_postal_box?: string;
  passport_number?: string;
  father_national_id?: string;
  mother_national_id?: string;
  driver_license_number?: string;
  voter_registration_number?: string;
  health_insurance_number?: string;
  tax_identification_number?: string;
  zanzibar_resident_id?: string;
  social_security_fund_type?: string;
  social_security_membership_number?: string;
  secondary_education_certificate_number?: string;
  higher_secondary_education_certificate_number?: string;
  applicant_signature?: string;
  official_use_executive_officer_name?: string;
  official_use_center_number?: string;
  official_use_region?: string;
  official_use_district?: string;
  official_use_ward?: string;
  official_use_center_name?: string;
  application_date?: string;
  registration_officer_name?: string;
  immigration_officer_name?: string;
  rita_rgo_officer_name?: string;
  weo_employer_name?: string;
  nida_officer_name?: string;
  primary_school_name?: string;
  primary_school_district?: string;
  primary_school_graduation_year?: string;
  is_verified: boolean;
  verification_date?: string;
  metadata?: Record<string, any>;
}

export interface NidaFilters {
  nida_number?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F';
  nationality?: string;
  is_verified?: boolean;
}

export interface VerifyNidaDto {
  nida_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
}

export interface NidaVerificationResult {
  is_valid: boolean;
  match_score: number;
  verification_date: string;
  details?: Record<string, any>;
} 