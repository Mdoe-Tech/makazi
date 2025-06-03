import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolConfig } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private static pool: Pool;
  private static isEnding = false;

  constructor(private configService: ConfigService) {
    if (!DatabaseService.pool) {
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

      DatabaseService.pool = new Pool(config);
    }
  }

  async onModuleInit() {
    try {
      // Test the connection
      const client = await DatabaseService.pool.connect();
      console.log('Successfully connected to PostgreSQL database');
      client.release();
    } catch (error) {
      console.error('Failed to connect to PostgreSQL database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (DatabaseService.pool && !DatabaseService.isEnding) {
      DatabaseService.isEnding = true;
      await DatabaseService.pool.end();
      DatabaseService.pool = null;
    }
  }

  async query(text: string, params?: any[]) {
    const client = await DatabaseService.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async getClient() {
    return await DatabaseService.pool.connect();
  }

  async dropConstraints() {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');

      // Drop all foreign key constraints
      await client.query(`
        DO $$ 
        DECLARE
          r RECORD;
        BEGIN
          FOR r IN (SELECT tc.constraint_name, tc.table_name
                   FROM information_schema.table_constraints tc
                   WHERE tc.constraint_type = 'FOREIGN KEY'
                   AND tc.table_schema = 'public')
          LOOP
            EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', r.table_name, r.constraint_name);
          END LOOP;
        END $$;
      `);

      // Drop primary key constraints
      await client.query(`
        DO $$ 
        DECLARE
          r RECORD;
        BEGIN
          FOR r IN (SELECT tc.constraint_name, tc.table_name
                   FROM information_schema.table_constraints tc
                   WHERE tc.constraint_type = 'PRIMARY KEY'
                   AND tc.table_schema = 'public')
          LOOP
            EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', r.table_name, r.constraint_name);
          END LOOP;
        END $$;
      `);

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