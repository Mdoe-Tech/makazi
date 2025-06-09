import { useRouter } from 'next/navigation';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Citizen } from '@/lib/api/citizen/types';
import { RegistrationStatus } from '@/lib/api/citizen/enums';

interface CitizenCardProps {
  citizen: Citizen;
}

export function CitizenCard({ citizen }: CitizenCardProps) {
  const router = useRouter();

  const getStatusColor = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.APPROVED:
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case RegistrationStatus.REJECTED:
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case RegistrationStatus.PENDING:
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getStatusIcon = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.APPROVED:
        return <CheckCircle className="w-4 h-4" />;
      case RegistrationStatus.REJECTED:
        return <XCircle className="w-4 h-4" />;
      case RegistrationStatus.PENDING:
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {citizen.first_name} {citizen.last_name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            NIDA: {citizen.nida_number}
          </p>
          {citizen.email && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {citizen.email}
            </p>
          )}
        </div>
        <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(citizen.registration_status)}`}>
          {getStatusIcon(citizen.registration_status)}
          <span className="ml-1.5">{citizen.registration_status}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Registered: {new Date(citizen.created_at).toLocaleDateString()}
        </div>
        <button
          onClick={() => router.push(`/admin/citizens/${citizen.id}`)}
          className="inline-flex items-center text-sm text-primary-main hover:text-primary-dark transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
      </div>
    </div>
  );
} 