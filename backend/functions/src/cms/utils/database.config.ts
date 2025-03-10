import { DataSource } from 'typeorm';
import * as path from 'path';
import * as os from 'os';

// Create and export the DataSource
// For simplicity, we'll use SQLite for both development and production for now
export const AppDataSource = new DataSource({
  type: 'sqlite',
  // In production (Cloud Functions), use the tmp directory
  // In development, use the local data directory
  database: process.env.NODE_ENV === 'production'
    ? path.join(os.tmpdir(), 'lorepin_cms.sqlite')
    : path.join(__dirname, '../../../data/lorepin_cms.sqlite'),
  synchronize: true,
  logging: ['error', 'warn'],
  entities: [__dirname + '/../models/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  subscribers: []
});

// Initialize the database connection
export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connection established');
    }
    return AppDataSource;
  } catch (error) {
    console.error('Error initializing database connection:', error);
    throw error;
  }
};

// Get the database connection
export const getConnection = async () => {
  if (!AppDataSource.isInitialized) {
    await initializeDatabase();
  }
  return AppDataSource;
}; 