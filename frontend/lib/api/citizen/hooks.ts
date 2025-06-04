import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { citizenService } from './service';
import type {
  CreateCitizenDto,
  UpdateCitizenDto,
  CitizenFilters,
  Citizen
} from './types';
import { PaginationParams } from '../types';

export const useCitizens = (params: PaginationParams & CitizenFilters) => {
  return useQuery({
    queryKey: ['citizens', params],
    queryFn: () => citizenService.getCitizens(params),
  });
};

export const useCitizen = (id: string) => {
  return useQuery({
    queryKey: ['citizen', id],
    queryFn: () => citizenService.getCitizenById(id),
    enabled: !!id,
  });
};

export const useCreateCitizen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCitizenDto) => citizenService.createCitizen(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizens'] });
    },
  });
};

export const useUpdateCitizen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCitizenDto }) => citizenService.updateCitizen(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizens'] });
    },
  });
};

export const useDeleteCitizen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => citizenService.deleteCitizen(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizens'] });
    },
  });
}; 