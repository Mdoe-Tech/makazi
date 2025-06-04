import { useQuery } from '@tanstack/react-query';
import { auditService } from './service';
import type { AuditFilters } from './types';
import { PaginationParams } from '../types';

export const useAuditLogs = (params: PaginationParams & AuditFilters) => {
  return useQuery({
    queryKey: ['auditLogs', params],
    queryFn: () => auditService.getAuditLogs(params),
  });
};

export const useAuditLog = (id: string) => {
  return useQuery({
    queryKey: ['auditLog', id],
    queryFn: () => auditService.getAuditLogById(id),
    enabled: !!id,
  });
}; 