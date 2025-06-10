'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import axios from 'axios';

interface VerificationResponse {
  data: {
    data: {
      exists: boolean;
      hasPassword: boolean;
      citizen: {
        id: string;
        first_name: string;
        last_name: string;
        nida_number: string;
      };
    }
  }
}

interface FormData {
  nida_number: string;
  password: string;
  confirmPassword: string;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30002/api';

export default function CitizenLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    nida_number: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [step, setStep] = useState<'nida' | 'create-password' | 'login'>('nida');
  const [verifying, setVerifying] = useState(false);

  const handleNidaVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setVerifying(true);

    try {
      const response = await axios.get<VerificationResponse>(`${baseURL}/citizen/verify/${formData.nida_number}`);
      const { exists, hasPassword } = response.data.data.data;

      if (!exists) {
        setFormError('NIDA number not found. Please check and try again.');
        return;
      }

      if (hasPassword) {
        // If password exists, go to login step
        setStep('login');
      } else {
        // If no password, go to create password step
        setStep('create-password');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setFormError(error.response?.data?.message || 'Failed to verify NIDA number. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (step === 'create-password') {
      if (formData.password !== formData.confirmPassword) {
        setFormError('Passwords do not match');
        return;
      }

      try {
        // Create password without authentication
        await axios.post(`${baseURL}/citizen/${formData.nida_number}/password`, {
          password: formData.password
        });

        // Show success message and go to login step
        setFormError(null);
        setStep('login');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } catch (error: any) {
        console.error('Password setting error:', error);
        setFormError(error.response?.data?.message || error.message || 'Failed to set password. Please try again.');
      }
    } else {
      // Handle regular login
      try {
        await login({ nida_number: formData.nida_number, password: formData.password });
        // Redirection is handled in the auth store
      } catch (error: any) {
        console.error('Login error:', error);
        setFormError(error.response?.data?.message || error.message || 'Failed to login. Please try again.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 'nida' ? 'Verify NIDA Number' : 
             step === 'create-password' ? 'Create Password' : 
             'Citizen Login'}
          </h2>
        </div>

        <form onSubmit={step === 'nida' ? handleNidaVerification : handlePasswordSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            {step === 'nida' && (
              <div>
                <label htmlFor="nida_number" className="sr-only">NIDA Number</label>
                <input
                  id="nida_number"
                  name="nida_number"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter NIDA Number"
                  value={formData.nida_number}
                  onChange={handleChange}
                />
              </div>
            )}

            {step === 'create-password' && (
              <>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {step === 'login' && (
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {formError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{formError}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={verifying}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {verifying ? 'Verifying...' : 
               step === 'nida' ? 'Verify NIDA' :
               step === 'create-password' ? 'Set Password' :
               'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 