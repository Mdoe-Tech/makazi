'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { useCitizenStore } from '@/lib/store/citizen.store';
import { useNidaStore } from '@/lib/store/nida.store';
import { Gender, MaritalStatus, EmploymentStatus } from '@/lib/api/citizen/enums';
import { AdminRole } from '@/lib/api/admin/types';
import { UserRole } from '@/lib/api/auth/types';
import { citizenService } from '@/lib/api/citizen/service';
import { nidaService } from '@/lib/api/nida/service';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      postal_code: '41107'
    },
    other_names: '',
    marital_status: MaritalStatus.SINGLE,
    occupation: '',
    employer_name: '',
    employment_status: EmploymentStatus.UNEMPLOYED,
    birth_certificate_number: 'cw200411'
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    try {
      // First verify NIDA
      const nidaResponse = await verifyNida({ 
        nida_number: formData.nida_number,
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth
      });

      if (!nidaResponse.data.is_valid) {
        setFormError(nidaResponse.data.details?.reason || 'Invalid NIDA number');
        return;
      }

      // If NIDA is valid, proceed with registration
      const submitData = {
        ...formData,
        date_of_birth: new Date(formData.date_of_birth + 'T00:00:00.000Z')
      };
      await createCitizen(submitData);
      setSuccessMessage('Citizen registered successfully!');
      router.push('/admin/citizens');
    } catch (error: any) {
      setFormError(error.message || 'Failed to register citizen. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Only REGISTRAR can access this page
  if (!user || !user.functional_roles?.includes(UserRole.ADMIN)) {
    return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">Only Registrars can register new citizens.</p>
        </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-4 lg:px-4 bg-white">
      <div className="md:flex md:items-center md:justify-between py-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Register New Citizen
          </h2>
          <p className="mt-2 text-base text-gray-500">
            Enter the citizen's personal details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8 bg-white rounded-lg">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="nida_number" className="block text-sm font-medium text-gray-700 mb-1">
              NIDA number
            </label>
            <div className="mt-1">
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
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              First name
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
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Last name
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
            <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700 mb-1">
              Middle name
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
            <label htmlFor="other_names" className="block text-sm font-medium text-gray-700 mb-1">
              Other names
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

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of birth
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
                <SelectItem value="other" className="hover:bg-gray-100">Other</SelectItem>
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
              Marital status
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

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="employment_status" className="block text-sm font-medium text-gray-700 mb-1">
              Employment status
            </label>
            <Select
              name="employment_status"
              value={formData.employment_status}
              onValueChange={(value) => handleChange({ target: { name: 'employment_status', value } })}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value={EmploymentStatus.EMPLOYED} className="hover:bg-gray-100">Employed</SelectItem>
                <SelectItem value={EmploymentStatus.UNEMPLOYED} className="hover:bg-gray-100">Unemployed</SelectItem>
                <SelectItem value={EmploymentStatus.SELF_EMPLOYED} className="hover:bg-gray-100">Self Employed</SelectItem>
                <SelectItem value={EmploymentStatus.STUDENT} className="hover:bg-gray-100">Student</SelectItem>
                <SelectItem value={EmploymentStatus.RETIRED} className="hover:bg-gray-100">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
              Occupation
            </label>
            <Input
              type="text"
              name="occupation"
              id="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="employer_name" className="block text-sm font-medium text-gray-700 mb-1">
              Employer name
            </label>
            <Input
              type="text"
              name="employer_name"
              id="employer_name"
              value={formData.employer_name}
              onChange={handleChange}
              className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
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
              Phone number
            </label>
            <Input
              type="tel"
              name="phone_number"
              id="phone_number"
              required
              placeholder="+255XXXXXXXXX"
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

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="birth_certificate_number" className="block text-sm font-medium text-gray-700 mb-1">
              Birth certificate number
            </label>
            <Input
              type="text"
              name="birth_certificate_number"
              id="birth_certificate_number"
              required
              value={formData.birth_certificate_number}
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
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
            onClick={() => router.push('/citizen/list')}
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