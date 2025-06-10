'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { documentService } from '@/lib/api/documents/service';
import type { DocumentRequest, DocumentTemplate } from '@/lib/api/documents/types';
import { DocumentStatus } from '@/lib/api/documents/types';

export default function DocumentsPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
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
    const fetchData = async () => {
      try {
        const [requestsData, templatesData] = await Promise.all([
          documentService.getDocumentRequests(),
          documentService.getDocumentTemplates()
        ]);
        setRequests(requestsData);
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load documents data');
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchData();
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

  const handleDownload = async (id: string) => {
    try {
      await documentService.downloadDocument(id);
    } catch (error) {
      console.error('Error downloading document:', error);
      setError('Failed to download document');
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
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Document Services</h1>
          <p className="mt-2 text-sm text-gray-600">
            Request official documents and track their status
          </p>
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
          {/* Available Documents */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Available Documents</h2>
            <div className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{template.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{template.description}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Fee: TZS {template.fee}</span>
                        <span>Processing: {template.processing_time}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/citizen/documents/request/${template.type}`)}
                      className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Requests */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Requests</h2>
            {requests.length === 0 ? (
              <p className="text-sm text-gray-500">No document requests yet</p>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {request.document_type.replace(/_/g, ' ')}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{request.purpose}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Requested: {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {request.status === DocumentStatus.APPROVED && (
                        <button
                          onClick={() => handleDownload(request.id)}
                          className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 