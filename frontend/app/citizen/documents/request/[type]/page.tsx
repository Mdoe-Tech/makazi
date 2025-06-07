'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { documentService } from '@/lib/api/documents/service';
import type { DocumentTemplate } from '@/lib/api/documents/types';
import { DocumentType } from '@/lib/api/documents/types';

export default function DocumentRequestPage({ params }: { params: { type: string } }) {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
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
    const fetchTemplate = async () => {
      try {
        const data = await documentService.getDocumentTemplate(params.type as DocumentType);
        setTemplate(data);
      } catch (error) {
        console.error('Error fetching template:', error);
        setError('Failed to load document template');
      } finally {
        setLoadingTemplate(false);
      }
    };

    if (user) {
      fetchTemplate();
    }
  }, [user, params.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;

    setSubmitting(true);
    setError(null);

    try {
      await documentService.requestDocument({
        document_type: template.type,
        purpose
      });
      router.push('/citizen/dashboard');
    } catch (error) {
      console.error('Error requesting document:', error);
      setError('Failed to submit document request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isClient || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (loadingTemplate) {
    return (
      <DashboardLayout userType="citizen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!template) {
    return (
      <DashboardLayout userType="citizen">
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-gray-900">Document template not found</h2>
          <button
            onClick={() => router.push('/citizen/dashboard')}
            className="mt-4 text-indigo-600 hover:text-indigo-500"
          >
            Return to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="citizen">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">{template.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{template.description}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                  Purpose of Request
                </label>
                <div className="mt-1">
                  <textarea
                    id="purpose"
                    name="purpose"
                    rows={4}
                    required
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Please explain why you need this document..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-900">Required Information</h3>
                <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
                  {template.required_fields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Processing time: {template.processing_time}</span>
                <span className="font-medium text-gray-900">Fee: TZS {template.fee}</span>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/citizen/dashboard')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 