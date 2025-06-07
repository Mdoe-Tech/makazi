'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { citizenService } from '@/lib/api/citizen/service';
import type { Citizen } from '@/lib/api/citizen/types';
import { RegistrationStatus } from '@/lib/api/citizen/types';
import { Search, Filter, Download, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function CitizensPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loadingCitizens, setLoadingCitizens] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | 'ALL'>('ALL');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        const response = await citizenService.getCitizens();
        setCitizens(response.data);
      } catch (error) {
        console.error('Error fetching citizens:', error);
      } finally {
        setLoadingCitizens(false);
      }
    };

    if (user) {
      fetchCitizens();
    }
  }, [user]);

  const getStatusColor = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.APPROVED:
        return 'text-green-600 bg-green-50';
      case RegistrationStatus.REJECTED:
        return 'text-red-600 bg-red-50';
      case RegistrationStatus.PENDING:
        return 'text-yellow-600 bg-yellow-50';
      case RegistrationStatus.NIDA_VERIFICATION:
        return 'text-blue-600 bg-blue-50';
      case RegistrationStatus.BIOMETRIC_VERIFICATION:
        return 'text-purple-600 bg-purple-50';
      case RegistrationStatus.DOCUMENT_VERIFICATION:
        return 'text-indigo-600 bg-indigo-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.APPROVED:
        return <CheckCircle className="w-5 h-5" />;
      case RegistrationStatus.REJECTED:
        return <XCircle className="w-5 h-5" />;
      default:
        return <Eye className="w-5 h-5" />;
    }
  };

  const filteredCitizens = citizens.filter(citizen => {
    const matchesSearch = 
      citizen.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      citizen.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      citizen.nida_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || citizen.registration_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Citizens</h1>
          <button
            onClick={() => router.push('/citizen/register')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Register New Citizen
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or NIDA number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RegistrationStatus | 'ALL')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Status</option>
              <option value={RegistrationStatus.PENDING}>Pending</option>
              <option value={RegistrationStatus.NIDA_VERIFICATION}>NIDA Verification</option>
              <option value={RegistrationStatus.BIOMETRIC_VERIFICATION}>Biometric Verification</option>
              <option value={RegistrationStatus.DOCUMENT_VERIFICATION}>Document Verification</option>
              <option value={RegistrationStatus.APPROVED}>Approved</option>
              <option value={RegistrationStatus.REJECTED}>Rejected</option>
            </select>
          </div>
        </div>

        {/* Citizens List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loadingCitizens ? (
            <div className="p-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredCitizens.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No citizens found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIDA Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCitizens.map((citizen) => (
                    <tr key={citizen.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {citizen.first_name} {citizen.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {citizen.email || 'No email'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {citizen.nida_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(citizen.registration_status)}`}>
                          {getStatusIcon(citizen.registration_status)}
                          <span className="ml-1.5">{citizen.registration_status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(citizen.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => router.push(`/admin/citizens/${citizen.id}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 