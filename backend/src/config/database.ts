import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    },
  }
);

// Initialize PostGIS extension
sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;').catch((err) => console.error('PostGIS setup error:', err));

export default sequelize;