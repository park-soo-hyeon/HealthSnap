import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckupModule } from './health-checkup/health-checkup.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthCheckup } from './health-checkup/entities/health-checkup.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const isProduction = process.env.NODE_ENV === 'production';
        
        if (isProduction && process.env.DATABASE_URL) {
          // 프로덕션: PostgreSQL (Render, Neon 등)
          return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: false, // 프로덕션에서는 false 권장
            ssl: { rejectUnauthorized: false }, // Neon SSL 설정
            logging: false,
          };
        } else {
          // 개발/로컬: SQLite
          const dbPath = process.env.NODE_ENV === 'production' 
            ? '/tmp/health-checkup.db'  // Render에서 쓰기 가능한 경로
            : 'health-checkup.db';
            
          console.log(`🗄️ Using SQLite database at: ${dbPath}`);
          
          return {
            type: 'sqlite',
            database: dbPath,
            entities: [HealthCheckup, User],
            synchronize: true, // 개발환경에서만 true
            logging: process.env.NODE_ENV === 'development',
            dropSchema: false, // 데이터 손실 방지
          };
        }
      },
    }),
    HealthCheckupModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
