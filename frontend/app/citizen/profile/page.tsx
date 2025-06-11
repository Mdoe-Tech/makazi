'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-700">No profile data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {profile.first_name} {profile.middle_name} {profile.last_name}
              </h1>
              <p className="text-slate-500">NIDA: {profile.nida_number}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={
              profile.registration_status === 'APPROVED' 
                ? 'border-emerald-500 text-emerald-500'
                : 'border-amber-500 text-amber-500'
            }
          >
            {profile.registration_status}
          </Badge>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <User className="h-5 w-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Date of Birth</p>
                <p className="font-medium text-slate-900">{new Date(profile.date_of_birth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Gender</p>
                <p className="font-medium text-slate-900 capitalize">{profile.gender}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Marital Status</p>
                <p className="font-medium text-slate-900 capitalize">{profile.marital_status}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Nationality</p>
                <p className="font-medium text-slate-900">{profile.nationality}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Mail className="h-5 w-5 text-blue-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-500" />
              <p className="font-medium text-slate-900">{profile.phone_number}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-500" />
              <p className="font-medium text-slate-900">{profile.email}</p>
            </div>
            {profile.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                <div>
                  <p className="font-medium text-slate-900">{profile.address.street}</p>
                  <p className="text-sm text-slate-500">
                    {profile.address.city}, {profile.address.region}
                  </p>
                  <p className="text-sm text-slate-500">{profile.address.postal_code}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card className="border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Employment Status</p>
                <p className="font-medium text-slate-900 capitalize">{profile.employment_status}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Occupation</p>
                <p className="font-medium text-slate-900">{profile.occupation || 'Not specified'}</p>
              </div>
              {profile.employer_name && (
                <div className="col-span-2">
                  <p className="text-sm text-slate-500">Employer</p>
                  <p className="font-medium text-slate-900">{profile.employer_name}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card className="border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">NIDA Verification</p>
                <Badge 
                  variant="outline" 
                  className={profile.is_nida_verified ? 'border-emerald-500 text-emerald-500' : 'border-red-500 text-red-500'}
                >
                  {profile.is_nida_verified ? 'Verified' : 'Not Verified'}
                </Badge>
              </div>
              {profile.verification_data && (
                <div>
                  <p className="text-sm text-slate-500">Match Score</p>
                  <p className="font-medium text-slate-900">{profile.verification_data.match_score}%</p>
                </div>
              )}
            </div>
            {profile.verification_data?.details?.verified_fields && (
              <div>
                <p className="text-sm text-slate-500 mb-2">Verified Fields</p>
                <div className="flex flex-wrap gap-2">
                  {profile.verification_data.details.verified_fields.map((field: string) => (
                    <Badge key={field} variant="secondary" className="bg-slate-100 text-slate-700">
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
  );
};

export default ProfilePage; 