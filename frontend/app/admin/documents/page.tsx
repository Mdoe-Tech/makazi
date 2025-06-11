'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { documentService } from '@/lib/api/documents/service';
import { DocumentRequest, DocumentStatus } from '@/lib/api/documents/types';
import { generateDocumentPDF } from '@/lib/utils/pdfGenerator';
import { Loader2, FileText, Download, Eye, Search, Filter, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<DocumentRequest | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await documentService.getDocumentRequests();
      setDocuments(response);
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.document_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.citizen.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.citizen.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.citizen.nida_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Documents</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage and review all document requests
          </p>
        </div>
        <Button 
          onClick={() => router.push('/admin/documents/approve')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Approve Documents
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents List */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                All Documents
              </CardTitle>
              <div className="flex items-center gap-4">
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border border-slate-200 dark:border-slate-800">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px] border border-slate-200 dark:border-slate-800">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator className="border-slate-200 dark:border-slate-800" />
                    <DropdownMenuItem onClick={() => setStatusFilter('ALL')}>
                      All Documents
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter(DocumentStatus.PENDING)}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter(DocumentStatus.APPROVED)}>
                      Approved
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter(DocumentStatus.REJECTED)}>
                      Rejected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-500 dark:text-slate-400">
                <FileText className="w-8 h-8 mb-2" />
                <p>No documents found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${
                      selectedDocument?.id === document.id ? 'bg-slate-50 dark:bg-slate-900/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <h3 className="font-medium text-slate-900 dark:text-slate-50">
                            {document.document_type}
                          </h3>
                          <Badge
                            variant="outline"
                            className={
                              document.status === DocumentStatus.APPROVED
                                ? 'border-emerald-500 text-emerald-500 dark:border-emerald-400 dark:text-emerald-400'
                                : document.status === DocumentStatus.REJECTED
                                ? 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400'
                                : 'border-amber-500 text-amber-500 dark:border-amber-400 dark:text-amber-400'
                            }
                          >
                            {document.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Requested by: {document.citizen.first_name} {document.citizen.last_name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          NIDA: {document.citizen.nida_number}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Purpose: {document.purpose}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(document)}
                          className="border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        {document.status === DocumentStatus.APPROVED && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(document)}
                            className="border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Preview */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Document Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingDocument ? (
              <div className="flex items-center justify-center h-[600px] border border-slate-200 dark:border-slate-800 rounded-lg">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-[600px] border border-slate-200 dark:border-slate-800 rounded-lg"
                title="Document Preview"
              />
            ) : selectedDocument ? (
              <div className="flex flex-col items-center justify-center h-[600px] border border-slate-200 dark:border-slate-800 rounded-lg">
                <FileText className="w-12 h-12 mb-4 text-slate-400" />
                <p className="text-slate-500 dark:text-slate-400">Loading document preview...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[600px] border border-slate-200 dark:border-slate-800 rounded-lg">
                <FileText className="w-12 h-12 mb-4 text-slate-400" />
                <p className="text-slate-500 dark:text-slate-400">Select a document to preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 