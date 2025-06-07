'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { colors } from '@/lib/theme/colors';

interface StatCard {
  title: string;
  value: number;
  icon: any;
  change: number;
  color: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  const [stats] = useState<StatCard[]>([
    {
      title: 'Total Citizens',
      value: 0,
      icon: Users,
      change: 0,
      color: colors.primary.main
    },
    {
      title: 'Pending Documents',
      value: 0,
      icon: FileText,
      change: 0,
      color: colors.warning.main
    },
    {
      title: 'Verified Citizens',
      value: 0,
      icon: CheckCircle,
      change: 0,
      color: colors.success.main
    },
    {
      title: 'Processing Time',
      value: 0,
      icon: Clock,
      change: 0,
      color: colors.accent.main
    }
  ]);

  if (!isClient || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (user.role === 'CITIZEN') {
    return null;
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center">
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon
                    className="w-6 h-6"
                    style={{ color: stat.color }}
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <div className="mt-6">
              <p className="text-sm text-gray-500 text-center py-4">No recent activity found</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 