import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from './service';
import type {
  CreateAdminDto,
  UpdateAdminDto,
  AdminFilters,
  AdminLoginDto,
  Admin
} from './types';
import { PaginationParams } from '../types';

export const useAdmins = (params: PaginationParams & AdminFilters) => {
  return useQuery({
    queryKey: ['admins', params],
    queryFn: () => adminService.getAdmins(params),
  });
};

export const useAdmin = (id: string) => {
  return useQuery({
    queryKey: ['admin', id],
    queryFn: () => adminService.getAdminById(id),
    enabled: !!id,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAdminDto) => adminService.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminDto }) => adminService.updateAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
}; 