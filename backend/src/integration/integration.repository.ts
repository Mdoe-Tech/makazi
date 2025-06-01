import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../database/base.repository';
import { DatabaseService } from '../database/database.service';
import { IntegrationConfig } from './entities/integration-config.entity';

@Injectable()
export class IntegrationRepository extends BaseRepository<IntegrationConfig> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'integration_config');
  }

  async findAll(): Promise<IntegrationConfig[]> {
    return this.find({});
  }

  async findByType(type: string): Promise<IntegrationConfig | null> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE metadata->>'provider' = $1`,
      [type]
    );
    return result.rows[0] || null;
  }

  async findByStatus(status: string): Promise<IntegrationConfig[]> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE metadata->>'status' = $1`,
      [status]
    );
    return result.rows;
  }

  async findActive(): Promise<IntegrationConfig[]> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE is_active = true`,
      []
    );
    return result.rows;
  }
} 