'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const { login, user } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    nida_number: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [step, setStep] = useState<'nida' | 'create-password' | 'login'>('nida');
  const [verifying, setVerifying] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push('/citizen/dashboard');
    }
  }, [user, router]);

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
        setStep('login');
      } else {
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
        await axios.post(`${baseURL}/citizen/${formData.nida_number}/password`, {
          password: formData.password
        });

        setFormError(null);
        setStep('login');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } catch (error: any) {
        console.error('Password setting error:', error);
        setFormError(error.response?.data?.message || error.message || 'Failed to set password. Please try again.');
      }
    } else {
      try {
        await login({ nida_number: formData.nida_number, password: formData.password });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border border-slate-200">
        <CardHeader className="space-y-1 border-b border-slate-200">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center ring-4 ring-blue-100">
            <LockClosedIcon className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-center font-bold text-slate-900">
            {step === 'nida' ? 'Verify NIDA Number' : 
             step === 'create-password' ? 'Create Password' : 
             'Citizen Login'}
          </CardTitle>
          <CardDescription className="text-center text-slate-500">
            {step === 'nida' ? 'Enter your NIDA number to continue' :
             step === 'create-password' ? 'Create a password for your account' :
             'Sign in to access your citizen dashboard'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={step === 'nida' ? handleNidaVerification : handlePasswordSubmit} className="space-y-4">
            {step === 'nida' && (
              <div className="space-y-2">
                <Label htmlFor="nida_number" className="text-slate-700">NIDA Number</Label>
                <Input
                  id="nida_number"
                  name="nida_number"
                  type="text"
                  required
                  placeholder="Enter your NIDA number"
                  value={formData.nida_number}
                  onChange={handleChange}
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            )}

            {(step === 'create-password' || step === 'login') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                {step === 'create-password' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                )}
              </>
            )}

            {formError && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">
                  {formError}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 border border-blue-600 hover:border-blue-700"
              disabled={verifying}
            >
              {verifying ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {step === 'nida' ? 'Verifying...' : 'Processing...'}
                </span>
              ) : (
                step === 'nida' ? 'Verify NIDA' :
                step === 'create-password' ? 'Create Password' :
                'Sign in'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 