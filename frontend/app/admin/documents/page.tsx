'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { documentService } from '@/lib/api/documents/service';
import { DocumentRequest, DocumentStatus } from '@/lib/api/documents/types';
import { generateDocumentPDF } from '@/lib/utils/pdfGenerator';
import { Loader2, FileText, Download, Eye } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<DocumentRequest | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await documentService.getDocumentRequests();
      setDocuments(response.filter(doc => doc.status === DocumentStatus.APPROVED));
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = async (document: DocumentRequest) => {
    try {
      setIsLoadingDocument(true);
      setSelectedDocument(document);
      
      // Get the document template
      const template = await documentService.getDocumentTemplate(document.document_type);
      
      // Generate PDF URL for preview
      const url = generateDocumentPDF(
        template,
        document,
        document.citizen,
        document.signature_url || undefined,
        document.stamp_url || undefined
      );
      setPdfUrl(url);
    } catch (error) {
      console.error('Error viewing document:', error);
      toast.error('Failed to view document');
    } finally {
      setIsLoadingDocument(false);
    }
  };

  const handleDownload = async (document: DocumentRequest) => {
    try {
      await documentService.downloadDocument(document.id);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
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
        <h1 className="text-2xl font-bold mb-6">Approved Documents</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Documents List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Approved Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-muted-foreground">No approved documents found</p>
                ) : (
                  <div className="space-y-4">
                    {documents.map((document) => (
                      <div
                        key={document.id}
                        className={`p-4 border rounded-lg ${
                          selectedDocument?.id === document.id ? 'bg-accent' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-primary" />
                              <h3 className="font-medium">{document.document_type}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Requested by: {document.citizen.first_name} {document.citizen.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              NIDA: {document.citizen.nida_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Purpose: {document.purpose}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocument(document)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(document)}
                              className="flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Document Preview */}
          <div>
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
                ) : selectedDocument ? (
                  <div className="flex flex-col items-center justify-center h-[600px] border rounded-lg">
                    <FileText className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Loading document preview...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[600px] border rounded-lg text-muted-foreground">
                    <FileText className="w-12 h-12 mb-4" />
                    <p>Select a document to preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 