'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { useNidaStore } from '@/lib/store/nida.store';
import {
  CitizenshipType,
  EmploymentStatus,
  Gender,
  MaritalStatus,
} from '@/lib/api/nida/types';
import { UserRole } from '@/lib/api/auth/types';

// Shadcn/ui and icon imports
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/progress';
import {
  AlertCircle,
  CheckCircle2,
  ChevronsRight,
  Loader2,
  ShieldAlert,
} from 'lucide-react';

// NOTE: All your types (FormData, etc.) and store imports remain the same.
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
    updated_at: new Date().toISOString(),
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const stepTitles = ['Personal Info', 'Parent Info', 'Citizenship', 'Residence'];

  if (!user || !user.role?.includes(UserRole.ADMIN)) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-900">
        <Alert className="max-w-md border-l-4 border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          <AlertTitle className="font-bold text-red-900 dark:text-red-100">
            Access Denied
          </AlertTitle>
          <AlertDescription>
            You do not have the necessary permissions to view this page. Only
            Registrars can register new NIDA data.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!formData.date_of_birth) {
      setFormError('Date of birth is required');
      return;
    }

    try {
      await registerNida({ ...formData });
      setSuccessMessage('NIDA data registered successfully!');
      // Reset form logic remains unchanged...
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
        updated_at: new Date().toISOString(),
      });
      setCurrentStep(1);
    } catch (error: any) {
      console.error('Registration failed:', error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An unknown error occurred.';
      setFormError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const renderStep = () => {
    const inputStyles =
      'bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 focus:border-indigo-500';
    const labelStyles = 'text-slate-700 dark:text-slate-300';
    const sectionTitleStyles =
      'text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-200';

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className={sectionTitleStyles}>Personal Information</h3>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name" className={labelStyles}>First Name *</Label>
                <Input id="first_name" name="first_name" required value={formData.first_name} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middle_name" className={labelStyles}>Middle Name</Label>
                <Input id="middle_name" name="middle_name" value={formData.middle_name} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className={labelStyles}>Last Name *</Label>
                <Input id="last_name" name="last_name" required value={formData.last_name} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_names" className={labelStyles}>Other Names</Label>
                <Input id="other_names" name="other_names" value={formData.other_names} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className={labelStyles}>Date of Birth *</Label>
                <Input id="date_of_birth" name="date_of_birth" type="date" required value={formData.date_of_birth} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className={labelStyles}>Gender *</Label>
                <Select name="gender" required value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)}>
                  <SelectTrigger className={inputStyles}><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent className="border-2 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"><SelectItem value={Gender.MALE}>Male</SelectItem><SelectItem value={Gender.FEMALE}>Female</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="marital_status" className={labelStyles}>Marital Status *</Label>
                <Select name="marital_status" required value={formData.marital_status} onValueChange={(v) => handleSelectChange('marital_status', v)}>
                  <SelectTrigger className={inputStyles}><SelectValue placeholder="Select marital status" /></SelectTrigger>
                  <SelectContent className="border-2 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"><SelectItem value={MaritalStatus.SINGLE}>Single</SelectItem><SelectItem value={MaritalStatus.MARRIED}>Married</SelectItem><SelectItem value={MaritalStatus.WIDOWED}>Widowed</SelectItem><SelectItem value={MaritalStatus.DIVORCED}>Divorced</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employment_status" className={labelStyles}>Employment Status *</Label>
                <Select name="employment_status" required value={formData.employment_status} onValueChange={(v) => handleSelectChange('employment_status', v)}>
                  <SelectTrigger className={inputStyles}><SelectValue placeholder="Select employment status" /></SelectTrigger>
                  <SelectContent className="border-2 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"><SelectItem value={EmploymentStatus.EMPLOYED}>Employed</SelectItem><SelectItem value={EmploymentStatus.SELF_EMPLOYED}>Self Employed</SelectItem><SelectItem value={EmploymentStatus.UNEMPLOYED}>Unemployed</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="nationality" className={labelStyles}>Nationality *</Label>
                <Input id="nationality" name="nationality" required value={formData.nationality} onChange={handleChange} className={inputStyles} />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className={sectionTitleStyles}>Parent Information</h3>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="father_first_name" className={labelStyles}>Father's First Name</Label>
                <Input id="father_first_name" name="father_first_name" value={formData.father_first_name} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father_last_name" className={labelStyles}>Father's Last Name</Label>
                <Input id="father_last_name" name="father_last_name" value={formData.father_last_name} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother_first_name" className={labelStyles}>Mother's First Name</Label>
                <Input id="mother_first_name" name="mother_first_name" value={formData.mother_first_name} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother_last_name" className={labelStyles}>Mother's Last Name</Label>
                <Input id="mother_last_name" name="mother_last_name" value={formData.mother_last_name} onChange={handleChange} className={inputStyles} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className={sectionTitleStyles}>Citizenship Information</h3>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="citizenship_type" className={labelStyles}>Citizenship Type *</Label>
                <Select name="citizenship_type" required value={formData.citizenship_type} onValueChange={(v) => handleSelectChange('citizenship_type', v)}>
                  <SelectTrigger className={inputStyles}><SelectValue placeholder="Select citizenship type" /></SelectTrigger>
                  <SelectContent className="border-2 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"><SelectItem value={CitizenshipType.BIRTH}>Birth</SelectItem><SelectItem value={CitizenshipType.INHERITANCE}>Inheritance</SelectItem><SelectItem value={CitizenshipType.NATURALIZATION}>Naturalization</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_country" className={labelStyles}>Birth Country *</Label>
                <Input id="birth_country" name="birth_country" required value={formData.birth_country} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_region" className={labelStyles}>Birth Region *</Label>
                <Input id="birth_region" name="birth_region" required value={formData.birth_region} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_district" className={labelStyles}>Birth District *</Label>
                <Input id="birth_district" name="birth_district" required value={formData.birth_district} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="birth_ward" className={labelStyles}>Birth Ward *</Label>
                <Input id="birth_ward" name="birth_ward" required value={formData.birth_ward} onChange={handleChange} className={inputStyles} />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className={sectionTitleStyles}>Residence Information</h3>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="current_residence_region" className={labelStyles}>Current Residence Region *</Label>
                <Input id="current_residence_region" name="current_residence_region" required value={formData.current_residence_region} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_residence_district" className={labelStyles}>Current Residence District *</Label>
                <Input id="current_residence_district" name="current_residence_district" required value={formData.current_residence_district} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="current_residence_ward" className={labelStyles}>Current Residence Ward *</Label>
                <Input id="current_residence_ward" name="current_residence_ward" required value={formData.current_residence_ward} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="permanent_residence_region" className={labelStyles}>Permanent Residence Region *</Label>
                <Input id="permanent_residence_region" name="permanent_residence_region" required value={formData.permanent_residence_region} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="permanent_residence_district" className={labelStyles}>Permanent Residence District *</Label>
                <Input id="permanent_residence_district" name="permanent_residence_district" required value={formData.permanent_residence_district} onChange={handleChange} className={inputStyles} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="permanent_residence_ward" className={labelStyles}>Permanent Residence Ward *</Label>
                <Input id="permanent_residence_ward" name="permanent_residence_ward" required value={formData.permanent_residence_ward} onChange={handleChange} className={inputStyles} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center dark:bg-slate-900 sm:p-6 lg:p-8">
      <Card className="w-full max-w-4xl-xl border-2 border-slate-200 bg-white shadow-2xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80 dark:shadow-black/30 shadow-slate-400/20">
        <CardHeader className="border-b-2 border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/50">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-3xl">
            NIDA Registration Portal
          </CardTitle>
          <CardDescription className="!mt-2 text-slate-500 dark:text-slate-400">
            Please fill the multi-step form to register a new citizen.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between px-1">
              {stepTitles.map((title, index) => (
                <div
                  key={title}
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    currentStep > index
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {title}
                </div>
              ))}
            </div>
            <Progress
              value={(currentStep / totalSteps) * 100}
              className="h-2 w-full bg-slate-200 dark:bg-slate-700"
              indicatorClassName="bg-indigo-600 dark:bg-indigo-500"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="min-h-[380px]">{renderStep()}</div>

            <div className="mt-6 space-y-4">
              {(formError || error) && (
                <Alert className="border-l-4 border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <AlertTitle className="font-bold text-red-900 dark:text-red-100">
                    Registration Error
                  </AlertTitle>
                  <AlertDescription>{formError || error}</AlertDescription>
                </Alert>
              )}
              {successMessage && (
                <Alert className="border-l-4 border-green-500 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <AlertTitle className="font-bold text-green-900 dark:text-green-100">
                    Success!
                  </AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between border-t-2 border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/50">
          <Button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            className="border-2 border-slate-400 bg-white text-slate-600 hover:border-slate-500 hover:bg-slate-100 disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              className="border-2 border-indigo-700 bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Next <ChevronsRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="border-2 border-green-700 bg-green-600 text-white hover:bg-green-700 disabled:border-green-400 disabled:bg-green-300"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Registering...' : 'Complete Registration'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}