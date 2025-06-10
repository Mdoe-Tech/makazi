'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { citizenService } from '@/lib/api/citizen/service';
import type { Citizen } from '@/lib/api/citizen/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building2, 
  Briefcase,
  Heart,
  Globe,
  FileText,
  CheckCircle2
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Citizen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await citizenService.getProfile();
        setProfile(data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout userType="citizen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="citizen">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout userType="citizen">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-700">No profile data found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="citizen">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-10 w-10 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.first_name} {profile.middle_name} {profile.last_name}
                </h1>
                <p className="text-gray-500">NIDA: {profile.nida_number}</p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={
                profile.registration_status === 'APPROVED' 
                  ? 'border-green-500 text-green-500'
                  : 'border-yellow-500 text-yellow-500'
              }
            >
              {profile.registration_status}
            </Badge>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{new Date(profile.date_of_birth).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{profile.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Marital Status</p>
                  <p className="font-medium capitalize">{profile.marital_status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nationality</p>
                  <p className="font-medium">{profile.nationality}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <p className="font-medium">{profile.phone_number}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <p className="font-medium">{profile.email}</p>
              </div>
              {profile.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">{profile.address.street}</p>
                    <p className="text-sm text-gray-500">
                      {profile.address.city}, {profile.address.region}
                    </p>
                    <p className="text-sm text-gray-500">{profile.address.postal_code}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Employment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Employment Status</p>
                  <p className="font-medium capitalize">{profile.employment_status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occupation</p>
                  <p className="font-medium">{profile.occupation || 'Not specified'}</p>
                </div>
                {profile.employer_name && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Employer</p>
                    <p className="font-medium">{profile.employer_name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">NIDA Verification</p>
                  <Badge 
                    variant="outline" 
                    className={profile.is_nida_verified ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}
                  >
                    {profile.is_nida_verified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>
                {profile.verification_data && (
                  <div>
                    <p className="text-sm text-gray-500">Match Score</p>
                    <p className="font-medium">{profile.verification_data.match_score}%</p>
                  </div>
                )}
              </div>
              {profile.verification_data?.details?.verified_fields && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Verified Fields</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.verification_data.details.verified_fields.map((field: string) => (
                      <Badge key={field} variant="secondary">
                        {field.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage; 