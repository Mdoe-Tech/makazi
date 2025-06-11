'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { citizenService } from '@/lib/api/citizen/service';
import { documentService } from '@/lib/api/documents/service';
import { DocumentStatus, DocumentRequest } from '@/lib/api/documents/types';
import { RegistrationStatus } from '@/lib/api/citizen/enums';
import type { Citizen } from '@/lib/api/citizen/types';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  UserPlus,
  FileCheck,
  FileX,
  ArrowRight
} from 'lucide-react';

interface DashboardStats {
  totalCitizens: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
  totalDocuments: number;
  pendingDocuments: number;
  approvedDocuments: number;
  rejectedDocuments: number;
  recentCitizens: Citizen[];
  recentDocuments: DocumentRequest[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalCitizens: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
    totalDocuments: 0,
    pendingDocuments: 0,
    approvedDocuments: 0,
    rejectedDocuments: 0,
    recentCitizens: [],
    recentDocuments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const citizensResponse = await citizenService.getCitizens();
      const citizens = Array.isArray(citizensResponse) ? citizensResponse : [];
      const documentsResponse = await documentService.getDocumentRequests();
      const documents = Array.isArray(documentsResponse) ? documentsResponse : [];

      const stats: DashboardStats = {
        totalCitizens: citizens.length,
        pendingRegistrations: citizens.filter((c: Citizen) => c.registration_status === RegistrationStatus.PENDING).length,
        approvedRegistrations: citizens.filter((c: Citizen) => c.registration_status === RegistrationStatus.APPROVED).length,
        rejectedRegistrations: citizens.filter((c: Citizen) => c.registration_status === RegistrationStatus.REJECTED).length,
        totalDocuments: documents.length,
        pendingDocuments: documents.filter((d: DocumentRequest) => d.status === DocumentStatus.PENDING).length,
        approvedDocuments: documents.filter((d: DocumentRequest) => d.status === DocumentStatus.APPROVED).length,
        rejectedDocuments: documents.filter((d: DocumentRequest) => d.status === DocumentStatus.REJECTED).length,
        recentCitizens: citizens
          .sort((a: Citizen, b: Citizen) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5),
        recentDocuments: documents
          .sort((a: DocumentRequest, b: DocumentRequest) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
      };

      setStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Welcome Back!</h1>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Clock className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Citizens */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Citizens</CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalCitizens}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {stats.pendingRegistrations} pending registrations
            </p>
          </CardContent>
        </Card>

        {/* Total Documents */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.totalDocuments}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {stats.pendingDocuments} pending approval
            </p>
          </CardContent>
        </Card>

        {/* Approved Documents */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Approved Documents</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{stats.approvedDocuments}</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        {/* Rejected Documents */}
        <Card className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 border-rose-200 dark:border-rose-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-300">Rejected Documents</CardTitle>
            <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-900 dark:text-rose-100">{stats.rejectedDocuments}</div>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              Failed to meet requirements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Citizens */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-50">
              <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Recent Citizens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentCitizens.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No recent citizens</p>
              ) : (
                stats.recentCitizens.map((citizen) => (
                  <div
                    key={citizen.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors group"
                    onClick={() => router.push(`/admin/citizens/${citizen.id}`)}
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-50">
                        {citizen.first_name} {citizen.last_name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        NIDA: {citizen.nida_number}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          citizen.registration_status === RegistrationStatus.APPROVED
                            ? 'border-emerald-500 text-emerald-500 dark:border-emerald-400 dark:text-emerald-400'
                            : citizen.registration_status === RegistrationStatus.REJECTED
                            ? 'border-rose-500 text-rose-500 dark:border-rose-400 dark:text-rose-400'
                            : 'border-amber-500 text-amber-500 dark:border-amber-400 dark:text-amber-400'
                        }
                      >
                        {citizen.registration_status}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-50">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Recent Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentDocuments.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No recent documents</p>
              ) : (
                stats.recentDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors group"
                    onClick={() => router.push(`/admin/documents/${document.id}`)}
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-50">{document.document_type}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Requested by: {document.citizen?.first_name} {document.citizen?.last_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          document.status === DocumentStatus.APPROVED
                            ? 'border-emerald-500 text-emerald-500 dark:border-emerald-400 dark:text-emerald-400'
                            : document.status === DocumentStatus.REJECTED
                            ? 'border-rose-500 text-rose-500 dark:border-rose-400 dark:text-rose-400'
                            : 'border-amber-500 text-amber-500 dark:border-amber-400 dark:text-amber-400'
                        }
                      >
                        {document.status}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 