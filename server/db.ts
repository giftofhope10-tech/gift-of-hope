import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../shared/schema.js';

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

let db: NeonHttpDatabase<typeof schema> | null = null;

if (!connectionString) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('DATABASE_URL not set. Database features will be disabled.');
  }
} else {
  try {
    if (!connectionString.startsWith('postgres://') && !connectionString.startsWith('postgresql://')) {
      throw new Error('Invalid database connection string format. Must start with postgres:// or postgresql://');
    }
    
    const sql = neon(connectionString);
    db = drizzle(sql, { schema });
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Database connection initialized successfully');
    }
  } catch (error: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to initialize database connection:', error.message);
      console.error('Connection string provided:', connectionString ? 'Yes (hidden for security)' : 'No');
    }
    db = null;
  }
}

export { db };
