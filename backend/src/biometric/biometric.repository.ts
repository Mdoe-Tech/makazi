import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../database/base.repository';
import { DatabaseService } from '../database/database.service';
import { Biometric } from './entities/biometric.entity';

@Injectable()
export class BiometricRepository extends BaseRepository<Biometric> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'biometric');
  }

  async findAll(): Promise<Biometric[]> {
    return this.find({});
  }

  async findByCitizenId(citizenId: string): Promise<Biometric | null> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE citizen_id = $1`,
      [citizenId]
    );
    return result.rows[0] || null;
  }

  async updateBiometricData(id: string, biometricData: any): Promise<Biometric> {
    const result = await this.databaseService.query(
      `UPDATE ${this.tableName} 
       SET biometric_data = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *`,
      [biometricData, id]
    );
    return result.rows[0];
  }
} 