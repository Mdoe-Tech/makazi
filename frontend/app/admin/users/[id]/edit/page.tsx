'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/store/admin.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { AdminRole } from '@/lib/api/admin/types';
import { UserRole } from '@/lib/api/auth/types';

interface FormData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: AdminRole;
  is_active: boolean;
  region?: string;
  district?: string;
  ward?: string;
  office?: string;
}

export default function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const { users, loading, error, fetchUsers, updateUser } = useAdminStore();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: AdminRole.ADMIN,
    is_active: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const userToEdit = users.find(u => u.id === id);
    if (userToEdit) {
      setFormData({
        username: userToEdit.username,
        email: userToEdit.email,
        first_name: userToEdit.first_name,
        last_name: userToEdit.last_name,
        phone_number: userToEdit.phone_number || '',
        role: userToEdit.role as AdminRole,
        is_active: userToEdit.is_active,
        region: userToEdit.metadata?.region || '',
        district: userToEdit.metadata?.district || '',
        ward: userToEdit.metadata?.ward || '',
        office: userToEdit.metadata?.office || '',
      });
    }
  }, [users, id]);

  // Only SUPER_ADMIN can access this page
  if (!user || user.role !== UserRole.SUPER_ADMIN) {
    return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
        </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(id, formData);
      router.push('/admin/users');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const showRoleSpecificFields = (role: AdminRole) => {
    switch (role) {
      case 'REGIONAL_ADMIN':
        return (
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
              Region
            </label>
            <input
              type="text"
              name="region"
              id="region"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.region || ''}
              onChange={handleChange}
            />
          </div>
        );
      case 'DISTRICT_ADMIN':
        return (
          <>
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <input
                type="text"
                name="region"
                id="region"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.region || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                name="district"
                id="district"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.district || ''}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case 'WARD_ADMIN':
        return (
          <>
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <input
                type="text"
                name="region"
                id="region"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.region || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                name="district"
                id="district"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.district || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="ward" className="block text-sm font-medium text-gray-700">
                Ward
              </label>
              <input
                type="text"
                name="ward"
                id="ward"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.ward || ''}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case 'OFFICE_ADMIN':
        return (
          <>
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <input
                type="text"
                name="region"
                id="region"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.region || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                name="district"
                id="district"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.district || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="ward" className="block text-sm font-medium text-gray-700">
                Ward
              </label>
              <input
                type="text"
                name="ward"
                id="ward"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.ward || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="office" className="block text-sm font-medium text-gray-700">
                Office
              </label>
              <input
                type="text"
                name="office"
                id="office"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.office || ''}
                onChange={handleChange}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="text-center py-12">
          <p className="text-red-600">Error: {error}</p>
        </div>
    );
  }

  return (
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Edit Admin User
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">User Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update the user's information and role.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      id="phone_number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value={AdminRole.SUPER_ADMIN}>Super Admin</option>
                      <option value={AdminRole.ADMIN}>Admin</option>
                      <option value={AdminRole.REGISTRAR}>Registrar</option>
                      <option value={AdminRole.VERIFIER}>Verifier</option>
                      <option value={AdminRole.APPROVER}>Approver</option>
                      <option value={AdminRole.VIEWER}>Viewer</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="is_active"
                          name="is_active"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={formData.is_active}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="is_active" className="font-medium text-gray-700">
                          Active
                        </label>
                        <p className="text-gray-500">User account is active and can access the system</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role-specific fields */}
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Role Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Additional information required for the selected role.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  {showRoleSpecificFields(formData.role)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/users')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
  );
} 