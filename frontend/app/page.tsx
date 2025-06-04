'use client';

import { useEffect } from 'react';
import { useAdminStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const {
    users,
    loading,
    error,
    filters,
    pagination,
    fetchUsers,
    setFilters,
    setPagination,
    activateUser,
    deactivateUser,
    deleteUser,
  } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination]);

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value });
  };

  const handlePageChange = (page: number) => {
    setPagination({ page, limit: pagination.limit || 10 });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <div className="flex gap-4">
            <Input
              placeholder="Search users..."
              value={filters.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? 'success' : 'destructive'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.is_active ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deactivateUser(user.id)}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => activateUser(user.id)}
                        >
                          Activate
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange((pagination.page || 1) - 1)}
              disabled={(pagination.page || 1) === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange((pagination.page || 1) + 1)}
              disabled={users.length < (pagination.limit || 10)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
