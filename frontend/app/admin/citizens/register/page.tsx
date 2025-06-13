'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { useCitizenStore } from '@/lib/store/citizen.store';
import { useNidaStore } from '@/lib/store/nida.store';
import {
  Gender,
  MaritalStatus,
  EmploymentStatus,
} from '@/lib/api/citizen/enums';
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
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  UserPlus,
} from 'lucide-react';

interface FormData {
  nida_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: string;
  gender: Gender;
  nationality: string;
  email?: string;
  phone_number: string;
  address: {
    street: string;
    city: string;
    region: string;
    postal_code: string;
  };
  other_names?: string;
  marital_status: MaritalStatus;
  occupation?: string;
  employer_name?: string;
  employment_status?: EmploymentStatus;
  birth_certificate_number: string;
  father_date_of_birth?: string;
  mother_date_of_birth?: string;
}

export default function CitizenRegistrationPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createCitizen, loading, error } = useCitizenStore();
  const { verifyNida } = useNidaStore();

  const [formData, setFormData] = useState<FormData>({
    nida_number: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    date_of_birth: '1999-11-21',
    gender: 'male' as Gender,
    nationality: 'Tanzania',
    email: '',
    phone_number: '+255710647374',
    address: {
      street: 'Mikocheni Street',
      city: 'Dar es Salaam',
      region: 'Dar es Salaam',
      postal_code: '41107',
    },
    other_names: '',
    marital_status: MaritalStatus.SINGLE,
    occupation: '',
    employer_name: '',
    employment_status: EmploymentStatus.UNEMPLOYED,
    birth_certificate_number: 'cw200411',
    father_date_of_birth: '',
    mother_date_of_birth: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Core logic remains untouched
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    try {
      const nidaResponse = await verifyNida({
        nida_number: formData.nida_number,
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
      });

      if (!nidaResponse.data.data.is_valid) {
        setFormError(
          nidaResponse.data.data.details?.reason || 'Invalid NIDA data provided.',
        );
        return;
      }

      const submitData = {
        ...formData,
        date_of_birth: new Date(formData.date_of_birth),
        father_date_of_birth: formData.father_date_of_birth
          ? new Date(formData.father_date_of_birth)
          : undefined,
        mother_date_of_birth: formData.mother_date_of_birth
          ? new Date(formData.mother_date_of_birth)
          : undefined,
      };

      await createCitizen(submitData);
      setSuccessMessage('Citizen registered successfully!');
      router.push('/admin/citizens');
    } catch (err: any) {
      console.error('Registration error:', err);
      const message =
        err.response?.data?.message || err.message || 'An unknown error occurred.';
      setFormError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    name: keyof FormData,
    value: Gender | MaritalStatus | EmploymentStatus,
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name.split('.')[1] as keyof FormData['address'];
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  // Styled access denied page
  if (!user || !user.role?.includes(UserRole.ADMIN)) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-900">
        <Alert className="max-w-md border-l-4 border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          <AlertTitle className="font-bold text-red-900 dark:text-red-100">
            Access Denied
          </AlertTitle>
          <AlertDescription>
            Only Registrars can register new citizens.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Shared styling for form inputs for consistency
  const inputStyles =
    'bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 focus:border-indigo-500';
  const labelStyles = 'text-slate-700 dark:text-slate-300 font-semibold';
  const selectContentStyles =
    'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600';

  return (
    <div className="flex min-h-screen w-full items-center justify-center dark:bg-slate-900 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl">
        <Card className="w-full border-2 border-slate-200 bg-white shadow-2xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80 shadow-slate-400/20 dark:shadow-black/30">
          <CardHeader className="border-b-2 border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/50">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-3xl">
              Register New Citizen
            </CardTitle>
            <CardDescription className="!mt-2 text-slate-500 dark:text-slate-400">
              Enter citizen details. NIDA information will be verified before
              registration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-6 md:p-8">
            {/* --- Personal Information Section --- */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
                  Verification & Identity
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  NIDA number, name, and date of birth are required for
                  verification.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:col-span-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="nida_number" className={labelStyles}>NIDA Number *</Label>
                  <Input id="nida_number" name="nida_number" required value={formData.nida_number} onChange={handleChange} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="first_name" className={labelStyles}>First Name *</Label>
                  <Input id="first_name" name="first_name" required value={formData.first_name} onChange={handleChange} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className={labelStyles}>Last Name *</Label>
                  <Input id="last_name" name="last_name" required value={formData.last_name} onChange={handleChange} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middle_name" className={labelStyles}>Middle Name</Label>
                  <Input id="middle_name" name="middle_name" value={formData.middle_name} onChange={handleChange} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth" className={labelStyles}>Date of Birth *</Label>
                  <Input id="date_of_birth" name="date_of_birth" type="date" required value={formData.date_of_birth} onChange={handleChange} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className={labelStyles}>Gender *</Label>
                  <Select name="gender" required value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v as Gender)}>
                    <SelectTrigger className={inputStyles}><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent className={selectContentStyles}><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality" className={labelStyles}>Nationality *</Label>
                  <Input id="nationality" name="nationality" required value={formData.nationality} onChange={handleChange} className={inputStyles} />
                </div>
              </div>
            </div>

            {/* --- Contact & Address Section --- */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 border-t border-slate-200 pt-8 dark:border-slate-700 md:grid-cols-3">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
                  Contact & Address
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Provide contact and residential information.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:col-span-2">
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className={labelStyles}>Phone Number *</Label>
                  <Input id="phone_number" name="phone_number" type="tel" required value={formData.phone_number} onChange={handleChange} className={inputStyles} placeholder="+255..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className={labelStyles}>Email Address *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={inputStyles} placeholder="name@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.street" className={labelStyles}>Street Address *</Label>
                  <Input id="address.street" name="address.street" required value={formData.address.street} onChange={handleAddressChange} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.city" className={labelStyles}>City *</Label>
                  <Input id="address.city" name="address.city" required value={formData.address.city} onChange={handleAddressChange} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.region" className={labelStyles}>Region *</Label>
                  <Input id="address.region" name="address.region" required value={formData.address.region} onChange={handleAddressChange} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.postal_code" className={labelStyles}>Postal Code *</Label>
                  <Input id="address.postal_code" name="address.postal_code" required value={formData.address.postal_code} onChange={handleAddressChange} className={inputStyles} />
                </div>
              </div>
            </div>

            {/* --- Additional Information Section --- */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 border-t border-slate-200 pt-8 dark:border-slate-700 md:grid-cols-3">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
                  Additional Details
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Provide other relevant personal information.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:col-span-2">
                <div className="space-y-2">
                  <Label htmlFor="marital_status" className={labelStyles}>Marital Status *</Label>
                  <Select name="marital_status" required value={formData.marital_status} onValueChange={(v) => handleSelectChange('marital_status', v as MaritalStatus)}>
                    <SelectTrigger className={inputStyles}><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent className={selectContentStyles}><SelectItem value={MaritalStatus.SINGLE}>Single</SelectItem><SelectItem value={MaritalStatus.MARRIED}>Married</SelectItem><SelectItem value={MaritalStatus.DIVORCED}>Divorced</SelectItem><SelectItem value={MaritalStatus.WIDOWED}>Widowed</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employment_status" className={labelStyles}>Employment Status</Label>
                  <Select name="employment_status" value={formData.employment_status} onValueChange={(v) => handleSelectChange('employment_status', v as EmploymentStatus)}>
                    <SelectTrigger className={inputStyles}><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent className={selectContentStyles}><SelectItem value={EmploymentStatus.EMPLOYED}>Employed</SelectItem><SelectItem value={EmploymentStatus.UNEMPLOYED}>Unemployed</SelectItem><SelectItem value={EmploymentStatus.SELF_EMPLOYED}>Self Employed</SelectItem><SelectItem value={EmploymentStatus.STUDENT}>Student</SelectItem><SelectItem value={EmploymentStatus.RETIRED}>Retired</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation" className={labelStyles}>Occupation</Label>
                  <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleChange} className={inputStyles} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth_certificate_number" className={labelStyles}>Birth Certificate No. *</Label>
                  <Input id="birth_certificate_number" name="birth_certificate_number" required value={formData.birth_certificate_number} onChange={handleChange} className={inputStyles} />
                </div>
              </div>
            </div>

            {/* --- Alerts --- */}
            <div className="space-y-4 pt-4">
              {(formError || error) && (
                <Alert className="border-l-4 border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <AlertTitle className="font-bold text-red-900 dark:text-red-100">
                    Registration Error
                  </AlertTitle>
                  <AlertDescription>{formError || 'An unexpected error occurred.'}</AlertDescription>
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
          </CardContent>
          <CardFooter className="flex justify-end space-x-4 border-t-2 border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/50">
            <Button
              type="button"
              onClick={() => router.back()}
              className="border-2 border-slate-400 bg-white text-slate-600 hover:border-slate-500 hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="border-2 border-indigo-700 bg-indigo-600 text-white hover:bg-indigo-700 disabled:border-indigo-400 disabled:bg-indigo-300"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Registering...' : 'Register Citizen'}
              {!loading && <UserPlus className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}