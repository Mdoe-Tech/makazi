import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Injectable()
export class BaseRepository<T> {
  constructor(
    protected readonly databaseService: DatabaseService,
    protected readonly tableName: string
  ) {}

  async findOne(id: string): Promise<T | null> {
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async find(where: Record<string, any>): Promise<T[]> {
    if (Object.keys(where).length === 0) {
      const result = await this.databaseService.query(
        `SELECT * FROM ${this.tableName}`,
        []
      );
      return result.rows;
    }

    const conditions = Object.entries(where)
      .map(([key, value], index) => `${key} = $${index + 1}`)
      .join(' AND ');
    const values = Object.values(where);
    
    const result = await this.databaseService.query(
      `SELECT * FROM ${this.tableName} WHERE ${conditions}`,
      values
    );
    return result.rows;
  }

  async create(data: Partial<T>): Promise<T> {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const result = await this.databaseService.query(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = [id, ...Object.values(data)];

    const result = await this.databaseService.query(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.query(
      `DELETE FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
  }
} 