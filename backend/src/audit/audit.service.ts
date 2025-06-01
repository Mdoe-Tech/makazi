import { Injectable } from '@nestjs/common';
import { AuditLog, AuditAction, AuditEntity } from './entities/audit-log.entity';
import { LoggingService } from '../logging/logging.service';
import { AuditLogRepository } from './audit-log.repository';
import * as swMessages from '../i18n/sw/sw.json';

@Injectable()
export class AuditService {
  constructor(
    private readonly auditLogRepository: AuditLogRepository,
    private readonly loggingService: LoggingService
  ) {}

  async log(
    action: AuditAction,
    entity: AuditEntity,
    entityId: number,
    userId: number,
    userRole: string,
    changes: {
      before?: any;
      after?: any;
      fields?: string[];
    },
    ipAddress?: string,
    userAgent?: string,
    additionalInfo?: string
  ): Promise<AuditLog> {
    const auditLog = {
      action,
      entity,
      entity_id: entityId,
      user_id: userId,
      user_role: userRole,
      changes,
      ip_address: ipAddress,
      user_agent: userAgent,
      additional_info: additionalInfo
    };

    const savedLog = await this.auditLogRepository.create(auditLog);
    this.loggingService.log(`Audit log created: ${action} on ${entity} ${entityId}`);
    return savedLog;
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogRepository.findAll();
  }

  async findByEntity(entity: AuditEntity, entityId: number): Promise<AuditLog[]> {
    return this.auditLogRepository.find({ entity, entity_id: entityId });
  }

  async findByUser(userId: number): Promise<AuditLog[]> {
    return this.auditLogRepository.findByUserId(userId.toString());
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.auditLogRepository.findByDateRange(startDate, endDate);
  }

  async findByAction(action: AuditAction): Promise<AuditLog[]> {
    return this.auditLogRepository.findByAction(action);
  }

  async generateComplianceReport(startDate: Date, endDate: Date): Promise<any> {
    const logs = await this.findByDateRange(startDate, endDate);
    
    const report = {
      total_actions: logs.length,
      by_action: {},
      by_entity: {},
      by_user: {},
      by_date: {},
      sensitive_changes: []
    };

    logs.forEach(log => {
      // Count by action
      report.by_action[log.action] = (report.by_action[log.action] || 0) + 1;
      
      // Count by entity
      report.by_entity[log.entity] = (report.by_entity[log.entity] || 0) + 1;
      
      // Count by user
      report.by_user[log.user_id] = (report.by_user[log.user_id] || 0) + 1;
      
      // Count by date
      const date = log.created_at.toISOString().split('T')[0];
      report.by_date[date] = (report.by_date[date] || 0) + 1;
      
      // Track sensitive changes
      if (this.isSensitiveChange(log)) {
        report.sensitive_changes.push({
          action: log.action,
          entity: log.entity,
          entity_id: log.entity_id,
          user_id: log.user_id,
          timestamp: log.created_at,
          changes: log.changes
        });
      }
    });

    return report;
  }

  private isSensitiveChange(log: AuditLog): boolean {
    const sensitiveActions = [
      AuditAction.DELETE,
      AuditAction.CONFIG_CHANGE,
      AuditAction.APPROVE,
      AuditAction.REJECT
    ];

    const sensitiveEntities = [
      AuditEntity.ADMIN,
      AuditEntity.SYSTEM_CONFIG
    ];

    return sensitiveActions.includes(log.action) || 
           sensitiveEntities.includes(log.entity) ||
           (log.changes?.fields?.some(field => 
             field.includes('password') || 
             field.includes('token') || 
             field.includes('secret')
           ));
  }
} 