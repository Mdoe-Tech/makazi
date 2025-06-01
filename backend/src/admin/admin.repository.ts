import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../database/base.repository';
import { DatabaseService } from '../database/database.service';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminRepository extends BaseRepository<Admin> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'admin');
  }

  async findAll(): Promise<Admin[]> {
    return this.find({});
  }

  async findByUsername(username: string): Promise<Admin | null> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE username = $1`,
      [username]
    );
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  }

  async updateLastLogin(id: string, ipAddress: string, userAgent: string): Promise<void> {
    await this.databaseService.query(
      `UPDATE ${this.tableName} 
       SET last_login = jsonb_build_object(
         'timestamp', CURRENT_TIMESTAMP,
         'ip_address', $1,
         'user_agent', $2
       )
       WHERE id = $3`,
      [ipAddress, userAgent, id]
    );
  }
} 