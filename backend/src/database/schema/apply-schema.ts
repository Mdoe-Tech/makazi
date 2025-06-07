import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function applySchema() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '@Issaally99',
    database: process.env.DB_DATABASE || 'makazi'
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully');

    // Read and execute the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Applying schema...');
    await client.query(schema);
    console.log('Schema applied successfully');

  } catch (error) {
    console.error('Error applying schema:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the script
applySchema().catch(console.error); 