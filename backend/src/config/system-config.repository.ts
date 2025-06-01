import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../database/base.repository';
import { DatabaseService } from '../database/database.service';
import { SystemConfig } from './entities/system-config.entity';

@Injectable()
export class SystemConfigRepository extends BaseRepository<SystemConfig> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'system_configs');
  }

  async findAll(): Promise<SystemConfig[]> {
    return this.find({});
  }

  async findByKey(key: string): Promise<SystemConfig | null> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE key = $1`,
      [key]
    );
    return result.rows[0] || null;
  }
} 