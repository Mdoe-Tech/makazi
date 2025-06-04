import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reportingService } from './service';
import type {
  CreateReportDto,
  ReportFilters,
  Report
} from './types';
import { PaginationParams } from '../types';

export const useReports = (params: PaginationParams & ReportFilters) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => reportingService.getReports(params),
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => reportingService.getReportById(id),
    enabled: !!id,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReportDto) => reportingService.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}; 