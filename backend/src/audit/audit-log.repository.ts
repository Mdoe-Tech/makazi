import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditAction, AuditEntity } from './entities/audit-log.entity';

@Injectable()
export class AuditLogRepository {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repository: Repository<AuditLog>
  ) {}

  async findAll(): Promise<AuditLog[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<AuditLog | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<AuditLog>): Promise<AuditLog> {
    const log = this.repository.create(data);
    return this.repository.save(log);
  }

  async findByEntity(entity: AuditEntity, entityId: string): Promise<AuditLog[]> {
    return this.repository.find({
      where: {
        entity_type: entity,
        entity_id: entityId
      }
    });
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.repository.find({
      where: {
        user_id: userId
      }
    });
  }

  async findByAction(action: AuditAction): Promise<AuditLog[]> {
    return this.repository.find({
      where: {
        action: action
      }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.repository.find({
      where: {
        created_at: Between(startDate, endDate)
      }
    });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
} 