import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { letterService } from './service';
import type {
  CreateLetterDto,
  LetterFilters,
  Letter
} from './types';
import { PaginationParams } from '../types';

export const useLetters = (params: PaginationParams & LetterFilters) => {
  return useQuery({
    queryKey: ['letters', params],
    queryFn: () => letterService.getLetters(params),
  });
};

export const useLetter = (id: string) => {
  return useQuery({
    queryKey: ['letter', id],
    queryFn: () => letterService.getLetterById(id),
    enabled: !!id,
  });
};

export const useCreateLetter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLetterDto) => letterService.createLetter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letters'] });
    },
  });
}; 