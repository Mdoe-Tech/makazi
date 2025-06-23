'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { authService } from '@/lib/api/auth/service';
import type { User, AuthResponse } from '@/lib/api/auth/types';

export default function CreateSuperAdminPage() {
  const router = useRouter();
  const { register, loading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await authService.registerFirstSuperAdmin({
        username: formData.username,
        nida_number: formData.username,
        password: formData.password,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-2">Create Super Admin User</h2>
          <p className="text-gray-600 text-base">This will create a super admin user with full system privileges.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
              <Input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
              <Input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <Input id="username" name="username" type="text" required value={formData.username} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number</Label>
              <Input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50 border border-blue-700" disabled={loading}>
            {loading ? 'Creating Admin...' : 'Create Admin'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline text-sm">&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 