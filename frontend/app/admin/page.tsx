'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { citizenService } from '@/lib/api/citizen/service';
import { documentService } from '@/lib/api/documents/service';
import { DocumentStatus } from '@/lib/api/documents/types';
import { RegistrationStatus } from '@/lib/api/citizen/enums';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  UserPlus,
  FileCheck,
  FileX
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface DashboardStats {
  totalCitizens: number;
  pendingRegistrations: number;
  totalDocuments: number;
  pendingDocuments: number;
  approvedDocuments: number;
  rejectedDocuments: number;
  recentCitizens: any[];
  recentDocuments: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalCitizens: 0,
    pendingRegistrations: 0,
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
      // Fetch citizens
      const citizens = await citizenService.getCitizens();
      const pendingRegistrations = citizens.data.filter(
        c => c.registration_status === RegistrationStatus.PENDING
      ).length;

      // Fetch documents
      const documents = await documentService.getDocumentRequests();
      const pendingDocuments = documents.filter(
        d => d.status === DocumentStatus.PENDING
      ).length;
      const approvedDocuments = documents.filter(
        d => d.status === DocumentStatus.APPROVED
      ).length;
      const rejectedDocuments = documents.filter(
        d => d.status === DocumentStatus.REJECTED
      ).length;

      // Get recent citizens (last 5)
      const recentCitizens = citizens.data
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      // Get recent documents (last 5)
      const recentDocuments = documents
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      setStats({
        totalCitizens: citizens.data.length,
        pendingRegistrations,
        totalDocuments: documents.length,
        pendingDocuments,
        approvedDocuments,
        rejectedDocuments,
        recentCitizens,
        recentDocuments
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="admin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Citizens */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Citizens</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCitizens}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingRegistrations} pending registrations
              </p>
            </CardContent>
          </Card>

          {/* Total Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingDocuments} pending approval
              </p>
            </CardContent>
          </Card>

          {/* Approved Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved Documents</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedDocuments}</div>
              <p className="text-xs text-muted-foreground">
                Successfully processed
              </p>
            </CardContent>
          </Card>

          {/* Rejected Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejected Documents</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejectedDocuments}</div>
              <p className="text-xs text-muted-foreground">
                Failed to meet requirements
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Citizens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Recent Citizens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentCitizens.map((citizen) => (
                  <div
                    key={citizen.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => router.push(`/admin/citizens/${citizen.id}`)}
                  >
                    <div>
                      <p className="font-medium">
                        {citizen.first_name} {citizen.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        NIDA: {citizen.nida_number}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        citizen.registration_status === RegistrationStatus.APPROVED
                          ? 'border-green-500 text-green-500'
                          : citizen.registration_status === RegistrationStatus.REJECTED
                          ? 'border-red-500 text-red-500'
                          : 'border-yellow-500 text-yellow-500'
                      }
                    >
                      {citizen.registration_status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => router.push(`/admin/documents/${document.id}`)}
                  >
                    <div>
                      <p className="font-medium">{document.document_type}</p>
                      <p className="text-sm text-muted-foreground">
                        Requested by: {document.citizen.first_name} {document.citizen.last_name}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        document.status === DocumentStatus.APPROVED
                          ? 'border-green-500 text-green-500'
                          : document.status === DocumentStatus.REJECTED
                          ? 'border-red-500 text-red-500'
                          : 'border-yellow-500 text-yellow-500'
                      }
                    >
                      {document.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 