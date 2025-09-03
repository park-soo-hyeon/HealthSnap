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
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'health-checkup.db',
      entities: [HealthCheckup, User],
      synchronize: true, // 프로덕션에서는 false로 설정
      logging: process.env.NODE_ENV === 'development',
    }),
    HealthCheckupModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
