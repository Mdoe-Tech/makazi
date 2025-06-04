import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { biometricService } from './service';
import type {
  CreateBiometricDto,
  UpdateBiometricDto,
  BiometricFilters,
  Biometric
} from './types';
import { PaginationParams } from '../types';

export const useBiometrics = (params: PaginationParams & BiometricFilters) => {
  return useQuery({
    queryKey: ['biometrics', params],
    queryFn: () => biometricService.getBiometrics(params),
  });
};

export const useBiometric = (id: string) => {
  return useQuery({
    queryKey: ['biometric', id],
    queryFn: () => biometricService.getBiometricById(id),
    enabled: !!id,
  });
};

export const useCreateBiometric = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBiometricDto) => biometricService.createBiometric(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biometrics'] });
    },
  });
};

export const useUpdateBiometric = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBiometricDto }) => biometricService.updateBiometric(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biometrics'] });
    },
  });
};

export const useDeleteBiometric = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => biometricService.deleteBiometric(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biometrics'] });
    },
  });
}; 