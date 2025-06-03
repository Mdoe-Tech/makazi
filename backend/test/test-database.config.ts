import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../src/database/database.service';

export async function setupTestDatabase() {
  const configService = new ConfigService();
  const databaseService = new DatabaseService(configService);

  try {
    // Drop all tables and recreate them
    await databaseService.dropConstraints();
    
    // Drop all tables in the correct order
    await databaseService.query(`
      DROP TABLE IF EXISTS notifications CASCADE;
      DROP TABLE IF EXISTS document CASCADE;
      DROP TABLE IF EXISTS biometric CASCADE;
      DROP TABLE IF EXISTS citizen CASCADE;
      DROP TABLE IF EXISTS admin CASCADE;
      DROP TABLE IF EXISTS system_configs CASCADE;
      DROP TABLE IF EXISTS integration_config CASCADE;
    `);
    
    // Drop existing triggers first
    await databaseService.query(`
      DROP TRIGGER IF EXISTS update_system_configs_updated_at ON system_configs;
      DROP TRIGGER IF EXISTS update_admin_updated_at ON admin;
      DROP TRIGGER IF EXISTS update_citizen_updated_at ON citizen;
      DROP TRIGGER IF EXISTS update_document_updated_at ON document;
      DROP TRIGGER IF EXISTS update_biometric_updated_at ON biometric;
      DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
      DROP TRIGGER IF EXISTS update_integration_config_updated_at ON integration_config;
    `);
    
    // Run migrations
    const migrationsDir = require('path').join(__dirname, '../src/database/migrations');
    const fs = require('fs');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(require('path').join(migrationsDir, file), 'utf8');
      await databaseService.query(sql);
    }

    return databaseService;
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
}

export async function teardownTestDatabase(databaseService: DatabaseService) {
  try {
    await databaseService.onModuleDestroy();
  } catch (error) {
    console.error('Error tearing down test database:', error);
    throw error;
  }
} 