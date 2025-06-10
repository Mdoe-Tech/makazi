'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { documentService } from '@/lib/api/documents/service';
import type { DocumentTemplate, DocumentRequest } from '@/lib/api/documents/types';
import { DocumentType, DocumentStatus } from '@/lib/api/documents/types';
import { FileText, Clock, CheckCircle, XCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CitizenDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

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
        const [templatesData, requestsData] = await Promise.all([
          documentService.getDocumentTemplates(),
          documentService.getDocumentRequests()
        ]);
        setTemplates(templatesData);
        setRequests(requestsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoadingTemplates(false);
        setLoadingRequests(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleDownload = async (requestId: string) => {
    try {
      setDownloading(requestId);
      await documentService.downloadDocument(requestId);
      toast.success('Document downloaded successfully');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    } finally {
      setDownloading(null);
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.APPROVED:
        return 'text-green-600 bg-green-50';
      case DocumentStatus.REJECTED:
        return 'text-red-600 bg-red-50';
      case DocumentStatus.PENDING:
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.APPROVED:
        return <CheckCircle className="w-5 h-5" />;
      case DocumentStatus.REJECTED:
        return <XCircle className="w-5 h-5" />;
      case DocumentStatus.PENDING:
        return <Clock className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (!isClient || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout userType="citizen">
      <div className="space-y-6">
        {/* Available Documents */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Available Documents</h2>
            {loadingTemplates ? (
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-4 hover:border-indigo-500 transition-colors cursor-pointer"
                    onClick={() => router.push(`/citizen/documents/request/${template.type}`)}
                  >
                    <div className="flex items-center">
                      <FileText className="w-6 h-6 text-indigo-600" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">{template.title}</h3>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-gray-500">Processing time: {template.processing_time}</span>
                      <span className="font-medium text-gray-900">Fee: TZS {template.fee}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Requests</h2>
            {loadingRequests ? (
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : requests.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500 text-center">No recent requests</p>
            ) : (
              <div className="mt-4 divide-y divide-gray-200">
                {requests.map((request) => (
                  <div key={request.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {request.document_type === DocumentType.INTRODUCTION_LETTER
                            ? 'Introduction Letter'
                            : 'Sponsorship Letter'}
                        </h3>
                        <p className="text-sm text-gray-500">{request.purpose}</p>
                      </div>
                      <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1.5">{request.status}</span>
                      </div>
                    </div>
                    {request.status === DocumentStatus.APPROVED && (
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(request.id)}
                          disabled={downloading === request.id}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          {downloading === request.id ? 'Downloading...' : 'Download Document'}
                        </Button>
                      </div>
                    )}
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