import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  });

  try {
    console.log('Attempting to connect to database...');
    await client.connect();
    console.log('Successfully connected to database!');
    
    // Test query
    const result = await client.query('SELECT current_database()');
    console.log('Current database:', result.rows[0].current_database);
    
    await client.end();
  } catch (error) {
    console.error('Error connecting to database:', error.message);
  }
}

testConnection(); 