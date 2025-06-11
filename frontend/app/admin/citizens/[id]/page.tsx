'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { citizenService } from '@/lib/api/citizen/service';
import type { Citizen } from '@/lib/api/citizen/types';
import { RegistrationStatus } from '@/lib/api/citizen/enums';
import { CheckCircle, XCircle, Clock, AlertCircle, FileText, User, Mail, Phone, MapPin, Calendar, Briefcase, Building } from 'lucide-react';
import { use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CitizenDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [loadingCitizen, setLoadingCitizen] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params outside of any try/catch
  const { id } = use(params);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !loading && !user) {
      router.push('/login');
    }
  }, [isClient, user, loading, router]);

  useEffect(() => {
    const fetchCitizen = async () => {
      try {
        const response = await citizenService.getCitizen(id);
        console.log('Raw response:', response);
        
        if (response) {
          console.log('Setting citizen data:', response);
          setCitizen(response);
        } else {
          console.log('No citizen data found in response');
          setError('Citizen not found');
        }
      } catch (error) {
        console.error('Error fetching citizen:', error);
        setError('Failed to load citizen details');
      } finally {
        setLoadingCitizen(false);
      }
    };

    if (user) {
      fetchCitizen();
    }
  }, [user, id]);

  const getStatusColor = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.APPROVED:
        return 'text-green-600 bg-green-50';
      case RegistrationStatus.REJECTED:
        return 'text-red-600 bg-red-50';
      case RegistrationStatus.PENDING:
        return 'text-yellow-600 bg-yellow-50';
      case RegistrationStatus.NIDA_VERIFICATION:
        return 'text-blue-600 bg-blue-50';
      case RegistrationStatus.BIOMETRIC_VERIFICATION:
        return 'text-purple-600 bg-purple-50';
      case RegistrationStatus.DOCUMENT_VERIFICATION:
        return 'text-indigo-600 bg-indigo-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.APPROVED:
        return <CheckCircle className="w-5 h-5" />;
      case RegistrationStatus.REJECTED:
        return <XCircle className="w-5 h-5" />;
      case RegistrationStatus.PENDING:
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (!isClient || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (loadingCitizen) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
  }

  if (error || !citizen) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">{error || 'Citizen not found'}</div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Citizen Details</h1>
          <button
            onClick={() => router.push('/admin/citizens')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Back to Citizens
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(citizen.registration_status as RegistrationStatus)}`}>
            {getStatusIcon(citizen.registration_status as RegistrationStatus)}
            <span className="ml-1.5">{citizen.registration_status}</span>
          </span>
          <span className="text-sm text-gray-500">
            Registered on {new Date(citizen.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Full Name</p>
                  <p className="text-sm text-gray-500">
                    {citizen.first_name} {citizen.middle_name} {citizen.last_name}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Date of Birth</p>
                  <p className="text-sm text-gray-500">
                    {new Date(citizen.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">NIDA Number</p>
                  <p className="text-sm text-gray-500">{citizen.nida_number}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">{citizen.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Phone Number</p>
                  <p className="text-sm text-gray-500">{citizen.phone_number}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Address Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Street Address</p>
                  <p className="text-sm text-gray-500">{citizen.address?.street || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">City</p>
                  <p className="text-sm text-gray-500">{citizen.address?.city || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Region</p>
                  <p className="text-sm text-gray-500">{citizen.address?.region || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Postal Code</p>
                  <p className="text-sm text-gray-500">{citizen.address?.postal_code || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Occupation</p>
                  <p className="text-sm text-gray-500">{citizen.occupation || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Employer</p>
                  <p className="text-sm text-gray-500">{citizen.employer_name || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Employment Status</p>
                  <p className="text-sm text-gray-500">{citizen.employment_status || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Marital Status</p>
                  <p className="text-sm text-gray-500">{citizen.marital_status}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Birth Certificate Number</p>
                  <p className="text-sm text-gray-500">{citizen.birth_certificate_number}</p>
                </div>
              </div>
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Other Names</p>
                  <p className="text-sm text-gray-500">{citizen.other_names || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          {citizen.registration_status === RegistrationStatus.PENDING && (
            <>
              <button
                onClick={() => router.push(`/admin/citizens/${citizen.id}/approve`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve Registration
              </button>
              <button
                onClick={() => router.push(`/admin/citizens/${citizen.id}/reject`)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject Registration
              </button>
            </>
          )}
        </div>
      </div>
  );
} 