'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { documentService } from '@/lib/api/documents/service';
import type { DocumentRequest } from '@/lib/api/documents/types';
import { DocumentStatus } from '@/lib/api/documents/types';
import { Button } from '@/components/ui/button';
import SignaturePad from 'react-signature-canvas';
import { useRef } from 'react';
import StampCreator from '@/components/stamp/StampCreator';

export default function DocumentReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [request, setRequest] = useState<DocumentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const signaturePadRef = useRef<SignaturePad>(null);
  const [stampData, setStampData] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        const response = await documentService.getDocumentRequest(params.id as string);
        setRequest(response);
      } catch (error) {
        console.error('Error fetching document request:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && params.id) {
      fetchRequest();
    }
  }, [user, params.id]);

  const handleApprove = async () => {
    if (!request) return;

    try {
      const formData = new FormData();
      
      // Get signature as base64
      if (signaturePadRef.current) {
        const signatureData = signaturePadRef.current.toDataURL('image/png');
        formData.append('signature', signatureData);
      }

      // Add stamp if created
      if (stampData) {
        formData.append('stamp', stampData);
      }

      await documentService.approveDocument(request.id, formData);
      router.push('/admin/documents/verify');
    } catch (error) {
      console.error('Error approving document:', error);
    }
  };

  const handleReject = async () => {
    if (!request || !rejectionReason) return;

    try {
      await documentService.rejectDocument(request.id, rejectionReason);
      router.push('/admin/documents/verify');
    } catch (error) {
      console.error('Error rejecting document:', error);
    }
  };

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Review Document Request</h1>
          <Button
            onClick={() => router.push('/admin/documents/verify')}
            variant="outline"
          >
            Back to List
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main"></div>
          </div>
        ) : !request ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Document request not found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Document Preview</h2>
              <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Document preview will be shown here</p>
              </div>
            </div>

            {/* Actions and Citizen Info */}
            <div className="space-y-6">
              {/* Citizen Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Citizen Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {request.citizen?.first_name} {request.citizen?.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIDA Number</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{request.citizen?.nida_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{request.citizen?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{request.citizen?.phone_number}</p>
                  </div>
                </div>
              </div>

              {/* Digital Signature */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Digital Signature</h2>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <SignaturePad
                    ref={signaturePadRef}
                    canvasProps={{
                      className: 'w-full h-48 bg-white dark:bg-gray-700 rounded-lg'
                    }}
                  />
                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={clearSignature}
                      variant="outline"
                      size="sm"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>

              {/* Official Stamp */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Official Stamp</h2>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <StampCreator onStampCreated={setStampData} />
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Actions</h2>
                <div className="space-y-4">
                  {showRejectionInput ? (
                    <div className="space-y-4">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleReject}
                          variant="destructive"
                          disabled={!rejectionReason}
                        >
                          Confirm Reject
                        </Button>
                        <Button
                          onClick={() => setShowRejectionInput(false)}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleApprove}
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve Document
                      </Button>
                      <Button
                        onClick={() => setShowRejectionInput(true)}
                        variant="destructive"
                      >
                        Reject Document
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 