'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { documentService } from '@/lib/api/documents/service';
import { DocumentRequest, DocumentStatus } from '@/lib/api/documents/types';
import { generateDocumentPDF } from '@/lib/utils/pdfGenerator';
import SignaturePad from '@/components/signature/SignaturePad';
import StampCreator from '@/components/stamp/StampCreator';
import { Loader2, FileText, Check, X, Search, Filter, ChevronDown, ArrowLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ApproveDocumentsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [stampData, setStampData] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await documentService.getDocumentRequests();
      setRequests(response.filter(req => req.status === DocumentStatus.PENDING));
    } catch (error) {
      console.error('Error fetching document requests:', error);
      toast.error('Failed to fetch document requests');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = async (request: DocumentRequest) => {
    try {
      setIsLoadingDocument(true);
      setSelectedRequest(request);
      
      // Get the document template
      const template = await documentService.getDocumentTemplate(request.document_type);
      
      // Generate PDF with signature and stamp if available
      const url = generateDocumentPDF(
        template, 
        request, 
        request.citizen,
        signatureData || undefined,
        stampData || undefined
      );
      setPdfUrl(url);
    } catch (error) {
      console.error('Error viewing document:', error);
      toast.error('Failed to view document');
    } finally {
      setIsLoadingDocument(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    if (!signatureData || !stampData) {
      toast.error('Please add both signature and stamp before approving');
      return;
    }

    try {
      await documentService.approveDocumentRequest(selectedRequest.id, {
        signature: signatureData,
        stamp: stampData
      });
      toast.success('Document approved successfully');
      fetchRequests();
      setSelectedRequest(null);
      setPdfUrl(null);
      setSignatureData(null);
      setStampData(null);
    } catch (error) {
      console.error('Error approving document:', error);
      toast.error('Failed to approve document');
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await documentService.rejectDocumentRequest(selectedRequest.id, rejectionReason);
      toast.success('Document rejected successfully');
      fetchRequests();
      setSelectedRequest(null);
      setPdfUrl(null);
      setSignatureData(null);
      setStampData(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast.error('Failed to reject document');
    }
  };

  const handleSignatureSave = (data: string) => {
    setSignatureData(data);
    if (selectedRequest && stampData) {
      handleViewDocument(selectedRequest);
    }
  };

  const handleStampSave = (data: string) => {
    setStampData(data);
    if (selectedRequest && signatureData) {
      handleViewDocument(selectedRequest);
    }
  };

  const filteredRequests = requests.filter(request => 
    request.document_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.citizen.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.citizen.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.citizen.nida_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Approve Documents</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review and approve pending document requests
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => router.push('/admin/documents')}
          className="border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Documents
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Requests List */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                Pending Documents
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[300px] border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-500 dark:text-slate-400">
                <FileText className="w-8 h-8 mb-2" />
                <p>No pending documents found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer ${
                      selectedRequest?.id === request.id ? 'bg-slate-50 dark:bg-slate-900/50' : ''
                    }`}
                    onClick={() => handleViewDocument(request)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <h3 className="font-medium text-slate-900 dark:text-slate-50">
                            {request.document_type}
                          </h3>
                          <Badge
                            variant="outline"
                            className="border-amber-500 text-amber-500 dark:border-amber-400 dark:text-amber-400"
                          >
                            Pending
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Requested by: {request.citizen.first_name} {request.citizen.last_name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          NIDA: {request.citizen.nida_number}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Purpose: {request.purpose}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Preview and Actions */}
        <div className="space-y-6">
          {/* Document Preview */}
          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800">
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                Document Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingDocument ? (
                <div className="flex items-center justify-center h-[400px] border border-slate-200 dark:border-slate-800 rounded-lg">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-[400px] border border-slate-200 dark:border-slate-800 rounded-lg"
                  title="Document Preview"
                />
              ) : selectedRequest ? (
                <div className="flex flex-col items-center justify-center h-[400px] border border-slate-200 dark:border-slate-800 rounded-lg">
                  <FileText className="w-12 h-12 mb-4 text-slate-400" />
                  <p className="text-slate-500 dark:text-slate-400">Loading document preview...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] border border-slate-200 dark:border-slate-800 rounded-lg">
                  <FileText className="w-12 h-12 mb-4 text-slate-400" />
                  <p className="text-slate-500 dark:text-slate-400">Select a document to preview</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Signature and Stamp */}
          {selectedRequest && (
            <Card className="border border-slate-200 dark:border-slate-800">
              <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  Add Signature & Stamp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">Digital Signature</h3>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                      <SignaturePad onSignatureCreated={handleSignatureSave} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">Official Stamp</h3>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                      <StampCreator onStampCreated={handleStampSave} />
                    </div>
                  </div>
                </div>

                <Separator className="border-slate-200 dark:border-slate-800" />

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">Actions</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Add both signature and stamp before approving
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleApprove}
                      disabled={!signatureData || !stampData}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRejectionReason('');
                        toast.promise(
                          new Promise((resolve) => {
                            const reason = prompt('Enter rejection reason:');
                            if (reason) {
                              setRejectionReason(reason);
                              handleReject();
                              resolve(true);
                            }
                          }),
                          {
                            loading: 'Rejecting document...',
                            success: 'Document rejected successfully',
                            error: 'Failed to reject document',
                          }
                        );
                      }}
                      className="border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 