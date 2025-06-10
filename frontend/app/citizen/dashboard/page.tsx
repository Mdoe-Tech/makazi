'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { documentService } from '@/lib/api/documents/service';
import type { DocumentRequest } from '@/lib/api/documents/types';
import { DocumentStatus } from '@/lib/api/documents/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [recentRequests, setRecentRequests] = useState<DocumentRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !loading && !user) {
      router.push('/citizen/login');
    }
  }, [isClient, user, loading, router]);

  useEffect(() => {
    const fetchRecentRequests = async () => {
      try {
        const requests = await documentService.getDocumentRequests();
        // Get the 5 most recent requests
        setRecentRequests(requests.slice(0, 5));
      } catch (error) {
        console.error('Error fetching recent requests:', error);
        setError('Failed to load recent requests');
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchRecentRequests();
    }
  }, [user]);

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case DocumentStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!isClient || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (loadingData) {
    return (
      <DashboardLayout userType="citizen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="citizen">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back, {user.first_name}!
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Here's what's happening with your document requests
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/citizen/documents')}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Request Document
              </button>
              <button
                onClick={() => router.push('/citizen/profile')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Quick Stats */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="text-sm font-medium text-indigo-600">Total Requests</div>
                <div className="mt-1 text-2xl font-semibold text-indigo-900">
                  {recentRequests.length}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm font-medium text-green-600">Approved</div>
                <div className="mt-1 text-2xl font-semibold text-green-900">
                  {recentRequests.filter(r => r.status === DocumentStatus.APPROVED).length}
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-sm font-medium text-yellow-600">Pending</div>
                <div className="mt-1 text-2xl font-semibold text-yellow-900">
                  {recentRequests.filter(r => r.status === DocumentStatus.PENDING).length}
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-sm font-medium text-red-600">Rejected</div>
                <div className="mt-1 text-2xl font-semibold text-red-900">
                  {recentRequests.filter(r => r.status === DocumentStatus.REJECTED).length}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            {recentRequests.length === 0 ? (
              <p className="text-sm text-gray-500">No recent document requests</p>
            ) : (
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {request.document_type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{request.purpose}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => router.push('/citizen/documents')}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Request Document
            </button>
            <button
              onClick={() => router.push('/citizen/profile')}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Update Profile
            </button>
            <button
              onClick={() => router.push('/citizen/documents')}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              View Documents
            </button>
            <button
              onClick={() => router.push('/citizen/documents')}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Track Requests
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 