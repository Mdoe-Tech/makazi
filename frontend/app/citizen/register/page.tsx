'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { useCitizenStore } from '@/lib/store/citizen.store';
import { useNidaStore } from '@/lib/store/nida.store';
import { Gender, MaritalStatus, EmploymentStatus } from '@/lib/api/citizen/types';
import { AdminRole } from '@/lib/api/admin/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { citizenService } from '@/lib/api/citizen/service';
import { nidaService } from '@/lib/api/nida/service';

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
    nida_number: '17492258534876078',
    first_name: 'John',
    last_name: 'Mdoe',
    middle_name: 'Peter',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Only REGISTRAR can access this page
  if (!user || (user.role as string) !== 'REGISTRAR') {
    return (
      <DashboardLayout userType="admin">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">Only Registrars can register new citizens.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Register New Citizen
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the citizen's personal details.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="nida_number" className="block text-sm font-medium text-gray-700">
                      NIDA number
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        name="nida_number"
                        id="nida_number"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formData.nida_number}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                      First name
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

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                      Last name
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

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">
                      Middle name
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

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="other_names" className="block text-sm font-medium text-gray-700">
                      Other names
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

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                      Date of birth
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

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                      Nationality
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

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700">
                      Marital status
                    </label>
                    <select
                      id="marital_status"
                      name="marital_status"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.marital_status}
                      onChange={handleChange}
                    >
                      <option value={MaritalStatus.SINGLE}>Single</option>
                      <option value={MaritalStatus.MARRIED}>Married</option>
                      <option value={MaritalStatus.DIVORCED}>Divorced</option>
                      <option value={MaritalStatus.WIDOWED}>Widowed</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="employment_status" className="block text-sm font-medium text-gray-700">
                      Employment status
                    </label>
                    <select
                      id="employment_status"
                      name="employment_status"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.employment_status}
                      onChange={handleChange}
                    >
                      <option value={EmploymentStatus.EMPLOYED}>Employed</option>
                      <option value={EmploymentStatus.UNEMPLOYED}>Unemployed</option>
                      <option value={EmploymentStatus.SELF_EMPLOYED}>Self Employed</option>
                      <option value={EmploymentStatus.STUDENT}>Student</option>
                      <option value={EmploymentStatus.RETIRED}>Retired</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      id="occupation"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.occupation}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="employer_name" className="block text-sm font-medium text-gray-700">
                      Employer name
                    </label>
                    <input
                      type="text"
                      name="employer_name"
                      id="employer_name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.employer_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="address.street"
                          id="address.street"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={formData.address.street}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            address: { ...prev.address, street: e.target.value }
                          }))}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          name="address.city"
                          id="address.city"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={formData.address.city}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            address: { ...prev.address, city: e.target.value }
                          }))}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="address.region" className="block text-sm font-medium text-gray-700">
                          Region
                        </label>
                        <input
                          type="text"
                          name="address.region"
                          id="address.region"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={formData.address.region}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            address: { ...prev.address, region: e.target.value }
                          }))}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="address.postal_code" className="block text-sm font-medium text-gray-700">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="address.postal_code"
                          id="address.postal_code"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={formData.address.postal_code}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            address: { ...prev.address, postal_code: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      id="phone_number"
                      required
                      placeholder="+255XXXXXXXXX"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="birth_certificate_number" className="block text-sm font-medium text-gray-700">
                      Birth certificate number
                    </label>
                    <input
                      type="text"
                      name="birth_certificate_number"
                      id="birth_certificate_number"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.birth_certificate_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(formError || error) && (
            <div className="rounded-md bg-red-50 p-4">
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

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/citizen/list')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Citizen'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
} 