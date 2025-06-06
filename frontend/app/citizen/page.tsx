'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { colors } from '@/lib/theme/colors';

export default function CitizenDashboard() {
  return (
    <DashboardLayout userType="citizen">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <button className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.primary.main}20` }}>
                <FileText className="w-6 h-6" style={{ color: colors.primary.main }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">New Application</p>
                <p className="text-sm text-gray-500">Submit a new document</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.accent.main}20` }}>
                <Clock className="w-6 h-6" style={{ color: colors.accent.main }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Track Status</p>
                <p className="text-sm text-gray-500">Check application status</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.success.main}20` }}>
                <CheckCircle className="w-6 h-6" style={{ color: colors.success.main }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">View History</p>
                <p className="text-sm text-gray-500">Past applications</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.warning.main}20` }}>
                <AlertCircle className="w-6 h-6" style={{ color: colors.warning.main }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Help & Support</p>
                <p className="text-sm text-gray-500">Get assistance</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Documents</h2>
            <div className="mt-6">
              <p className="text-sm text-gray-500 text-center py-4">No recent documents found</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 