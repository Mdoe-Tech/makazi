'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { useNidaStore } from '@/lib/store/nida.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Gender, MaritalStatus, EmploymentStatus, CitizenshipType, NidaData } from '@/lib/api/nida/types';

type FormData = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  marital_status: MaritalStatus;
  employment_status: EmploymentStatus;
  citizenship_type: CitizenshipType;
  birth_country: string;
  birth_region: string;
  birth_district: string;
  birth_ward: string;
  current_residence_region: string;
  current_residence_district: string;
  current_residence_ward: string;
  permanent_residence_region: string;
  permanent_residence_district: string;
  permanent_residence_ward: string;
  nationality: string;
  middle_name: string;
  other_names: string;
  birth_certificate_number: string;
  phone_number: string;
  occupation: string;
  employer_name: string;
  dossier_number: string;
  father_first_name: string;
  father_middle_name: string;
  father_last_name: string;
  father_birth_country: string;
  father_date_of_birth: string;
  mother_first_name: string;
  mother_middle_name: string;
  mother_last_name: string;
  mother_birth_country: string;
  mother_date_of_birth: string;
  naturalization_certificate_number: string;
  current_residence_house_number: string;
  current_residence_postal_code: string;
  current_residence_village: string;
  current_residence_street: string;
  current_residence_postal_box: string;
  permanent_residence_house_number: string;
  permanent_residence_postal_code: string;
  permanent_residence_village: string;
  permanent_residence_street: string;
  permanent_residence_postal_box: string;
  passport_number: string;
  father_national_id: string;
  mother_national_id: string;
  driver_license_number: string;
  voter_registration_number: string;
  health_insurance_number: string;
  tax_identification_number: string;
  zanzibar_resident_id: string;
  social_security_fund_type: string;
  social_security_membership_number: string;
  secondary_education_certificate_number: string;
  higher_secondary_education_certificate_number: string;
  applicant_signature: string;
  official_use_executive_officer_name: string;
  official_use_center_number: string;
  official_use_region: string;
  official_use_district: string;
  official_use_ward: string;
  official_use_center_name: string;
  application_date: string;
  registration_officer_name: string;
  immigration_officer_name: string;
  rita_rgo_officer_name: string;
  weo_employer_name: string;
  nida_officer_name: string;
  primary_school_name: string;
  primary_school_district: string;
  primary_school_graduation_year: string;
  is_verified: boolean;
  id: string;
  created_at: string;
  updated_at: string;
};

