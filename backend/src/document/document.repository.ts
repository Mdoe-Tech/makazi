import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../database/base.repository';
import { DatabaseService } from '../database/database.service';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentRepository extends BaseRepository<Document> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'document');
  }

  async findAll(): Promise<Document[]> {
    return this.find({});
  }

  async findByCitizenId(citizenId: string): Promise<Document[]> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE citizen_id = $1`,
      [citizenId]
    );
    return result.rows;
  }

  async findByType(citizenId: string, type: string): Promise<Document | null> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE citizen_id = $1 AND type = $2`,
      [citizenId, type]
    );
    return result.rows[0] || null;
  }
} 