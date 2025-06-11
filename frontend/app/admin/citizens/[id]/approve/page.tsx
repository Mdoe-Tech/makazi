'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { citizenService } from '@/lib/api/citizen/service';
import type { Citizen } from '@/lib/api/citizen/types';
import { use } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { UserRole } from '@/lib/api/auth/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ApproveCitizenPage({ params }: PageProps) {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [loadingCitizen, setLoadingCitizen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

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

  const handleApprove = async () => {
    if (!citizen) return;
    
    setApproving(true);
    try {
      await citizenService.approveCitizen(citizen.id);
      router.push('/admin/citizens');
    } catch (error) {
      console.error('Error approving citizen:', error);
      setError('Failed to approve citizen');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!citizen || !rejectionReason) return;
    
    setRejecting(true);
    try {
      await citizenService.rejectCitizen(citizen.id, rejectionReason);
      router.push('/admin/citizens');
    } catch (error) {
      console.error('Error rejecting citizen:', error);
      setError('Failed to reject citizen');
    } finally {
      setRejecting(false);
    }
  };

  if (!isClient || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Check if user has ADMIN or SUPER_ADMIN role
  const hasAdminRole = user.role === UserRole.ADMIN || 
    user.role === UserRole.SUPER_ADMIN || 
    (user.roles && (user.roles.includes(UserRole.ADMIN) || user.roles.includes(UserRole.SUPER_ADMIN)));

  if (!hasAdminRole) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">You don't have permission to approve citizens</div>
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
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Review Citizen Registration</h2>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {citizen.first_name} {citizen.middle_name} {citizen.last_name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">NIDA Number</h3>
                  <p className="mt-1 text-sm text-gray-900">{citizen.nida_number}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-sm text-gray-900">{citizen.email || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p className="mt-1 text-sm text-gray-900">{citizen.phone_number}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Rejection Reason (if rejecting)</h3>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows={3}
                  placeholder="Enter reason for rejection..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={handleReject}
                  disabled={rejecting || !rejectionReason}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  {rejecting ? 'Rejecting...' : 'Reject'}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={approving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {approving ? 'Approving...' : 'Approve'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
} 