export default function NidaRegistrationPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { registerNida, loading, error } = useNidaStore();
  const [formData, setFormData] = useState<FormData>({
    first_name: 'John',
    last_name: 'Mdoe',
    date_of_birth: '1990-01-01',
    gender: Gender.MALE,
    marital_status: MaritalStatus.SINGLE,
    employment_status: EmploymentStatus.EMPLOYED,
    citizenship_type: CitizenshipType.BIRTH,
    birth_country: 'Tanzania',
    birth_region: 'Dar es Salaam',
    birth_district: 'Ilala',
    birth_ward: 'Kisutu',
    current_residence_region: 'Dar es Salaam',
    current_residence_district: 'Kinondoni',
    current_residence_ward: 'Mikocheni',
    permanent_residence_region: 'Dar es Salaam',
    permanent_residence_district: 'Kinondoni',
    permanent_residence_ward: 'Mikocheni',
    nationality: 'Tanzania',
    middle_name: 'Peter',
    other_names: 'JP',
    birth_certificate_number: 'BC123456',
    phone_number: '+255712345678',
    occupation: 'Software Engineer',
    employer_name: 'Tech Solutions Ltd',
    dossier_number: 'DOS123456',
    father_first_name: 'Michael',
    father_middle_name: 'Joseph',
    father_last_name: 'Mdoe',
    father_birth_country: 'Tanzania',
    father_date_of_birth: '1960-01-01',
    mother_first_name: 'Mary',
    mother_middle_name: 'Elizabeth',
    mother_last_name: 'Mdoe',
    mother_birth_country: 'Tanzania',
    mother_date_of_birth: '1965-01-01',
    naturalization_certificate_number: '',
    current_residence_house_number: '123',
    current_residence_postal_code: '14112',
    current_residence_village: 'Mikocheni',
    current_residence_street: 'Mikocheni Street',
    current_residence_postal_box: '12345',
    permanent_residence_house_number: '123',
    permanent_residence_postal_code: '14112',
    permanent_residence_village: 'Mikocheni',
    permanent_residence_street: 'Mikocheni Street',
    permanent_residence_postal_box: '12345',
    passport_number: 'AB123456',
    father_national_id: 'NID123456',
    mother_national_id: 'NID123457',
    driver_license_number: 'DL123456',
    voter_registration_number: 'VR123456',
    health_insurance_number: 'HI123456',
    tax_identification_number: 'TIN123456',
    zanzibar_resident_id: '',
    social_security_fund_type: 'NHIF',
    social_security_membership_number: 'SSF123456',
    secondary_education_certificate_number: 'SEC123456',
    higher_secondary_education_certificate_number: 'HSC123456',
    applicant_signature: 'John Mdoe',
    official_use_executive_officer_name: 'James Wilson',
    official_use_center_number: 'CN123456',
    official_use_region: 'Dar es Salaam',
    official_use_district: 'Kinondoni',
    official_use_ward: 'Mikocheni',
    official_use_center_name: 'Kinondoni Registration Center',
    application_date: new Date().toISOString(),
    registration_officer_name: 'Sarah Johnson',
    immigration_officer_name: 'David Smith',
    rita_rgo_officer_name: 'Robert Brown',
    weo_employer_name: 'Tech Solutions Ltd',
    nida_officer_name: 'Michael Johnson',
    primary_school_name: 'Mikocheni Primary School',
    primary_school_district: 'Kinondoni',
    primary_school_graduation_year: '2002',
    is_verified: false,
    id: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Only REGISTRAR can access this page
  if (!user || (user.role as string) !== 'REGISTRAR') {
    return (
      <DashboardLayout userType="admin">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">Only Registrars can register new NIDA data.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    // Validate required fields
    if (!formData.date_of_birth) {
      setFormError('Date of birth is required');
      return;
    }

    try {
      await registerNida({
        ...formData,
        application_date: formData.application_date,
        created_at: formData.created_at,
        updated_at: formData.updated_at
      });
      setSuccessMessage('NIDA data registered successfully!');
      // Reset form after successful registration
      setFormData({
        first_name: 'John',
        last_name: 'Mdoe',
        date_of_birth: '1990-01-01',
        gender: Gender.MALE,
        marital_status: MaritalStatus.SINGLE,
        employment_status: EmploymentStatus.EMPLOYED,
        citizenship_type: CitizenshipType.BIRTH,
        birth_country: 'Tanzania',
        birth_region: 'Dar es Salaam',
        birth_district: 'Ilala',
        birth_ward: 'Kisutu',
        current_residence_region: 'Dar es Salaam',
        current_residence_district: 'Kinondoni',
        current_residence_ward: 'Mikocheni',
        permanent_residence_region: 'Dar es Salaam',
        permanent_residence_district: 'Kinondoni',
        permanent_residence_ward: 'Mikocheni',
        nationality: 'Tanzania',
        middle_name: 'Peter',
        other_names: 'JP',
        birth_certificate_number: 'BC123456',
        phone_number: '+255712345678',
        occupation: 'Software Engineer',
        employer_name: 'Tech Solutions Ltd',
        dossier_number: 'DOS123456',
        father_first_name: 'Michael',
        father_middle_name: 'Joseph',
        father_last_name: 'Mdoe',
        father_birth_country: 'Tanzania',
        father_date_of_birth: '1960-01-01',
        mother_first_name: 'Mary',
        mother_middle_name: 'Elizabeth',
        mother_last_name: 'Mdoe',
        mother_birth_country: 'Tanzania',
        mother_date_of_birth: '1965-01-01',
        naturalization_certificate_number: '',
        current_residence_house_number: '123',
        current_residence_postal_code: '14112',
        current_residence_village: 'Mikocheni',
        current_residence_street: 'Mikocheni Street',
        current_residence_postal_box: '12345',
        permanent_residence_house_number: '123',
        permanent_residence_postal_code: '14112',
        permanent_residence_village: 'Mikocheni',
        permanent_residence_street: 'Mikocheni Street',
        permanent_residence_postal_box: '12345',
        passport_number: 'AB123456',
        father_national_id: 'NID123456',
        mother_national_id: 'NID123457',
        driver_license_number: 'DL123456',
        voter_registration_number: 'VR123456',
        health_insurance_number: 'HI123456',
        tax_identification_number: 'TIN123456',
        zanzibar_resident_id: '',
        social_security_fund_type: 'NHIF',
        social_security_membership_number: 'SSF123456',
        secondary_education_certificate_number: 'SEC123456',
        higher_secondary_education_certificate_number: 'HSC123456',
        applicant_signature: 'John Mdoe',
        official_use_executive_officer_name: 'James Wilson',
        official_use_center_number: 'CN123456',
        official_use_region: 'Dar es Salaam',
        official_use_district: 'Kinondoni',
        official_use_ward: 'Mikocheni',
        official_use_center_name: 'Kinondoni Registration Center',
        application_date: new Date().toISOString(),
        registration_officer_name: 'Sarah Johnson',
        immigration_officer_name: 'David Smith',
        rita_rgo_officer_name: 'Robert Brown',
        weo_employer_name: 'Tech Solutions Ltd',
        nida_officer_name: 'Michael Johnson',
        primary_school_name: 'Mikocheni Primary School',
        primary_school_district: 'Kinondoni',
        primary_school_graduation_year: '2002',
        is_verified: false,
        id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setCurrentStep(1);
    } catch (error: any) {
      console.error('Registration failed:', error);
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          setFormError(error.response.data.message[0]);
        } else {
          setFormError(error.response.data.message);
        }
      } else if (error.response?.data?.error) {
        setFormError(error.response.data.error);
      } else if (error.message) {
        setFormError(error.message);
      } else {
        setFormError('Failed to register NIDA data. Please try again.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middle_name"
                  id="middle_name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.middle_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="other_names" className="block text-sm font-medium text-gray-700">
                  Other Names
                </label>
                <input
                  type="text"
                  name="other_names"
                  id="other_names"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.other_names}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender *
                </label>
                <select
                  name="gender"
                  id="gender"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value={Gender.MALE}>Male</option>
                  <option value={Gender.FEMALE}>Female</option>
                </select>
              </div>

              <div>
                <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700">
                  Marital Status *
                </label>
                <select
                  name="marital_status"
                  id="marital_status"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.marital_status}
                  onChange={handleChange}
                >
                  <option value={MaritalStatus.SINGLE}>Single</option>
                  <option value={MaritalStatus.MARRIED}>Married</option>
                  <option value={MaritalStatus.WIDOWED}>Widowed</option>
                  <option value={MaritalStatus.DIVORCED}>Divorced</option>
                </select>
              </div>

              <div>
                <label htmlFor="employment_status" className="block text-sm font-medium text-gray-700">
                  Employment Status *
                </label>
                <select
                  name="employment_status"
                  id="employment_status"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.employment_status}
                  onChange={handleChange}
                >
                  <option value={EmploymentStatus.EMPLOYED}>Employed</option>
                  <option value={EmploymentStatus.SELF_EMPLOYED}>Self Employed</option>
                  <option value={EmploymentStatus.UNEMPLOYED}>Unemployed</option>
                </select>
              </div>

              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                  Nationality *
                </label>
                <input
                  type="text"
                  name="nationality"
                  id="nationality"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.nationality}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Parent Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="father_first_name" className="block text-sm font-medium text-gray-700">
                  Father's First Name
                </label>
                <input
                  type="text"
                  name="father_first_name"
                  id="father_first_name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.father_first_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="father_last_name" className="block text-sm font-medium text-gray-700">
                  Father's Last Name
                </label>
                <input
                  type="text"
                  name="father_last_name"
                  id="father_last_name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.father_last_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="mother_first_name" className="block text-sm font-medium text-gray-700">
                  Mother's First Name
                </label>
                <input
                  type="text"
                  name="mother_first_name"
                  id="mother_first_name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.mother_first_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="mother_last_name" className="block text-sm font-medium text-gray-700">
                  Mother's Last Name
                </label>
                <input
                  type="text"
                  name="mother_last_name"
                  id="mother_last_name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.mother_last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Citizenship Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="citizenship_type" className="block text-sm font-medium text-gray-700">
                  Citizenship Type *
                </label>
                <select
                  name="citizenship_type"
                  id="citizenship_type"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.citizenship_type}
                  onChange={handleChange}
                >
                  <option value={CitizenshipType.BIRTH}>Birth</option>
                  <option value={CitizenshipType.INHERITANCE}>Inheritance</option>
                  <option value={CitizenshipType.NATURALIZATION}>Naturalization</option>
                </select>
              </div>

              <div>
                <label htmlFor="birth_country" className="block text-sm font-medium text-gray-700">
                  Birth Country *
                </label>
                <input
                  type="text"
                  name="birth_country"
                  id="birth_country"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.birth_country}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="birth_region" className="block text-sm font-medium text-gray-700">
                  Birth Region *
                </label>
                <input
                  type="text"
                  name="birth_region"
                  id="birth_region"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.birth_region}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="birth_district" className="block text-sm font-medium text-gray-700">
                  Birth District *
                </label>
                <input
                  type="text"
                  name="birth_district"
                  id="birth_district"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.birth_district}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="birth_ward" className="block text-sm font-medium text-gray-700">
                  Birth Ward *
                </label>
                <input
                  type="text"
                  name="birth_ward"
                  id="birth_ward"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.birth_ward}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Residence Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="current_residence_region" className="block text-sm font-medium text-gray-700">
                  Current Residence Region *
                </label>
                <input
                  type="text"
                  name="current_residence_region"
                  id="current_residence_region"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.current_residence_region}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="current_residence_district" className="block text-sm font-medium text-gray-700">
                  Current Residence District *
                </label>
                <input
                  type="text"
                  name="current_residence_district"
                  id="current_residence_district"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.current_residence_district}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="current_residence_ward" className="block text-sm font-medium text-gray-700">
                  Current Residence Ward *
                </label>
                <input
                  type="text"
                  name="current_residence_ward"
                  id="current_residence_ward"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.current_residence_ward}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="permanent_residence_region" className="block text-sm font-medium text-gray-700">
                  Permanent Residence Region *
                </label>
                <input
                  type="text"
                  name="permanent_residence_region"
                  id="permanent_residence_region"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.permanent_residence_region}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="permanent_residence_district" className="block text-sm font-medium text-gray-700">
                  Permanent Residence District *
                </label>
                <input
                  type="text"
                  name="permanent_residence_district"
                  id="permanent_residence_district"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.permanent_residence_district}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="permanent_residence_ward" className="block text-sm font-medium text-gray-700">
                  Permanent Residence Ward *
                </label>
                <input
                  type="text"
                  name="permanent_residence_ward"
                  id="permanent_residence_ward"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.permanent_residence_ward}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout userType="admin">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Register New NIDA Data
            </h2>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep > index + 1
                        ? 'bg-green-500'
                        : currentStep === index + 1
                        ? 'bg-indigo-600'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span className="text-white">{index + 1}</span>
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      className={`w-full h-1 ${
                        currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}

            {(formError || error) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {formError || error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      {successMessage}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register NIDA Data'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
} 