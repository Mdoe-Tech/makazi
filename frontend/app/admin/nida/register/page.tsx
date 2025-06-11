'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { useNidaStore } from '@/lib/store/nida.store';
import { Gender, MaritalStatus, EmploymentStatus, CitizenshipType, NidaData } from '@/lib/api/nida/types';
import { UserRole } from '@/lib/api/auth/types';
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type FormData = {
  nida_number: string;
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
  address: {
    street: string;
    city: string;
    region: string;
    postal_code: string;
  };
  email: string;
};

export default function NidaRegistrationPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { registerNida, loading, error } = useNidaStore();
  const [formData, setFormData] = useState<FormData>({
    nida_number: '',
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
    updated_at: new Date().toISOString(),
    address: {
      street: '',
      city: '',
      region: '',
      postal_code: '',
    },
    email: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Only REGISTRAR can access this page
  if (!user || !user.functional_roles?.includes(UserRole.ADMIN)) {
    return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">Only Registrars can register new NIDA data.</p>
        </div>
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
        nida_number: '',
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
        updated_at: new Date().toISOString(),
        address: {
          street: '',
          city: '',
          region: '',
          postal_code: '',
        },
        email: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }) => {
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
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="block text-base font-medium text-gray-700">
                  First Name *
                </label>
                <Input
                  type="text"
                  name="first_name"
                  id="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="middle_name" className="block text-base font-medium text-gray-700">
                  Middle Name
                </label>
                <Input
                  type="text"
                  name="middle_name"
                  id="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-base font-medium text-gray-700">
                  Last Name *
                </label>
                <Input
                  type="text"
                  name="last_name"
                  id="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="other_names" className="block text-base font-medium text-gray-700">
                  Other Names
                </label>
                <Input
                  type="text"
                  name="other_names"
                  id="other_names"
                  value={formData.other_names}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="date_of_birth" className="block text-base font-medium text-gray-700">
                  Date of Birth *
                </label>
                <Input
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  required
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-base font-medium text-gray-700">
                  Gender *
                </label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onValueChange={(value) => handleChange({ target: { name: 'gender', value } })}
                >
                  <SelectTrigger className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="male" className="hover:bg-gray-100">Male</SelectItem>
                    <SelectItem value="female" className="hover:bg-gray-100">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="marital_status" className="block text-base font-medium text-gray-700">
                  Marital Status *
                </label>
                <Select
                  name="marital_status"
                  value={formData.marital_status}
                  onValueChange={(value) => handleChange({ target: { name: 'marital_status', value } })}
                >
                  <SelectTrigger className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value={MaritalStatus.SINGLE} className="hover:bg-gray-100">Single</SelectItem>
                    <SelectItem value={MaritalStatus.MARRIED} className="hover:bg-gray-100">Married</SelectItem>
                    <SelectItem value={MaritalStatus.DIVORCED} className="hover:bg-gray-100">Divorced</SelectItem>
                    <SelectItem value={MaritalStatus.WIDOWED} className="hover:bg-gray-100">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="employment_status" className="block text-base font-medium text-gray-700">
                  Employment Status *
                </label>
                <select
                  name="employment_status"
                  id="employment_status"
                  required
                  value={formData.employment_status}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value={EmploymentStatus.EMPLOYED}>Employed</option>
                  <option value={EmploymentStatus.SELF_EMPLOYED}>Self Employed</option>
                  <option value={EmploymentStatus.UNEMPLOYED}>Unemployed</option>
                </select>
              </div>

              <div>
                <label htmlFor="nationality" className="block text-base font-medium text-gray-700">
                  Nationality *
                </label>
                <Input
                  type="text"
                  name="nationality"
                  id="nationality"
                  required
                  value={formData.nationality}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900">Parent Information</h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="father_first_name" className="block text-base font-medium text-gray-700">
                  Father's First Name
                </label>
                <Input
                  type="text"
                  name="father_first_name"
                  id="father_first_name"
                  value={formData.father_first_name}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="father_last_name" className="block text-base font-medium text-gray-700">
                  Father's Last Name
                </label>
                <Input
                  type="text"
                  name="father_last_name"
                  id="father_last_name"
                  value={formData.father_last_name}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="mother_first_name" className="block text-base font-medium text-gray-700">
                  Mother's First Name
                </label>
                <Input
                  type="text"
                  name="mother_first_name"
                  id="mother_first_name"
                  value={formData.mother_first_name}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="mother_last_name" className="block text-base font-medium text-gray-700">
                  Mother's Last Name
                </label>
                <Input
                  type="text"
                  name="mother_last_name"
                  id="mother_last_name"
                  value={formData.mother_last_name}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900">Citizenship Information</h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="citizenship_type" className="block text-base font-medium text-gray-700">
                  Citizenship Type *
                </label>
                <select
                  name="citizenship_type"
                  id="citizenship_type"
                  required
                  value={formData.citizenship_type}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value={CitizenshipType.BIRTH}>Birth</option>
                  <option value={CitizenshipType.INHERITANCE}>Inheritance</option>
                  <option value={CitizenshipType.NATURALIZATION}>Naturalization</option>
                </select>
              </div>

              <div>
                <label htmlFor="birth_country" className="block text-base font-medium text-gray-700">
                  Birth Country *
                </label>
                <Input
                  type="text"
                  name="birth_country"
                  id="birth_country"
                  required
                  value={formData.birth_country}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="birth_region" className="block text-base font-medium text-gray-700">
                  Birth Region *
                </label>
                <Input
                  type="text"
                  name="birth_region"
                  id="birth_region"
                  required
                  value={formData.birth_region}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="birth_district" className="block text-base font-medium text-gray-700">
                  Birth District *
                </label>
                <Input
                  type="text"
                  name="birth_district"
                  id="birth_district"
                  required
                  value={formData.birth_district}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="birth_ward" className="block text-base font-medium text-gray-700">
                  Birth Ward *
                </label>
                <Input
                  type="text"
                  name="birth_ward"
                  id="birth_ward"
                  required
                  value={formData.birth_ward}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900">Residence Information</h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="current_residence_region" className="block text-base font-medium text-gray-700">
                  Current Residence Region *
                </label>
                <Input
                  type="text"
                  name="current_residence_region"
                  id="current_residence_region"
                  required
                  value={formData.current_residence_region}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="current_residence_district" className="block text-base font-medium text-gray-700">
                  Current Residence District *
                </label>
                <Input
                  type="text"
                  name="current_residence_district"
                  id="current_residence_district"
                  required
                  value={formData.current_residence_district}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="current_residence_ward" className="block text-base font-medium text-gray-700">
                  Current Residence Ward *
                </label>
                <Input
                  type="text"
                  name="current_residence_ward"
                  id="current_residence_ward"
                  required
                  value={formData.current_residence_ward}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="permanent_residence_region" className="block text-base font-medium text-gray-700">
                  Permanent Residence Region *
                </label>
                <Input
                  type="text"
                  name="permanent_residence_region"
                  id="permanent_residence_region"
                  required
                  value={formData.permanent_residence_region}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="permanent_residence_district" className="block text-base font-medium text-gray-700">
                  Permanent Residence District *
                </label>
                <Input
                  type="text"
                  name="permanent_residence_district"
                  id="permanent_residence_district"
                  required
                  value={formData.permanent_residence_district}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="permanent_residence_ward" className="block text-base font-medium text-gray-700">
                  Permanent Residence Ward *
                </label>
                <Input
                  type="text"
                  name="permanent_residence_ward"
                  id="permanent_residence_ward"
                  required
                  value={formData.permanent_residence_ward}
                  onChange={handleChange}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
    <div className="w-full px-4 sm:px-4 lg:px-4 bg-white">
      <div className="md:flex md:items-center md:justify-between py-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            NIDA Registration
          </h2>
          <p className="mt-2 text-base text-gray-500">
            Enter the citizen's NIDA registration details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8 bg-white rounded-lg">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="nida_number" className="block text-sm font-medium text-gray-700 mb-1">
              NIDA Number
            </label>
            <Input
              type="text"
              name="nida_number"
              id="nida_number"
              required
              value={formData.nida_number}
              onChange={handleChange}
              className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <Input
              type="text"
              name="first_name"
              id="first_name"
              required
              value={formData.first_name}
              onChange={handleChange}
              className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700 mb-1">
              Middle Name
            </label>
            <Input
              type="text"
              name="middle_name"
              id="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <Input
              type="text"
              name="last_name"
              id="last_name"
              required
              value={formData.last_name}
              onChange={handleChange}
              className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <Input
              type="date"
              name="date_of_birth"
              id="date_of_birth"
              required
              value={formData.date_of_birth}
              onChange={handleChange}
              className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <Select
              name="gender"
              value={formData.gender}
              onValueChange={(value) => handleChange({ target: { name: 'gender', value } })}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value="male" className="hover:bg-gray-100">Male</SelectItem>
                <SelectItem value="female" className="hover:bg-gray-100">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
              Nationality
            </label>
            <Input
              type="text"
              name="nationality"
              id="nationality"
              required
              value={formData.nationality}
              onChange={handleChange}
              className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700 mb-1">
              Marital Status
            </label>
            <Select
              name="marital_status"
              value={formData.marital_status}
              onValueChange={(value) => handleChange({ target: { name: 'marital_status', value } })}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value={MaritalStatus.SINGLE} className="hover:bg-gray-100">Single</SelectItem>
                <SelectItem value={MaritalStatus.MARRIED} className="hover:bg-gray-100">Married</SelectItem>
                <SelectItem value={MaritalStatus.DIVORCED} className="hover:bg-gray-100">Divorced</SelectItem>
                <SelectItem value={MaritalStatus.WIDOWED} className="hover:bg-gray-100">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <div className="mt-2 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <Input
                  type="text"
                  name="address.street"
                  id="address.street"
                  required
                  value={formData.address.street}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value }
                  }))}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input
                  type="text"
                  name="address.city"
                  id="address.city"
                  required
                  value={formData.address.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value }
                  }))}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="address.region" className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <Input
                  type="text"
                  name="address.region"
                  id="address.region"
                  required
                  value={formData.address.region}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, region: e.target.value }
                  }))}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="address.postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <Input
                  type="text"
                  name="address.postal_code"
                  id="address.postal_code"
                  required
                  value={formData.address.postal_code}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, postal_code: e.target.value }
                  }))}
                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Input
              type="tel"
              name="phone_number"
              id="phone_number"
              required
              value={formData.phone_number}
              onChange={handleChange}
              className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {(formError || error) && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
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
          <div className="rounded-md bg-green-50 p-4 border border-green-200">
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

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push('/nida/list')}
            className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Citizen'}
          </button>
        </div>
      </form>
    </div>
  );
} 