import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolConfig } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    const config: PoolConfig = {
      host: this.configService.get('DATABASE_HOST', 'localhost'),
      port: this.configService.get('DATABASE_PORT', 5432),
      user: this.configService.get('DATABASE_USERNAME', 'postgres'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: this.configService.get('DATABASE_NAME', 'makazi'),
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    this.pool = new Pool(config);
  }

  async onModuleInit() {
    try {
      // Test the connection
      const client = await this.pool.connect();
      console.log('Successfully connected to PostgreSQL database');
      client.release();
    } catch (error) {
      console.error('Failed to connect to PostgreSQL database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async query(text: string, params?: any[]) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async getClient() {
    return await this.pool.connect();
  }

  async dropConstraints() {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');

      // Drop foreign key constraints first
      await client.query(`
        DO $$ 
        DECLARE
          r RECORD;
        BEGIN
          FOR r IN (SELECT tc.constraint_name, tc.table_name
                   FROM information_schema.table_constraints tc
                   WHERE tc.constraint_type = 'FOREIGN KEY'
                   AND tc.table_name IN ('document', 'biometric', 'notification')
                   AND tc.constraint_name LIKE '%citizen_id%')
          LOOP
            EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', r.table_name, r.constraint_name);
          END LOOP;
        END $$;
      `);

      // Now drop the primary key constraint
      await client.query('ALTER TABLE citizen DROP CONSTRAINT IF EXISTS PK_42173d8db4506cbe5f5684a41fb');

      await client.query('COMMIT');
      console.log('Successfully dropped constraints');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error dropping constraints:', error);
      throw error;
    } finally {
      client.release();
    }
  }
} 