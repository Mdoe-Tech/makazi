import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../database/base.repository';
import { DatabaseService } from '../database/database.service';
import { RegistrationStatus } from './enums/registration-status.enum';
import { Citizen } from './entities/citizen.entity';

@Injectable()
export class CitizenRepository extends BaseRepository<Citizen> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'citizen');
  }

  async findAll(): Promise<Citizen[]> {
    return this.find({});
  }

  async findByNidaNumber(nidaNumber: string): Promise<Citizen | null> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE nida_number = $1`,
      [nidaNumber]
    );
    return result.rows[0] || null;
  }

  async findByBirthCertificateNumber(birthCertificateNumber: string): Promise<Citizen | null> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE birth_certificate_number = $1`,
      [birthCertificateNumber]
    );
    return result.rows[0] || null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Citizen | null> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE phone_number = $1`,
      [phoneNumber]
    );
    return result.rows[0] || null;
  }

  async findByRegistrationStatus(status: RegistrationStatus): Promise<Citizen[]> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE registration_status = $1`,
      [status]
    );
    return result.rows;
  }

  async updateRegistrationStatus(id: string, status: RegistrationStatus, metadata: any = {}): Promise<Citizen> {
    const result = await this.databaseService.query(
      `UPDATE ${this.tableName} 
       SET registration_status = $1,
           metadata = jsonb_set(COALESCE(metadata, '{}'::jsonb), '{status_history}', 
             COALESCE(metadata->'status_history', '[]'::jsonb) || 
             jsonb_build_object('status', $1, 'timestamp', CURRENT_TIMESTAMP, 'metadata', $2::jsonb)
           )
       WHERE id = $3 
       RETURNING *`,
      [status, JSON.stringify(metadata), id]
    );
    return result.rows[0];
  }

  async updateBiometricData(id: string, biometricData: any): Promise<Citizen> {
    const result = await this.databaseService.query(
      `UPDATE ${this.tableName} 
       SET biometric_data = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *`,
      [JSON.stringify(biometricData), id]
    );
    return result.rows[0];
  }

  async updateDocuments(id: string, documents: any): Promise<Citizen> {
    const result = await this.databaseService.query(
      `UPDATE ${this.tableName} 
       SET documents = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *`,
      [JSON.stringify(documents), id]
    );
    return result.rows[0];
  }
} 