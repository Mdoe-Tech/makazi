import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  console.log('Starting database initialization...');
  console.log('Environment variables:', {
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_NAME: process.env.DATABASE_NAME,
    NODE_ENV: process.env.NODE_ENV
  });

  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'postgres' // Connect to default database first
  });

  try {
    console.log('Attempting to connect to PostgreSQL...');
    await client.connect();
    console.log('Connected to PostgreSQL successfully');

    // Check if database exists
    console.log(`Checking if database ${process.env.DATABASE_NAME} exists...`);
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DATABASE_NAME]
    );

    if (result.rowCount === 0) {
      console.log(`Creating database ${process.env.DATABASE_NAME}`);
      await client.query(`CREATE DATABASE ${process.env.DATABASE_NAME}`);
      console.log('Database created successfully');
    } else {
      console.log(`Database ${process.env.DATABASE_NAME} already exists`);
    }

    // Test connection to the actual database
    console.log('Testing connection to the actual database...');
    await client.end();
    
    const dbClient = new Client({
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    });

    await dbClient.connect();
    console.log('Successfully connected to the actual database');
    await dbClient.end();

  } catch (error) {
    console.error('Error during database initialization:', error);
    if (error.code === '3D000') {
      console.error('Database does not exist');
    } else if (error.code === '28P01') {
      console.error('Invalid password');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - check if PostgreSQL is running');
    }
    throw error;
  }
}

initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}); 