'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { citizenService } from '@/lib/api/citizen/service';
import type { Citizen } from '@/lib/api/citizen/types';
import { RegistrationStatus } from '@/lib/api/citizen/enums';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CitizensPage() {
  const router = useRouter();
  const { user, loading, initialized } = useAuthStore();
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loadingCitizens, setLoadingCitizens] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | 'ALL'>('ALL');
  const [showAddCitizenModal, setShowAddCitizenModal] = useState(false);

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        setLoadingCitizens(true);
        const response = await citizenService.getCitizens();
        console.log('Citizens response:', response);
        if (Array.isArray(response)) {
          setCitizens(response);
        } else {
          console.log('No citizens data found in response:', response);
          setCitizens([]);
        }
      } catch (error) {
        console.error('Error fetching citizens:', error);
        setCitizens([]);
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

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Citizens</h1>
          <Button
            onClick={() => router.push('/citizen/register')}
            className="bg-primary-main hover:bg-primary-main/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Citizen
          </Button>
        </div>

        {loadingCitizens ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main"></div>
          </div>
        ) : citizens.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No citizens found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">NIDA Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registered</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {citizens.map((citizen) => (
                  <tr key={citizen.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {citizen.first_name} {citizen.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{citizen.nida_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{citizen.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        citizen.registration_status === 'APPROVED' 
                          ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                          : citizen.registration_status === 'REJECTED'
                          ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                          : 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                      }`}>
                        {citizen.registration_status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(citizen.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/admin/citizens/${citizen.id}`)}
                        className="text-primary-main hover:text-primary-dark transition-colors"
                      >
                        <Eye className="w-4 h-4 inline-block mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 