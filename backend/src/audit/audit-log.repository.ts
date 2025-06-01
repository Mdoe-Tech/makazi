import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../database/base.repository';
import { DatabaseService } from '../database/database.service';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLog> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'audit_logs');
  }

  async findAll(): Promise<AuditLog[]> {
    return this.find({});
  }

  async findByUserId(userId: string): Promise<AuditLog[]> {
    return this.find({ user_id: userId });
  }

  async findByAction(action: string): Promise<AuditLog[]> {
    return this.find({ action });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.find({
      created_at: {
        $gte: startDate,
        $lte: endDate
      }
    });
  }
} 