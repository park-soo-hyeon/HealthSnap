import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { HealthCheckup } from '../health-checkup/entities/health-checkup.entity';
import { User } from '../users/entities/user.entity';

// 환경변수 로드
config();

const getDataSourceOptions = (): DataSourceOptions => {
  if (process.env.DATABASE_URL) {
    // PostgreSQL (프로덕션)
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [HealthCheckup, User],
      migrations: ['src/migrations/*.ts'],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
      ssl: { rejectUnauthorized: false },
    };
  } else {
    // SQLite (개발)
    return {
      type: 'sqlite',
      database: 'health-checkup.db',
      entities: [HealthCheckup, User],
      migrations: ['src/migrations/*.ts'],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    };
  }
};

export default new DataSource(getDataSourceOptions());