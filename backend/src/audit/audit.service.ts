import { Injectable } from '@nestjs/common';
import { AuditLogRepository } from './audit-log.repository';
import { AuditLog, AuditAction, AuditEntity } from './entities/audit-log.entity';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class AuditService {
  constructor(
    private readonly auditLogRepository: AuditLogRepository,
    private readonly loggingService: LoggingService
  ) {}

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogRepository.findAll();
  }

  async findByEntity(entity: AuditEntity, entityId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByEntity(entity, entityId);
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByUser(userId);
  }

  async findByAction(action: AuditAction): Promise<AuditLog[]> {
    return this.auditLogRepository.findByAction(action);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.auditLogRepository.findByDateRange(startDate, endDate);
  }

  async log(
    action: AuditAction,
    entity: AuditEntity,
    entityId: string,
    userId: string,
    changes?: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<AuditLog> {
    this.loggingService.log(`Audit log: ${action} on ${entity} ${entityId} by user ${userId}`);
    
    return this.auditLogRepository.create({
      action,
      entity_type: entity,
      entity_id: entityId,
      user_id: userId,
      changes,
      metadata
    });
  }

  async generateComplianceReport(startDate: Date, endDate: Date): Promise<any> {
    const logs = await this.findByDateRange(startDate, endDate);
    
    // Group logs by action and entity
    const report = {
      total_actions: logs.length,
      actions_by_type: {},
      entities_affected: {},
      user_activity: {},
      time_distribution: {
        by_hour: {},
        by_day: {}
      }
    };

    logs.forEach(log => {
      // Count actions
      report.actions_by_type[log.action] = (report.actions_by_type[log.action] || 0) + 1;
      
      // Count entities
      report.entities_affected[log.entity_type] = (report.entities_affected[log.entity_type] || 0) + 1;
      
      // Count user activity
      report.user_activity[log.user_id] = (report.user_activity[log.user_id] || 0) + 1;
      
      // Time distribution
      const hour = log.created_at.getHours();
      const day = log.created_at.getDay();
      report.time_distribution.by_hour[hour] = (report.time_distribution.by_hour[hour] || 0) + 1;
      report.time_distribution.by_day[day] = (report.time_distribution.by_day[day] || 0) + 1;
    });

    return report;
  }

  private isSensitiveChange(log: AuditLog): boolean {
    const sensitiveActions = [
      AuditAction.DELETE,
      AuditAction.APPROVE,
      AuditAction.REJECT
    ];

    const sensitiveEntities = [
      AuditEntity.ADMIN
    ];

    return sensitiveActions.includes(log.action) || 
           sensitiveEntities.includes(log.entity_type) ||
           (log.changes?.fields?.some(field => 
             field.includes('password') || 
             field.includes('token') || 
             field.includes('secret')
           ));
  }
} 