import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nidaService } from './service';
import type { NidaFilters, VerifyNidaDto, NidaData } from './types';
import { PaginationParams } from '../types';

export const useNidaData = (params: PaginationParams & NidaFilters) => {
  return useQuery({
    queryKey: ['nidaData', params],
    queryFn: () => nidaService.getNidaData(params),
  });
};

export const useNidaDataById = (id: string) => {
  return useQuery({
    queryKey: ['nidaData', id],
    queryFn: () => nidaService.getNidaDataById(id),
    enabled: !!id,
  });
};

export const useRegisterNida = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, citizenId }: { data: Omit<NidaData, 'nida_number'>; citizenId: string }) =>
      nidaService.registerNida(data, citizenId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nidaData'] });
      queryClient.invalidateQueries({ queryKey: ['citizens'] });
    },
  });
};

export const useVerifyNida = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VerifyNidaDto) => nidaService.verifyNida(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nidaData'] });
      queryClient.invalidateQueries({ queryKey: ['citizens'] });
    },
  });
};

export const useNidaVerificationHistory = (id: string) => {
  return useQuery({
    queryKey: ['nidaVerificationHistory', id],
    queryFn: () => nidaService.getNidaVerificationHistory(id),
    enabled: !!id,
  });
}; 