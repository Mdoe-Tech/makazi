'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { documentService } from '@/lib/api/documents/service';
import { DocumentRequest, DocumentStatus } from '@/lib/api/documents/types';
import { generateDocumentPDF } from '@/lib/utils/pdfGenerator';
import SignaturePad from '@/components/signature/SignaturePad';
import StampCreator from '@/components/stamp/StampCreator';
import { Loader2, FileText, Check, X } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ApproveDocumentsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [stampData, setStampData] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);

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

    try {
      await documentService.rejectDocumentRequest(selectedRequest.id, 'Rejected by admin');
      toast.success('Document rejected successfully');
      fetchRequests();
      setSelectedRequest(null);
      setPdfUrl(null);
      setSignatureData(null);
      setStampData(null);
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

  if (loading) {
    return (
      <DashboardLayout userType="admin">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Approve Documents</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Requests List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Pending Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <p className="text-muted-foreground">No documents pending approval</p>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className={`p-4 border rounded-lg cursor-pointer hover:bg-accent ${
                          selectedRequest?.id === request.id ? 'bg-accent' : ''
                        }`}
                        onClick={() => handleViewDocument(request)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-primary" />
                              <h3 className="font-medium">{request.document_type}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Requested by: {request.citizen.first_name} {request.citizen.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              NIDA: {request.citizen.nida_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Purpose: {request.purpose}
                            </p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={request.status === DocumentStatus.PENDING ? 'border-yellow-500 text-yellow-500' : ''}
                          >
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Document Preview and Approval */}
          <div className="space-y-6">
            {selectedRequest ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Document Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDocument ? (
                      <div className="flex items-center justify-center h-[600px] border rounded-lg">
                        <Loader2 className="w-8 h-8 animate-spin" />
                      </div>
                    ) : pdfUrl ? (
                      <iframe
                        src={pdfUrl}
                        className="w-full h-[600px] border rounded-lg"
                        title="Document Preview"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-[600px] border rounded-lg text-muted-foreground">
                        Failed to load document preview
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Add Signature and Stamp</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Digital Signature</h3>
                      <SignaturePad onSignatureCreated={handleSignatureSave} />
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-4">Official Stamp</h3>
                      <StampCreator onStampCreated={handleStampSave} />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleReject}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </Button>
                      <Button
                        onClick={handleApprove}
                        className="flex items-center gap-2"
                        disabled={!signatureData || !stampData}
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                  <FileText className="w-12 h-12 mb-4" />
                  <p>Select a document to preview and approve</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 